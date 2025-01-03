"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formResultHistoryType, formResultsType } from "@/types/interface";
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};
type categorizedTableProp = {
  formHistoryResultsItem: formResultHistoryType | undefined;
};
const CategorizedHistoryTable = ({
  formHistoryResultsItem,
}: categorizedTableProp) => {
  const [scoreTypes, setScoreTypes] = useState<string[]>([]);
  const styles = useThemeStyles();
  const renderTableHeaders = (scoreTypes: string[]) => (
    <>
      <TableRow
        className={`text-lg ${styles.background_head_table}`}
      >
        <TableHead
          rowSpan={2}
          className={`text-center  ${styles.text}`}
        >
          ลำดับ
        </TableHead>
        <TableHead
          rowSpan={2}
          className={`text-center border ${styles.text}`}
        >
          หัวข้อคำถาม
        </TableHead>
        <TableHead
          rowSpan={2}
          className={`text-center border ${styles.text}`}
        >
          ข้อคำถาม
        </TableHead>
        <TableHead
          colSpan={2}
          className={`text-center border ${styles.text}`}
        >
          ผลรวมเฉลี่ย
        </TableHead>
        {scoreTypes.map((type) => (
          <TableHead
            key={type}
            colSpan={2}
            className={`text-center border ${styles.text}`}
          >
            {SCORE_TYPE_LABELS[type] || type}
          </TableHead>
        ))}
      </TableRow>
      <TableRow
        className={`text-lg ${styles.background_head_table}`}
      >
        <TableHead
          className={`text-center border ${styles.text}`}
        >
          ค่าเฉลี่ย
        </TableHead>
        <TableHead
          className={`text-center border  ${styles.text}`}
        >
          ค่า SD
        </TableHead>
        {scoreTypes.map((type) => (
          <React.Fragment key={type}>
            <TableHead
              className={`text-center border  ${styles.text}`}
            >
              ค่าเฉลี่ย
            </TableHead>
            <TableHead
              className={`text-center border  ${styles.text}`}
            >
              ค่า SD
            </TableHead>
          </React.Fragment>
        ))}
      </TableRow>
    </>
  );
  //หาว่ามันมีทั้งหมดที่ type ใน formResults นี้ โดยตรวจสอบจาก score.type
  const extractScoreTypes = (formResultsItem: formResultHistoryType) => {
    const types = new Set<string>();
    formResultsItem.questions.forEach((question) =>
      question.scores?.forEach((score) => types.add(score.type))
    );

    return Array.from(types);
  };
  useEffect(() => {
    if (formHistoryResultsItem) {
      //   resultsByCharacteristics(resultEvaluateDetail.headData.totalAvg);
      setScoreTypes(extractScoreTypes(formHistoryResultsItem));
    }
  }, []);

  // useEffect(() => {
  //   scoreTypes.flatMap((type) => console.log("type", type));
  // }, [scoreTypes]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="border rounded-lg">
        <Table>
          <TableCaption>ผลการประเมินรายละเอียด</TableCaption>

          <TableHeader>{renderTableHeaders(scoreTypes)}</TableHeader>

          <TableBody>
            <TableRow
              className={`text-[16px] ${styles.background_secondary_head_table}`}
            >
              <TableCell colSpan={3} className="font-bold">
                {formHistoryResultsItem?.formName}
              </TableCell>
              <TableCell className="text-center">
                {formHistoryResultsItem?.sumTotal.average_per_form.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {formHistoryResultsItem?.sumTotal.sd_per_form.toFixed(2)}
              </TableCell>
              {/* Dynamic Scores Rendering */}
              {scoreTypes.flatMap((type) => {
                const matchedScore = formHistoryResultsItem?.total?.find(
                  (match) => match.type === type
                );
                return [
                  <TableCell key={`${type}-avg`} className="text-center">
                    {matchedScore?.average_per_type.toFixed(2) || "-"}
                  </TableCell>,
                  <TableCell key={`${type}-sd`} className="text-center">
                    {matchedScore?.sd_per_type.toFixed(2) || "-"}
                  </TableCell>,
                ];
              })}
            </TableRow>

            {/* Questions Rows */}
            {formHistoryResultsItem?.questions.map((question, index) => (
              <TableRow key={question.id} className="text-[16px]">
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>{formHistoryResultsItem?.formName}</TableCell>
                <TableCell>{question.questionName}</TableCell>
                {question.sumScore && [
                  <TableCell key={`sumScore-avg`} className="text-center">
                    {question.sumScore?.average.toFixed(2) || "-"}
                  </TableCell>,
                  <TableCell key={`sumScore-Sd`} className="text-center">
                    {question.sumScore?.sd.toFixed(2) || "-"}
                  </TableCell>,
                ]}
                {/* Dynamic Scores Rendering */}
                {scoreTypes.flatMap((type) => {
                  const matchedScore = question.scores?.find(
                    (score) => score.type === type
                  );
                  return [
                    <TableCell key={`${type}-avg`} className="text-center">
                      {matchedScore?.average.toFixed(2) || "-"}
                    </TableCell>,
                    <TableCell key={`${type}-sd`} className="text-center">
                      {matchedScore?.sd.toFixed(2) || "-"}
                    </TableCell>,
                  ];
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategorizedHistoryTable;
