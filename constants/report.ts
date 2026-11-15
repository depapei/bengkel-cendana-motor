/** Format file export laporan (nilai = ekstensi file). */
export enum ExportFormat {
  Pdf = "pdf",
  Excel = "xlsx",
}

export const EXPORT_FORMAT_META: Record<ExportFormat, { label: string; mime: string }> = {
  [ExportFormat.Pdf]: { label: "PDF", mime: "application/pdf" },
  [ExportFormat.Excel]: {
    label: "Excel",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
};

/** Jenis laporan (dipakai juga sebagai bagian nama file). */
export enum ReportKind {
  Orders = "order-servis",
  StockMovements = "pergerakan-stok",
}

export const REPORT_TITLE: Record<ReportKind, string> = {
  [ReportKind.Orders]: "Laporan Order Servis",
  [ReportKind.StockMovements]: "Laporan Pergerakan Stok",
};

/** Batas baris per export supaya file & memori server tetap wajar. */
export const EXPORT_MAX_ROWS = 5000;
