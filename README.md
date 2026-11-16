# Cendana Motor

Sistem pencatatan order servis Bengkel Cendana Motor: customer & kendaraan, order servis (jasa / sparepart + jasa), mekanik, stok sparepart, status order sampai selesai & dibayar, nota (cetak / WhatsApp), laporan, dan papan antrean publik untuk customer.

Stack: Next.js 16 · Prisma 7 + PostgreSQL · Ant Design · TanStack Query · React Hook Form + Zod · Axios · Tailwind CSS v4. Aturan codebase ada di [AGENTS.md](AGENTS.md).

## Fitur

| Halaman | Path | Akses |
| --- | --- | --- |
| Dashboard — ringkasan, order terbaru, quick link per status | `/` | semua |
| Order servis — daftar per tab status, buat order, detail + edit inline | `/orders` | semua |
| Nota order (cetak / kirim WhatsApp) | `/orders/:id/nota` | semua |
| Customer & kendaraan | `/customers` | semua |
| Sparepart & riwayat pergerakan stok | `/spare-parts` | semua |
| Merek motor | `/brands` | semua |
| Mekanik (aktif / nonaktif) | `/mechanics` | semua |
| Laporan order & pergerakan stok, export PDF / Excel | `/reports` | admin |
| Manajemen user | `/users` | admin |
| Papan antrean servis hari ini (tanpa data harga) | `/antrean` | publik, tanpa login |

## Setup

```bash
bun install                 # otomatis menjalankan `prisma generate`
cp .env.example .env        # isi env (lihat tabel di bawah)
bun run db:migrate          # buat database + tabel
bun run db:seed             # user default, merek motor, contoh sparepart
bun run dev
```

### Environment

| Variabel | Fungsi |
| --- | --- |
| `DATABASE_URL` | Koneksi Postgres untuk aplikasi (pooler transaction-mode) |
| `DIRECT_URL` | Koneksi langsung / session-mode, dipakai Prisma CLI (migrate) |
| `AUTH_SECRET` | Secret JWT session. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `NEXT_PUBLIC_API_URL` | Base URL API untuk client (default `/api`) |
| `CRON_SECRET` | Token Bearer untuk `/api/cron/keep-alive` (Vercel Cron) |

Login default (dari seed):

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin123` | admin |
| `kasir` | `kasir123` | kasir |

Ganti password setelah login pertama (menu **User**, khusus admin).

## Script

| Script | Fungsi |
| --- | --- |
| `bun run dev` | Server development |
| `bun run build` / `start` | Build & jalankan produksi |
| `bun run production` | Build lalu langsung start |
| `bun run lint` | ESLint |
| `bun run typecheck` | Generate route types + `tsc --noEmit` |
| `bun run db:migrate` | Buat & apply migration dari `prisma/schema.prisma` |
| `bun run db:deploy` | Apply migration (tanpa membuat migration baru) |
| `bun run db:seed` | Isi data awal |
| `bun run db:studio` | Prisma Studio |
| `bun run db:deploy:prod` | Apply migration ke DB produksi (`.env.production`) |
| `bun run db:status:prod` | Cek status migration produksi |
| `bun run db:seed:prod` | Seed DB produksi |

## Deploy (Vercel + Supabase)

1. Set semua env di atas di project Vercel (`DATABASE_URL` ke pooler transaction-mode, `DIRECT_URL` ke session-mode).
2. Simpan env produksi lokal di `.env.production`, lalu `bun run db:deploy:prod` setiap ada migration baru.
3. [vercel.json](vercel.json) menjadwalkan cron harian `GET /api/cron/keep-alive` yang mem-ping database supaya project Supabase tidak di-pause. Endpoint menolak request tanpa header `Authorization: Bearer <CRON_SECRET>`.

## Aturan bisnis yang diterapkan

- **Stok** hanya berkurang saat order `booked` (atau item ditambah ke order booked/in-progress) dan kembali saat batal / item dihapus. Draft tidak memengaruhi stok. Pengurangan atomik (`stock >= qty`) + CHECK constraint `stock >= 0`, dan setiap perubahan tercatat di `stock_movements`.
- **Transisi status**: draft → booked → in-progress → done, batal dari draft/booked/in-progress (wajib alasan). Status tidak bisa mundur.
- **Draft > 7 hari** otomatis dibatalkan (dicek saat daftar/detail order dibuka).
- **Mekanik wajib ditugaskan** sebelum order bisa mulai dikerjakan, dan tidak bisa dilepas selama order in-progress.
- **Mekanik** bisa ditugaskan ke order beserta catatan servis (kilometer, servis berikutnya, catatan mekanik). Mekanik nonaktif tidak bisa dipilih untuk order baru, riwayat order lamanya tetap utuh.
- **Pembayaran** dicatat setelah `done`, lunas penuh (cash / transfer / QRIS).
- **Harga sparepart** di item adalah snapshot saat input, harga jasa dipisah.
- **Papan antrean** (`/antrean`) hanya menampilkan order hari ini dengan kolom aman: harga, total, pembayaran, nomor HP, dan catatan internal tidak pernah dikirim.
- **Laporan & export** khusus admin, maksimal 5.000 baris per file export.
