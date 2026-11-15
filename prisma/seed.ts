import "dotenv/config";
import bcrypt from "bcryptjs";
import { StockMovementType, UserRole } from "../generated/prisma/enums";
import { createPrismaClient } from "../server/prisma-client";

const prisma = createPrismaClient();

const USERS = [
  { name: "Administrator", username: "admin", password: "admin123", role: UserRole.admin },
  { name: "Kasir", username: "kasir", password: "kasir123", role: UserRole.kasir },
];

/**
 * Merek & tipe motor populer di Indonesia (model yang dijual sekarang + model lama yang
 * masih banyak di jalan). Diurutkan per popularitas. KAPITAL sesuai `normalizeUpper`.
 */
const BRAND_TYPES: Record<string, string[]> = {
  HONDA: [
    "BEAT", "BEAT STREET", "SCOOPY", "GENIO", "VARIO 125", "VARIO 160", "PCX 160", "ADV 160", "STYLO 160",
    "SUPRA X 125", "REVO", "SUPRA GTR 150", "SONIC 150R", "CB150R", "CB150X", "CBR150R", "CBR250RR",
    "CRF150L", "VERZA", "SPACY", "VARIO 110", "VARIO 150", "PCX 150", "ADV 150", "BLADE", "SUPRA FIT",
    "KHARISMA", "MEGAPRO", "TIGER",
  ],
  YAMAHA: [
    "NMAX", "AEROX 155", "LEXI", "FAZZIO", "GRAND FILANO", "GEAR 125", "MIO M3", "X-RIDE 125", "FREEGO",
    "XMAX", "JUPITER Z1", "VEGA FORCE", "MX KING 150", "VIXION", "R15", "R25", "MT-15", "MT-25", "XSR 155",
    "WR 155R", "MIO", "MIO SPORTY", "MIO SOUL GT", "MIO J", "JUPITER Z", "JUPITER MX", "BYSON", "SCORPIO",
  ],
  SUZUKI: [
    "NEX II", "NEX CROSSOVER", "ADDRESS", "SATRIA F150", "SATRIA FU", "GSX-R150", "GSX-S150",
    "BURGMAN STREET 125EX", "SMASH", "SHOGUN 125", "SPIN", "THUNDER 125",
  ],
  KAWASAKI: ["NINJA 250", "NINJA ZX-25R", "Z250", "KLX 150", "KLX 230", "W175", "D-TRACKER 150", "NINJA 150 RR"],
  TVS: ["APACHE RTR 200", "NTORQ 125", "CALLISTO", "DAZZ"],
  VESPA: ["PRIMAVERA", "SPRINT", "LX 125", "GTS 150"],
};

const BRANDS = Object.entries(BRAND_TYPES).flatMap(([name, types]) => types.map((type) => ({ name, type })));

const SPARE_PARTS = [
  { name: "Oli Mesin MPX2 0.8L", price: 55000, stock: 20 },
  { name: "Oli Gardan", price: 18000, stock: 15 },
  { name: "Kampas Rem Depan", price: 45000, stock: 10 },
  { name: "Busi NGK", price: 25000, stock: 12 },
  { name: "V-Belt Vario 125", price: 135000, stock: 4 },
];

async function main() {
  for (const { password, ...user } of USERS) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: { ...user, passwordHash: await bcrypt.hash(password, 10) },
    });
  }

  for (const brand of BRANDS) {
    await prisma.brandVehicle.upsert({ where: { name_type: brand }, update: {}, create: brand });
  }

  if ((await prisma.sparePart.count()) === 0) {
    for (const part of SPARE_PARTS) {
      await prisma.sparePart.create({
        data: {
          ...part,
          stockMovements: { create: { type: StockMovementType.in, qty: part.stock, note: "Stok awal (seed)" } },
        },
      });
    }
  }

  console.log("Seed selesai. Login: admin / admin123 atau kasir / kasir123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
