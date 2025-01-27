import ExcelJS from 'exceljs';
import { evaluationExcelStyles } from './styles';
import { SCORE_TYPE_LABELS, type ExcelExportConfig } from './types';
import { CategorizedFormResults, CommonResultFormat } from '../../adapters/results';

export const exportEvaluationToExcel = async (
    formResultsByVisionLevel: CategorizedFormResults,
    adaptedData: CommonResultFormat,
    scoreTypes: string[],
    config: ExcelExportConfig
) => {
    if (!formResultsByVisionLevel) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.sheetName);
    // Add title rows with correct merge range
    const totalColumns = 5 + (scoreTypes.length * 2); // 5 คือคอลัมน์พื้น
    const lastColumn = String.fromCharCode(64 + totalColumns);

    const titleRow1 = worksheet.addRow([`ผลรายละเอียดคะแนนของ`]);
    titleRow1.height = 30;
    worksheet.mergeCells(`A1: ${lastColumn}1`);
    titleRow1.eachCell(cell => Object.assign(cell.style, evaluationExcelStyles.titleStyle));

    const titleRow2 = worksheet.addRow([`${adaptedData?.headData.userName + " " + adaptedData.headData.roleName + " หน่วยงาน" + adaptedData.headData.department}  `]);
    titleRow2.height = 30;
    worksheet.mergeCells(`A2:${lastColumn}2`);
    titleRow2.eachCell(cell => Object.assign(cell.style, evaluationExcelStyles.titleStyle));

    const titleRow3 = worksheet.addRow([`${adaptedData?.headData.periodName}`]);
    titleRow2.height = 30;
    worksheet.mergeCells(`A3:${lastColumn}3`);
    titleRow3.eachCell(cell => Object.assign(cell.style, evaluationExcelStyles.titleStyle));

    // ตั้งค่าความกว้างของคอลัมน์
    worksheet.columns = config.columnWidths.map((width) => ({ width }));
    // เว้นบรรทัด
    // worksheet.addRow([])
    // แถวหัวข้อใหญ่
    const headerRow1 = worksheet.addRow([
        "ลำดับ",
        "หัวข้อคำถาม",
        "ข้อคำถาม",
        "ผลรวมเฉลี่ย",
        ...scoreTypes.map(() => ""), // เว้นว่างไว้สำหรับเซลล์ที่จะ merge
    ]);

    // ตั้งค่าคอลัมน์ที่ 4 ("ผลรวมเฉลี่ย")
    worksheet.getCell("D4").value = "ผลรวมเฉลี่ย";
    worksheet.mergeCells("D4:E4");

    // ตั้งค่า scoreTypes และ merge cell
    scoreTypes.forEach((type, index) => {
        const startColumn = 6 + index * 2; // เริ่มจากคอลัมน์ที่ 6
        const endColumn = startColumn + 1;
        const cellAddress = `${getExcelColumn(startColumn)}4`;

        // ตั้งค่าข้อความในเซลล์แรกของช่วงที่ merge
        worksheet.getCell(cellAddress).value = SCORE_TYPE_LABELS[type] || type;
        worksheet.mergeCells(`${cellAddress}:${getExcelColumn(endColumn)}4`);
    });


    // แถวหัวข้อย่อย
    const headerRow2 = worksheet.addRow([
        "",
        "",
        "",
        "ค่าเฉลี่ย",
        "ค่า SD",
        ...scoreTypes.flatMap(() => ["ค่าเฉลี่ย", "ค่า SD"]), // เพิ่มหัวข้อย่อยตาม scoreTypes
    ]);
    // จัดรูปแบบหัวข้อ
    [headerRow1, headerRow2].forEach((row) =>
        row.eachCell((cell) => Object.assign(cell.style, evaluationExcelStyles.headerStyle))
    );

    // เพิ่มข้อมูลในตาราง (ตัวอย่างการเพิ่มข้อมูล)
    // เพิ่มข้อมูลในตาราง
    Object.entries(formResultsByVisionLevel.formResults).forEach(([level, forms]) => {
        forms.forEach((form) => {
            // เพิ่มแถว "รวมทั้งสิ้น"
            const row = worksheet.addRow([
                `ผลรวมของด้าน ${form.formName}`, // ข้อความ "รวมทั้งสิ้น" จะอยู่ในคอลัมน์ที่ต้องการรวม
                "", // เว้นคอลัมน์ว่างไว้ (หรือใช้จำนวนคอลัมน์ที่เหมาะสม)
                "",
                form.totals.average.toFixed(2), // ค่าเฉลี่ยทั้งหมด
                form.totals.sd.toFixed(2),// ค่าSDทั้งหมด
                ...scoreTypes.flatMap((type) => { // ผลรวมของแต่ละด้านที่ถูกจำแนกออกไป
                    const matchedScore = form.totals.byType?.find(
                        (score) => score.type === type
                    );
                    return [
                        matchedScore?.average?.toFixed(2) || "-", // ค่าเฉลี่ยรวม
                        matchedScore?.sd?.toFixed(2) || "-", // ค่า SD รวม
                    ];
                }),
            ]);
            // Merge เซลล์สำหรับ "รวมทั้งสิ้น"
            worksheet.mergeCells(`A${row.number}:C${row.number}`); // รวมเซลล์ A ถึง C ในแถวนี้
            // จัดรูปแบบสไตล์ของ "รวมทั้งสิ้น"
            // จัดรูปแบบสไตล์ให้ทั้งแถวเป็นสีเหลือง
            row.eachCell((cell) => {
                cell.style = {
                    font: { size: 12, bold: true },
                    alignment: { horizontal: "center", vertical: "middle" },
                    fill: {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFFFF00" }, // สีเหลือง
                    },
                    border: {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    },
                };
            });

            // เพิ่มคำถาม
            form.questions.forEach((question, index) => {
                const row = worksheet.addRow([
                    index + 1, // ลำดับคำถาม
                    form.formName, // ชื่อฟอร์ม
                    question.name, // ชื่อคำถาม
                    question.summary.average.toFixed(2), // ค่าเฉลี่ย
                    question.summary.sd.toFixed(2), // ค่า SD
                    ...scoreTypes.flatMap((type) => {
                        const matchedScore = question.scores?.find(
                            (score) => score.type === type
                        );
                        return [
                            matchedScore?.average?.toFixed(2) || "-", // ค่าเฉลี่ยของ scoreType
                            matchedScore?.sd?.toFixed(2) || "-", // ค่า SD ของ scoreType
                        ];
                    }),
                ]);

                // เพิ่มสไตล์ให้แถวคำถาม
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            });


        });
    });

    // เพิ่มแถว "ผลรวมทั้งหมด"
    const finalRow = worksheet.addRow([
        `ผลรวมทั้งหมดของ ${adaptedData.headData.userName}`, // ข้อความ "รวมทั้งสิ้น" จะอยู่ในคอลัมน์ที่ต้องการรวม
        "", // เว้นคอลัมน์ว่างไว้ (หรือใช้จำนวนคอลัมน์ที่เหมาะสม)
        "",
        adaptedData.headData.totalAverage.toFixed(2), // ค่าเฉลี่ยทั้งหมด
        adaptedData.headData.totalSD.toFixed(2),// ค่าSDทั้งหมด
    ]);
    // Merge เซลล์สำหรับ "รวมทั้งสิ้น"
    worksheet.mergeCells(`A${finalRow.number}:C${finalRow.number}`); // รวมเซลล์ A ถึง C ในแถวนี้
    // จัดรูปแบบสไตล์ของ "รวมทั้งสิ้น"
    // จัดรูปแบบสไตล์ให้ทั้งแถวเป็นสีเหลือง
    finalRow.eachCell((cell) => {
        cell.style = {
            font: { size: 12, bold: true },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "3EFD29" }, // สีเหลือง
            },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            },
        };
    });
    // Return buffer
    return await workbook.xlsx.writeBuffer();
};

// ฟังก์ชันช่วยในการหาชื่อคอลัมน์ Excel (เช่น A, B, C...Z, AA, AB)
const getExcelColumn = (index: number): string => {
    let col = "";
    while (index > 0) {
        const remainder = (index - 1) % 26;
        col = String.fromCharCode(65 + remainder) + col;
        index = Math.floor((index - 1) / 26);
    }
    // console.log("col", col);

    return col;
};
