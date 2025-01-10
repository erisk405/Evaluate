"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";
export const description = "A radar chart with a custom label";

const chartConfig = {
  evaluated: {
    label: "เสร็จสิ้นแล้ว",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "จากทั้งหมด",
    color: "#BFECFF",
  },
} satisfies ChartConfig;

const RadarChartSection = () => {
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
      className={`rounded-2xl ${styles.text} ${styles.background} border-none shadow`}
    >
      <CardHeader className="items-center pb-4">
        <CardTitle className="">แผนภูมิเรดาร์</CardTitle>
        <CardDescription>
          แสดงจำนวนผู้ประเมินในแต่ละวัน
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="w-full min-h-[260px]">
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
              dataKey="depart"
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData ? chartData[index] : undefined;
                return (
                  <text
                    x={x}
                    y={index === 0 ? y - 10 : y}
                    textAnchor={textAnchor}
                    fontSize={13}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan>{data?.evaluated}</tspan>
                    <tspan className="fill-muted-foreground">/</tspan>
                    <tspan>{data?.total}</tspan>
                    <tspan
                      x={x}
                      dy={"1rem"}
                      fontSize={12}
                      className="fill-muted-foreground"
                    >
                      {data?.depart}
                    </tspan>
                  </text>
                );
              }}
            />
            <PolarGrid />
            <Radar
              dataKey="total"
              fill="var(--color-total)"
              fillOpacity={0.6}
            />
            <Radar dataKey="evaluated" fill="var(--color-evaluated)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RadarChartSection;
