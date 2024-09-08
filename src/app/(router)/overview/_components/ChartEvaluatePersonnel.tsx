import useStore from "@/app/store/store";
import React from "react";

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
import Link from "next/link";
import ChartEvaluatedYou from "./ChartEvaluatedYou";
import { TrendingUp } from "lucide-react";

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
    <div className="">
      {myQuest &&
        myQuest.map((item, index) => (
          <div key={item.id}>
            <Card className="grid grid-cols-2 border-none shadow-none">
              <CardHeader className="items-center col-span-2 pb-0">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-auto col-span-2">
                <div className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
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
              <CardFooter className="flex-col gap-2 col-span-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>

            <div className="col-span-2">
              <div className="grid sm:grid-cols-2 gap-4 text-sm  mx-6 mb-6">
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
          </div>
        ))}
    </div>
  );
};

export default ChartEvaluatePersonnel;
