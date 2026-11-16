"use client";

import { useState, type ReactNode } from "react";
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

/**
 * Field yang bisa diklik untuk langsung diubah di tempat:
 * teks → input + tombol simpan (Space.Compact).
 */
export function InlineEdit<T>({ value, display, editable = true, loading, validate, onSave, renderInput }: InlineEditProps<T>) {
  const [draft, setDraft] = useState<T>();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();

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
      <Tooltip title="Klik untuk mengubah" mouseEnterDelay={0.5}>
        <div
          role="button"
          tabIndex={0}
          onClick={start}
          onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && start()}
          className="group -mx-2 -my-1 flex w-full cursor-pointer items-start gap-2 rounded px-2 py-1 transition-all hover:border hover:border-primary dark:hover:bg-white/10 rounded-lg"
        >
          <span className="flex-1 whitespace-pre-wrap">{content}</span>
          <EditOutlined className="mt-1 opacity-0 transition-opacity group-hover:opacity-60" />
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="w-full" onKeyDown={(event) => event.key === "Escape" && cancel()}>
      {/*
        Sudut kanan input dirapatkan manual: style compact AntD hanya ikut ter-load oleh <Input>,
        sehingga <Input.TextArea> di dalam Space.Compact tetap rounded di sisi kanan.
      */}
      <Space.Compact block size="large" className="[&>:first-child]:rounded-e-none!">

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
