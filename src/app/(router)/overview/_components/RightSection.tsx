"use client";
import React from "react";
import DatePicker from "./DatePicker";
import Image from "next/image";
import CarouselSection from "./CarouselSection";
import { TextEffect } from "@/app/_components/motion/TextEffect";
import { motion } from "framer-motion";
import DepartmentSection from "./DepartmentSection";
import { Calendar } from "@/components/ui/calendar";
import { Dot } from "lucide-react";
const RightSection = () => {
  const defaultDate = new Date(2024, 9); // เดือน 12 (0-11 where 11 is December)
  return (
    <div className="flex gap-3 flex-col h-full">
      <div className="@container">
        <div className="rounded-2xl flex @[23rem]:flex-row @[23rem]:items-start flex-col justify-center items-center shadow-sm border w-auto bg-white ">
          <Calendar
            className="border-b @[23rem]:border-r"
            classNames={{
              day_selected:
                "w-full  bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-blue-500 rounded-md text-white",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-500 opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            initialFocus
            mode="range"
            defaultMonth={defaultDate}
            // selected prop ควรเป็น Date หรือ { from: Date, to: Date } สำหรับ mode="range"
            selected={{
              from: new Date(2024, 9, 24),
              to: new Date(2024, 9, 28),
            }}
            numberOfMonths={1}
          />
          <div className="py-4 px-1">
            <div className="grid gap-3 items-center">
              <h2 className="text-center font-bold pl-2">คำอธิบาย</h2>
              <div className="flex items-center">
                <div className="relative">
                  <Dot strokeWidth={8} className="text-blue-500" />
                  <Dot
                    strokeWidth={8}
                    className="absolute top-0 text-blue-500 animate-ping"
                  />
                </div>
                <h2>วันปัจจุบัน</h2>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <Dot strokeWidth={8} />
                  <Dot
                    strokeWidth={8}
                    className="absolute top-0 animate-ping"
                  />
                </div>
                <h2>วันเริ่ม-สิ้นสุด</h2>
              </div>
            </div>
          </div>
          {/* <DatePicker /> */}
        </div>
      </div>
      <motion.div
        className="bg-white p-5 border h-full shadow-md rounded-2xl"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <h2 className="font-bold text-xl">
          <TextEffect preset="slide">Department</TextEffect>
        </h2>
        <div className="mt-5">
          <DepartmentSection />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.6,
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 100,
              restDelta: 0.001,
              delay: 0.6,
            },
          }}
          className="mt-5"
        >
          <CarouselSection />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RightSection;
