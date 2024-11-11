"use client";
import useStore from "@/app/store/store";
import React from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export const description = "A radial chart with a custom shape";
const ChartEvaluatePersonnel = () => {
  const { departments } = useStore();

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
      return `${departName.slice(0, 8)}...`;
    }
  };
  return (
    <div className="w-full">
      {myQuest &&
        myQuest.map((item, index) => (
          <div key={item.id} className="grid grid-cols-3 p-4 items-center gap-3">
            <div className="col-span-1">
              <div className="grid sm:grid-cols-1 gap-4 text-sm ">
                {departments.map((item, index) => (
                  <div
                    className="grid grid-cols-3 items-center gap-2 border p-3 rounded-full"
                    key={index + "Letgo"}
                  >
                    <Link
                      href={`/overview/department/${item.id}`}
                      className="cursor-pointer w-full border-r col-span-2 truncate hover:text-blue-500 transition-all active:scale-95"
                    >
                      {item.department_name}
                    </Link>
                    <div className="col-span-1 text-end gap-1 font-bold">
                      25/32
                      <span>คน</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Tooltip - Advanced</CardTitle>
                <CardDescription>
                  Tooltip with custom formatter and total.
                </CardDescription>
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
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="unfinished"
                      stackId="a"
                      fill="var(--color-unfinished)"
                      radius={[4, 4, 0, 0]}
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
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default ChartEvaluatePersonnel;
