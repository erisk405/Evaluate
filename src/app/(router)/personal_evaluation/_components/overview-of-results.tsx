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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { formResultsType, getResultEvaluateType } from "@/types/interface";
import { Button } from "@/components/ui/button";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};
type categorizedTableProp = {
  resultEvaluateDetail: getResultEvaluateType | undefined;
};
const OverviewOfResults = ({ resultEvaluateDetail }: categorizedTableProp) => {
  const [scoreTypes, setScoreTypes] = useState<string[]>([]);
  const [Characteristics, SetCharacteristics] = useState<string>();

  const renderTableHeaders = (scoreTypes: string[]) => (
    <>
      <TableRow className="text-lg bg-blue-300">
        <TableHead rowSpan={2} className="text-center text-stone-800">
          ลำดับ
        </TableHead>
        <TableHead rowSpan={2} className="text-center border text-stone-800">
          หัวข้อคำถาม
        </TableHead>
        <TableHead rowSpan={2} className="text-center border text-stone-800">
          ข้อคำถาม
        </TableHead>
        <TableHead colSpan={2} className="text-center border text-stone-800">
          ผลรวมเฉลี่ย
        </TableHead>
        {scoreTypes.map((type) => (
          <TableHead
            key={type}
            colSpan={2}
            className="text-center border text-stone-800"
          >
            {SCORE_TYPE_LABELS[type] || type}
          </TableHead>
        ))}
      </TableRow>
      <TableRow className="text-lg bg-blue-300">
        <TableHead className="text-center border text-stone-800">
          ค่าเฉลี่ย
        </TableHead>
        <TableHead className="text-center border text-stone-800">
          ค่า SD
        </TableHead>
        {scoreTypes.map((type) => (
          <React.Fragment key={type}>
            <TableHead className="text-center border text-stone-800">
              ค่าเฉลี่ย
            </TableHead>
            <TableHead className="text-center border text-stone-800">
              ค่า SD
            </TableHead>
          </React.Fragment>
        ))}
      </TableRow>
    </>
  );

  const resultsByCharacteristics = (totalAvg: number | undefined) => {
    try {
      if (!totalAvg) {
        throw new Error("totalAvg is undefined");
      }
      if (totalAvg >= 4.5) {
        SetCharacteristics("10");
      } else if (totalAvg >= 3.5) {
        SetCharacteristics("9");
      } else if (totalAvg >= 2.5) {
        SetCharacteristics("8");
      } else if (totalAvg >= 1.5) {
        SetCharacteristics("7");
      } else if (totalAvg < 1.5) {
        SetCharacteristics("6");
      } else {
        SetCharacteristics("");
      }
    } catch (error) {
      console.error({ message: error });
    }
  };
  //หาว่ามันมีทั้งหมดที่ type ใน formResults นี้ โดยตรวจสอบจาก score.type
  const extractScoreTypes = (formResults: formResultsType[]) => {
    const types = new Set<string>();
    formResults.forEach((form) =>
      form.questions.forEach((question) =>
        question.scores?.forEach((score) => types.add(score.type))
      )
    );

    return Array.from(types);
  };
  useEffect(() => {
    if (resultEvaluateDetail) {
      resultsByCharacteristics(resultEvaluateDetail.headData.totalAvg);
      setScoreTypes(extractScoreTypes(resultEvaluateDetail.formResults));
    }
  }, [resultEvaluateDetail]);

  useEffect(() => {
    scoreTypes.flatMap((type) => console.log("type", type));
  }, [scoreTypes]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="border rounded-lg">
        <Table>
          <TableCaption>ผลการประเมินรายละเอียด</TableCaption>

          <TableHeader>{renderTableHeaders(scoreTypes)}</TableHeader>

          <TableBody>
            {resultEvaluateDetail?.formResults.map((form) => (
              <React.Fragment key={form.formId}>
                {/* Form Level Summary Row */}
                {/* ผลรวมในแต่ละด้าน */}
                <TableRow className="text-[16px] bg-blue-100">
                  <TableCell colSpan={3} className="font-bold">
                    {form.formName}
                  </TableCell>
                  <TableCell className="text-center">
                    {form.totalAvgPerForm.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {form.totalSDPerForm.toFixed(2)}
                  </TableCell>
                  {/* Dynamic Scores Rendering */}
                  {scoreTypes.flatMap((type) => {
                    const matchedScore = form.total?.find(
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
                {form.questions.map((question, index) => (
                  <TableRow key={question.questionId} className="text-[16px]">
                    <TableCell className="font-medium text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell>{form.formName}</TableCell>
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
              </React.Fragment>
            ))}

            {/* Total Summary Row */}
            {resultEvaluateDetail?.headData && (
              <TableRow className="text-[16px] bg-yellow-200">
                <TableCell colSpan={2} className="font-bold text-right">
                  ผลรวมของ
                </TableCell>
                <TableCell className="text-left">
                  {resultEvaluateDetail.headData.evaluatorName}
                </TableCell>
                <TableCell
                  colSpan={scoreTypes.length * 2 + 2}
                  className="text-center"
                >
                  เฉลี่ยรวม:{" "}
                  {resultEvaluateDetail.headData.totalAvg?.toFixed(2) || "-"},
                  SD รวม:{" "}
                  {resultEvaluateDetail.headData.totalSD?.toFixed(2) || "-"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow className="text-right">
              <TableCell
                colSpan={5 + scoreTypes.length * 2}
                className="text-center"
              >
                <h2>
                  ผลการประเมินการปฎิบัติงานตามคุณลักษณะและพฤติกรรมในการปฎิบัติงาน
                </h2>
                <h2 className="flex justify-around mt-4">
                  เท่ากับ <span className="text-xl">{Characteristics}</span>{" "}
                  คะแนน
                </h2>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="mx-auto w-full max-w-lg">
          <DrawerFooter>
            <Button>Export</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </div>
    </div>
  );
};

export default OverviewOfResults;
