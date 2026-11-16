"use client";

import { Descriptions, theme, type DescriptionsProps } from "antd";

/**
 * Descriptions bergaya "label di atas, data di bawah" (tanpa titik dua).
 * Dipakai untuk blok informasi read-only/inline-edit, mis. Informasi Order & Detail Pengerjaan.
 */
export function InfoDescriptions({ className, styles, ...props }: Omit<DescriptionsProps, "layout" | "colon">) {
  const { token } = theme.useToken();

  return (
    <Descriptions
      layout="vertical"
      colon={false}
      // Layout vertical: label ada di baris <th> sendiri dengan padding-bottom bawaan (16px);
      // styles.label hanya kena <span> di dalamnya → nolkan padding <th> agar label menempel ke data.
      className={`[&_.ant-descriptions-row>th]:pb-0! ${className ?? ""}`}
      // Skala komponen large AntD: label = fontSize (14), data = fontSizeLG (16).
      styles={{
        label: { fontSize: token.fontSize, lineHeight: token.lineHeight, color: token.colorTextSecondary, paddingBottom: 0, marginBottom: 0 },
        content: { fontSize: token.fontSizeLG, lineHeight: token.lineHeightLG, color: token.colorText },
        ...(typeof styles === "object" ? styles : {}),
      }}
      {...props}
    />
  );
}
