"use client";

import { Tag, Typography } from "antd";
import type { Brand, Vehicle } from "@/types/models";

interface VehicleLabelProps {
  vehicle: Pick<Vehicle, "platNomor"> & { brand: Pick<Brand, "name" | "type"> };
  /** `tag`: satu baris dalam Tag. `stacked`: plat di atas, merek di bawah. */
  variant?: "tag" | "stacked";
}

/** Label kendaraan: plat nomor + merek/tipe. */
export function VehicleLabel({ vehicle, variant = "stacked" }: VehicleLabelProps) {
  const brand = `${vehicle.brand.name} ${vehicle.brand.type}`;

  if (variant === "tag") {
    return (
      // Boleh turun baris supaya tidak meluber dari card sempit (grid 2 kolom mobile).
      <Tag className="max-w-full whitespace-normal">
        {vehicle.platNomor} · {brand}
      </Tag>
    );
  }

  return (
    <div>
      <div>{vehicle.platNomor}</div>
      <Typography.Text type="secondary">{brand}</Typography.Text>
    </div>
  );
}
