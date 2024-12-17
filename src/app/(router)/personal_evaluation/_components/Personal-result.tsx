"use client";
import React, { useEffect, useState } from "react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalApi from "@/app/_util/GlobalApi";
import {
  formResultsType,
  getResultEvaluateType,
  PeriodType,
} from "@/types/interface";
import { Button } from "@/components/ui/button";
import CategorizedTable from "./categorizedTable";
import OverviewOfResults from "./overview-of-results";

type Personal_resultProp = {
  period: PeriodType;
};

const Personal_result = ({ period }: Personal_resultProp) => {
  const [loading, setLoading] = useState(false);
  const [resultEvaluateDetail, setResultEvaluateDetail] =
    useState<getResultEvaluateType>();

  const fetchResultEvaluateDetail = async () => {
    setLoading(true);
    try {
      if (!period) throw new Error("period not found");

      const response = await GlobalApi.getResultEvaluateDetail(
        period.period_id
      );
      const data = response?.data;
      console.log("data", data);

      if (data) {
        setResultEvaluateDetail(data);
      }
    } catch (error) {
      console.error("Failed to fetch evaluation details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultEvaluateDetail();
  }, []);

  return (
    <div className="mx-auto w-full overflow-auto scrollbar-gemini">
      <div className="mx-auto w-full max-w-xl">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle className="text-xl">
            สรุปผลการประเมินสมรรถนะ 360 องศา <br />
            {resultEvaluateDetail?.headData.evaluatorName}
          </DrawerTitle>
          <DrawerDescription>
            {resultEvaluateDetail?.headData.periodName} สังกัดที่{" "}
            {resultEvaluateDetail?.headData?.department}
          </DrawerDescription>
        </DrawerHeader>
      </div>
      {/* Body of Table */}
      <Tabs defaultValue="all-result" className="w-[full]">
        <div className="flex justify-center items-center">
          <TabsList className="w-auto">
            <TabsTrigger value="all-result">ผลรวมทั้งหมด</TabsTrigger>
            {resultEvaluateDetail?.formResults.map((item) => (
              <TabsTrigger value={`${item.formId}`}>
                {item.formName}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="all-result">
          <OverviewOfResults resultEvaluateDetail={resultEvaluateDetail} />
        </TabsContent>
        {resultEvaluateDetail?.formResults.map((item) => (
          <TabsContent value={`${item.formId}`}>
            <CategorizedTable formResultsItem={item} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Personal_result;
