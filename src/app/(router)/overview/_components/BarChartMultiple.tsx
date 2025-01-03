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
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";
export const description = "A multiple bar chart";

const chartConfig = {
  evaluated: {
    label: "เสร็จสิ้นแล้ว",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "จากทั้งหมด",
    color: "#BFECFF",
  },
} satisfies ChartConfig;

const BarChartMultiple = () => {
  const { resultEvalEachDepartment } = useStore();
  const styles = useThemeStyles();
  const chartData = resultEvalEachDepartment?.map((result) => ({
    depart: result.department,
    evaluated: result.totalFinished,
    total: result.totalUsers,
  }));
  const abbreviateDepartment = (departName: string): string => {
    if (departName.length <= 10) {
      return departName;
    } else {
      return `${departName.slice(0, 10)}...`;
    }
  };
  return (
    <Card
      className={`rounded-2xl ${styles.text}`}
    >
      <CardHeader>
        <CardTitle>จำนวนผู้ประเมินในแต่ละวัน</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] mx-auto">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="depart"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={abbreviateDepartment}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="evaluated"
              fill="var(--color-evaluated)"
              radius={20}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartMultiple;
