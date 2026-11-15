"use client";

import { useState } from "react";
import { Select, type SelectProps } from "antd";
import { MAX_PAGE_SIZE } from "@/constants/app";
import { useSpareParts } from "@/hooks/queries/use-spare-parts";
import type { SparePart } from "@/types/models";
import { formatRupiah } from "@/utils/format";

interface SparePartSelectProps extends Omit<SelectProps<string | null>, "options" | "onChange"> {
  onChange?: (value: string | null) => void;
  /** Dipanggil dengan data sparepart terpilih (untuk isi nama & info stok). */
  onSelectPart?: (part: SparePart | undefined) => void;
  /** Sparepart yang sudah terpilih saat edit (mungkin tidak ada di hasil pencarian). */
  current?: Pick<SparePart, "id" | "name" | "stock"> | null;
}

/** Pilih sparepart dari master dengan info harga & stok tersedia (Spesifikasi §2.2). */
export function SparePartSelect({ onChange, onSelectPart, current, ...props }: SparePartSelectProps) {
  const [q, setQ] = useState("");
  const { data, isFetching } = useSpareParts({ q, pageSize: MAX_PAGE_SIZE });
  const parts = data?.items ?? [];

  const options = parts.map((part) => ({
    value: part.id,
    label: `${part.name} — ${formatRupiah(part.price)} (stok ${part.stock})`,
  }));
  if (current && !parts.some((part) => part.id === current.id)) {
    options.unshift({ value: current.id, label: `${current.name} (stok ${current.stock})` });
  }

  return (
    <Select<string | null>
      allowClear
      showSearch={{ filterOption: false, onSearch: setQ }}
      placeholder="Kosongkan jika jasa saja"
      loading={isFetching}
      options={options}
      onChange={(value) => {
        onChange?.(value ?? null);
        onSelectPart?.(parts.find((part) => part.id === value));
      }}
      {...props}
    />
  );
}
