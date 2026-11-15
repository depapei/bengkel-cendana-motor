"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { queryKeys } from "@/constants/query-keys";
import { type ExportFormat, ReportKind } from "@/constants/report";
import { reportService } from "@/services/report.service";
import type { OrderReportFilter, OrderReportParams, StockReportFilter, StockReportParams } from "@/types/report";
import { saveBlob } from "@/utils/download";
import { reportFileName } from "@/utils/report";
import { useAppMutation } from "../use-app-mutation";

export function useDashboardSummary() {
  return useQuery({ queryKey: queryKeys.dashboard.all, queryFn: reportService.dashboard });
}

export function useOrderReport(params: OrderReportParams) {
  return useQuery({
    queryKey: queryKeys.reports.orders(params),
    queryFn: () => reportService.orders(params),
    placeholderData: keepPreviousData,
  });
}

export function useStockReport(params: StockReportParams) {
  return useQuery({
    queryKey: queryKeys.reports.stockMovements(params),
    queryFn: () => reportService.stockMovements(params),
    placeholderData: keepPreviousData,
  });
}

type ExportTarget =
  | { kind: ReportKind.Orders; filter: OrderReportFilter }
  | { kind: ReportKind.StockMovements; filter: StockReportFilter };

/** Unduh laporan (semua baris sesuai filter) sebagai PDF / Excel. */
export function useExportReport() {
  return useAppMutation({
    mutationFn: async ({ target, format }: { target: ExportTarget; format: ExportFormat }) => {
      const blob =
        target.kind === ReportKind.Orders
          ? await reportService.exportOrders(target.filter, format)
          : await reportService.exportStockMovements(target.filter, format);
      saveBlob(blob, reportFileName(target.kind, target.filter.from, target.filter.to, format));
    },
    successMessage: MESSAGE.exported,
  });
}
