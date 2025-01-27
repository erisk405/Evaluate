import type { Style } from 'exceljs'

export interface ExcelStyles {
    titleStyle: Partial<Style>;
    headerStyle: Partial<Style>;
    summaryStyle: Partial<Style>;
    totalStyle: Partial<Style>;
}
export interface ExcelExportConfig {
    fileName: string;
    sheetName: string;
    columnWidths: number[];
}

export const SCORE_TYPE_LABELS: Record<string, string> = {
    Executive: "ผู้บริหาร",
    Manager: "ผู้จัดการ",
    Employee: "พนักงาน",
  };