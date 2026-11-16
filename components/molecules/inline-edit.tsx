"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import { IconButton } from "@/components/atoms/icon-button";

export interface InlineEditInputProps<T> {
  value: T;
  onChange: (value: T) => void;
  status?: "error";
  autoFocus: boolean;
  /** Simpan nilai saat ini (mis. untuk onPressEnter). */
  onSubmit: () => void;
}

interface InlineEditProps<T> {
  /** Nilai awal saat masuk mode edit. */
  value: T;
  /** Tampilan baca (default: nilai mentah). */
  display?: ReactNode;
  /** false = hanya tampilan baca, tidak bisa diklik. */
  editable?: boolean;
  loading?: boolean;
  /** Kembalikan pesan error untuk membatalkan simpan. */
  validate?: (value: T) => string | undefined;
  /** Promise yang reject = tetap di mode edit (error ditampilkan oleh mutation). */
  onSave: (value: T) => Promise<unknown>;
  renderInput: (props: InlineEditInputProps<T>) => ReactNode;
}

const POPUP_SELECTOR = ".ant-select-dropdown, .ant-picker-dropdown, .ant-dropdown, .ant-popover";

/**
 * Field yang bisa diklik untuk langsung diubah di tempat:
 * teks → input + tombol simpan (Space.Compact).
 */
export function InlineEdit<T>({ value, display, editable = true, loading, validate, onSave, renderInput }: InlineEditProps<T>) {
  const [draft, setDraft] = useState<T>();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Klik di luar komponen = batal edit. Popup AntD (Select/DatePicker) dirender lewat portal,
  // jadi klik di dalamnya tidak dianggap "di luar".
  useEffect(() => {
    if (!editing || loading) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target || containerRef.current?.contains(target)) return;
      if (target.closest(POPUP_SELECTOR)) return;
      setEditing(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [editing, loading]);

  const content = display ?? (value as ReactNode);
  if (!editable) return <>{content}</>;

  const start = () => {
    setDraft(value);
    setError(undefined);
    setEditing(true);
  };
  const cancel = () => setEditing(false);

  const submit = async () => {
    const next = draft as T;
    const message = validate?.(next);
    if (message) return setError(message);
    if (Object.is(next, value)) return cancel();
    try {
      await onSave(next);
      setEditing(false);
    } catch {
      // Notifikasi error sudah ditangani mutation; biarkan user memperbaiki nilai.
    }
  };

  if (!editing) {
    return (
      <Tooltip title="Klik untuk mengubah" placement="bottomLeft">
        <div
          role="button"
          tabIndex={0}
          onClick={start}
          onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && start()}
          // Border selalu ada (transparan) agar hover tidak menggeser layout; margin negatif = padding + border,
          // sehingga teks sejajar dengan label. Lebar = sel penuh (+ margin negatif) supaya sama dengan mode edit —
          // parent bisa flex (mis. Descriptions), jadi lebar harus eksplisit, bukan auto.
          className="group -mx-[9px] -my-[5px] flex w-[calc(100%+18px)] cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1 transition-colors hover:border-primary"
        >
          {/* Tanpa flex-1: pensil menempel tepat di samping teks, bukan di ujung kanan sel. */}
          <span className="min-w-0 whitespace-pre-wrap break-words">{content}</span>
          <EditOutlined className="mt-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
        </div>
      </Tooltip>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-w-0" onKeyDown={(event) => event.key === "Escape" && cancel()}>
      {/*
        Sudut kanan input dirapatkan manual: style compact AntD hanya ikut ter-load oleh <Input>,
        sehingga <Input.TextArea> di dalam Space.Compact tetap rounded di sisi kanan.
      */}
      {/* Input boleh menyusut (min-w-0) agar tombol tidak mendorong lebar melebihi sel. */}
      <Space.Compact block size="large" className="[&>:first-child]:min-w-0 [&>:first-child]:flex-1 [&>:first-child]:rounded-e-none!">

        {renderInput({
          value: draft as T,
          onChange: (next) => {
            setDraft(next);
            setError(undefined);
          },
          status: error ? "error" : undefined,
          autoFocus: true,
          onSubmit: submit,
        })}
        <Button size="large" type="primary" icon={<CheckOutlined />} loading={loading} onClick={submit}>
          Simpan
        </Button>
        <IconButton label="Batal" icon={<CloseOutlined />} disabled={loading} onClick={cancel} />
      </Space.Compact>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
