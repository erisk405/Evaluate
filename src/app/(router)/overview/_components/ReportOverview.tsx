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
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import InfoOfDepartmentEval from "./InfoOfDepartmentEval";
import { getAllSuperviseByAdminType } from "@/types/interface";
import { useThemeStyles } from "@/hooks/useTheme";
import Loading from "@/app/_components/Loading";

export const description = "A radial chart with a grid";

const ReportOverview = () => {
  const { resultEvalEachDepartment, setResultEvalEachDepartment } = useStore();
  const { currentlyEvaluationPeriod } = useStore();
  const styles = useThemeStyles();
  const [supervise, setSupervise] = useState<getAllSuperviseByAdminType[]>([]);
  const getResultEvaluatePerDepart = async () => {
    try {
      if (!currentlyEvaluationPeriod?.period_id) {
        throw new Error("Not found currentlyEvaluationPeriod");
      }
      const response = await GlobalApi.getResultEvaluatePerDepart(
        currentlyEvaluationPeriod?.period_id
      );
      setResultEvalEachDepartment(response?.data);
      // console.log("setResultEvalEachDepartment",response?.data);
    } catch (error) {
      console.error({ message: error });
      // handleErrorOnAxios(error)
    }
  };
  const fetchSupervise = async () => {
    try {
      const response = await GlobalApi.getSupervises();
      // console.log("supervise", response?.data?.data);
      setSupervise(response?.data?.data);
    } catch (error) {
      console.error({ message: error });
      handleErrorOnAxios(error);
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
      icon: "🏅",
      quantity: AllFinished,
    },
    {
      id: "FN02",
      title: "ยังไม่เสร็จสิ้น",
      icon: "⚡",
      quantity: AllUnfinished,
    },
    {
      id: "FN03",
      title: "ทั้งหมด",
      icon: "👔",
      quantity: AllUser,
    },
  ];

  useEffect(() => {
    // console.log("resultEvalEachDepartment", resultEvalEachDepartment);
    getResultEvaluatePerDepart();
    fetchSupervise();
  }, [currentlyEvaluationPeriod?.period_id]);

  return (
    <div className={`h-full flex flex-col gap-3 ${styles.text}`}>
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
                className={`flex gap-3 w-full justify-center ${styles.background} p-2 shadow rounded-2xl items-center`}
              >
                <div
                  className={`${styles.border} shadow rounded-full w-[60px] h-[60px] animate-wiggle flex justify-center items-center`}
                >
                  <h2 className="text-2xl">{item.icon}</h2>
                </div>
                <div className="grid gap-1 grid-cols-1">
                  <div className="flex gap-1 items-end">
                    <div className="text-lg">🎗️</div>
                    <h2 className="text-xl ">{item.quantity} คน</h2>
                  </div>
                  <h2 className="text-sm">{item.title}</h2>
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
          <div
            className={`grid grid-cols-1 p-3 relative rounded-2xl h-[100px] overflow-hidden shadow border-none ${styles.background} my-2`}
          >
            <h2>ทั้งหมดประเมินไปแล้ว</h2>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {AllFinished}/{AllUser} คน
              </h2>
            </div>
            <h2>
              จากหน่วยงานทั้งหมด {resultEvalEachDepartment?.length} หน่วยงาน
            </h2>
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
          className="col-span-3 my-3"
        >
          <h2 className="text-2xl font-bold my-3">การประเมินแต่ละหน่วยงาน</h2>
          {resultEvalEachDepartment?.length ? (
            <InfoOfDepartmentEval />
          ) : (
            <div className="w-full flex justify-center items-center h-[180px]">
              <h2 className="text-2xl">
                ตอนนี้ไม่ได้อยู่ในช่วงเวลาการประเมินค้าบผม...{" "}
              </h2>
              <span className="text-4xl animate-bounce">🐱</span>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="col-span-3 my-3"
        >
          <h2 className="text-2xl font-bold my-3">
            บุคคลที่กำกับดูแลในแต่ละหน่วยงาน
          </h2>
          {supervise.length ? (
            <Table className={`shadow ${styles.background} rounded-lg my-3`}>
              <TableCaption>
                ข้อมูลลำดับบุคคลกำกับดูแลในแต่ละหน่วยงาน
              </TableCaption>
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
                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={
                          item.user.image
                            ? item.user.image.url
                            : "/profiletest.jpg"
                        }
                        width={30}
                        height={30}
                        alt="hover profile"
                        className="rounded-lg w-[30px] h-[30px] object-cover"
                      />
                      {item.user.prefix?.prefix_name}
                      {item.user.name}
                    </TableCell>
                    <TableCell>
                      {item.user.department?.department_name}
                    </TableCell>
                    <TableCell>{item.user.role.role_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="w-full flex justify-center items-center h-[180px]">
              <h2 className="text-2xl">
                ยังไม่ได้กำหนดบุคคลที่ต้อง"กำกับดูแล"ในแต่ละหน่วยงาน...{" "}
              </h2>
              <span className="text-4xl animate-bounce">🐱</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportOverview;
