"use client";
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
export const description = "A donut chart with text";
const chartData = [
  { browser: "chrome", visitors: 5, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 10, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 19, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 13, fill: "var(--color-edge)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "rgb(59 130 246)",
  },
  safari: {
    label: "Safari",
    color: "rgb(37 99 235)",
  },
  firefox: {
    label: "Firefox",
    color: "rgb(147 197 253)",
  },
  edge: {
    label: "Edge",
    color: "rgb(29 78 216)",
  },
} satisfies ChartConfig;

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
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  let myscore: Score[] = [
    {
      id: "AT01",
      name: "ทักษะการปฎิบัติงาน",
      now: 10,
      total: 39,
      icon: <UserRoundSearch />,
      color: "#22c55e",
      state: Academicknowledge,
    },
    {
      id: "AT02",
      name: "ความรู้เชิงวิขาการ",
      now: 14,
      total: 54,
      icon: <FolderKanban />,
      color: "#3b82f6",
      state: OperationalSkills,
    },
    {
      id: "AT03",
      name: "จิตพิสัย",
      now: 64,
      total: 72,
      icon: <Cog />,
      color: "#06B6D4",
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
                dataKey="visitors"
                nameKey="browser"
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
                            Visitors
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
            Showing total visitors for the last 6 months
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
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: "butt",
                    pathColor: `${item.color}`,
                    // Text size
                    textSize: "30px",
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',
                    // Colors
                    textColor: "#000000",
                    trailColor: "#D1ECEC",
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
