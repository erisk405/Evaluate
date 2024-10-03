"use client"
import React from "react";
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
import { ChevronUp } from "lucide-react";

const data = [
  {
    id: "CO01",
    HeadTitle: "ทักษะการปฎิบัติงาน",
    subData: [
      {
        id: "INV001",
        avg: "4.36",
        sd: "0.87",
        paymentMethod: "ปริมาณผลงาน",
      },
      {
        id: "INV002",
        avg: "4.50",
        sd: "0.87",
        paymentMethod: "ความอุสาหพยายาม",
      },
      {
        id: "INV003",
        avg: "4.50",
        sd: "0.68",
        paymentMethod: "การบำรุงรักษาเครื่องมือและอุปกรณ์ที่ใช้",
      },
      {
        id: "INV004",
        avg: "4.44",
        sd: "0.68",
        paymentMethod: "การตัดสินใจและแก้ปัญหาเฉพาะหน้า",
      },
      {
        id: "INV005",
        avg: "4.50",
        sd: "0.92",
        paymentMethod: "ความคิดริเริ่มในการปฎิบัติงาน",
      },
      {
        id: "INV006",
        avg: "4.00",
        sd: "0.92",
        paymentMethod: "ความรับผิดชอบต่อหน้าที่ที่ได้รับมอบหมาย",
      },
      {
        id: "INV007",
        avg: "4.00",
        sd: "0.67",
        paymentMethod: "ความรวดเร็วในการปฎิบัติงาน",
      },
      {
        id: "INV008",
        avg: "4.40",
        sd: "0.67",
        paymentMethod: "ตรงต่อเวลาในการทำงาน",
      },
    ],
  },
  {
    id: "CO02",
    HeadTitle: "ความรู้เชิงวิชาการ",
    subData: [
      {
        id: "INA001",
        avg: "4.00",
        sd: "0.87",
        paymentMethod: "มีความคิดริเริ่ม/การนำวิธี่ที่มีประสิทธิภาพมาใช้",
      },
      {
        id: "INA002",
        avg: "4.00",
        sd: "0.67",
        paymentMethod: "ความใฝ่หาความรู้และคุณภาพงาน",
      },
      {
        id: "INA003",
        avg: "4.20",
        sd: "0.74",
        paymentMethod: "การจัดระบบบริหารควบคุมและติดตามผลงาน",
      },
      {
        id: "INA004",
        avg: "4.00",
        sd: "0.74",
        paymentMethod: "ทักษะและเทคนิคในการทำงาน",
      },
      {
        id: "INA005",
        avg: "4.11",
        sd: "0.74",
        paymentMethod: "การวางแผนและการเตรียมอุปกรณ์ก่อนการทำงาน",
      },
    ],
  },
  {
    id: "CO03",
    HeadTitle: "จิตพิสัยในการทำงาน",
    subData: [
      {
        id: "IND001",
        avg: "4.80",
        sd: "0.81",
        paymentMethod: "การอุทิศเวลาให้แก่ราชการอย่างสม่ำเสมอ",
      },
      {
        id: "IND002",
        avg: "4.65",
        sd: "0.75",
        paymentMethod: "ลักษณะการเป็นผู้นำและผู้ตามที่ดี",
      },
      {
        id: "IND003",
        avg: "4.54",
        sd: "0.78",
        paymentMethod: "การให้คำปรึกษาและประสานงานกับผู้เกี่ยวข้อง",
      },
      {
        id: "IND004",
        avg: "4.54",
        sd: "0.67",
        paymentMethod: "ความประพฤติและการควบคุมอารมณ์",
      },
      {
        id: "IND005",
        avg: "4.60",
        sd: "0.63",
        paymentMethod: "บุคลิกภาพและการแต่งกาย",
      },
    ],
  },
];
const ResultSection = () => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow className="text-lg bg-blue-300">
            <TableHead className="w-[50px] text-center text-black">
              ลำดับ
            </TableHead>
            <TableHead className="text-black">หัวข้อคำถาม</TableHead>
            <TableHead className="w-[500px] text-black">ข้อคำถาม</TableHead>
            <TableHead className="text-center text-black">ค่าเฉลี่ย</TableHead>
            <TableHead className="text-center text-black">ค่า sd</TableHead>
            <TableHead className="text-center text-black">เพิ่ม / ลด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <TableRow className="text-[16px] bg-blue-100">
                <TableCell colSpan={3} className="font-bold ">
                  {item.HeadTitle}
                </TableCell>
                <TableCell className="text-center">4.36</TableCell>
                <TableCell className="text-center">0.87</TableCell>
                <TableCell className="flex justify-center items-center gap-1 text-emerald-500">
                  0.17{" "}
                  <span className="bg-emerald-500 text-white rounded-full">
                    <ChevronUp size={16} />
                  </span>
                </TableCell>
              </TableRow>
              {item.subData.map((sup, index) => (
                <TableRow key={sup.id} className="text-[16px]">
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>{item.HeadTitle}</TableCell>
                  <TableCell>{sup.paymentMethod}</TableCell>
                  <TableCell className="text-center">{sup.avg}</TableCell>
                  <TableCell className="text-center">{sup.sd}</TableCell>
                  <TableCell className="flex justify-center items-center gap-1 text-emerald-500">
                    0.87{" "}
                    <span className="bg-emerald-500 text-white rounded-full">
                      <ChevronUp size={16} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          <TableRow className="text-[16px] bg-yellow-200">
            <TableCell colSpan={2} className="font-bold text-right">
              ผลรวมของ
            </TableCell>
            <TableCell className="text-left">นายกฤตภาส สัมฤทธิ์</TableCell>
            <TableCell className="text-center">4.35</TableCell>
            <TableCell className="text-center">0.81</TableCell>
            <TableCell className="flex justify-center items-center gap-1 text-emerald-500">
              0.87{" "}
              <span className="bg-emerald-500 text-white rounded-full">
                <ChevronUp size={16} />
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow className="text-right">
            <TableCell colSpan={3}></TableCell>
            <TableCell colSpan={3} className="text-center">
              <h2>
                ผลการประเมินการปฎิบัติงานตามคุณลักษณะและพฤติกรรมในการปฎิบัติงาน
              </h2>
              <h2 className="flex justify-around mt-4">
                เท่ากับ <span className="text-xl">9</span> คะแนน
              </h2>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ResultSection;
