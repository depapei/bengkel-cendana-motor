"use client";

import { isValidElement, type ReactNode } from "react";
import { Typography, type TableColumnsType, type TableColumnType } from "antd";
import { ListCard } from "@/components/molecules/list-card";
import { ACTION_COLUMN_KEY } from "@/constants/table";

interface RecordCardProps<T> {
  record: T;
  index: number;
  columns: TableColumnsType<T>;
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/** Nilai `dataIndex` (key tunggal atau path array) dari satu record. */
function readDataIndex(record: unknown, dataIndex: unknown): unknown {
  if (dataIndex === undefined || dataIndex === null) return undefined;
  const path: unknown[] = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce<unknown>((value, key) => (isObject(value) ? value[String(key)] : undefined), record);
}

/** Isi sel persis seperti di tabel: hasil `render` kolom, atau nilai mentah `dataIndex`. */
function renderCell<T>(column: TableColumnType<T>, record: T, index: number): ReactNode {
  const value = readDataIndex(record, column.dataIndex);
  const cell: unknown = column.render ? column.render(value, record, index) : value;
  // `render` boleh mengembalikan `{ children, props }` (RenderedCell) — ambil children-nya saja.
  if (isObject(cell) && !isValidElement(cell) && !Array.isArray(cell) && "children" in cell) return cell.children as ReactNode;
  return cell === null || cell === undefined || cell === "" ? "-" : (cell as ReactNode);
}

/**
 * Card otomatis dari definisi kolom tabel, untuk tampilan mobile `DataTable`.
 * Kolom pertama = judul, kolom aksi (`ACTION_COLUMN_KEY`) = footer, sisanya pasangan label–nilai.
 */
export function RecordCard<T>({ record, index, columns }: RecordCardProps<T>) {
  const leafColumns = columns.filter((column): column is TableColumnType<T> => !("children" in column) && !column.hidden);
  const actionColumn = leafColumns.find((column) => column.key === ACTION_COLUMN_KEY);
  const [titleColumn, ...fieldColumns] = leafColumns.filter((column) => column !== actionColumn);

  return (
    <ListCard
      title={titleColumn && renderCell(titleColumn, record, index)}
      footer={actionColumn && <div className="flex justify-end">{renderCell(actionColumn, record, index)}</div>}
    >
      {fieldColumns.map((column, position) => (
        <div key={String(column.key ?? column.dataIndex ?? position)} className="flex flex-wrap items-baseline justify-between gap-x-2">
          <Typography.Text type="secondary">{typeof column.title === "function" ? null : column.title}</Typography.Text>
          <div className="min-w-0 break-words">{renderCell(column, record, index)}</div>
        </div>
      ))}
    </ListCard>
  );
}
