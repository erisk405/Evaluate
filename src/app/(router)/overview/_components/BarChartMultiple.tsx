"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A multiple bar chart";
const chartData = [
  { week: "Sunday", evaluated: 186, evaluate: 80 },
  { week: "Monday", evaluated: 305, evaluate: 200 },
  { week: "Tuesday", evaluated: 237, evaluate: 120 },
  { week: "Wednesday", evaluated: 73, evaluate: 190 },
  { week: "Thursday", evaluated: 209, evaluate: 130 },
  { week: "Friday", evaluated: 214, evaluate: 140 },
  { week: "Saturday", evaluated: 214, evaluate: 140 },
];
const chartConfig = {
  evaluated: {
    label: "evaluated",
    color: "hsl(var(--chart-2))",
  },
  evaluate: {
    label: "evaluate",
    color: "#BFECFF",
  },
} satisfies ChartConfig;

const BarChartMultiple = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>จำนวนผู้ประเมินในแต่ละวัน</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig} className="max-h-[300px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="evaluated" fill="var(--color-evaluated)" radius={4} />
            <Bar dataKey="evaluate" fill="var(--color-evaluate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartMultiple;
