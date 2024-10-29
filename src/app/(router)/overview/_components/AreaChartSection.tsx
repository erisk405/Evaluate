"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "An area chart with gradient fill";
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
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const AreaChartSection = () => {
  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between">
          <h2>
            ในรูปแบบของ <span className="font-bold">Area Chart</span>
          </h2>
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillEvaluated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-evaluated)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-evaluated)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEvaluate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-evaluate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-evaluate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="evaluate"
              type="natural"
              fill="url(#fillEvaluate)"
              fillOpacity={0.4}
              stroke="var(--color-evaluate)"
              stackId="a"
            />
            <Area
              dataKey="evaluated"
              type="natural"
              fill="url(#fillEvaluated)"
              fillOpacity={0.4}
              stroke="var(--color-evaluated)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AreaChartSection;
