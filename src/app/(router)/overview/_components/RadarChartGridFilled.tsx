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
const formDatail = [
  {
    id: "INV001",
    name: "ความรู้เชิงวิชาการ",
    avg: "4.44",
    SD: "5.54",
  },
  {
    id: "INV002",
    name: "ทักษะการปฏิบัติงาน",
    avg: "11.54",
    SD: "9.84",
  },
  {
    id: "INV003",
    name: "จิตพิสัย",
    avg: "8.34",
    SD: "7.24",
  },
];
const RadarChartGridFilled = () => {
  const abbreviateForm = (formname: string): string => {
    if (formname.length <= 10) {
      return formname;
    } else {
      return `${formname.slice(0, 10)}...`;
    }
  };
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
            <TableRow >
              <TableHead className="w-auto truncate">
                ด้านในการประเมิน
              </TableHead>
              <TableHead className="text-end truncate">ส่วนเบี่ยงเบน</TableHead>
              <TableHead className="text-end truncate">ค่าเฉลี่ย</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formDatail.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium truncate">
                  <span>{item.name}</span>
                </TableCell>
                <TableCell className="text-end truncate">{item.avg}</TableCell>
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
