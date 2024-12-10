"use client";
import useStore from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import RadarChartGridFilled from "./RadarChartGridFilled";
import GlobalApi from "@/app/_util/GlobalApi";
import { getCountUserAsEvaluatedType } from "@/types/interface";

export const description = "A radial chart with a custom shape";
const ChartEvaluatePersonnel = () => {
  const {
    resultCountUserAsEvaluated,
    setResultCountUserAsEvaluated,
    ProfileDetail,
    currentlyEvaluationPeriod,
  } = useStore();
  const chartData =
    resultCountUserAsEvaluated?.map((item) => ({
      depart: item.department_name,
      finished: item.evaluated,
      unfinished: item.evaluator,
    })) || [];
  const chartConfig = {
    finished: {
      label: "เสร็จแล้ว",
      color: "hsl(var(--chart-1))",
    },
    unfinished: {
      label: "ยังไม่เสร็จ",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  const abbreviateDepartment = (departName: string): string => {
    if (departName.length <= 10) {
      return departName;
    } else {
      return `${departName.slice(0, 10)}...`;
    }
  };

  const getCountUserAsEvaluated = async () => {
    try {
      // Add additional checks before making the API call
      if (!ProfileDetail?.id || !currentlyEvaluationPeriod?.period_id) {
        console.log("Missing required data for fetching result evaluation");
        return;
      }
      const payload = {
        assessor_id: ProfileDetail.id,
        period_id: currentlyEvaluationPeriod.period_id,
      };
      console.log("payload",payload);
      
      const response = await GlobalApi.getCountUserAsEvaluated(payload);
      console.log("getCountUserAsEvaluated", response?.data);
      const sortedData = response?.data.sort(
        (a: getCountUserAsEvaluatedType, b: getCountUserAsEvaluatedType) => {
          // เรียงตามคอลัมน์ที่คุณต้องการ เช่น ชื่อ หรือ ID
          return a.department_id.localeCompare(b.department_id); // ถ้าเรียงตามชId
          // หรือ return a.id - b.id; // ถ้าเรียงตาม ID
        }
      );
      
      setResultCountUserAsEvaluated(sortedData);
    } catch (error) {
      console.error({ message: error });
    }
  };
  useEffect(() => {
    getCountUserAsEvaluated();
  }, [currentlyEvaluationPeriod, ProfileDetail]);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>รูปแบบของ Bar Chart </CardTitle>
            <div className="grid grid-cols-3">
              <div className="flex flex-col justify-center">
                <h2 className="text-sm">ทั้งหมด</h2>
                <h2 className="font-bold">4268</h2>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-sm">เสร็จสิ้นแล้ว</h2>
                <h2 className="font-bold">215</h2>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-sm">ยังไม่เสร็จ</h2>
                <h2 className="font-bold">4020</h2>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <XAxis
                  dataKey="depart"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={abbreviateDepartment}
                />
                <Bar
                  dataKey="finished"
                  stackId="a"
                  fill="var(--color-finished)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="unfinished"
                  stackId="a"
                  fill="var(--color-unfinished)"
                  radius={[20, 20, 0, 0]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[180px]"
                      formatter={(value, name, item, index) => (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                            style={
                              {
                                "--color-bg": `var(--color-${name})`,
                              } as React.CSSProperties
                            }
                          />
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {value}
                            <span className="font-normal text-muted-foreground">
                              คน
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                  cursor={false}
                  defaultIndex={1}
                />
              </BarChart>
            </ChartContainer>

            <div className="">
              <h2 className="text-xl font-bold my-3">คุณประเมินไปแล้ว</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm ">
                {resultCountUserAsEvaluated?.length ? (
                  resultCountUserAsEvaluated?.map((item, index) => (
                    <div key={index + "Letgo"}>
                      <div className="grid grid-cols-3 items-center gap-2 border p-3 rounded-full">
                        <Link
                          href={`/overview/department/${item.department_id}`}
                          className="cursor-pointer w-full border-r col-span-2 truncate hover:text-blue-500 transition-all active:scale-95"
                        >
                          {item.department_name}
                        </Link>
                        <div className="col-span-1 flex justify-center gap-2 truncate font-bold text-blue-500">
                          <h2>
                            {item.evaluated}/{item.evaluator}
                          </h2>
                          <span>คน</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[160px] gap-3 w-full col-span-2">
                    <h2 className="text-xl">ยังไม่ได้อยู่ในรอบการประเมิน</h2>
                    <span className="animate-bounce text-xl">😾</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-1">
          <RadarChartGridFilled />
        </div>
      </div>
    </div>
  );
};

export default ChartEvaluatePersonnel;
