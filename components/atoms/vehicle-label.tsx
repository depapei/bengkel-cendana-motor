"use client";

import { Tag, Typography } from "antd";
import type { Vehicle } from "@/types/models";

interface VehicleLabelProps {
  vehicle: Pick<Vehicle, "platNomor" | "brand">;
  /** `tag`: satu baris dalam Tag. `stacked`: plat di atas, merek di bawah. */
  variant?: "tag" | "stacked";
}

/** Label kendaraan: plat nomor + merek/tipe. */
export function VehicleLabel({ vehicle, variant = "stacked" }: VehicleLabelProps) {
  const brand = `${vehicle.brand.name} ${vehicle.brand.type}`;

  if (variant === "tag") {
    return (
      <Tag>
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
