import type { OrderStatus } from "@/constants/order-status";
import type { PaymentMethod, PaymentStatus } from "@/constants/payment";
import type { ListParams, Timestamps } from "./common";
import type { Customer, SparePart, Vehicle } from "./models";

export interface ServiceFee extends Timestamps {
  id: string;
  orderId: string;
  sparepartId: string | null;
  name: string;
  qty: number;
  sparepartPrice: number;
  laborPrice: number;
  subtotal: number;
  sparePart: Pick<SparePart, "id" | "name" | "stock"> | null;
}

export interface Order extends Timestamps {
  id: string;
  orderNo: string;
  customerId: string;
  customerVehicleId: string;
  complaint: string;
  notes: string | null;
  totalPrice: number;
  status: OrderStatus;
  cancelReason: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  draftAt: string;
  bookedAt: string | null;
  progressAt: string | null;
  doneAt: string | null;
  cancelledAt: string | null;
  paidAt: string | null;
  customer: Pick<Customer, "id" | "name" | "phoneNumber">;
  customerVehicle: Pick<Vehicle, "id" | "platNomor" | "brand">;
}

export interface OrderDetail extends Order {
  serviceFees: ServiceFee[];
}

export interface OrderListParams extends ListParams {
  status?: OrderStatus;
  customerId?: string;
  customerVehicleId?: string;
}
