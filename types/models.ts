import type { StockMovementType } from "@/constants/stock-movement";
import type { UserRole } from "@/constants/user-role";
import type { Timestamps } from "./common";

export interface User extends Timestamps {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export type SessionUser = Pick<User, "id" | "name" | "username" | "role">;

export interface Brand extends Timestamps {
  id: string;
  name: string;
  type: string;
}

export interface Mechanic extends Timestamps {
  id: string;
  name: string;
  phoneNumber: string | null;
  isActive: boolean;
}

export interface Vehicle extends Timestamps {
  id: string;
  customerId: string;
  brandId: string;
  platNomor: string;
  brand: Brand;
}

export interface Customer extends Timestamps {
  id: string;
  name: string;
  phoneNumber: string;
  vehicles: Vehicle[];
}

export interface SparePart extends Timestamps {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface StockMovement extends Timestamps {
  id: string;
  sparepartId: string;
  type: StockMovementType;
  qty: number;
  note: string | null;
  order: { id: string; orderNo: string } | null;
}
