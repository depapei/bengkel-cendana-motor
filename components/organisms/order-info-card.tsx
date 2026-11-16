"use client";

import Link from "next/link";
import { Card, Input, InputNumber, Typography } from "antd";
import { DateInput } from "@/components/molecules/date-input";
import { InfoDescriptions } from "@/components/molecules/info-descriptions";
import { InlineEdit } from "@/components/molecules/inline-edit";
import { MILEAGE_UNIT } from "@/constants/app";
import { MESSAGE } from "@/constants/messages";
import { ITEM_EDITABLE_STATUSES } from "@/constants/order-status";
import { PAYMENT_METHOD_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import { useUpdateOrder } from "@/hooks/queries/use-orders";
import { orderSchema, type OrderInput } from "@/schemas/order.schema";
import type { OrderDetail } from "@/types/order";
import { formatDateOnly, formatDateTime, formatMileage, numberInputFormatter, numberInputParser, toDateOnly } from "@/utils/format";
import { buildUrl } from "@/utils/url";
import { MechanicSelect } from "./mechanic-select";

type Field = keyof OrderInput;
/** Nilai order saat ini; kilometer bisa kosong pada data lama. */
type OrderValues = Omit<OrderInput, "mileage"> & { mileage: number | null };

/** Card "Informasi Order": field detail service bisa diklik & diubah langsung di tempat. */
export function OrderInfoCard({ order }: { order: OrderDetail }) {
  const update = useUpdateOrder(order.id);
  const editable = ITEM_EDITABLE_STATUSES.includes(order.status);

  // API update menerima seluruh field → kirim nilai saat ini + field yang diubah.
  const current: OrderValues = {
    complaint: order.complaint,
    notes: order.notes,
    mileage: order.mileage,
    mechanicId: order.mechanicId,
    mechanicNote: order.mechanicNote,
    nextServiceDate: toDateOnly(order.nextServiceDate),
    nextServiceNote: order.nextServiceNote,
  };

  const patch = (field: Field, value: unknown) => ({
    ...current,
    [field]: value,
    // Catatan mekanik hanya berlaku selama ada mekanik yang ditugaskan.
    ...(field === "mechanicId" && !value ? { mechanicNote: null } : {}),
  });

  const field = <T,>(name: Field) => ({
    editable,
    loading: update.isPending,
    validate: (value: T) => {
      const result = orderSchema.safeParse(patch(name, value));
      return result.success ? undefined : result.error.issues.find((issue) => issue.path[0] === name)?.message;
    },
    // Sudah lolos validate → aman di-cast ke OrderInput.
    onSave: (value: T) => update.mutateAsync(patch(name, value) as OrderInput),
  });

  const textArea = (name: Field, placeholder: string) => (
    <InlineEdit<string | null>
      {...field<string | null>(name)}
      value={current[name] as string | null}
      display={(current[name] as string | null) || "-"}
      renderInput={({ value, onChange, onSubmit, ...props }) => (
        <Input.TextArea
          size="large"
          {...props}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          onPressEnter={(event) => {
            // Enter = simpan, Shift+Enter = baris baru.
            if (event.shiftKey) return;
            event.preventDefault();
            onSubmit();
          }}
          autoSize={{ minRows: 1, maxRows: 6 }}
          placeholder={placeholder}
        />
      )}
    />
  );

  return (
    <Card title="Informasi Order">
      <InfoDescriptions
        column={{ xs: 1, md: 2, lg: 3 }}
        items={[
          {
            label: "Customer",
            children: (
              <Link href={buildUrl(AppRoute.CustomerDetail, { id: order.customer.id })}>
                {order.customer.name} ({order.customer.phoneNumber})
              </Link>
            ),
          },
          {
            label: "Kendaraan",
            children: `${order.customerVehicle.platNomor} · ${order.customerVehicle.brand.name} ${order.customerVehicle.brand.type}`,
          },
          {
            label: "Kilometer",
            children: (
              <InlineEdit<number | null>
                {...field<number | null>("mileage")}
                value={order.mileage}
                display={formatMileage(order.mileage)}
                renderInput={({ value, onChange, onSubmit, ...props }) => (
                  <InputNumber<number>
                    size="large"
                    {...props}
                    value={value}
                    onChange={onChange}
                    onPressEnter={onSubmit}
                    min={0}
                    className="w-full"
                    suffix={MILEAGE_UNIT}
                    placeholder="Contoh: 12.500"
                    formatter={numberInputFormatter}
                    parser={numberInputParser}
                  />
                )}
              />
            ),
          },
          {
            label: "Mekanik",
            children: (
              <InlineEdit<string | null>
                {...field<string | null>("mechanicId")}
                value={order.mechanicId}
                display={order.mechanic?.name ?? "Belum ditugaskan"}
                renderInput={({ value, onChange, status, autoFocus }) => (
                  <MechanicSelect status={status} autoFocus={autoFocus} value={value ?? undefined} onChange={(id) => onChange(id ?? null)} className="w-full" />
                )}
              />
            ),
          },
          { label: "Keluhan", children: textArea("complaint", "Contoh: rem depan bunyi, tarikan berat") },
          {
            label: "Catatan mekanik",
          
            children: order.mechanicId ? (
              textArea("mechanicNote", "Temuan / hasil pengecekan mekanik (tidak tampil di nota)")
            ) : (
              <Typography.Text type="secondary">{order.mechanicNote ?? MESSAGE.mechanicRequired}</Typography.Text>
            ),
          },
          { label: "Catatan bengkel", children: textArea("notes", "Catatan internal (opsional)") },
          {
            label: "Service selanjutnya",
            children: (
              <InlineEdit<string | null>
                {...field<string | null>("nextServiceDate")}
                value={current.nextServiceDate ?? null}
                display={formatDateOnly(order.nextServiceDate)}
                renderInput={({ value, onChange, status, autoFocus }) => (
                  <DateInput futureOnly value={value} onChange={onChange} status={status} autoFocus={autoFocus} placeholder="Tanggal rekomendasi" />
                )}
              />
            ),
          },
          { label: "Rekomendasi service", children: textArea("nextServiceNote", "Contoh: ganti oli & cek kampas rem") },
          { label: "Draft", children: formatDateTime(order.draftAt) },
          { label: "Booked", children: formatDateTime(order.bookedAt) },
          { label: "Mulai dikerjakan", children: formatDateTime(order.progressAt) },
          { label: "Selesai", children: formatDateTime(order.doneAt) },
          ...(order.cancelledAt ? [{ label: "Dibatalkan", children: formatDateTime(order.cancelledAt) }] : []),
          {
            label: "Pembayaran",
            children: order.paymentMethod ? `${PAYMENT_METHOD_META[order.paymentMethod].label} · ${formatDateTime(order.paidAt)}` : "-",
          },
        ]}
      />
    </Card>
  );
}
