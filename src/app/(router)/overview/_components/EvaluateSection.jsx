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

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const data = [
  {
    id: "CO01",
    HeadTitle: "ทักษะการปฎิบัติงาน",
    subData: [
      {
        id: "11",
        content: "ปริมาณผลงาน",
      },
      {
        id: "12",
        content: "ความอุสาหพยายาม",
      },
      {
        id: "13",
        content: "การบำรุงรักษาเครื่องมือและอุปกรณ์ที่ใช้",
      },
      {
        id: "14",
        content: "การตัดสินใจและแก้ปัญหาเฉพาะหน้า",
      },
      {
        id: "15",
        content: "ความคิดริเริ่มในการปฎิบัติงาน",
      },
      {
        id: "16",
        content: "ความรับผิดชอบต่อหน้าที่ที่ได้รับมอบหมาย",
      },
      {
        id: "17",
        content: "ความรวดเร็วในการปฎิบัติงาน",
      },
      {
        id: "18",
        content: "ตรงต่อเวลาในการทำงาน",
      },
    ],
  },
  {
    id: "CO02",
    HeadTitle: "ความรู้เชิงวิชาการ",
    subData: [
      {
        id: "06",
        content: "มีความคิดริเริ่ม/การนำวิธี่ที่มีประสิทธิภาพมาใช้",
      },
      {
        id: "07",
        content: "ความใฝ่หาความรู้และคุณภาพงาน",
      },
      {
        id: "08",
        content: "การจัดระบบบริหารควบคุมและติดตามผลงาน",
      },
      {
        id: "09",
        content: "ทักษะและเทคนิคในการทำงาน",
      },
      {
        id: "10",
        content: "การวางแผนและการเตรียมอุปกรณ์ก่อนการทำงาน",
      },
    ],
  },
  {
    id: "CO03",
    HeadTitle: "จิตพิสัยในการทำงาน",
    subData: [
      {
        id: "01",
        content: "การอุทิศเวลาให้แก่ราชการอย่างสม่ำเสมอ",
      },
      {
        id: "02",
        content: "ลักษณะการเป็นผู้นำและผู้ตามที่ดี",
      },
      {
        id: "03",
        content: "การให้คำปรึกษาและประสานงานกับผู้เกี่ยวข้อง",
      },
      {
        id: "04",
        content: "ความประพฤติและการควบคุมอารมณ์",
      },
      {
        id: "05",
        content: "บุคลิกภาพและการแต่งกาย",
      },
    ],
  },
];

const EvaluateSection = () => {
  const [selectedValues, setSelectedValues] = useState(Array(18).fill("3"));

  const [payload, setPayload] = useState(
    data.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.HeadTitle]: {
          formId: curr.id,
          question: curr.subData.map((item) => ({
            questionId: item.id,
            content: item.content,
            score: "3",
          })),
        },
      }),
      {}
    )
  );
  const handleValueChange = (index, value) => {
    // console.log(value);
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = value;
    setSelectedValues(newSelectedValues);
  };

  const handlePayloadChange = (headTitle, formId, newValues) => {
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

  const handleRaioColorChange = (formId, questionId) => {
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
  useEffect(() => {
    console.log("selectedValues", selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    console.log("payload", payload);
  }, [payload]);
  return (
    <div className="mt-3">
      <div className="flex items-center w-full flex-col">
        <h2 className="text-xl text-stone-700 font-bold">
          สรุปผลการประเมินสมรรถนะ 360 องศา นายกฤตภาส สัมฤทธิ์
        </h2>
        <h2 className="text-sm text-gray-500">
          รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567 (1 กันยายน 2566 - 28 กุมภาพันธ์
          2567)
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
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="text-[16px] bg-blue-100">
                    <TableCell colSpan={3} className="font-bold text-stone-700">
                      {item.HeadTitle}
                    </TableCell>
                  </TableRow>
                  {item.subData.map((sup, index) => (
                    <TableRow key={sup.id} className="text-[16px]">
                      <TableCell className="font-medium text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{sup.content}</TableCell>
                      <TableCell className="text-center min-w-[50px] w-[400px] max-w-[400px]">
                        <RadioGroup
                          defaultValue="3"
                          className="flex gap-3 justify-around flex-wrap "
                          onValueChange={(value) => {
                            handleValueChange(index, value);
                            handlePayloadChange(item.HeadTitle, item.id, {
                              id: sup.id,
                              content: sup.content,
                              score: value,
                            });
                          }}
                        >
                          {/* ---------------------------------- */}
                          {/*            score contenct          */}
                          {/* ---------------------------------- */}
                          {/*  score 5 */}
                          <div className="flex items-center relative  ">
                            <RadioGroupItem
                              value="5"
                              id={"r5" + sup.id}
                              className="z-0 w-10 h-10"
                            />
                            <Label
                              htmlFor={"r5" + sup.id}
                              className={`${
                                handleRaioColorChange(item.id, sup.id) === "5"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black"
                              }
                              absolute -top-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full 
                              border border-neutral-500
                              flex justify-center items-center transition-all
                              z-10
                          `}
                            >
                              5
                            </Label>
                          </div>
                          {/*  score 4 */}
                          <div className="flex items-center relative">
                            <RadioGroupItem
                              value="4"
                              id={"r4" + sup.id}
                              className="w-10 h-10"
                            />
                            <Label
                              htmlFor={"r4" + sup.id}
                              className={`${
                                handleRaioColorChange(item.id, sup.id) === "4"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black"
                              }
                              absolute w-10 h-10 rounded-full -top-1/2 left-1/2 -translate-x-1/2 
                              border border-neutral-500 transition-all
                              flex justify-center items-center 
                              z-10
                          `}
                            >
                              4
                            </Label>
                          </div>
                          {/*  score 3 */}
                          <div className="flex items-center relative">
                            <RadioGroupItem
                              value="3"
                              id={"r3" + sup.id}
                              className="w-10 h-10"
                            />
                            <Label
                              htmlFor={"r3" + sup.id}
                              className={`${
                                handleRaioColorChange(item.id, sup.id) === "3"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black"
                              }
                              absolute w-10 h-10 rounded-full -top-1/2 left-1/2 -translate-x-1/2 
                              border border-neutral-500 transition-all
                              flex justify-center items-center
                              z-10
                          `}
                            >
                              3
                            </Label>
                          </div>
                          {/*  score 2 */}
                          <div className="flex items-center relative">
                            <RadioGroupItem
                              value="2"
                              id={"r2" + sup.id}
                              className="w-10 h-10"
                            />
                            <Label
                              htmlFor={"r2" + sup.id}
                              className={`${
                                handleRaioColorChange(item.id, sup.id) === "2"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black"
                              }
                              absolute w-10 h-10 rounded-full -top-1/2 left-1/2 -translate-x-1/2 
                              border border-neutral-500 transition-all
                              flex justify-center items-center
                              z-10
                          `}
                            >
                              2
                            </Label>
                          </div>
                          {/*  score 1 */}
                          <div className="flex items-center relative">
                            <RadioGroupItem
                              value="1"
                              id={"r1" + sup.id}
                              className="w-10 h-10"
                            />
                            <Label
                              htmlFor={"r1" + sup.id}
                              className={`${
                                handleRaioColorChange(item.id, sup.id) === "1"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black"
                              }
                              absolute w-10 h-10 rounded-full -top-1/2 left-1/2 -translate-x-1/2 
                              border border-neutral-500 transition-all
                              flex justify-center items-center
                              z-10
                          `}
                            >
                              1
                            </Label>
                          </div>
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
          <Button type="submit">Save inform</Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateSection;
