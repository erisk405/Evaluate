"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  PermissionFormItem,
  User,
  userHaveBeenEvaluatedType,
} from "@/types/interface";
import useStore from "@/app/store/store";
import { useParams } from "next/navigation";
import GlobalApi from "@/app/_util/GlobalApi";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { formatThaiDateTime } from "../../../_components/RightSection";

type PayloadQuestion = {
  questionId: string;
  content: string;
  score: string;
};
type detailsType = {
  id: string;
  score: number;
};

interface Payload {
  [key: string]: {
    formId: string;
    question: PayloadQuestion[];
  };
}
interface EvaluateSection {
  evaluatorUserTarget: User;
  fetchUserHaveBeenEvaluated: () => void;
  setOpen: (open: boolean) => void;
  defaultScoreOfUserHasEval?: userHaveBeenEvaluatedType;
}

const SCORE_OPTIONS = [5, 4, 3, 2, 1];
const DEFAULT_SCORE = "3";

const EvaluateSection: React.FC<EvaluateSection> = ({
  evaluatorUserTarget,
  fetchUserHaveBeenEvaluated,
  setOpen,
  defaultScoreOfUserHasEval,
}) => {
  const [formEvaluation, setFormEvaluation] = useState<PermissionFormItem[]>(
    []
  );
  const [payload, setPayload] = useState<Payload>({});
  const [payloadForUpdate, setPayloadForUpdate] = useState<
    Array<{ question_id: string; score: string }>
  >([]);
  const { ProfileDetail, currentlyEvaluationPeriod } = useStore();

  const handleScoreChange = (
    formName: string,
    formId: string,
    questionId: string,
    newScore: string
  ) => {
    setPayload((prev) => ({
      ...prev,
      [formName]: {
        formId,
        question: prev[formName].question.map((q) =>
          q.questionId === questionId ? { ...q, score: newScore } : q
        ),
      },
    }));
    // Update payload for existing evaluations
    // ในส่วนนี้เป็นการจัดการกับการอัพเดทคะแนนสำหรับการประเมินที่มีอยู่แล้ว
    if (defaultScoreOfUserHasEval) {
      setPayloadForUpdate((prev) => {
        // ถ้าไม่เจอจะได้ -1
        const existingIndex = prev.findIndex(
          (item) => item.question_id === questionId
        );
        const newItem = { question_id: questionId, score: newScore };

        return existingIndex === -1
          ? [...prev, newItem] // กรณีไม่เคยแก้ไข
          : prev.map(
              (
                item,
                index // กรณีเคยแก้ไขแล้ว
              ) => (index === existingIndex ? newItem : item)
            );
      });
    }
  };
  const handleRaioColorChange = (formId: string, questionId: string) => {
    // console.log("formId",formId,"questionId",questionId);
    const section = Object.values(payload).find(
      (section) => section.formId === formId
    );
    if (section) {
      const question = section.question.find(
        (q) => q.questionId === questionId
      );
      if (question) {
        // Return a color class based on the score
        return question.score;
      }
      return ""; // Return empty string if no match found
    }
  };
  const handleSubmit = async () => {
    try {
      if (!payload || !currentlyEvaluationPeriod) {
        throw new Error("Missing required data");
      }
      // is created evaluation
      if (!defaultScoreOfUserHasEval) {
        const questions = Object.values(payload).flatMap((item) =>
          item.question.map((q) => ({
            questionId: q.questionId,
            score: q.score,
          }))
        );
        const data = {
          period_id: currentlyEvaluationPeriod.period_id,
          assessor_id: ProfileDetail.id!, // Ensuring non-null
          evaluator_id: evaluatorUserTarget.id,
          questions, // ตอนแรกเป็นarrays เลยส่งไปแบบ object ที่มีความสัมพันธ์แบบ key value
        };
        console.log("data", data);

        const response = await GlobalApi.createEvaluate(data);
        console.log("response", response);
        toast({
          title: "บันทึกข้อมูลเรียบร้อยแล้ว",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(response?.data, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        // Update existing evaluation
        const detailsUpdate = defaultScoreOfUserHasEval.evaluateDetail
          .map((evd) => {
            const update = payloadForUpdate.find(
              (pfu) => pfu.question_id === evd.formQuestion.id
            );
            return update ? { id: evd.id, score: parseFloat(update.score) } : null;
          })
          .filter((item): item is detailsType => item !== null); // Type guard เพื่อให้ TypeScript รู้ว่า filter แล้วจะได้ detailsType แน่ๆ
        console.log("details", detailsUpdate);

        await GlobalApi.updateEvaluate({
          evaluate_id: defaultScoreOfUserHasEval.id,
          details: detailsUpdate,
        });
      }

      setOpen(false);
      // รอให้แอนิเมชันของ Sheet ปิดสำเร็จก่อน
      await new Promise((resolve) => setTimeout(resolve, 300)); // รอ 300ms (ระยะเวลาแอนิเมชัน)
      // เรียก fetchUserHaveBeenEvaluated หลังจากแอนิเมชันเสร็จสมบูรณ์
      fetchUserHaveBeenEvaluated();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const initializeFormEvaluation = () => {
      // console.log("evaluatorUserTarget", evaluatorUserTarget);
      const isMySupervise = evaluatorUserTarget?.supervise?.some(
        (item) => item.department_id === ProfileDetail?.department?.id
      );
      // console.log("isMySupervise", isMySupervise);
      const ingroup = isMySupervise
        ? true
        : evaluatorUserTarget.department?.id === ProfileDetail?.department?.id;
      // console.log("ingroup", ProfileDetail);
      // Find the appropriate permission for the evaluator
      const matchedPermission = ProfileDetail?.role?.permissionsAsAssessor.find(
        (item) => item.evaluator_role_id === evaluatorUserTarget.role.id
      );
      // console.log("filteredPermissions", matchedPermission);
      // Filter the forms based on the `ingroup` value
      const filteredForms = matchedPermission?.permissionForm.filter(
        (item) => item.ingroup === ingroup
      );
      setFormEvaluation(filteredForms || []);
    };
    initializeFormEvaluation();
  }, [evaluatorUserTarget, ProfileDetail]);
  // เพิ่ม useEffect เพื่อ initialize payload เมื่อ formEvaluation เปลี่ยน
  useEffect(() => {
    if (!formEvaluation.length) return;
    const initialPayload = formEvaluation.reduce<Payload>((acc, curr) => {
      const questions = curr.form.questions.map((item) => {
        const defaultScore = defaultScoreOfUserHasEval?.evaluateDetail.find(
          (evd) => evd.formQuestion.id === item.id
        );
        return {
          questionId: defaultScore?.formQuestion.id || item.id,
          content: defaultScore?.formQuestion.content || item.content,
          score: defaultScore?.score.toString() || DEFAULT_SCORE,
        };
      });
      return {
        ...acc,
        [curr.form.name]: {
          formId: curr.form.id,
          question: questions,
        },
      };
    }, {});
    setPayload(initialPayload);
  }, [formEvaluation, defaultScoreOfUserHasEval]);

  // useEffect(() => {
  //   console.log("evaluatorUserTarget", evaluatorUserTarget);
  //   console.log("defaultScoreOfUserHasEval", defaultScoreOfUserHasEval);
  // }, [evaluatorUserTarget]);
  return (
    <div className="mt-3">
      <div className="flex items-center w-full flex-col">
        <h2 className="text-xl text-stone-700 font-bold">
          {evaluatorUserTarget.name} ({evaluatorUserTarget.role.role_name})
        </h2>
        <h2 className="text-sm text-gray-500">
          {currentlyEvaluationPeriod?.title} ตั้งแต่วันที่{" "}
          {formatThaiDateTime(currentlyEvaluationPeriod!.start).date +
            " จนถึงวันที่ " +
            formatThaiDateTime(currentlyEvaluationPeriod!.end).date}
        </h2>
      </div>
      <div className=" bg-white my-4">
        <div className="rounded-lg border">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow className="text-lg bg-blue-300 w-full">
                <TableHead className="text-lg w-[100px] text-stone-700">
                  ลำดับ
                </TableHead>
                <TableHead className="text-lg text-stone-700">
                  ข้อคำถาม
                </TableHead>
                <TableHead className="text-lg text-center text-stone-700">
                  ลงคะแนน
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formEvaluation?.map(({ form }) => (
                <React.Fragment key={form.id}>
                  <TableRow className="text-[16px] bg-blue-100">
                    <TableCell colSpan={3} className="font-bold text-stone-700">
                      {form.name}
                    </TableCell>
                  </TableRow>
                  {form.questions?.map((question, index) => (
                    <TableRow key={question.id} className="text-[16px]">
                      <TableCell className="font-medium text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{question.content}</TableCell>
                      <TableCell className="text-center min-w-[50px] w-[400px] max-w-[400px]">
                        <RadioGroup
                          className="flex gap-3 justify-around flex-wrap "
                          onValueChange={(value) => {
                            handleScoreChange(
                              form.name,
                              form.id,
                              question.id,
                              value
                            );
                            // hadlePayloadUpdateChange(ques.id,value);
                          }}
                        >
                          {/* ---------------------------------- */}
                          {/*            score contenct          */}
                          {/* ---------------------------------- */}
                          {SCORE_OPTIONS.map((score) => (
                            <div
                              key={score}
                              className="flex items-center relative"
                            >
                              <RadioGroupItem
                                value={score.toString()}
                                id={`r${score}${question.id}`}
                                className="z-0 w-10 h-10"
                              />
                              <Label
                                htmlFor={`r${score}${question.id}`}
                                className={`
                        ${
                          handleRaioColorChange(form.id, question.id) ===
                          score.toString()
                            ? "bg-blue-500 text-white"
                            : "bg-white text-black"
                        }
                        absolute w-10 h-10 rounded-full left-1/2 -translate-x-1/2 
                        border border-neutral-500 transition-all
                        flex justify-center items-center 
                        z-10 cursor-pointer
                      `}
                              >
                                {score}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center my-3">
          <Button type="submit" onClick={handleSubmit}>
            Save inform
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateSection;
