"use client";

import type { ReactNode } from "react";
import { Empty, Pagination, Spin, type TablePaginationConfig } from "antd";

export interface DataGridProps<T extends { id: string }> {
  dataSource?: readonly T[];
  loading?: boolean;
  /** `false` → tanpa pagination (mis. daftar ringkas di dashboard). */
  pagination: TablePaginationConfig | false;
  renderItem: (item: T, index: number) => ReactNode;
  /** Ringkasan di bawah daftar (mis. total order). */
  footer?: ReactNode;
}

/**
 * Daftar data dalam grid card dengan pagination yang sama seperti DataTable.
 * - Mobile: selalu 2 kolom, langsung di halaman (tanpa wadah/padding tambahan).
 * - Desktop: 1/2/3/4 kolom mengikuti lebar wadah (container query), jadi tetap rapi di kartu sempit.
 */
export function DataGrid<T extends { id: string }>({ dataSource, loading, pagination, renderItem, footer }: DataGridProps<T>) {
  const items = dataSource ?? [];

  return (
    <Spin spinning={!!loading}>
      <div className="@container lg:p-4">
        {items.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1 lg:gap-4 lg:@lg:grid-cols-2 lg:@3xl:grid-cols-3 lg:@5xl:grid-cols-4">
            {items.map((item, index) => (
              <div key={item.id}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        )}
        {footer && <div className="pt-3 lg:pt-4">{footer}</div>}
        {pagination && (
          <div className="flex justify-center pt-4 lg:justify-end">
            <Pagination
              responsive
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={pagination.showSizeChanger}
              onChange={pagination.onChange}
            />
          </div>
        )}
      </div>
    </Spin>
  );
}
