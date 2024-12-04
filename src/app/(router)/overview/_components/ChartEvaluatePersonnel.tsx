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
      const response = await GlobalApi.getCountUserAsEvaluated(payload);
      console.log("getCountUserAsEvaluated", response?.data);
      setResultCountUserAsEvaluated(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  useEffect(() => {
    getCountUserAsEvaluated();
  }, [currentlyEvaluationPeriod]);
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 p-4 gap-3">
        <Card className="col-span-4">
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
                          {/* Add this after the last item */}
                          {index === 1 && (
                            <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                              Total
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                {item.payload.finished +
                                  item.payload.unfinished}
                                <span className="font-normal text-muted-foreground">
                                  คน
                                </span>
                              </div>
                            </div>
                          )}
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
                {resultCountUserAsEvaluated?.map((item, index) => (
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-3">
          <RadarChartGridFilled />
        </div>
      </div>
    </div>
  );
};

export default ChartEvaluatePersonnel;
