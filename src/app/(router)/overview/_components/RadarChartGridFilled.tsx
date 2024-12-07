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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStore from "@/app/store/store";
import { useMemo } from "react";
const RadarChartGridFilled = () => {
  const { resultEvaluate } = useStore();

  const chartData = resultEvaluate?.formResults?.map((item) => ({
    form: item.formName,
    F01: item.totalAVGPerForm,
  })) || [
    {
      form: "form",
      F01: 0,
    },
    {
      form: "form2",
      F01: 0,
    },
    {
      form: "form3",
      F01: 0,
    },
  ];
  const chartConfig = {
    F01: {
      label: "ค่าเฉลี่ย",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const abbreviateForm = (formname: string): string => {
    if (formname.length <= 10) {
      return formname;
    } else {
      return `${formname.slice(0, 10)}...`;
    }
  };
  // ฟังก์ชันสำหรับคำนวณค่าเฉลี่ย
  const calculateAverage = (data: number[]) =>
    data.reduce((sum, val) => sum + val, 0) / data.length || 0;
  // คำนวณค่าเฉลี่ย`item.average` และ `item.SD`
  // บันทึกค่า" ที่คำนวณไว้แล้ว (memoize) และจะคำนวณค่าใหม่เฉพาะเมื่อค่าที่ใช้ใน dependency array เปลี่ยนแปลงเท่านั้น
  const totalAverage = useMemo(() => {
    const averages =
      resultEvaluate?.formResults?.map((item) =>
        Number(item.totalAVGPerForm)
      ) || [];
    return calculateAverage(averages);
  }, [resultEvaluate]);
  const totalAverageSD = useMemo(() => {
    const averages =
      resultEvaluate?.formResults?.map((item) => Number(item.totalSDPerForm)) ||
      [];
    return calculateAverage(averages);
  }, [resultEvaluate]);

  return (
    resultEvaluate && (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>ผลการประเมินในขณะนี้</CardTitle>
          <CardDescription>
            Showing total visitors for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarGrid className="fill-[--color-F01] opacity-20" />
              <PolarAngleAxis dataKey="form" tickFormatter={abbreviateForm} />
              <Radar dataKey="F01" fill="var(--color-F01)" fillOpacity={0.5} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            January - June 2024
          </div>
        </CardFooter>

        <div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-auto truncate">
                  ด้านในการประเมิน
                </TableHead>
                <TableHead className="text-end truncate">
                  ส่วนเบี่ยงเบน
                </TableHead>
                <TableHead className="text-end truncate">ค่าเฉลี่ย</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultEvaluate?.formResults &&
                resultEvaluate?.formResults.map((item) => (
                  <TableRow key={item.formId}>
                    <TableCell className="font-medium truncate">
                      <span>{item.formName}</span>
                    </TableCell>
                    <TableCell className="text-end truncate">
                      {item.totalSDPerForm}
                    </TableCell>
                    <TableCell className="text-end truncate">
                      {item.totalAVGPerForm.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right font-bold text-blue-500 text-lg">
                  {totalAverageSD.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold text-green-500 text-lg">
                  {totalAverage.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    )
  );
};

export default RadarChartGridFilled;
