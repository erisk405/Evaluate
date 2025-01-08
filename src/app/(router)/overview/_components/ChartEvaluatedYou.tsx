import {
  Boxes,
  CalendarClock,
  Cog,
  FolderKanban,
  TrendingUp,
  UserRoundSearch,
} from "lucide-react";
import { color, motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Label, Pie, PieChart } from "recharts";
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
import { useEffect, useMemo } from "react";
import useStore from "@/app/store/store";
import { formatThaiDateTime } from "./RightSection";
import { useThemeStyles } from "@/hooks/useTheme";
import socket from "@/lib/socket";
import { User } from "@/types/interface";
import { toast } from "sonner";

const ChartEvaluatedYou = () => {
  const { resultEvaluate, currentlyEvaluationPeriod, ProfileDetail } =
    useStore();

  const styles = useThemeStyles();
  const chartData = resultEvaluate?.formResults?.map((item) => ({
    form: item.formName,
    result: item.evaluatedPerForm,
    fill: `var(--color-${item.formId})`,
  }));

  const chartConfig: ChartConfig = resultEvaluate?.formResults?.length
    ? Object.fromEntries(
        resultEvaluate?.formResults?.map((item, index) => [
          item.formId,
          {
            label: item.formName,
            color: `hsl(var(--chart-${index + 1}))`,
          },
        ])
      )
    : {
        "default-form": {
          label: "No Data",
          color: "hsl(var(--chart-1))",
        },
      };
  const currentlyEvaluationPeriodThaiFormat = useMemo(() => {
    if (!currentlyEvaluationPeriod) return null;

    const formattedStart = formatThaiDateTime(currentlyEvaluationPeriod?.start);
    const formattedEnd = formatThaiDateTime(currentlyEvaluationPeriod?.end);

    return {
      startDate: formattedStart.date,
      startTime: formattedStart.time,
      endDate: formattedEnd.date,
      endTime: formattedEnd.time,
    };
  }, [currentlyEvaluationPeriod]);
  useEffect(() => {

  }, [ProfileDetail]);
  return (
    <div className={`${styles.text}`}>
      <div className="@container flex w-full justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="cursor-pointer "
        >
          <div className={`hidden @[700px]:flex text-xl  items-center gap-3`}>
            <h2>สำเร็จแล้ว</h2>
            <div className="text-3xl">
              {resultEvaluate?.headData
                ? resultEvaluate?.headData?.totalEvaluated
                : 0}
            </div>
            <h2>คน</h2>
          </div>
        </motion.div>
        <Card
          className={`flex flex-col border-none shadow-none ${styles.background}`}
        >
          <CardHeader className="items-center pb-0">
            <CardTitle>คุณถูกประเมินไปแล้วทั้งหมด</CardTitle>
            <CardDescription>
              {currentlyEvaluationPeriod && (
                <>
                  {currentlyEvaluationPeriodThaiFormat?.startDate} {" - "}
                  {currentlyEvaluationPeriodThaiFormat?.endDate}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 relative pb-0">
            {resultEvaluate && resultEvaluate?.headData?.totalEvaluated > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="result"
                    nameKey="form"
                    innerRadius={60}
                    strokeWidth={5}
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
                                className="fill-foreground text-3xl font-bold"
                              >
                                {resultEvaluate?.headData
                                  ? resultEvaluate?.headData?.totalEvaluated
                                  : 0}{" "}
                                /{" "}
                                {resultEvaluate?.headData
                                  ? resultEvaluate?.headData
                                      ?.totalAssessorsHasPermiss
                                  : 0}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                result
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center">
                <h2 className="text-9xl text-blue-500 font-bold animate-bounce">
                  0
                </h2>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {currentlyEvaluationPeriod?.title}
              <CalendarClock className="h-4 w-4" />
            </div>
            {currentlyEvaluationPeriod && (
              <div>
                {currentlyEvaluationPeriodThaiFormat?.startDate} เวลา{" "}
                {currentlyEvaluationPeriodThaiFormat?.startTime} {" จนถึง "}
                {currentlyEvaluationPeriodThaiFormat?.endDate} เวลา{" "}
                {currentlyEvaluationPeriodThaiFormat?.endTime}
              </div>
            )}
          </CardFooter>
        </Card>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="cursor-pointer"
        >
          <div className="hidden @[700px]:flex text-xl items-center gap-3">
            <h2>จากทั้งหมด</h2>
            <span className="text-3xl">
              {resultEvaluate?.headData
                ? resultEvaluate?.headData?.totalAssessorsHasPermiss
                : 0}
            </span>
            <h2>คน</h2>
          </div>
        </motion.div>
      </div>
      <div className="flex flex-wrap ">
        {resultEvaluate?.formResults?.map((item, index) => (
          <motion.div
            key={item.formId}
            className="flex-1 py-3 px-7 border-r border-t"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="flex items-center gap-3">
              {/* icon ของ form */}
              <div
                className={`p-2 rounded-2xl text-white`}
                style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
              >
                <Boxes />
              </div>
              <h2 className="text-lg font-semibold">{item.formName}</h2>
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex items-end gap-3">
                <h2 className="font-light">
                  <span className="text-xl font-medium">
                    {item.evaluatedPerForm} /{" "}
                  </span>
                  {item.totalAsserPerForm}
                </h2>
                <h2 className="text-[12px] font-bold text-emerald-500">
                  Today
                </h2>
              </div>
              <div className="w-[40px] font-bold">
                <CircularProgressbar
                  value={(item.evaluatedPerForm / item.totalAsserPerForm) * 100}
                  text={`${(
                    (item.evaluatedPerForm / item.totalAsserPerForm) *
                    100
                  ).toFixed(0)}%`}
                  strokeWidth={15}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: `hsl(var(--chart-${index + 1}))`,
                    textSize: "30px",
                    pathTransitionDuration: 0.5,
                    trailColor: "rgb(243 244 246)",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>
            <div className="mt-3">
              <hr />
              <h2 className="text-[12px]  mt-3">1.3% Performance up</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChartEvaluatedYou;
