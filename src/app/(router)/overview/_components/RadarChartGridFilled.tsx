"use client";
import { CalendarClock, TrendingUp } from "lucide-react";
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
import { formatThaiDateTime } from "./RightSection";
import { useThemeStyles } from "@/hooks/useTheme";
const RadarChartGridFilled = () => {
  const { resultEvaluate, currentlyEvaluationPeriod, ProfileDetail } =
    useStore();

  const styles = useThemeStyles();
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

  return (
    <Card className={`${styles.background} border-none shadow`}>
      <CardHeader className="items-center pb-4">
        <CardTitle>ผลการประเมินในขณะนี้</CardTitle>
        <CardDescription>
          แสดงผลรวมทั้งหมดในแต่ละด้านภายในระยะเวลาของรอบการประเมิน
        </CardDescription>
      </CardHeader>
      {ProfileDetail.role?.role_name === "member" ? (
        <div className="flex flex-col items-center justify-center p-4 h-80">
          <h2 className="text-6xl animate-wiggle-float">🕯️</h2>
          <h2 className="text-2xl text-center">
            หากยังไม่ได้ระบุตำแหน่งงาน
            <br /> จะไม่สามารถดำเนินการประเมินได้
          </h2>
        </div>
      ) : (
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
      )}
      {ProfileDetail.role?.role_name !== "member" && (
        <>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {currentlyEvaluationPeriod ? (
                <div className="flex items-center gap-2">
                  {currentlyEvaluationPeriod?.title}
                  <CalendarClock className="h-4 w-4" />
                </div>
              ) : (
                <div className="text-xl animate-bounce">☃️</div>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {currentlyEvaluationPeriod && (
                <div>
                  {formatThaiDateTime(currentlyEvaluationPeriod?.start).date}{" "}
                  เวลา{" "}
                  {formatThaiDateTime(currentlyEvaluationPeriod?.start).time}{" "}
                  {" จนถึง "}
                  {
                    formatThaiDateTime(currentlyEvaluationPeriod?.end).date
                  } เวลา{" "}
                  {formatThaiDateTime(currentlyEvaluationPeriod?.end).time}
                </div>
              )}
            </div>
          </CardFooter>
          <div className="border-t">
            <Table>
              <TableCaption>
                ตารางนี้จะแสดงเพียงภาพรวมของผลการประเมิน ณ ขณะนั้น.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto truncate">
                    ด้านในการประเมิน
                  </TableHead>
                  <TableHead className="text-center truncate">
                    ส่วนเบี่ยงเบน(SD.)
                  </TableHead>
                  <TableHead className="text-center truncate">
                    ค่าเฉลี่ย(AVG)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultEvaluate?.formResults &&
                  resultEvaluate?.formResults.map((item) => (
                    <TableRow key={item.formId}>
                      <TableCell className="font-medium truncate">
                        <span>{item.formName}</span>
                      </TableCell>
                      <TableCell className="text-center truncate">
                        {item.totalSDPerForm.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center truncate">
                        {item.totalAVGPerForm?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>รวมทั้งหมด</TableCell>
                  <TableCell className="text-center text-blue-500 text-[16px]">
                    {resultEvaluate?.headData.totalSD.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center text-fuchsia-700 text-[16px]">
                    {resultEvaluate?.headData.totalAVG.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </>
      )}
    </Card>
  );
};

export default RadarChartGridFilled;
