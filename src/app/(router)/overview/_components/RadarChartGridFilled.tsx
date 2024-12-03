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
import { useEffect, useState } from "react";
import GlobalApi from "@/app/_util/GlobalApi";
import { getResultEvaluateType } from "@/types/interface";
const chartData = [
  { form: "ความรู้เชิงวิชาการ", F01: 186 },
  { form: "ทักษะการปฏิบัติงาน", F01: 285 },
  { form: "จิตพิสัย", F01: 237 },
];
const chartConfig = {
  F01: {
    label: "จากผู้ใช้งานอื่น",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
const RadarChartGridFilled = () => {
  const {
    setResultEvaluate,
    resultEvaluate,
    ProfileDetail,
    currentlyEvaluationPeriod,
  } = useStore();

  const fetchResultEval = async () => {
    try {
      // Add additional checks before making the API call
      if (!ProfileDetail?.id || !currentlyEvaluationPeriod?.period_id) {
        console.log("Missing required data for fetching result evaluation");
        return;
      }
      const payload = {
        evaluator_id: ProfileDetail.id,
        period_id: currentlyEvaluationPeriod.period_id,
      };
      const response = await GlobalApi.getResultEvaluate(payload);
      setResultEvaluate(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  const abbreviateForm = (formname: string): string => {
    if (formname.length <= 10) {
      return formname;
    } else {
      return `${formname.slice(0, 10)}...`;
    }
  };

  useEffect(() => {
    console.log("resultEvaluate", resultEvaluate);
  }, [resultEvaluate]);
  useEffect(() => {
    fetchResultEval();
  }, [currentlyEvaluationPeriod]);
  return (
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
          className="mx-auto aspect-square max-h-[250px]"
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
              <TableHead className="text-end truncate">ส่วนเบี่ยงเบน</TableHead>
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
                    {item.average}
                  </TableCell>
                  <TableCell className="text-end truncate">{item.SD}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">2.27</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
};

export default RadarChartGridFilled;
