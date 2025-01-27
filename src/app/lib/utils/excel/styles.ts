import { ExcelStyles } from "./types";


export const evaluationExcelStyles: ExcelStyles = {
    titleStyle: {
        font: { size: 14, bold: true },
        alignment: { horizontal: 'center' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F0FF' }
        }
    },
    headerStyle: {
        font: { size: 12, bold: true, color: { argb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    },
    summaryStyle: {
        font: { size: 12, bold: true },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' }
        }
    },
    totalStyle: { // เพิ่มสไตล์สำหรับ "รวมทั้งสิ้น"
        font: { size: 12, bold: true },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' } // สีเหลือง
        }
    }
}