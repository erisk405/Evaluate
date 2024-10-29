"use client";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
export const description = "A radar chart with a custom label";
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
    color: "hsl(var(--chart-1))",
  },
  evaluate: {
    label: "evaluate",
    color: "#BFECFF",
  },
} satisfies ChartConfig;

const RadarChartSection = () => {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="week"
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData[index];
                return (
                  <text
                    x={x}
                    y={index === 0 ? y - 10 : y}
                    textAnchor={textAnchor}
                    fontSize={13}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan>{data.evaluated}</tspan>
                    <tspan className="fill-muted-foreground">/</tspan>
                    <tspan>{data.evaluate}</tspan>
                    <tspan
                      x={x}
                      dy={"1rem"}
                      fontSize={12}
                      className="fill-muted-foreground"
                    >
                      {data.week}
                    </tspan>
                  </text>
                );
              }}
            />
            <PolarGrid />
            <Radar
              dataKey="evaluated"
              fill="var(--color-evaluated)"
              fillOpacity={0.6}
            />
            <Radar dataKey="evaluate" fill="var(--color-evaluate)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RadarChartSection;
