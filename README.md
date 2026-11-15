# Cendana Motor

Sistem pencatatan order servis Bengkel Cendana Motor (MVP): customer & kendaraan, order servis (jasa / sparepart + jasa), stok sparepart, status order sampai selesai & dibayar, nota (cetak / WhatsApp).

Stack: Next.js 16 · Prisma 7 + PostgreSQL · Ant Design · TanStack Query · React Hook Form + Zod · Axios. Aturan codebase ada di [AGENTS.md](AGENTS.md).

## Setup

```bash
bun install                 # otomatis menjalankan `prisma generate`
cp .env.example .env        # isi DATABASE_URL & AUTH_SECRET
bun run db:migrate          # buat database + tabel
bun run db:seed             # user default, merek motor, contoh sparepart
bun run dev
```

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
| `bun run lint` | ESLint |
| `bun run typecheck` | Generate route types + `tsc --noEmit` |
| `bun run db:migrate` | Buat & apply migration dari `prisma/schema.prisma` |
| `bun run db:deploy` | Apply migration di produksi |
| `bun run db:seed` | Isi data awal |
| `bun run db:studio` | Prisma Studio |

## Aturan bisnis yang diterapkan

- **Stok** hanya berkurang saat order `booked` (atau item ditambah ke order booked/in-progress) dan kembali saat batal / item dihapus. Draft tidak memengaruhi stok. Pengurangan atomik (`stock >= qty`) + CHECK constraint `stock >= 0`, dan setiap perubahan tercatat di `stock_movements`.
- **Transisi status**: draft → booked → in-progress → done, batal dari draft/booked/in-progress (wajib alasan). Status tidak bisa mundur.
- **Draft > 7 hari** otomatis dibatalkan (dicek saat daftar/detail order dibuka).
- **Pembayaran** dicatat setelah `done`, lunas penuh (cash / transfer / QRIS).
- **Harga sparepart** di item adalah snapshot saat input, harga jasa dipisah.
