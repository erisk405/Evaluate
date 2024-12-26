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
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import {
  formResultHistoryType,
  formResultsType,
  getResultEvaluateType,
  historyResult,
  LevelFormVision,
} from "@/types/interface";
import { Button } from "@/components/ui/button";
import { adaptHistoryResult, CommonFormResult, CommonResultFormat } from "@/app/lib/adapters/results";
import { calculateCharacteristics } from "@/app/lib/utils/result-calculations";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};
interface CategorizedFormResults {
  formResults: {
    [level in LevelFormVision]?: CommonFormResult[];
  };
}
interface VisionLevelConfig {
  showScoreTypes: boolean;
  label: string;
}
const VISION_LEVEL_CONFIGS: Record<LevelFormVision, VisionLevelConfig> = {
  VISION_1: {
    showScoreTypes: false,
    label: "ผลโดยรวมของตาราง",
  },
  VISION_2: {
    showScoreTypes: true,
    label: "จำแนกแต่ละหน่วยงาน",
  },
  UNSET: {
    showScoreTypes: false,
    label: "ยังไม่ถูกกำหนด VISION",
  },
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
  const renderTableHeaders = (
    scoreTypes: string[],
    vesion_level: LevelFormVision
  ) => (
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
        {VISION_LEVEL_CONFIGS[vesion_level as LevelFormVision].showScoreTypes &&
          scoreTypes.map((type) => (
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
          ค่า SD.
        </TableHead>
        {VISION_LEVEL_CONFIGS[vesion_level].showScoreTypes &&
          scoreTypes.map((type) => (
            <React.Fragment key={type}>
              <TableHead className="text-center border text-stone-800">
                ค่าเฉลี่ย
              </TableHead>
              <TableHead className="text-center border text-stone-800">
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
  const categorizeFormResultsByVisionLevel = (
    formResults: CommonFormResult[]
  ): CategorizedFormResults => {
    const categorized: CategorizedFormResults = {
      formResults: {},
    };
    formResults.forEach((formResult) => {
      const level = formResult.level;
      // Type guard to ensure level is a valid LevelFormVision
      console.log("level",level);
      
      if (Object.keys(VISION_LEVEL_CONFIGS).includes(level)) {
        const typedLevel = level as LevelFormVision;
        if (!categorized.formResults[typedLevel]) {
          categorized.formResults[typedLevel] = [];
        }
        categorized.formResults[typedLevel]!.push(formResult);
      }
    });
    return categorized;
  };
  useEffect(() => {
    if (resultHistoryDetail) {
      const adapted = adaptHistoryResult(resultHistoryDetail);
      setAdaptedData(adapted);
      setCharacteristics(calculateCharacteristics(adapted.headData.totalAverage));
      setScoreTypes(extractScoreTypes(adapted.formResults));
      
      SetFormResultsByVisionLevel(
        categorizeFormResultsByVisionLevel(adapted?.formResults)
      );
    }
  }, [resultHistoryDetail]);
  useEffect(()=>{
    console.log("formResultsByVisionLevel",formResultsByVisionLevel);
    console.log("adaptedData?.formResults",adaptedData?.formResults);
    
  },[formResultsByVisionLevel,adaptedData])
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="">
        {formResultsByVisionLevel &&
          Object.entries(formResultsByVisionLevel.formResults).map(
            ([vesion_level, vision]) => (
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
                        <TableRow className="text-[16px] bg-blue-100">
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
                                  {matchedScore?.average.toFixed(2) ||
                                    "-"}
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
            )
          )}
        <div className="w-full">
          <div className="lg:w-[70%] mx-auto">
            <Table className="border rounded-lg ">
              <TableCaption>ผลการประเมินรายละเอียด</TableCaption>
              <TableHeader className=" text-lg bg-blue-300 text-center text-stone-800">
                <TableRow className="text-lg bg-blue-300">
                  <TableHead colSpan={1} className="text-center text-stone-800">
                    ลำดับ
                  </TableHead>
                  <TableHead
                    colSpan={4}
                    className="text-center border text-stone-800"
                  >
                    ผลรวมในแต่ละด้าน
                  </TableHead>
                  <TableHead
                    colSpan={1}
                    className="text-center border text-stone-800"
                  >
                    ค่าเฉลี่ย
                  </TableHead>
                  <TableHead
                    colSpan={1}
                    className="text-center border text-stone-800"
                  >
                    ค่า SD.
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultHistoryDetail?.formResults.map((item, index) => (
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
                      {item.sumTotal.average_per_form.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {item.sumTotal.sd_per_form.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Summary Row */}
                {resultHistoryDetail?.headData && (
                  <TableRow className="text-[16px] bg-yellow-200">
                    <TableCell colSpan={1} className="font-bold text-right">
                      ผลรวมทั้งหมดของ
                    </TableCell>
                    <TableCell colSpan={4} className="text-left">
                      {resultHistoryDetail.headData.userName}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {resultHistoryDetail.headData.total_mean?.toFixed(2) ||
                        "-"}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {resultHistoryDetail.headData.total_SD?.toFixed(2) || "-"}
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

export default OverviewHistoryResult;
