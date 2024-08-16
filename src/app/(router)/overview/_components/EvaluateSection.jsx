"use client";
import React, { useState } from "react";
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

const invoices = [
  {
    id: "001",
    totalAmount: "$250.00",
    question: "ปริมาณผลงาน",
  },
  {
    id: "002",
    totalAmount: "$150.00",
    question: "ความอุสาหพยายาม",
  },
  {
    id: "003",
    totalAmount: "$350.00",
    question: "การบำรุงรักษาเครื่องมือและอุปกรณ์ที่ใช้",
  },
  {
    id: "004",
    totalAmount: "$450.00",
    question: "การตัดสินใจและแก้ปัญหาเฉพาะหน้า",
  },
  {
    id: "005",
    totalAmount: "$550.00",
    question: "ความคิดริเริ่มในการปฎิบัติงาน",
  },
  {
    id: "006",
    totalAmount: "$200.00",
    question: "ความรับผิดชอบต่อหน้าที่ ที่ได้รับมอบหมายความรับผิดชอบต่อหน้าที่ ",
  },
  {
    id: "007",
    totalAmount: "$300.00",
    question: "ความรวดเร็วในการปฏิบัติงาน",
  },
  {
    id: "008",
    totalAmount: "$300.00",
    question: "ตรงต่อเวลาในการทำงาน",
  },
];

const EvaluateSection = () => {
  const [selectedValues, setSelectedValues] = useState(invoices.map(() => "3"));

  const handleValueChange = (index, value) => {
    console.log(value);
    
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = value;
    setSelectedValues(newSelectedValues);
  };

  return (
    <div className="mt-3">
      <div >
        <h1 className="text-xl font-bold">ทักษะการปฎิบัติงาน</h1>
        <div className="rounded-2xl border bg-white my-4">
          <Table className="">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg w-[100px]">ลำดับ</TableHead>
                <TableHead className="text-lg">ข้อคำถาม</TableHead>
                <TableHead className="text-lg text-center ">ลงคะแนน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((item, index) => (
                <TableRow key={item.id} >
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell style={{ minWidth: '170px', whiteSpace: 'normal', wordBreak: 'break-word' }} className="text-lg  " >
                    {item.question}
                  </TableCell>
                  <TableCell className="text-center min-w-[50px] w-[400px] max-w-[400px]">
                    <RadioGroup
                      defaultValue="3"
                      className="flex gap-3 justify-around flex-wrap "
                      onValueChange={(value) => handleValueChange(index, value)}
                    >
                      <div className="flex items-center relative  ">
                        <RadioGroupItem
                          value="5"
                          id={"r5" + item.id}
                          className="z-0 w-10 h-10"
                        />
                        <Label
                          htmlFor={"r5" + item.id}
                          className={`${
                            selectedValues[index] === "5"
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
                      <div className="flex items-center relative">
                        <RadioGroupItem value="4" id={"r4" + item.id} className="w-10 h-10" />
                        <Label
                          htmlFor={"r4" + item.id}
                          className={`${
                            selectedValues[index] === "4"
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
                      <div className="flex items-center relative">
                        <RadioGroupItem value="3" id={"r3" + item.id} className="w-10 h-10" />
                        <Label
                          htmlFor={"r3" + item.id}
                          className={`${
                            selectedValues[index] === "3"
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
                      <div className="flex items-center relative">
                        <RadioGroupItem value="2" id={"r2" + item.id} className="w-10 h-10" />
                        <Label
                          htmlFor={"r2" + item.id}
                          className={`${
                            selectedValues[index] === "2"
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
                      <div className="flex items-center relative">
                        <RadioGroupItem value="1" id={"r1" + item.id} className="w-10 h-10" />
                        <Label
                          htmlFor={"r1" + item.id}
                          className={`${
                            selectedValues[index] === "1"
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
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EvaluateSection;
