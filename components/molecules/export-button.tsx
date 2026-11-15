"use client";

import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import { EXPORT_FORMAT_META, ExportFormat } from "@/constants/report";

const FORMAT_ICON: Record<ExportFormat, React.ReactNode> = {
  [ExportFormat.Pdf]: <FilePdfOutlined />,
  [ExportFormat.Excel]: <FileExcelOutlined />,
};

const ITEMS: MenuProps["items"] = Object.values(ExportFormat).map((format) => ({
  key: format,
  icon: FORMAT_ICON[format],
  label: EXPORT_FORMAT_META[format].label,
}));

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
  loading?: boolean;
}

/** Tombol export dengan pilihan format PDF / Excel. */
export function ExportButton({ onExport, loading }: ExportButtonProps) {
  return (
    <Dropdown
      trigger={["click"]}
      disabled={loading}
      menu={{ items: ITEMS, onClick: ({ key }) => onExport(key as ExportFormat) }}
    >
      <Button icon={<DownloadOutlined />} loading={loading}>
        Export
      </Button>
    </Dropdown>
  );
}
