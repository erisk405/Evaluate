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
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  formResultHistoryType,
  formResultsType,
  getResultEvaluateType,
  historyResult,
  LevelFormVision,
} from "@/types/interface";
import { Button } from "@/components/ui/button";
import {
  adaptHistoryResult,
  CategorizedFormResults,
  CommonFormResult,
  CommonResultFormat,
  VISION_LEVEL_CONFIGS,
} from "@/app/lib/adapters/results";
import { calculateCharacteristics } from "@/app/lib/utils/result-calculations";
import { adaptCategorizeFormResultsByVisionLevel } from "@/app/lib/adapters/results/categorize-vision-results";
import Loading from "@/app/_components/Loading";
import useStore from "@/app/store/store";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};

type categorizedTableProp = {
  resultHistoryDetail: historyResult | undefined;
};

const OverviewHistoryResult = ({
  resultHistoryDetail,
}: categorizedTableProp) => {
  const [scoreTypes, setScoreTypes] = useState<string[]>([]);
  const [characteristics, setCharacteristics] = useState<string>();
  const [adaptedData, setAdaptedData] = useState<CommonResultFormat>();
  const [formResultsByVisionLevel, SetFormResultsByVisionLevel] =
    useState<CategorizedFormResults>();
  const styles = useThemeStyles();
  const renderTableHeaders = (
    scoreTypes: string[],
    vesion_level: LevelFormVision
  ) => (
    <>
      <TableRow className={`text-lg ${styles.background_head_table}`}>
        <TableHead rowSpan={2} className={`text-center border  ${styles.text}`}>
          ลำดับ
        </TableHead>
        <TableHead rowSpan={2} className={`text-center border ${styles.text}`}>
          หัวข้อคำถาม
        </TableHead>
        <TableHead rowSpan={2} className={`text-center border ${styles.text}`}>
          ข้อคำถาม
        </TableHead>
        <TableHead colSpan={2} className={`text-center border ${styles.text}`}>
          ผลรวมเฉลี่ย
        </TableHead>
        {VISION_LEVEL_CONFIGS[vesion_level as LevelFormVision].showScoreTypes &&
          scoreTypes.map((type) => (
            <TableHead
              key={type}
              colSpan={2}
              className={`text-center border ${styles.text}`}
            >
              {SCORE_TYPE_LABELS[type] || type}
            </TableHead>
          ))}
      </TableRow>
      <TableRow className={`text-lg ${styles.background_head_table}`}>
        <TableHead className={`text-center border ${styles.text}`}>
          ค่าเฉลี่ย
        </TableHead>
        <TableHead className={`text-center border ${styles.text}`}>
          ค่า SD.
        </TableHead>
        {VISION_LEVEL_CONFIGS[vesion_level].showScoreTypes &&
          scoreTypes.map((type) => (
            <React.Fragment key={type}>
              <TableHead className={`text-center border ${styles.text}`}>
                ค่าเฉลี่ย
              </TableHead>
              <TableHead className={`text-center border ${styles.text}`}>
                ค่า SD.
              </TableHead>
            </React.Fragment>
          ))}
      </TableRow>
    </>
  );
  //หาว่ามันมีทั้งหมดที่ type ใน formResults นี้ โดยตรวจสอบจาก score.type
  const extractScoreTypes = (formResults: CommonFormResult[]) => {
    const types = new Set<string>();
    formResults.forEach((form) =>
      form.questions.forEach((question) =>
        question.scores?.forEach((score) => types.add(score.type))
      )
    );
    return Array.from(types);
  };
  useEffect(() => {
    if (resultHistoryDetail) {
      const adapted = adaptHistoryResult(resultHistoryDetail);
      setAdaptedData(adapted);

      const extractType = extractScoreTypes(adapted.formResults);
      setScoreTypes(extractType);

      const summaryCharacteristics = calculateCharacteristics(
        adapted.headData.totalAverage
      );
      setCharacteristics(summaryCharacteristics);

      const adaptCategorize = adaptCategorizeFormResultsByVisionLevel(
        adapted?.formResults
      );
      SetFormResultsByVisionLevel(adaptCategorize);
    }
  }, [resultHistoryDetail]);

  if (resultHistoryDetail === null) {
    return <Loading />;
  }
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="">
        {formResultsByVisionLevel &&
          Object.entries(formResultsByVisionLevel.formResults)
            .sort((a, b) => (a[0] === "VISION_2" ? -1 : 1)) //ถ้าได้ -1 หมายถึง a มาก่อน b  แต่ถ้าได้ 1 หมายถึง b มาก่อน a แล้วถ้าได้ 0 หมายถึง ค่าเท่ากัน
            .map(([vesion_level, vision]) => (
              <div
                key={vesion_level}
                className={`my-5  ${
                  vesion_level === "VISION_1" ? "lg:w-[70%] mx-auto" : "w-full"
                }`}
              >
                <Table className="border rounded-lg">
                  <TableCaption>รายละเอียดผลการประเมิน</TableCaption>
                  <TableHeader>
                    {renderTableHeaders(
                      scoreTypes,
                      vesion_level as LevelFormVision
                    )}
                  </TableHeader>
                  <TableBody>
                    {vision.map((form) => (
                      <React.Fragment key={form.id}>
                        {/* Form Level Summary Row */}
                        {/* ผลรวมในแต่ละด้าน */}
                        <TableRow
                          className={`text-[16px] ${styles.background_secondary_head_table}`}
                        >
                          <TableCell colSpan={3} className="font-bold">
                            {form.formName}
                          </TableCell>
                          <TableCell className="text-center">
                            {form.totals.average.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {form.totals.sd.toFixed(2)}
                          </TableCell>
                          {/* Dynamic Scores Rendering */}
                          {VISION_LEVEL_CONFIGS[vesion_level as LevelFormVision]
                            .showScoreTypes &&
                            scoreTypes.flatMap((type) => {
                              const matchedScore = form.totals.byType?.find(
                                (score) => score.type === type
                              );
                              return [
                                <TableCell
                                  key={`${type}-avg`}
                                  className="text-center"
                                >
                                  {matchedScore?.average.toFixed(2) || "-"}
                                </TableCell>,
                                <TableCell
                                  key={`${type}-sd`}
                                  className="text-center"
                                >
                                  {matchedScore?.sd.toFixed(2) || "-"}
                                </TableCell>,
                              ];
                            })}
                        </TableRow>

                        {/* Questions Rows */}
                        {form.questions.map((question, index) => (
                          <TableRow key={question.id} className="text-[16px]">
                            <TableCell className="font-medium text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell>{form.formName}</TableCell>
                            <TableCell>{question.name}</TableCell>
                            {question.scores && [
                              <TableCell
                                key={`sumScore-avg`}
                                className="text-center"
                              >
                                {question.summary.average.toFixed(2) || "-"}
                              </TableCell>,
                              <TableCell
                                key={`sumScore-Sd`}
                                className="text-center"
                              >
                                {question.summary.sd?.toFixed(2) || "-"}
                              </TableCell>,
                            ]}
                            {/* Dynamic Scores Rendering */}

                            {VISION_LEVEL_CONFIGS[
                              vesion_level as LevelFormVision
                            ].showScoreTypes &&
                              scoreTypes.flatMap((type) => {
                                const matchedScore = question.scores?.find(
                                  (score) => score.type === type
                                );
                                return [
                                  <TableCell
                                    key={`${type}-avg`}
                                    className="text-center"
                                  >
                                    {matchedScore?.average.toFixed(2) || "-"}
                                  </TableCell>,
                                  <TableCell
                                    key={`${type}-sd`}
                                    className="text-center"
                                  >
                                    {matchedScore?.sd.toFixed(2) || "-"}
                                  </TableCell>,
                                ];
                              })}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
        <div className="w-full">
          <div className="lg:w-[70%] mx-auto">
            <Table className="border rounded-lg ">
              <TableCaption>ผลการประเมินรายละเอียด</TableCaption>
              <TableHeader className={`text-lg`}>
                <TableRow
                  className={`text-lg ${styles.background_head_table} `}
                >
                  <TableHead
                    colSpan={1}
                    className={`text-center ${styles.text}`}
                  >
                    ลำดับ
                  </TableHead>
                  <TableHead
                    colSpan={4}
                    className={`text-center border ${styles.text}`}
                  >
                    ผลรวมในแต่ละด้าน
                  </TableHead>
                  <TableHead
                    colSpan={1}
                    className={`text-center border ${styles.text}`}
                  >
                    ค่าเฉลี่ย
                  </TableHead>
                  <TableHead
                    colSpan={1}
                    className={`text-center border ${styles.text}`}
                  >
                    ค่า SD.
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adaptedData?.formResults.map((item, index) => (
                  <TableRow
                    className="text-[16px] "
                    key={"all-result-" + index}
                  >
                    <TableCell colSpan={1} className="text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell colSpan={4} className="text-start">
                      {item.formName}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {item.totals.average.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {item.totals.sd.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Summary Row */}
                {adaptedData?.headData && (
                  <TableRow
                    className={`text-[16px] bg-yellow-200 text-zinc-800`}
                  >
                    <TableCell colSpan={1} className="font-bold text-right">
                      ผลรวมทั้งหมดของ
                    </TableCell>
                    <TableCell colSpan={4} className="text-left">
                      {adaptedData.headData.userName}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {adaptedData.headData.totalAverage?.toFixed(2) || "-"}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {adaptedData.headData.totalSD?.toFixed(2) || "-"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="text-right">
                  <TableCell colSpan={7} className="text-center">
                    <h2>
                      ผลการประเมินการปฎิบัติงานตามคุณลักษณะและพฤติกรรมในการปฎิบัติงาน
                    </h2>
                    <h2 className="flex justify-around mt-4">
                      เท่ากับ <span className="text-xl">{characteristics}</span>{" "}
                      คะแนน
                    </h2>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        <div className="mx-auto w-full max-w-lg">
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">ตกลง</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </div>
    </div>
  );
};

export default OverviewHistoryResult;
