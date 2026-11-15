import "server-only";
import { Document, Page, renderToBuffer, StyleSheet, Text, View } from "@react-pdf/renderer";
import { APP_NAME } from "@/constants/app";
import { formatRupiah } from "@/utils/format";
import type { ExportDocument } from "./types";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 8, fontFamily: "Helvetica", color: "#1c1917" },
  brand: { fontSize: 9, color: "#78716c", marginBottom: 2 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { color: "#57534e", marginBottom: 2 },
  summary: { flexDirection: "row", gap: 16, marginVertical: 10 },
  summaryLabel: { color: "#78716c" },
  summaryValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  headerRow: { flexDirection: "row", backgroundColor: "#e7e5e4", fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#d6d3d1" },
  cell: { paddingVertical: 4, paddingHorizontal: 4 },
  right: { textAlign: "right" },
  footer: { position: "absolute", bottom: 14, right: 28, color: "#a8a29e" },
});

function ReportPdf<T>({ doc }: { doc: ExportDocument<T> }) {
  const cellStyle = (index: number) => {
    const column = doc.columns[index];
    return [styles.cell, { flex: column.width }, column.align === "right" ? styles.right : {}];
  };

  return (
    <Document title={doc.title} author={APP_NAME}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.brand}>{APP_NAME}</Text>
        <Text style={styles.title}>{doc.title}</Text>
        {doc.subtitles.map((line) => (
          <Text key={line} style={styles.subtitle}>
            {line}
          </Text>
        ))}
        <View style={styles.summary}>
          {doc.summary.map((item) => (
            <View key={item.label}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.headerRow} fixed>
          {doc.columns.map((column, index) => (
            <Text key={column.header} style={cellStyle(index)}>
              {column.header}
            </Text>
          ))}
        </View>
        {doc.rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row} wrap={false}>
            {doc.columns.map((column, index) => {
              const value = column.value(row);
              return (
                <Text key={column.header} style={cellStyle(index)}>
                  {column.money && typeof value === "number" ? formatRupiah(value) : value}
                </Text>
              );
            })}
          </View>
        ))}

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
}

export async function buildPdf<T>(doc: ExportDocument<T>): Promise<Uint8Array> {
  return new Uint8Array(await renderToBuffer(<ReportPdf doc={doc} />));
}
