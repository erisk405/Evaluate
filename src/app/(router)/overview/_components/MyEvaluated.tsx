"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChartEvaluatedYou from "./ChartEvaluatedYou";
import ChartEvaluatePersonnel from "./ChartEvaluatePersonnel";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { useThemeStyles } from "@/hooks/useTheme";

const MyEvaluated = () => {
  const { setResultEvaluate, ProfileDetail, currentlyEvaluationPeriod } = useStore();
  const styles = useThemeStyles()
  const fetchResultEval = async () => {
    try {
      // Add additional checks before making the API call
      if (!ProfileDetail?.id || !currentlyEvaluationPeriod?.period_id) {
        console.log("Missing required data for fetching result evaluation");
        return;
      }
      const payload = {
        period_id: currentlyEvaluationPeriod.period_id,
      };
      const response = await GlobalApi.getResultEvaluate(payload);
      setResultEvaluate(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  useEffect(() => {
    fetchResultEval();
  }, [currentlyEvaluationPeriod, ProfileDetail.id]);
  return (
    <div className="h-full flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-5">
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 gap-5 ">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`${styles.background} rounded-2xl shadow`}
          >
            <ChartEvaluatedYou />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`rounded-2xl`}
          >
            <ChartEvaluatePersonnel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyEvaluated;
