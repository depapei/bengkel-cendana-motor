"use client";

import type { ReactNode } from "react";
import { Empty, Flex, Pagination, Spin, type TablePaginationConfig } from "antd";

export interface DataGridProps<T extends { id: string }> {
  dataSource?: readonly T[];
  loading?: boolean;
  pagination: TablePaginationConfig;
  renderItem: (item: T) => ReactNode;
}

/** Daftar data dalam grid card (1/2/3/4 kolom) dengan pagination yang sama seperti DataTable. */
export function DataGrid<T extends { id: string }>({ dataSource, loading, pagination, renderItem }: DataGridProps<T>) {
  const items = dataSource ?? [];

  return (
    <Spin spinning={!!loading}>
      <div className="p-4">
        {items.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </div>
        )}
        <Flex justify="end" className="pt-4">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={pagination.showSizeChanger}
            onChange={pagination.onChange}
          />
        </Flex>
      </div>
    </Spin>
  );
}
