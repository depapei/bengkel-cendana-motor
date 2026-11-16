"use client";

import type { ReactNode } from "react";
import { Space, Table, type TableColumnType, type TablePaginationConfig, type TableProps } from "antd";
import { DataGrid, type DataGridProps } from "@/components/molecules/data-grid";
import { RecordCard } from "@/components/molecules/record-card";
import { ACTION_COLUMN_KEY, ACTION_COLUMN_TITLE, ACTION_COLUMN_WIDTH } from "@/constants/table";

export interface DataTableProps<T extends { id: string }>
  extends Omit<TableProps<T>, "dataSource" | "loading" | "pagination"> {
  dataSource?: readonly T[];
  loading?: boolean;
  pagination: TablePaginationConfig | false;
  /** Card untuk tampilan mobile. Default: card otomatis dari `columns` (RecordCard). */
  renderItem?: DataGridProps<T>["renderItem"];
  /** Padanan `summary` tabel untuk tampilan card mobile (mis. baris total). */
  cardFooter?: ReactNode;
}

/**
 * Tabel standar aplikasi (rowKey id, scroll horizontal). Di mobile otomatis tampil sebagai grid card
 * 2 kolom — dipilih lewat CSS breakpoint, jadi tidak ada kedipan saat hydration.
 */
export function DataTable<T extends { id: string }>({ renderItem, cardFooter, ...tableProps }: DataTableProps<T>) {
  const { columns = [], dataSource, loading, pagination } = tableProps;

  return (
    <>
      <div className="max-lg:hidden">
        <Table<T> rowKey="id" scroll={{ x: "max-content" }} {...tableProps} />
      </div>
      <div className="lg:hidden">
        <DataGrid<T>
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          footer={cardFooter}
          renderItem={renderItem ?? ((record, index) => <RecordCard<T> record={record} index={index} columns={columns} />)}
        />
      </div>
    </>
  );
}

/** Kolom "Aksi" standar (tombol ubah/hapus). Di card mobile tampil sebagai footer card. */
export function actionColumn<T>(render: (record: T) => ReactNode): TableColumnType<T> {
  return {
    title: ACTION_COLUMN_TITLE,
    key: ACTION_COLUMN_KEY,
    width: ACTION_COLUMN_WIDTH,
    render: (_, record) => <Space>{render(record)}</Space>,
  };
}
