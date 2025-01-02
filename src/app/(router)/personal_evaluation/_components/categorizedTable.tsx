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
import { formResultsType } from "@/types/interface";
import { useTheme } from "next-themes";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};
type categorizedTableProp = {
  formResultsItem: formResultsType | undefined;
};
const CategorizedTable = ({ formResultsItem }: categorizedTableProp) => {
  const [scoreTypes, setScoreTypes] = useState<string[]>([]);
  const { theme } = useTheme();

  const renderTableHeaders = (scoreTypes: string[]) => (
    <>
      <TableRow
        className={`text-lg bg-blue-300  ${
          theme === "light" ? "bg-blue-300" : "bg-blue-400"
        }`}
      >
        <TableHead
          rowSpan={2}
          className={`text-center  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          ลำดับ
        </TableHead>
        <TableHead
          rowSpan={2}
          className={`text-center border  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          หัวข้อคำถาม
        </TableHead>
        <TableHead
          rowSpan={2}
          className={`text-center border  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          ข้อคำถาม
        </TableHead>
        <TableHead
          colSpan={2}
          className={`text-center border  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          ผลรวมเฉลี่ย
        </TableHead>
        {scoreTypes.map((type) => (
          <TableHead
            key={type}
            colSpan={2}
            className={`text-center border  ${
              theme === "light" ? "text-neutral-800" : "text-white "
            }`}
          >
            {SCORE_TYPE_LABELS[type] || type}
          </TableHead>
        ))}
      </TableRow>
      <TableRow
        className={`text-lg ${
          theme === "light" ? "bg-blue-300" : "bg-blue-400"
        }`}
      >
        <TableHead
          className={`text-center border  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          ค่าเฉลี่ย
        </TableHead>
        <TableHead
          className={`text-center border  ${
            theme === "light" ? "text-neutral-800" : "text-white "
          }`}
        >
          ค่า SD
        </TableHead>
        {scoreTypes.map((type) => (
          <React.Fragment key={type}>
            <TableHead
              className={`text-center border  ${
                theme === "light" ? "text-neutral-800" : "text-white "
              }`}
            >
              ค่าเฉลี่ย
            </TableHead>
            <TableHead
              className={`text-center border  ${
                theme === "light" ? "text-neutral-800" : "text-white "
              }`}
            >
              ค่า SD
            </TableHead>
          </React.Fragment>
        ))}
      </TableRow>
    </>
  );
  //หาว่ามันมีทั้งหมดที่ type ใน formResults นี้ โดยตรวจสอบจาก score.type
  const extractScoreTypes = (formResultsItem: formResultsType) => {
    const types = new Set<string>();
    formResultsItem.questions.forEach((question) =>
      question.scores?.forEach((score) => types.add(score.type))
    );

    return Array.from(types);
  };
  useEffect(() => {
    if (formResultsItem) {
      //   resultsByCharacteristics(resultEvaluateDetail.headData.totalAvg);
      setScoreTypes(extractScoreTypes(formResultsItem));
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
              className={`text-[16px] bg-blue-100 ${
                theme === "light"
                  ? "text-neutral-800"
                  : "text-neutral-800 hover:text-white"
              }`}
            >
              <TableCell colSpan={3} className="font-bold">
                {formResultsItem?.formName}
              </TableCell>
              <TableCell className="text-center">
                {formResultsItem?.totalAvgPerForm.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {formResultsItem?.totalSDPerForm.toFixed(2)}
              </TableCell>
              {/* Dynamic Scores Rendering */}
              {scoreTypes.flatMap((type) => {
                const matchedScore = formResultsItem?.total?.find(
                  (match) => match.total === type
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

            {/* Questions Rows */}
            {formResultsItem?.questions.map((question, index) => (
              <TableRow key={question.questionId} className="text-[16px]">
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>{formResultsItem?.formName}</TableCell>
                <TableCell>{question.questionName}</TableCell>
                {question.sumScore && [
                  <TableCell key={`sumScore-avg`} className="text-center">
                    {question.sumScore?.average.toFixed(2) || "-"}
                  </TableCell>,
                  <TableCell key={`sumScore-Sd`} className="text-center">
                    {question.sumScore?.standardDeviation.toFixed(2) || "-"}
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

export default CategorizedTable;
