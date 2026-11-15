"use client";

import type { TableProps } from "antd";
import { DataGrid, type DataGridProps } from "@/components/molecules/data-grid";
import { DataTable } from "@/components/molecules/data-table";
import { ViewMode } from "@/constants/view-mode";

interface DataViewProps<T extends { id: string }> extends DataGridProps<T> {
  view: ViewMode;
  columns: TableProps<T>["columns"];
}

/** Menampilkan data sebagai grid card atau tabel sesuai `view`. */
export function DataView<T extends { id: string }>({ view, columns, renderItem, dataSource, loading, pagination }: DataViewProps<T>) {
  if (view === ViewMode.Card) {
    return <DataGrid<T> dataSource={dataSource} loading={loading} pagination={pagination} renderItem={renderItem} />;
  }

  return <DataTable<T> dataSource={dataSource} loading={loading} pagination={pagination} columns={columns} />;
}
