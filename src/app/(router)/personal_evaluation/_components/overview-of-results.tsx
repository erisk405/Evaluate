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
  formResultsType,
  getResultEvaluateType,
  LevelFormVision,
} from "@/types/interface";
import { Button } from "@/components/ui/button";

const SCORE_TYPE_LABELS: Record<string, string> = {
  Executive: "ผู้บริหาร",
  Manager: "ผู้จัดการ",
  Employee: "พนักงาน",
};
type categorizedTableProp = {
  resultEvaluateDetail: getResultEvaluateType | undefined;
};
interface CategorizedFormResults {
  formResults: {
    [level in LevelFormVision]?: formResultsType[];
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
const OverviewOfResults = ({ resultEvaluateDetail }: categorizedTableProp) => {
  const [scoreTypes, setScoreTypes] = useState<string[]>([]);
  const [Characteristics, SetCharacteristics] = useState<string>();
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
  const categorizeFormResultsByVisionLevel = (
    formResults: formResultsType[]
  ): CategorizedFormResults => {
    const categorized: CategorizedFormResults = {
      formResults: {},
    };

    formResults.forEach((formResult) => {
      // จัดกลุ่มออกมาก่อน ว่าคำถามที่ส่งมามี VISION level อะไรบ้าง
      const visionLevels = new Set(
        formResult.questions.map((question) => question.level)
      );

      visionLevels.forEach((level) => {
        // ถ้ายังไม่มี array vision นี้ก็ให้ สร้าง array เปล่าๆมาไว้เก็บค่าก่อน
        if (!categorized.formResults[level]) {
          categorized.formResults[level] = [];
        }

        // Add the entire form result to the appropriate level group
        categorized.formResults[level]!.push(formResult);
      });
    });
    return categorized;
  };
  useEffect(() => {
    if (resultEvaluateDetail) {
      resultsByCharacteristics(resultEvaluateDetail.headData.totalAvg);
      setScoreTypes(extractScoreTypes(resultEvaluateDetail.formResults));
      SetFormResultsByVisionLevel(
        categorizeFormResultsByVisionLevel(resultEvaluateDetail.formResults)
      );
    }
  }, [resultEvaluateDetail]);

  // useEffect(() => {
  //   scoreTypes.flatMap((type) => console.log("type", type));
  //   console.log(formResultsByVisionLevel);
  // }, [scoreTypes]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="">
        {formResultsByVisionLevel &&
          Object.entries(formResultsByVisionLevel.formResults).map(
            ([vesion_level, vision]) => (
              <div
                key={vesion_level}
                className={`my-5  ${
                  vesion_level === "VISION_1" ? "w-[70%] mx-auto" : "w-full"
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
                          {VISION_LEVEL_CONFIGS[vesion_level as LevelFormVision]
                            .showScoreTypes &&
                            scoreTypes.flatMap((type) => {
                              const matchedScore = form.total?.find(
                                (match) => match.total === type
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
                          <TableRow
                            key={question.questionId}
                            className="text-[16px]"
                          >
                            <TableCell className="font-medium text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell>{form.formName}</TableCell>
                            <TableCell>{question.questionName}</TableCell>
                            {question.sumScore && [
                              <TableCell
                                key={`sumScore-avg`}
                                className="text-center"
                              >
                                {question.sumScore?.average.toFixed(2) || "-"}
                              </TableCell>,
                              <TableCell
                                key={`sumScore-Sd`}
                                className="text-center"
                              >
                                {question.sumScore?.standardDeviation.toFixed(
                                  2
                                ) || "-"}
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
          <div className="w-[70%] mx-auto">
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
                {resultEvaluateDetail?.formResults.map((item, index) => (
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
                      {item.totalAvgPerForm.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {item.totalSDPerForm.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Summary Row */}
                {resultEvaluateDetail?.headData && (
                  <TableRow className="text-[16px] bg-yellow-200">
                    <TableCell colSpan={1} className="font-bold text-right">
                      ผลรวมทั้งหมดของ
                    </TableCell>
                    <TableCell colSpan={4} className="text-left">
                      {resultEvaluateDetail.headData.evaluatorName}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      {resultEvaluateDetail.headData.totalAvg?.toFixed(2) ||
                        "-"}
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
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

export default OverviewOfResults;
