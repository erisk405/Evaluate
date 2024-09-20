"use client";
import React from "react";
import DatePicker from "./DatePicker";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import CarouselSection from "./CarouselSection";
import { TextEffect } from "@/app/_components/motion/TextEffect";
import { motion } from "framer-motion";
import DepartmentSection from "./DepartmentSection";
const RightSection = () => {
  return (
    <div className="flex gap-3 flex-col h-full">
      <div className="flex justify-center w-full">
        <DatePicker />
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
