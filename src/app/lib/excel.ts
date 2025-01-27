import { getResultEvaluateType } from "@/types/interface";
import { CategorizedFormResults, CommonResultFormat } from "./adapters/results";
import { exportEvaluationToExcel } from "./utils/excel/exportEvaluation";
import { handleErrorOnAxios } from "../_util/GlobalApi";


export const downloadEvaluationExcel = async (
    formResultsByVisionLevel: CategorizedFormResults,
    adaptedData: CommonResultFormat,
    scoreTypes: string[]
) => {
    const basicColumns = [10, 20, 40, 15, 15]; // Widths for the 5 basic columns
    const scoreTypeColumns = Array(scoreTypes.length * 2).fill(15); // Two columns per scoreType

    const columnWidths = [...basicColumns, ...scoreTypeColumns];

    const config = {
        fileName: `ผลการประเมิน${adaptedData.headData.userName}.xlsx`,
        sheetName: 'Results',
        columnWidths
    };

    try {
        const buffer = await exportEvaluationToExcel(
            formResultsByVisionLevel,
            adaptedData,
            scoreTypes,
            config
        );
        if (!buffer) {
            throw new Error('Failed to generate Excel buffer');
        }
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = config.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export Excel:', error);
        handleErrorOnAxios(error)
        // Handle error appropriately
    }
};