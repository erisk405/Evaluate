"use client";
import { Cog, FolderKanban, UserRoundSearch } from "lucide-react";
import React, { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DepartmentSection from "./DepartmentSection";
import { motion } from "framer-motion";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_unit/GlobalApi";

export const description = "A radial chart with a custom shape";

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

  const { departments } = useStore();

  const myQuest = [
    {
      id: "AOU01",
      name: "คุณประเมินบุคลากรไปแล้ว",
      chartData: [
        { browser: "alreadyEvaluated", quantity: 40, fill: "rgb(253 224 71)" },
      ],
      engle: 200,
    },
    {
      id: "AOU02",
      name: "มีคนประเมินคุณทั้งหมด",
      chartData: [{ browser: "evaluatedYou", quantity: 60, fill: "#60a5fa" }],
      engle: 300,
    },
  ];
  const chartConfig = {
    quantity: {
      label: "Already evaluated",
    },
  } satisfies ChartConfig;

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
        <div className="w-full grid grid-cols-2 gap-5">
          {myQuest &&
            myQuest.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Card className="grid grid-cols-2">
                  <CardContent className="p-0  h-auto col-span-2">
                    <CardHeader className="items-start pb-0">
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <div className="w-full flex justify-center">
                      <ChartContainer
                        config={chartConfig}
                        className="aspect-square h-[220px] "
                      >
                        <RadialBarChart
                          data={item.chartData}
                          endAngle={item.engle}
                          innerRadius={80}
                          outerRadius={140}
                        >
                          <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                          />
                          <RadialBar dataKey={"quantity"} background />
                          <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-4xl font-bold"
                                      >
                                        {item.chartData[0].quantity.toLocaleString()}
                                        /70
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                      >
                                        People
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </PolarRadiusAxis>
                        </RadialBarChart>
                      </ChartContainer>
                    </div>
                  </CardContent>
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 text-sm  mx-6 mb-6">
                      {departments.map((item, index) => (
                        <div
                          className="flex justify-between gap-2"
                          key={index + "Letgo"}
                        >
                          <div className="cursor-pointer hover:text-blue-500 transition-all active:scale-95">
                            {item.department_name}
                          </div>
                          <div className="flex items-start gap-1 font-bold">
                            25/32
                            <span>คน</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
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
