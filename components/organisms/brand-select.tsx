"use client";

import { useState } from "react";
import { Divider, Select, type SelectProps } from "antd";
import { useBrands } from "@/hooks/queries/use-brands";
import type { Brand } from "@/types/models";
import { BrandQuickAdd } from "./brand-quick-add";

const brandLabel = (brand: Brand) => `${brand.name} ${brand.type}`;

interface BrandOption {
  value: string;
  label: string;
  /** Teks pencarian: merek + tipe, agar "honda" menemukan semua tipe Honda. */
  search: string;
}

/** Opsi dikelompokkan per merek (option group), isi grup = tipe motor. */
function groupByBrand(brands: Brand[]) {
  const groups = new Map<string, BrandOption[]>();
  for (const brand of brands) {
    const options = groups.get(brand.name) ?? [];
    options.push({ value: brand.id, label: brand.type, search: brandLabel(brand).toLowerCase() });
    groups.set(brand.name, options);
  }
  return [...groups].map(([name, options]) => ({ label: name, title: name, options }));
}

/** Pilih merek & tipe motor; merek/tipe baru bisa langsung ditambahkan dari dropdown. */
export function BrandSelect({ onChange, ...props }: Omit<SelectProps<string>, "options">) {
  const { data = [], isLoading } = useBrands();
  const [open, setOpen] = useState(false);
  const brandById = new Map(data.map((brand) => [brand.id, brand]));

  const handleCreated = (brand: Brand) => {
    onChange?.(brand.id, { value: brand.id, label: brandLabel(brand) });
    setOpen(false);
  };

  return (
    <Select<string>
      showSearch={{
        filterOption: (input, option) => (option as BrandOption | undefined)?.search.includes(input.toLowerCase()) ?? false,
      }}
      placeholder="Pilih merek & tipe motor"
      loading={isLoading}
      options={groupByBrand(data)}
      // Nilai terpilih tampil lengkap "Merek Tipe", bukan hanya tipe.
      labelRender={({ value, label }) => {
        const brand = brandById.get(String(value));
        return brand ? brandLabel(brand) : label;
      }}
      open={open}
      onOpenChange={setOpen}
      onChange={onChange}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className="my-2" />
          <BrandQuickAdd onCreated={handleCreated} />
        </>
      )}
      {...props}
    />
  );
}
