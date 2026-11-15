/** Pesan yang dipakai berulang di server & client. */
export const MESSAGE = {
  saved: "Data berhasil disimpan",
  exported: "Laporan berhasil diunduh",
  exportTooLarge: (max: number) => `Data terlalu banyak untuk diexport (maks. ${max} baris). Persempit rentang tanggal atau filter.`,
  deleted: "Data berhasil dihapus",
  validationFailed: "Data yang dikirim tidak valid",
  unauthorized: "Silakan login terlebih dahulu",
  forbidden: "Anda tidak punya akses untuk aksi ini",
  notFound: (entity: string) => `${entity} tidak ditemukan`,
  duplicate: (field: string) => `${field} sudah terdaftar`,
  serverError: "Terjadi kesalahan pada server",
  invalidLogin: "Username atau password salah",
  required: (label: string) => `${label} wajib diisi`,
} as const;

/** Nama kolom unik → label untuk pesan duplikat. */
export const UNIQUE_FIELD_LABEL: Record<string, string> = {
  phoneNumber: "Nomor HP",
  platNomor: "Plat nomor",
  username: "Username",
  orderNo: "Nomor order",
  name: "Nama",
  name_type: "Merek & tipe motor",
};
