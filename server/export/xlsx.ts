import "server-only";
import ExcelJS from "exceljs";
import type { ExportDocument } from "./types";

const RUPIAH_FORMAT = '"Rp"#,##0';
const SHEET_NAME = "Laporan";

export async function buildXlsx<T>(doc: ExportDocument<T>): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);

  sheet.addRow([doc.title]).font = { bold: true, size: 14 };
  for (const line of doc.subtitles) sheet.addRow([line]);
  sheet.addRow([]);
  for (const item of doc.summary) sheet.addRow([item.label, item.value]).getCell(1).font = { bold: true };
  sheet.addRow([]);

  const header = sheet.addRow(doc.columns.map((column) => column.header));
  header.font = { bold: true };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE7E5E4" } };
    cell.border = { bottom: { style: "thin" } };
  });

  for (const row of doc.rows) sheet.addRow(doc.columns.map((column) => column.value(row)));

  doc.columns.forEach((column, index) => {
    const sheetColumn = sheet.getColumn(index + 1);
    sheetColumn.width = column.width;
    if (column.money) sheetColumn.numFmt = RUPIAH_FORMAT;
    if (column.align) sheetColumn.alignment = { horizontal: column.align };
  });

  return new Uint8Array(await workbook.xlsx.writeBuffer());
}
