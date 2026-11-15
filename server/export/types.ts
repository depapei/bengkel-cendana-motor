import "server-only";

export interface ExportColumn<T> {
  header: string;
  /** Lebar relatif (≈ jumlah karakter) — kolom Excel & proporsi kolom PDF. */
  width: number;
  value: (row: T) => string | number;
  /** Angka Rupiah: di Excel tetap angka dengan format mata uang. */
  money?: boolean;
  align?: "right";
}

/** Isi satu file export, tidak bergantung format (PDF / Excel). */
export interface ExportDocument<T> {
  title: string;
  /** Baris keterangan di bawah judul (periode, filter). */
  subtitles: string[];
  summary: { label: string; value: string }[];
  columns: ExportColumn<T>[];
  rows: T[];
}
