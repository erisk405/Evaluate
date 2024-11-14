"use client";

import { motion } from "framer-motion";
import RadarChartSection from "./RadarChartSection";
import BarChartMultiple from "./BarChartMultiple";
import {
  Building2,
  CircleCheck,
  CircleDotDashed,
  CircleX,
  Container,
  Handshake,
  Package,
  TrendingUp,
  User,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import Image from "next/image";
import AreaChartSection from "./AreaChartSection";

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

const invoices = [
  {
    id: "DE01",
    department: "งานพัฒนาวิชาการและส่งเสริมการศึกษา",
    evaluated: 73,
    evaluate: 0,
    member: 73,
  },
  {
    id: "DE02",
    department: "งานทะเบียนและประมวลผล",
    evaluated: 58,
    evaluate: 0,
    member: 58,
  },
  {
    id: "DE03",
    department: "งานฝึกประสบการณ์วิชาชีพนักศึกษา",
    evaluated: 10,
    evaluate: 5,
    member: 15,
  },
  {
    id: "DE04",
    department: "งานประกันคุณภาพและประเมินผล",
    evaluated: 8,
    evaluate: 3,
    member: 11,
  },
  {
    id: "DE05",
    department: "งานบริหารงานทั่วไป",
    evaluated: 33,
    evaluate: 0,
    member: 33,
  },
  {
    id: "DE06",
    department: "สำนักงานผู้อำนวยการ",
    evaluated: 50,
    evaluate: 5,
    member: 55,
  },
];

export const description = "A radial chart with a grid";
const data = [
  {
    id: "FN01",
    title: "เสร็จแล้ววันนี้",
    icon: <Handshake size={25} />,
    quantity: 172,
  },
  {
    id: "FN02",
    title: "ยังไม่เสร็จสิ้น",
    icon: <Package size={25} />,
    quantity: 42,
  },
  {
    id: "FN03",
    title: "อื่นๆ",
    icon: <Container size={25} />,
    quantity: 16,
  },
];
const ReportOverview = () => {
  return (
    <div className="h-full flex flex-col gap-5">
      <div className="w-full grid grid-cols-3 lg:grid-cols-3 gap-5 ">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-2 rounded-2xl"
        >
          <div className="flex gap-5 justify-between mb-2">
            {data.map((item, index) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="bg-white border rounded-full p-4">
                  {item.icon}
                </div>
                <div className="grid gap-1 grid-cols-1">
                  <div className="flex gap-2 items-end">
                    <h2 className="text-2xl font-bold text-stone-700">{item.quantity}</h2>
                    <div className="flex items-center">
                      <h2 className="text-green-500 text-sm ">+1.92%</h2>
                      <TrendingUp size={18} className="text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-sm text-stone-700">{item.title}</h2>
                </div>
              </div>
            ))}
          </div>
          <BarChartMultiple />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-1 rounded-2xl"
        >
          <RadarChartSection />
          <div className="grid grid-cols-1 p-3 relative rounded-2xl h-[100px] overflow-hidden border bg-white my-2">
            <h2>ทั้งหมดประเมินไปแล้ว</h2>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-700">182/250 คน</h2>
            </div>
            <h2>เฉลี่ยต่อวัน 10 คน</h2>
            <Image
              width={80}
              height={80}
              src={"/OverviewBannerIcon.png"}
              alt="OverviewBannerIcon"
              className="absolute bottom-0 right-0"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-3"
        >
          <h2 className="text-xl font-bold text-stone-700">การประเมินแต่ละหน่วยงาน</h2>
          <div className="w-full bg-white grid grid-cols-3 overflow-hidden rounded-lg">
            <div className="w-full">
              <Image
                width={300}
                height={300}
                alt="bannerDepartment"
                src={"/test.png"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-full ">
                  <Building2 />
                </div>
                <h2>งานพัฒนาวิชาการและส่งเสริมการศึกษา</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-full ">
                  <UserRoundCheck />
                </div>
                <div className="grid grid-cols-1">
                  <h2 className="text-lg font-bold">192 คน</h2>
                  <h2 className="text-sm">เสร็จสิ้นแล้วทั้งหมด</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-full ">
                  <UserRoundX />
                </div>
                <div className="grid grid-cols-1">
                  <h2 className="text-lg font-bold">42 คน</h2>
                  <h2 className="text-sm">ยังไม่เสร็จ</h2>
                </div>
              </div>
            </div>
            <div className="w-full border-l p-3">
              <AreaChartSection />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-3 bg-white rounded-lg"
        >
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ลำดับ</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead className="text-center">สามาชิกทั้งหมด</TableHead>
                <TableHead className="text-center ">
                  ผู้ที่ประเมินเสร็จสิ้นแล้ว
                </TableHead>
                <TableHead className="text-center ">ยังไม่แล้วเสร็จ</TableHead>
                <TableHead className="text-center ">status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{invoice.department}</TableCell>
                  <TableCell className="text-center">
                    {invoice.member}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.evaluated}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.evaluate}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.evaluated === invoice.member ? (
                      <CircleCheck className="text-white bg-green-500 rounded-full" />
                    ) : (
                      <CircleDotDashed className="text-white bg-amber-500 rounded-full" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportOverview;
