"use client";
import { Cog, FolderKanban, UserRoundSearch } from "lucide-react";
import React, { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DepartmentSection from "./DepartmentSection";
import { motion } from "framer-motion";
import ChartEvaluatedYou from "./ChartEvaluatedYou";
import ChartEvaluatePersonnel from "./ChartEvaluatePersonnel";

interface Score {
  id: string;
  name: string;
  now: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  state: any;
}

const MyEvaluated = () => {
  const [Academicknowledge, setAcademicknowledge] = useState(61);
  const [OperationalSkills, setOperationalSkills] = useState(34);
  const [AffectiveDomain, setAffectiveDomain] = useState(50);

  let myscore: Score[] = [
    {
      id: "AT01",
      name: "ทักษะการปฎิบัติงาน",
      now: 10,
      total: 39,
      icon: <UserRoundSearch />,
      color: "#22c55e",
      state: Academicknowledge,
    },
    {
      id: "AT02",
      name: "ความรู้เชิงวิขาการ",
      now: 14,
      total: 54,
      icon: <FolderKanban />,
      color: "#3b82f6",
      state: OperationalSkills,
    },
    {
      id: "AT03",
      name: "จิตพิสัย",
      now: 64,
      total: 72,
      icon: <Cog />,
      color: "#06B6D4",
      state: AffectiveDomain,
    },
  ];

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
          >
            <ChartEvaluatedYou />
          </motion.div>
        </div>
        {/* <h2 className="text-xl font-bold">ผลการประเมินตอนนี้</h2> */}
        <div className="flex flex-wrap gap-5">
          {myscore.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex-1 py-3 px-7 bg-white shadow-md rounded-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg text-white`}
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
              </div>
              <div className="flex items-center justify-between gap-3 mt-2">
                <div className="flex items-end gap-3">
                  <h2 className="font-light">
                    <span className="text-xl font-medium">{item.now}/</span>
                    {item.total}
                  </h2>
                  <h2 className="text-[12px] font-bold text-emerald-500">
                    Today
                  </h2>
                </div>
                <div className="w-[40px] font-bold">
                  <CircularProgressbar
                    value={item.state}
                    text={`${item.state}%`}
                    strokeWidth={15}
                    styles={buildStyles({
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: "butt",
                      pathColor: `${item.color}`,
                      // Text size
                      textSize: "30px",
                      // How long animation takes to go from one percentage to another, in seconds
                      pathTransitionDuration: 0.5,

                      // Can specify path transition in more detail, or remove it entirely
                      // pathTransition: 'none',
                      // Colors
                      textColor: "#000000",
                      trailColor: "#D1ECEC",
                      backgroundColor: "#3e98c7",
                    })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <hr />
                <h2 className="text-[12px] text-neutral-500 mt-3">
                  1.3% Performance up
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
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
