"use client";
import useStore from "@/app/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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
import Link from "next/link";
import RadarChartGridFilled from "./RadarChartGridFilled";
import GlobalApi from "@/app/_util/GlobalApi";
import { getCountUserAsEvaluatedType } from "@/types/interface";
import { Combine, ContainerIcon, Package } from "lucide-react";
import Image from "next/image";
import { useThemeStyles } from "@/hooks/useTheme";
export const description = "A radial chart with a custom shape";
const ChartEvaluatePersonnel = () => {
  const styles = useThemeStyles();
  const {
    resultCountUserAsEvaluated,
    setResultCountUserAsEvaluated,
    ProfileDetail,
    currentlyEvaluationPeriod,
  } = useStore();
  const chartData =
    resultCountUserAsEvaluated?.map((item) => ({
      depart: item.department_name,
      finished: item.evaluated,
      total: item.evaluator,
    })) || [];

  const chartConfig = {
    finished: {
      label: "เสร็จแล้ว",
      color: "hsl(var(--chart-1))",
    },
    total: {
      label: "ทั้งหมด",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  const abbreviateDepartment = (departName: string): string => {
    if (departName.length <= 8) {
      return departName;
    } else {
      return `${departName.slice(0, 7)}...`;
    }
  };

  const getCountUserAsEvaluated = async () => {
    try {
      // Add additional checks before making the API call
      if (!currentlyEvaluationPeriod?.period_id) {
        // console.log("Missing required data for fetching result evaluation");
        return;
      }
      const payload = {
        period_id: currentlyEvaluationPeriod.period_id,
      };
      // console.log("payload", payload);

      const response = await GlobalApi.getCountUserAsEvaluated(payload);
      // console.log("getCountUserAsEvaluated", response?.data);
      const sortedData = response?.data.sort(
        (a: getCountUserAsEvaluatedType, b: getCountUserAsEvaluatedType) => {
          // เรียงตามคอลัมน์ที่คุณต้องการ เช่น ชื่อ หรือ ID
          return a.department_id.localeCompare(b.department_id); // ถ้าเรียงตามชId
          // หรือ return a.id - b.id; // ถ้าเรียงตาม ID
        }
      );

      setResultCountUserAsEvaluated(sortedData);
    } catch (error) {
      console.error({ message: error });
    }
  };

  const calculetSummention = (data: number[]) =>
    data.reduce((sum, val) => sum + val, 0) || 0;

  const totalUserInDepart = useMemo(() => {
    const total =
      resultCountUserAsEvaluated?.map((item) => Number(item.evaluator)) || [];
    return calculetSummention(total);
  }, [resultCountUserAsEvaluated]);

  const totalFinish = useMemo(() => {
    const total =
      resultCountUserAsEvaluated?.map((item) => Number(item.evaluated)) || [];
    return calculetSummention(total);
  }, [resultCountUserAsEvaluated]);

  const totalUnfinish = useMemo(() => {
    const total =
      resultCountUserAsEvaluated?.map(
        (item) => Number(item.evaluator) - Number(item.evaluated)
      ) || [];
    return calculetSummention(total);
  }, [resultCountUserAsEvaluated]);

  useEffect(() => {
    getCountUserAsEvaluated();
  }, [currentlyEvaluationPeriod, ProfileDetail]);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className={` ${styles.background} border-none shadow`}>
          <CardHeader>
            <CardTitle className="mb-3">
              บุคคลที่คุณประเมินไปแล้วในแต่ละหน่วยงาน
            </CardTitle>
            <div className="inline-flex justify-around">
              <div className="flex items-center gap-2 p-2 shadow rounded-lg justify-center">
                <Combine strokeWidth={1} className="text-blue-500" />
                <h2 className="text-sm ">ทั้งหมด</h2>
                <h2 className="">{totalUserInDepart}</h2>
              </div>
              <div className="flex items-center gap-2 p-2 shadow rounded-lg  justify-center">
                <Package strokeWidth={1} className="text-green-500" />
                <h2 className="text-sm ">เสร็จสิ้นแล้ว</h2>
                <h2 className="">{totalFinish}</h2>
              </div>
              <div className="flex items-center gap-2 p-2 shadow rounded-lg  justify-center">
                <ContainerIcon strokeWidth={1} className="text-yellow-500" />
                <h2 className="text-sm ">ยังไม่เสร็จ</h2>
                <h2 className="">{totalUnfinish}</h2>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="finished" fill="var(--color-finished)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
                <Bar dataKey="total" fill="var(--color-total)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="">
              <h2 className="text-xl font-bold my-3">คุณประเมินไปแล้ว</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm ">
                {resultCountUserAsEvaluated?.length ? (
                  resultCountUserAsEvaluated?.map((item, index) => (
                    <div key={index + "Letgo"}>
                      <div className="relative flex flex-col shadow items-center p-3 rounded-lg">
                        <Link
                          href={`/overview/department/${item.department_id}`}
                          className="cursor-pointer w-full col-span-2 truncate hover:text-blue-500
                           transition-all active:scale-95"
                        >
                          {item.department_name}
                        </Link>
                        <div className=" flex justify-between px-2 items-center w-full">
                          <div className="inline-flex rounded-lg  mt-1 items-center gap-1 truncate text-blue-500">
                            <h2 className="text-sm ">
                              {item.evaluated}/{item.evaluator}
                            </h2>
                            <span>คน</span>
                          </div>
                          <Image
                            width={30}
                            height={30}
                            src={"/OverviewBannerIcon.png"}
                            alt="OverviewBannerIcon"
                            className="animate-wiggle"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[160px] gap-3 w-full col-span-2">
                    <h2 className="text-xl">ยังไม่ได้อยู่ในรอบการประเมิน</h2>
                    <span className="animate-bounce text-xl">😾</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-1">
          <RadarChartGridFilled />
        </div>
      </div>
    </div>
  );
};

export default ChartEvaluatePersonnel;
