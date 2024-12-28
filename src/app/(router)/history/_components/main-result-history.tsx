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
  historyResult,
  PeriodType,
} from "@/types/interface";
import Loading from "@/app/_components/Loading";
import OverviewHistoryResult from "./overview-history-result";
import CategorizedHistoryTable from "./categorized-history-table";

type MainResultHistoryProp = {
  period: PeriodType;
  userId: string;
};
const MainResultHistory = ({ period, userId }: MainResultHistoryProp) => {
  const [loading, setLoading] = useState(false);
  const [resultHistoryDetail, setResultHistoryDetail] =
    useState<historyResult>();
  
  useEffect(() => {
    const getResultEvaluateFormHistory = async () => {
      try {
        if (!period) throw new Error("period not found");

        if (!userId) {
          const response = await GlobalApi.getResultEvaluateFormHistory(
            period.period_id
          );
          // console.log("HistoryResult", response?.data);
          setResultHistoryDetail(response?.data);
        } else {
          const response = await GlobalApi.getResultEvaluateFormHistoryForAdmin(
            period.period_id,
            userId
          );
          const data = response?.data;
          // console.log("data for admin", data);
          if (data) {
            setResultHistoryDetail(data);
          }
        }
      } catch (error) {
        console.log({ message: error });
      }
    };
    getResultEvaluateFormHistory();
  }, []);
  return (
    <div className="mx-auto w-full overflow-auto scrollbar-gemini">
      <div className="mx-auto w-full max-w-xl">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle className="text-xl">
            สรุปผลการประเมินสมรรถนะ 360 องศา <br />
            {resultHistoryDetail?.headData?.userName}
          </DrawerTitle>
          <DrawerDescription>
            {resultHistoryDetail?.headData?.periodName} สังกัดที่{" "}
            {resultHistoryDetail?.headData?.department}
          </DrawerDescription>
        </DrawerHeader>
      </div>
      {/* Body of Table */}
      <Tabs defaultValue="all-result" className="w-full">
        <div className="flex justify-center items-center">
          <TabsList className="w-auto">
            <TabsTrigger value="all-result">ผลรวมทั้งหมด</TabsTrigger>
            {resultHistoryDetail?.formResults.map((item, index) => (
              <TabsTrigger value={`${item.detailId}`} key={index + "trigger"}>
                {item.formName}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="all-result">
          <OverviewHistoryResult resultHistoryDetail={resultHistoryDetail} />
        </TabsContent>
        {resultHistoryDetail?.formResults.map((item, index) => (
          <TabsContent value={`${item.detailId}`} key={index + "tabsContent"}>
            <CategorizedHistoryTable formHistoryResultsItem={item} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MainResultHistory;
