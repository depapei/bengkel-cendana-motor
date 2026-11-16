"use client";

import { Card, Empty, Flex, List, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { InfoDescriptions } from "@/components/molecules/info-descriptions";
import { QueryState } from "@/components/molecules/query-state";
import { QueueProgress } from "@/components/molecules/queue-progress";
import { ResponsiveModal } from "@/components/molecules/responsive-modal";
import { QUEUE_STATUS_META } from "@/constants/order-status";
import { useQueueOrder } from "@/hooks/queries/use-queue";
import type { QueueOrderDetail } from "@/types/queue";
import { formatDateOnly, formatMileage } from "@/utils/format";
import { queueNumber } from "@/utils/order";

interface QueueDetailModalProps {
  id: string;
  onClose: () => void;
}

const MODAL_WIDTH = 720;

/** Detail pengerjaan untuk customer — tanpa harga jasa / sparepart. */
export function QueueDetailModal({ id, onClose }: QueueDetailModalProps) {
  const query = useQueueOrder(id);

  return (
    <ResponsiveModal title="Detail Pengerjaan" width={MODAL_WIDTH} onCancel={onClose}>
      <QueryState {...query}>{(order) => <QueueDetailContent order={order} />}</QueryState>
    </ResponsiveModal>
  );
}

function QueueDetailContent({ order }: { order: QueueOrderDetail }) {
  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap gap={8}>
        <div>
          <Typography.Text type="secondary">No. Antrean</Typography.Text>
          <div className="text-4xl leading-none font-bold">{queueNumber(order.orderNo)}</div>
        </div>
        <StatusTag value={order.status} meta={QUEUE_STATUS_META} />
      </Flex>

      <InfoDescriptions
        column={{ xs: 1, sm: 2 }}
        items={[
          { label: "No. Order", children: order.orderNo },
          { label: "Customer", children: order.customer.name },
          { label: "Kendaraan", children: <VehicleLabel vehicle={order.customerVehicle} variant="tag" /> },
          { label: "Kilometer", children: formatMileage(order.mileage) },
          { label: "Mekanik", children: order.mechanic?.name ?? "-" },
          { label: "Keluhan", children: order.complaint, span: { xs: 1, sm: 2 } },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Status Pengerjaan">
          <QueueProgress order={order} />
        </Card>
        <Card title="Rincian Pekerjaan">
          {order.serviceFees.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada rincian pekerjaan" />
          ) : (
            <List
             
              dataSource={order.serviceFees}
              renderItem={(item) => (
                <List.Item extra={<Typography.Text type="secondary">x{item.qty}</Typography.Text>}>
                  <List.Item.Meta
                    title={item.name}
                    description={item.sparePart ? `Sparepart: ${item.sparePart.name}` : "Jasa saja"}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      {order.nextServiceDate && (
        <InfoDescriptions
          title="Rekomendasi Servis Berikutnya"
          column={{ xs: 1, sm: 2 }}
          items={[
            { label: "Tanggal", children: formatDateOnly(order.nextServiceDate) },
            { label: "Catatan", children: order.nextServiceNote ?? "-" },
          ]}
        />
      )}
    </Flex>
  );
}
