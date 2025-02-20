"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash"; // เพิ่ม import debounce
import ChartEvaluatedYou from "./ChartEvaluatedYou";
import ChartEvaluatePersonnel from "./ChartEvaluatePersonnel";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { useThemeStyles } from "@/hooks/useTheme";
import { User } from "@/types/interface";
import { toast } from "@/components/ui/use-toast";
import socket from "@/lib/socket";

const MyEvaluated = () => {
  const { setResultEvaluate, ProfileDetail, currentlyEvaluationPeriod } =
    useStore();
  const styles = useThemeStyles();
  // สร้าง debounced version ของ fetchResultEval
  //ใช้ useCallback ป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่ ช่วยให้ฟังก์ชันนั้นถูกสร้างขึ้นแค่ครั้งเดียวและจะถูกเก็บไว้ในหน่วยความจำจนกว่าค่าของ dependencies จะเปลี่ยนแปลง
  const debouncedFetchResultEval = useCallback(
    debounce(async () => {
      try {
        if (!ProfileDetail?.id || !currentlyEvaluationPeriod?.period_id) {
          // console.log("Missing required data for fetching result evaluation");
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
    }, 1000), // จะรอ 1 วินาทีหลังจากการเรียกครั้งสุดท้าย
    [ProfileDetail?.id, currentlyEvaluationPeriod?.period_id]
  );
  useEffect(() => {
    debouncedFetchResultEval();
    socket.on(
      "evaluatedNotification",
      (receive: { evaluatorUserTarget: User }) => {
        if (ProfileDetail.id === receive.evaluatorUserTarget.id) {
          debouncedFetchResultEval();
          toast({
            description: (
              <div className="w-full">
                <div className="flex gap-3 justify-start items-start">
                  <div className="text-lg">
                    <h1 className="text-sm">มีผู้ใช้งานอื่นประเมินคุณ</h1>
                  </div>
                </div>
              </div>
            ),
            duration: 5000, // Optional: duration in milliseconds
          });
        }
      }
    );
    return () => {
      // Cleanup: ยกเลิก debounce และ event listener
      socket.off("evaluatedNotification");
      debouncedFetchResultEval.cancel(); // ยกเลิก debounce function เมื่อ component ถูก unmount
    };
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
            {ProfileDetail.role?.role_name === "member" ? (
              <div className="flex flex-col gap-3 justify-center items-center p-6 h-80">
                <div className="text-6xl animate-wiggle-float">🌕</div>
                <h2 className="text-3xl">โปรดระบุตำแหน่งของตนเอง</h2>
                <p>
                  โดยการคลิกที่ <span className="text-green-500">โปรไฟล์</span>{" "}
                  แล้วเลือก <span className="text-green-500">บัญชีของฉัน </span>
                </p>
                <p>
                  หากตำแหน่งยังคงเป็น{" "}
                  <span className="text-green-500">"member"</span>{" "}
                  โปรดเลือกตำแหน่งใหม่ให้ถูกต้อง
                </p>
              </div>
            ) : (
              <ChartEvaluatedYou />
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
