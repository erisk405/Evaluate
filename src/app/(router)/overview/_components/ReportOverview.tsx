"use client";

import { motion } from "framer-motion";
import PieEvalChart from "./PieEvalChart";
import BarChartMultiple from "./BarChartMultiple";
import { Container, Handshake, Package, TrendingUp } from "lucide-react";
import Image from "next/image";
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
                    <h2 className="text-2xl font-bold">{item.quantity}</h2>
                    <div className="flex items-center">
                      <h2 className="text-green-500 text-sm">+1.92%</h2>
                      <TrendingUp size={18} className="text-green-500" />
                    </div>
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
          className="col-span-1 rounded-2xl"
        >
          <PieEvalChart />
          <div className="grid grid-cols-1 p-3 relative rounded-2xl h-[100px] overflow-hidden border bg-white my-2">
            <h2>ทั้งหมดประเมินไปแล้ว</h2>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">182 คน</h2>
            </div>
            <h2>เฉลี่ยนต่อวัน 10 คน</h2>
            <Image
              width={80}
              height={80}
              src={"/OverviewBannerIcon.png"}
              alt="OverviewBannerIcon"
              className="absolute bottom-0 right-0"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportOverview;
