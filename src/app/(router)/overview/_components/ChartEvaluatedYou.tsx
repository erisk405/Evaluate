import {
  Boxes,
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
import { useEffect, useState } from "react";
import useStore from "@/app/store/store";

interface result {
  formId: string;
  formName: string;
  totalAssesPerForm: number;
  amountAssessor: number;
  color: string;
  percentage: number;
  totalAssessors: number;
  icon: React.ReactNode;
}

const ChartEvaluatedYou = () => {
  const [combinedData, setCombinedData] = useState<result[] | undefined>([]);
  const { resultEvaluate } = useStore();

  const evaluateScores = resultEvaluate?.resultData?.evaluateScore;
  const assessorsHasPermiss = resultEvaluate?.resultData?.assessorsHasPermiss;

  const chartData = combinedData?.map((item) => ({
    form: item.formName,
    result: item.amountAssessor ,
    fill: `var(--color-${item.formId})`,
  }));

  const chartConfig: ChartConfig = combinedData?.length
    ? Object.fromEntries(
        combinedData.map((item, index) => [
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

  useEffect(() => {
    // ใช้ในการรวม 2 object เพราะข้อมูล
    const result = assessorsHasPermiss?.map((assessor, index) => {
      // นำข้อมูล formId ของแต่ละ object มาอ้างอิงข้อมูล
      const evaluateScore = evaluateScores?.find(
        (score) => score.formId === assessor.formId
      );
      // ข้อมูลที่ต้องการ
      return {
        formId: assessor.formId,
        formName: assessor.formName,
        totalAssesPerForm: assessor.totalAssesPerForm,
        amountAssessor: evaluateScore ? evaluateScore.amountAssessor : 0,
        color: `hsl(var(--chart-${index + 1}))`,
        icon: <Boxes />,
        totalAssessors: assessor.totalAssessors,
        percentage: evaluateScore
          ? (evaluateScore.amountAssessor / assessor.totalAssesPerForm) * 100
          : 0,
      };
    });
    console.log("result", result);

    setCombinedData(result);
  }, [resultEvaluate]);

  return (
    <div className="">
      <Card className="flex flex-col border-none shadow-none">
        <CardHeader className="items-center pb-0">
          <CardTitle>คุณถูกประเมินไปแล้วทั้งหมด</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
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
                            {resultEvaluate?.headData?.allAssessorEvaluated} /{" "}
                            {combinedData ? combinedData[0].totalAssessors : 0}
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
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total result for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <div className="flex flex-wrap ">
        {combinedData?.map((item, index) => (
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
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <h2 className="text-lg font-semibold">{item.formName}</h2>
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex items-end gap-3">
                <h2 className="font-light">
                  <span className="text-xl font-medium">
                    {item.amountAssessor}/
                  </span>
                  {item.totalAssesPerForm}
                </h2>
                <h2 className="text-[12px] font-bold text-emerald-500">
                  Today
                </h2>
              </div>
              <div className="w-[40px] font-bold">
                <CircularProgressbar
                  value={item.percentage}
                  text={`${item.percentage.toFixed(0)}%`}
                  strokeWidth={15}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: `${item.color}`,
                    textSize: "30px",
                    pathTransitionDuration: 0.5,
                    textColor: "#000000",
                    trailColor: "rgb(243 244 246)",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>
            <div className="mt-3">
              <hr />
              <h2 className="text-[12px] text-neutral-500 mt-3">
                1.3% Performance up
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChartEvaluatedYou;
