"use client";

import type { ReactNode } from "react";
import { Empty, Flex, Pagination, Spin, type TablePaginationConfig } from "antd";

export interface DataGridProps<T extends { id: string }> {
  dataSource?: readonly T[];
  loading?: boolean;
  /** `false` → tanpa pagination (mis. daftar ringkas di dashboard). */
  pagination: TablePaginationConfig | false;
  renderItem: (item: T) => ReactNode;
}

/**
 * Daftar data dalam grid card (1/2/3/4 kolom) dengan pagination yang sama seperti DataTable.
 * Jumlah kolom mengikuti lebar wadah (container query), jadi tetap rapi di kartu yang sempit.
 */
export function DataGrid<T extends { id: string }>({ dataSource, loading, pagination, renderItem }: DataGridProps<T>) {
  const items = dataSource ?? [];

  return (
    <Spin spinning={!!loading}>
      <div className="@container p-4">
        {items.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </div>
        )}
        {pagination && (
          <Flex justify="end" className="pt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger={pagination.showSizeChanger}
              onChange={pagination.onChange}
            />
          </Flex>
        )}
      </div>
    </Spin>
  );
}
