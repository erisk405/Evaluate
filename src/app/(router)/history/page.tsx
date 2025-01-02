"use client";
import React from "react";
import InfomationProfile from "./_components/infomation-profile";
import ListHistorySection from "./_components/list-history-section";
import useStore from "@/app/store/store";
import { useTheme } from "next-themes";

const page = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`m-3 w-full ${
        theme === "light" ? "text-neutral-800" : "text-white "
      }`}
    >
      <h2 className="text-3xl">ประวัติผลการประเมินของฉัน</h2>
      <div className=" bg-background_secondary shadow rounded-xl overflow-hidden w-full p-5 mb-3">
        <div className="flex  gap-3 items-center ">
          <span className="text-6xl animate-wiggle-float-blue">🪻</span>
          <div>
            <h2 className="text-xl">ประวัติผลการประเมินที่ถูกบันทึกไว้</h2>
            <p className="text-sm ">
              การเก็บข้อมูลนี้
              จะเก็บตามแต่ในรอบการประเมินที่ผู้ดูแลระบบเป็นคนกำหนด
              เพื่อเป็นการรักษาผลการประเมินให้คงไว้
              และไม่ส่งผลกระทบเมื่อมีการเปลี่ยนแปลงบางข้อมูล
              ผลที่ถูกเก็บนี้จะไม่ถูกเปลี่ยนแปลง ยังคงสภาพเดิมขณะตอนเก็บผล
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div
          className={`col-span-4 xl:col-span-1 shadow rounded-xl ${
            theme === "light" ? "bg-white" : "bg-background_secondary"
          }`}
        >
          <InfomationProfile />
        </div>
        <div
          className={`col-span-4 xl:col-span-3 p-4 rounded-xl shadow ${
            theme === "light" ? "bg-white" : "bg-background_secondary"
          }`}
        >
          <div>
            <h2>History evaluate</h2>
            <p className="text-gray-500 text-sm">
              ผลการประเมินที่ถูกบันทึกไว้ในแต่ละรอบการประเมิน
            </p>
            <ListHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
