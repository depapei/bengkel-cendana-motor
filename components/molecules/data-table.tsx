"use client";

import { Table, type TableProps } from "antd";

/** Tabel standar aplikasi (rowKey id, scroll horizontal di layar kecil). */
export function DataTable<T extends { id: string }>(props: TableProps<T>) {
  return <Table<T> rowKey="id" size="middle" scroll={{ x: "max-content" }} {...props} />;
}
