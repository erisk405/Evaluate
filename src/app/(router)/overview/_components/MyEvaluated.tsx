"use client";
import { Cog, FolderKanban, UserRoundSearch } from "lucide-react";
import React, { useState } from "react";
import DepartmentSection from "./DepartmentSection";
import { motion } from "framer-motion";
import ChartEvaluatedYou from "./ChartEvaluatedYou";
import ChartEvaluatePersonnel from "./ChartEvaluatePersonnel";


const MyEvaluated = () => {

  return (
    <div className="h-full flex flex-col gap-5">
      <div className=" flex flex-col justify-between gap-5">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="bg-white  rounded-2xl  shadow-md"
          >
            <ChartEvaluatePersonnel />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="bg-white  rounded-2xl  shadow-md"
          >
            <ChartEvaluatedYou />
          </motion.div>
        </div>
        {/* <h2 className="text-xl font-bold">ผลการประเมินตอนนี้</h2> */}
      </div>
      <motion.div
        className="bg-white rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div className="overflow-hidden">
          <DepartmentSection />
        </div>
      </motion.div>
    </div>
  );
};

export default MyEvaluated;
