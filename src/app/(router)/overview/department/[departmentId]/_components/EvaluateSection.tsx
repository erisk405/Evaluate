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
import { PermissionFormItem, User } from "@/types/interface";
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

type Payload = Record<
  string,
  {
    formId: string;
    question: PayloadQuestion[];
  }
>;

type evaluateSection = {
  evaluatorUserTarget: User;
  fetchUserHaveBeenEvaluated: () => void;
  setOpen: (open: boolean) => void;
};

const EvaluateSection = ({
  evaluatorUserTarget,
  fetchUserHaveBeenEvaluated,
  setOpen,
}: evaluateSection) => {
  const [formEvaluation, setFormEvaluation] = useState<
    PermissionFormItem[] | undefined
  >([]);
  const { ProfileDetail, currentlyEvaluationPeriod } = useStore();
  const [payload, setPayload] = useState<Payload>({});
  // เพิ่ม useEffect เพื่อ initialize payload เมื่อ formEvaluation เปลี่ยน
  useEffect(() => {
    if (formEvaluation && formEvaluation.length > 0) {
      const initialPayload = formEvaluation.reduce<Payload>(
        (acc, curr) => ({
          ...acc,
          [curr.form.name]: {
            formId: curr.form.id,
            question: curr.form.questions.map((item) => ({
              questionId: item.id,
              content: item.content,
              score: "3",
            })),
          },
        }),
        {}
      );
      setPayload(initialPayload);
    }
  }, [formEvaluation]);

  const handlePayloadChange = (
    headTitle: string,
    formId: string,
    newValues: { id: string; content: string; score: string }
  ) => {
    // ใช้ setPayload เพื่ออัพเดท state โดยรับ previous state (prev) เป็น parameter

    setPayload((prev) => {
      // ดึงข้อมูลคำถามทั้งหมดของหัวข้อนั้นๆ จาก previous state
      // prev[headTitle] คือการเข้าถึงข้อมูลของหัวข้อนั้นๆ เช่น "ทักษะการปฎิบัติงาน"
      // .question คือการเข้าถึง array ของคำถามทั้งหมดในหัวข้อนั้น
      const currentQuestions = prev[headTitle].question;
      // console.log("currentQuestions:", currentQuestions);
      // สร้าง array ใหม่โดยการ map ข้อมูลเดิม
      const updatedQuestions = currentQuestions.map(
        (question) =>
          // นำค่าใหม่ newValues ที่ user กดมาอัพเดทลง state ใหม่ ก็เลย เอาquestion.questionId === newValues.id  เพื่ออัพเดทค่าไปใหม่
          // ถ้าตรง: สร้าง object ใหม่โดย
          // ...question = copy ข้อมูลเดิมทั้งหมดของคำถามนั้น (questionId, content)
          // score: newValues.score = อัพเดทค่า score เป็นค่าใหม่ที่ user เลือก
          question.questionId === newValues.id
            ? { ...question, score: newValues.score }
            : question // ถ้าไม่ตรง: ส่งคืนข้อมูลเดิมโดยไม่มีการเปลี่ยนแปลง
      );

      // สร้าง object ใหม่สำหรับ state
      return {
        ...prev, // copy ข้อมูลทั้งหมดจาก previous state
        [headTitle]: {
          // อัพเดทเฉพาะหัวข้อที่มีการเปลี่ยนแปลง
          formId: formId, // กำหนด formID
          question: updatedQuestions, // ใส่ array คำถามที่อัพเดทแล้ว
        },
      };
    });
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
      if (!payload) {
        throw new Error("Form data not found");
      }
      if (!currentlyEvaluationPeriod) {
        throw new Error(
          "Not Found Currently about Determining the evaluation period"
        );
      }
      const allQuestions = Object.values(payload).flatMap((item) =>
        item.question.map((q) => ({
          questionId: q.questionId,
          score: q.score,
        }))
      );
      const data = {
        period_id: currentlyEvaluationPeriod.period_id,
        assessor_id: ProfileDetail.id!, // Ensuring non-null
        evaluator_id: evaluatorUserTarget.id,
        questions: allQuestions, // ตอนแรกเป็นarrays เลยส่งไปแบบ object ที่มีความสัมพันธ์แบบ key value
      };
      console.log("data", data);

      const response = await GlobalApi.createEvaluate(data);
      console.log("response", response);
      // const { evaluator_id } = response?.data;
      // socket.emit("roleRequestHandled", {
      //   evaluator_id,
      // });
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

      setOpen(false);
      // รอให้แอนิเมชันของ Sheet ปิดสำเร็จก่อน
      await new Promise((resolve) => setTimeout(resolve, 300)); // รอ 300ms (ระยะเวลาแอนิเมชัน)
      // เรียก fetchUserHaveBeenEvaluated หลังจากแอนิเมชันเสร็จสมบูรณ์
      fetchUserHaveBeenEvaluated();
    } catch (error: unknown) {
      // ตรวจสอบว่า error เป็น instance ของ AxiosError หรือไม่
      if (axios.isAxiosError(error)) {
        // ถ้าเป็น AxiosError ให้ดึงข้อมูลจาก response
        toast({
          title: "เกิดข้อผิดพลาด",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error.response?.data?.message, null, 2)}
              </code>
            </pre>
          ),
        });
      } else if (error instanceof Error) {
        // ถ้าเป็น instance ของ Error ทั่วไป
        toast({
          title: "เกิดข้อผิดพลาด",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error.message, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        // กรณีที่ไม่สามารถระบุประเภทข้อผิดพลาดได้
        toast({
          title: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    }
  };
  useEffect(() => {
    // console.log("evaluatorUserTarget", evaluatorUserTarget);
    const isMySupervise = evaluatorUserTarget?.supervise?.some(
      (item) => item.department_id === ProfileDetail?.department?.id
    );
    console.log("isMySupervise", isMySupervise);

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
    const Form = matchedPermission?.permissionForm.filter(
      (item) => item.ingroup === ingroup
    );
    // console.log("Form", Form);
    // Update the state with the filtered forms
    if (Form) {
      setFormEvaluation(Form);
    } else {
      setFormEvaluation([]);
    }
  }, [evaluatorUserTarget.department?.id, evaluatorUserTarget.role.id]);

  useEffect(() => {
    console.log("evaluatorUserTarget", evaluatorUserTarget);
  }, [evaluatorUserTarget]);
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
              {formEvaluation?.map((item) => (
                <React.Fragment key={item.form.id}>
                  <TableRow className="text-[16px] bg-blue-100">
                    <TableCell colSpan={3} className="font-bold text-stone-700">
                      {item.form.name}
                    </TableCell>
                  </TableRow>
                  {item.form.questions?.map((ques, index) => (
                    <TableRow key={ques.id} className="text-[16px]">
                      <TableCell className="font-medium text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{ques.content}</TableCell>
                      <TableCell className="text-center min-w-[50px] w-[400px] max-w-[400px]">
                        <RadioGroup
                          defaultValue="3"
                          className="flex gap-3 justify-around flex-wrap "
                          onValueChange={(value) => {
                            handlePayloadChange(item.form.name, item.form.id, {
                              id: ques.id,
                              content: ques.content,
                              score: value,
                            });
                          }}
                        >
                          {/* ---------------------------------- */}
                          {/*            score contenct          */}
                          {/* ---------------------------------- */}
                          {[5, 4, 3, 2, 1].map((score) => (
                            <div
                              key={score}
                              className="flex items-center relative"
                            >
                              <RadioGroupItem
                                value={score.toString()}
                                id={`r${score}${ques.id}`}
                                className="z-0 w-10 h-10"
                              />
                              <Label
                                htmlFor={`r${score}${ques.id}`}
                                className={`
                        ${
                          handleRaioColorChange(item.form.id, ques.id) ===
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
