"use client";

import { motion } from "framer-motion";
import RadarChartSection from "./RadarChartSection";
import BarChartMultiple from "./BarChartMultiple";
import {
  CircleCheck,
  CircleDotDashed,
  Combine,
  Container,
  Package,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import InfoOfDepartmentEval from "./InfoOfDepartmentEval";
import { getAllSuperviseByAdminType } from "@/types/interface";

export const description = "A radial chart with a grid";

const ReportOverview = () => {
  const { resultEvalEachDepartment, setResultEvalEachDepartment } = useStore();
  const { currentlyEvaluationPeriod } = useStore();
  const [supervise, setSupervise] = useState<getAllSuperviseByAdminType[]>([]);
  const getResultEvaluatePerDepart = async () => {
    try {
      if (!currentlyEvaluationPeriod?.period_id) {
        throw new Error("Not found currentlyEvaluationPeriod");
      }
      const response = await GlobalApi.getResultEvaluatePerDepart(
        currentlyEvaluationPeriod?.period_id
      );
      console.log(response?.data);

      setResultEvalEachDepartment(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  const fetchSupervise = async () => {
    try {
      const response = await GlobalApi.getSupervises();
      console.log("supervise", response?.data?.data);

      setSupervise(response?.data?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };

  const calculateSummention = (data: number[]) =>
    data.reduce((sum, val) => sum + val, 0);
  // บันทึกค่า" ที่คำนวณไว้แล้ว (memoize) และจะคำนวณค่าใหม่เฉพาะเมื่อค่าที่ใช้ใน dependency array เปลี่ยนแปลงเท่านั้น
  const AllFinished = useMemo(() => {
    const averages =
      resultEvalEachDepartment?.map((item) => Number(item.totalFinished)) || [];
    return calculateSummention(averages);
  }, [resultEvalEachDepartment]);
  const AllUnfinished = useMemo(() => {
    const averages =
      resultEvalEachDepartment?.map((item) => Number(item.totalUnfinished)) ||
      [];
    return calculateSummention(averages);
  }, [resultEvalEachDepartment]);
  const AllUser = useMemo(() => {
    const averages =
      resultEvalEachDepartment?.map((item) => Number(item.totalUsers)) || [];
    return calculateSummention(averages);
  }, [resultEvalEachDepartment]);

  const data = [
    {
      id: "FN01",
      title: "เสร็จสิ้นแล้ว",
      icon: <Combine size={25} strokeWidth={1.2} />,
      quantity: AllFinished,
    },
    {
      id: "FN02",
      title: "ยังไม่เสร็จสิ้น",
      icon: <Package size={25} strokeWidth={1.2} />,
      quantity: AllUnfinished,
    },
    {
      id: "FN03",
      title: "ทั้งหมด",
      icon: <Container size={25} strokeWidth={1.2} />,
      quantity: AllUser,
    },
  ];

  useEffect(() => {
    getResultEvaluatePerDepart();
    fetchSupervise();
  }, [currentlyEvaluationPeriod?.period_id]);
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="@container w-full grid grid-cols-3 lg:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-3 @[45rem]:col-span-2 rounded-2xl grid gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">
            {data.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-3 w-full justify-center bg-white p-2 shadow rounded-2xl items-center"
              >
                <div className=" border rounded-full p-4 animate-wiggle">
                  {item.icon}
                </div>
                <div className="grid gap-1 grid-cols-1">
                  <div className="flex gap-2 items-end">
                    <h2 className="text-2xl font-bold text-stone-700">
                      {item.quantity}
                    </h2>
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
          className="col-span-3 @[45rem]:col-span-1 rounded-2xl"
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
              className="absolute bottom-0 right-0 animate-wiggle"
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
          className="col-span-3 "
        >
          <h2 className="text-xl font-bold text-stone-700 my-3">
            การประเมินแต่ละหน่วยงาน
          </h2>
          <InfoOfDepartmentEval />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-3 "
        >
          <h2 className="text-xl font-bold">
            บุคคลที่กำกับดูแลในแต่ละหน่วยงาน
          </h2>
          <Table className="shadow bg-white rounded-lg my-3 ">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ลำดับ</TableHead>
                <TableHead>หน่วยงานที่กำกับดูแล</TableHead>
                <TableHead className="">ชื่อผู้ที่กำกับดูแล</TableHead>
                <TableHead className="">หน่วยงาน/สังกัด</TableHead>
                <TableHead className="">ตำแหน่ง</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervise?.map((item, index) => (
                <TableRow key={item.department.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.department.department_name}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
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
