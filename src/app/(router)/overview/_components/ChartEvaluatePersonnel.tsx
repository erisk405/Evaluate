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
import { PeriodType } from "@/types/interface";


export const description = "A radial chart with a custom shape";
const ChartEvaluatePersonnel = () => {
  const { departments } = useStore();

  const [result, setResult] = useState();
  const { ProfileDetail } = useStore();
  const fetchResultEval = async () => {
    try {
      const payload = {
        evaluator_id: ProfileDetail.id!,
        // period_id: period[0].period_id!,
      };
      // const response = await GlobalApi.getResultEvaluate(payload)
      // console.log("response", response);
    } catch (error) {
      console.error({ message: error });
    }
  };
  const chartData = [
    { depart: "งานพัฒนาวิชาการ", finished: 450, unfinished: 300 },
    { depart: "งานทะเบียนและประมวลผล", finished: 380, unfinished: 420 },
    {
      depart: "งานฝึกประสบการณ์วิชาชีพนักศึกษา",
      finished: 520,
      unfinished: 120,
    },
    { depart: "งานประกันคุณภาพและประเมินผล", finished: 140, unfinished: 550 },
    { depart: "งานบริหารงานทั่วไป", finished: 600, unfinished: 350 },
    { depart: "สำนักงานผู้อำนวยการ", finished: 480, unfinished: 400 },
  ];
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
  const myQuest = [
    {
      id: "AOU01",
      name: "คุณประเมินไปแล้ว",
      chartData: [
        { browser: "alreadyEvaluated", quantity: 40, fill: "#9bf6ff" },
      ],
      engle: 200,
    },
  ];
  const abbreviateDepartment = (departName: string): string => {
    if (departName.length <= 8) {
      return departName;
    } else {
      return `${departName.slice(0, 5)}...`;
    }
  };

  useEffect(() => {
    fetchResultEval();
  }, []);
  return (
    <div className="w-full">
      {myQuest &&
        myQuest.map((item, index) => (
          <div key={item.id} className="grid grid-cols-7 p-4 gap-3">
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
                      radius={[0, 0, 8, 8]}
                    />
                    <Bar
                      dataKey="unfinished"
                      stackId="a"
                      fill="var(--color-unfinished)"
                      radius={[14, 14, 0, 0]}
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
                    {departments.map((item, index) => (
                      <div key={index + "Letgo"}>
                        <div className="grid grid-cols-3 items-center gap-2 border p-3 rounded-full">
                          <Link
                            href={`/overview/department/${item.id}`}
                            className="cursor-pointer w-full border-r col-span-2 truncate hover:text-blue-500 transition-all active:scale-95"
                          >
                            {item.department_name}
                          </Link>
                          <div className="col-span-1 text-end truncate gap-1 font-bold">
                            25/32
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
        ))}
    </div>
  );
};

export default ChartEvaluatePersonnel;
