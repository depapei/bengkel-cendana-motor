/** subtotal = qty × sparepartPrice + laborPrice (Spesifikasi §2.2) */
export function calcSubtotal(qty: number, sparepartPrice: number, laborPrice: number): number {
  return qty * sparepartPrice + laborPrice;
}

/** Jumlahkan qty per sparepart (satu sparepart bisa muncul di beberapa item). */
export function sumQtyBySparePart(items: readonly { sparepartId: string | null; qty: number }[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const { sparepartId, qty } of items) {
    if (sparepartId) totals.set(sparepartId, (totals.get(sparepartId) ?? 0) + qty);
  }
  return totals;
}

interface ItemWithStock {
  sparepartId: string | null;
  qty: number;
  sparePart: { id: string; name: string; stock: number } | null;
}

export interface StockShortage {
  sparepartId: string;
  name: string;
  required: number;
  available: number;
}

/** Sparepart yang stoknya tidak cukup untuk seluruh item order. */
export function getStockShortages(items: readonly ItemWithStock[]): StockShortage[] {
  const parts = new Map(items.flatMap((item) => (item.sparePart ? [[item.sparePart.id, item.sparePart] as const] : [])));
  return [...sumQtyBySparePart(items)]
    .map(([sparepartId, required]) => {
      const part = parts.get(sparepartId);
      return { sparepartId, name: part?.name ?? "-", required, available: part?.stock ?? 0 };
    })
    .filter((entry) => entry.required > entry.available);
}
