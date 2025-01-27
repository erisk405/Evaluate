"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Loader } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemeStyles } from "@/hooks/useTheme";
import socket from "@/lib/socket";

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

const EvaluateSection: React.FC<EvaluateSection> = ({
  evaluatorUserTarget,
  fetchUserHaveBeenEvaluated,
  setOpen,
  defaultScoreOfUserHasEval,
}) => {
  const [formEvaluation, setFormEvaluation] = useState<PermissionFormItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<Payload>({});
  const [initialPayload, setInitialPayload] = useState<Payload>({});
  const [payloadForUpdate, setPayloadForUpdate] = useState<
    Array<{ question_id: string; score: string }>
  >([]);
  const { ProfileDetail, currentlyEvaluationPeriod } = useStore();
  const styles = useThemeStyles();

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
    setLoading(true);
    try {
      // วิธีที่ 3: ถ้าคุณแน่ใจว่าจะมีค่าเสมอ สามารถใช้ non-null assertion operator (!)
      const restrictedRoles = ["member", "admin"];
      if (restrictedRoles.includes(ProfileDetail.role!.role_name)) {
        throw new Error("หาก member และ admin ไม่สามารถประเมินผลได้");
      }
      if (!payload || !currentlyEvaluationPeriod) {
        throw new Error("Missing required data");
      }
      // Check for unanswered questions first
      const questionsWithMissingScores = Object.values(payload).flatMap(
        (item) => item.question.filter((q) => !q.score)
      );
      if (questionsWithMissingScores.length > 0) {
        // If there are questions without scores, show error message
        const missingQuestions = questionsWithMissingScores
          .map((q) => q.content)
          .join(", ");
        throw new Error(
          `กรุณาลงคะแนนให้ครบทุกข้อ ท่านยังไม่ลงคะแนนอีก${questionsWithMissingScores.length}ข้อ : ${missingQuestions}`
        );
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
        // console.log("payload", payload);

        await GlobalApi.createEvaluate(data);
        // console.log("response", response);
        toast({
          title: "บันทึกข้อมูลเรียบร้อยแล้ว",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <h2 className="text-white whitespace-pre-wrap break-words">
                ระบบได้บันทึกข้อมูลลงคะแนนประเมินของ {evaluatorUserTarget.name}{" "}
                แล้ว
              </h2>
            </div>
          ),
        });
      } else {
        // Update existing evaluation
        const detailsUpdate = defaultScoreOfUserHasEval.evaluateDetail
          .map((evd) => {
            const update = payloadForUpdate.find(
              (pfu) => pfu.question_id === evd.formQuestion.id
            );
            return update
              ? { id: evd.id, score: parseFloat(update.score) }
              : null;
          })
          .filter((item): item is detailsType => item !== null); // Type guard เพื่อให้ TypeScript รู้ว่า filter แล้วจะได้ detailsType แน่ๆ
        // console.log("details", detailsUpdate);

        const response = await GlobalApi.updateEvaluate({
          evaluate_id: defaultScoreOfUserHasEval.id,
          details: detailsUpdate,
        });
        // console.log("response", response);

        toast({
          title: "บันทึกข้อมูลเรียบร้อยแล้ว",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <h2 className="text-white whitespace-pre-wrap break-words">
                ระบบได้แก้ไขคะแนนของ{" "}
                {JSON.stringify(`${response?.data.result.updateDetail.length}`)}{" "}
                ข้อคำถามนั้นแล้ว
              </h2>
            </div>
          ),
        });
      }

      setLoading(false);
      setOpen(false);
      // รอให้แอนิเมชันของ Sheet ปิดสำเร็จก่อน
      await new Promise((resolve) => setTimeout(resolve, 300)); // รอ 300ms (ระยะเวลาแอนิเมชัน)
      // เรียก fetchUserHaveBeenEvaluated หลังจากแอนิเมชันเสร็จสมบูรณ์
      socket.emit("evaluatedHandled", {
        evaluatorUserTarget,
      });
      fetchUserHaveBeenEvaluated();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

      toast({
        title: "โปรดตรวจสอบข้อมูลให้แน่ใจ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const SupervisionService = {
    isUserSupervisor: (
      currentUser: typeof ProfileDetail,
      targetUser: typeof evaluatorUserTarget
    ): boolean => {
      // Ensure supervise array exists and handle potential undefined
      const currentUserSupervises = currentUser.supervise || [];
      const targetUserSupervises = targetUser.supervise || [];

      // Level 3 users check if they supervise the target's department
      if (currentUser.role?.role_level === "LEVEL_3") {
        return currentUserSupervises.some(
          (superviseItem) =>
            superviseItem.department_id === targetUser.department?.id
        );
      }

      // For other levels, check if the target supervises current user's department
      return targetUserSupervises.some(
        (superviseItem) =>
          superviseItem.department_id === currentUser.department?.id
      );
    },
  };
  const isScoreUnchanged = useMemo(() => {
    return JSON.stringify(payload) === JSON.stringify(initialPayload);
  }, [payload, initialPayload]);
  useEffect(() => {
    const initializeFormEvaluation = () => {
      // isInSameGroup เป็น function ที่ใช้ในการหาว่า ตอนนี้เราตำแหน่งอะไร เพื่อเช็คว่า ตอนนี้เรากำกับดูแลที่ไหนบ้าง ถ้าไม่มีแล้วใครกำกับดูแลเราบ้าง
      const isInSameGroup =
        SupervisionService.isUserSupervisor(
          ProfileDetail,
          evaluatorUserTarget
        ) ||
        evaluatorUserTarget.department?.id === ProfileDetail?.department?.id;
      // console.log("isInSameGroup", isInSameGroup);
      // Find the appropriate permission for the evaluator
      const matchedPermission = ProfileDetail?.role?.permissionsAsAssessor.find(
        (item) => item.evaluator_role_id === evaluatorUserTarget.role.id
      );
      // console.log("filteredPermissions", matchedPermission);
      // Filter the forms based on the `ingroup` value
      const filteredForms = matchedPermission?.permissionForm.filter(
        (item) => item.ingroup === isInSameGroup
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
          score: defaultScore?.score?.toString() || "",
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
    setInitialPayload(initialPayload);
  }, [formEvaluation, defaultScoreOfUserHasEval]);

  return (
    <div className="mt-3">
      <div className="flex items-center w-full flex-col">
        <h2 className={`text-xl ${styles.text} font-bold`}>
          {evaluatorUserTarget.name} ({evaluatorUserTarget.role.role_name})
        </h2>
        <h2 className="text-sm text-gray-500">
          {currentlyEvaluationPeriod?.title} ตั้งแต่วันที่{" "}
          {formatThaiDateTime(currentlyEvaluationPeriod!.start).date +
            " จนถึงวันที่ " +
            formatThaiDateTime(currentlyEvaluationPeriod!.end).date}
        </h2>
      </div>
      <div
        className={` ${styles.text + " " + styles.background_secondary} my-4`}
      >
        <div className="rounded-lg border">
          <Table>
            <TableCaption>ตารางคะแนนในแต่ละแบบฟอร์มการประเมิน</TableCaption>
            <TableHeader>
              <TableRow
                className={`text-lg ${styles.background_head_table} w-full`}
              >
                <TableHead className={`text-lg w-[100px]  ${styles.text}`}>
                  ลำดับ
                </TableHead>
                <TableHead className={`text-lg ${styles.text}`}>
                  ข้อคำถาม
                </TableHead>
                <TableHead className={`text-lg text-center ${styles.text}`}>
                  ลงคะแนน
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formEvaluation?.map(({ form }) => (
                <React.Fragment key={form.id}>
                  <TableRow
                    className={`text-[16px] ${styles.background_secondary_head_table} `}
                  >
                    <TableCell colSpan={3} className={`font-bold  `}>
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
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={defaultScoreOfUserHasEval && isScoreUnchanged}
          >
            {loading ? <Loader className="animate-spin" /> : "บันทึกข้อมูล"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateSection;
