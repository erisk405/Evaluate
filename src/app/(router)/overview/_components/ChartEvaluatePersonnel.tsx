import useStore from "@/app/store/store";
import React from "react";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import Link from "next/link";
import ChartEvaluatedYou from "./ChartEvaluatedYou";

export const description = "A radial chart with a custom shape";
const ChartEvaluatePersonnel = () => {
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
  ];
  const chartConfig = {
    quantity: {
      label: "Already evaluated",
    },
  } satisfies ChartConfig;
  return (
    <div>
      {myQuest &&
        myQuest.map((item, index) => (
          <div
            key={item.id}
          >
            <Card className="grid grid-cols-2">
              <CardContent className="p-0 h-auto col-span-2">
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
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                      <Link
                        href={`/overview/department/${item.id}`}
                        className="cursor-pointer hover:text-blue-500 transition-all active:scale-95"
                      >
                        {item.department_name}
                      </Link>
                      <div className="flex items-start gap-1 font-bold">
                        25/32
                        <span>คน</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default ChartEvaluatePersonnel;
