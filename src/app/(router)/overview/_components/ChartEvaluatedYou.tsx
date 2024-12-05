import { Cog, FolderKanban, TrendingUp, UserRoundSearch } from "lucide-react";
import { motion } from "framer-motion";
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
import { useMemo, useState } from "react";
import useStore from "@/app/store/store";

interface Score {
  id: string;
  name: string;
  now: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  state: any;
}

const ChartEvaluatedYou = () => {
  const [Academicknowledge, setAcademicknowledge] = useState(61);
  const [OperationalSkills, setOperationalSkills] = useState(34);
  const [AffectiveDomain, setAffectiveDomain] = useState(50);
  const { resultEvaluate } = useStore();

 
  
  const chartData =
    resultEvaluate?.resultData?.assessorsHasPermiss?.map((item) => ({
      form: item.formName,
      result: item.totalAssesPerForm,
      fill: "var(--color-" + item.formId + ")",
    })) || [];

  // Fixed chartConfig2 with correct type
  const chartConfig: ChartConfig = resultEvaluate?.resultData?.assessorsHasPermiss
    ? Object.fromEntries(
        resultEvaluate.resultData.assessorsHasPermiss.map((item) => [
          item.formId,
          {
            label: item.formName,
            color: `hsl(var(--chart-${item.formId+1}))`,
          },
        ])
      )
    : {} satisfies ChartConfig;

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.result, 0);
  }, []);

  let myscore: Score[] = [
    {
      id: "AT01",
      name: "ทักษะการปฎิบัติงาน",
      now: 10,
      total: 39,
      icon: <UserRoundSearch />,
      color: "hsl(var(--chart-1))",
      state: Academicknowledge,
    },
    {
      id: "AT02",
      name: "ความรู้เชิงวิขาการ",
      now: 14,
      total: 54,
      icon: <FolderKanban />,
      color: "hsl(var(--chart-2))",
      state: OperationalSkills,
    },
    {
      id: "AT03",
      name: "จิตพิสัย",
      now: 64,
      total: 72,
      icon: <Cog />,
      color: "hsl(var(--chart-3))",
      state: AffectiveDomain,
    },
  ];

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
                            {totalVisitors.toLocaleString()} / 50
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
      <div className="flex flex-wrap gap-3">
        {myscore.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex-1 py-3 px-7"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-2xl text-white`}
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
            </div>
            <div className="flex items-center justify-between gap-3 mt-2">
              <div className="flex items-end gap-3">
                <h2 className="font-light">
                  <span className="text-xl font-medium">{item.now}/</span>
                  {item.total}
                </h2>
                <h2 className="text-[12px] font-bold text-emerald-500">
                  Today
                </h2>
              </div>
              <div className="w-[40px] font-bold">
                <CircularProgressbar
                  value={item.state}
                  text={`${item.state}%`}
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