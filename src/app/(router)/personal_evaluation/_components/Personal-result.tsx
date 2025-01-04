"use client";
import React, { useEffect, useState } from "react";
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalApi from "@/app/_util/GlobalApi";
import { getResultEvaluateType, PeriodType } from "@/types/interface";
import CategorizedTable from "./categorizedTable";
import OverviewOfResults from "./overview-of-results";
import Loading from "@/app/_components/Loading";
import IndividualOverview from "./individual-overview";
import useStore from "@/app/store/store";

type Personal_resultProp = {
  period: PeriodType;
  userId?: string;
};

const Personal_result = ({ period, userId }: Personal_resultProp) => {
  const [loading, setLoading] = useState(false);
  const [resultEvaluateDetail, setResultEvaluateDetail] =
    useState<getResultEvaluateType>();
  const { ProfileDetail } = useStore();

  const fetchResultEvaluateDetail = async () => {
    setLoading(true);
    try {
      if (!period) throw new Error("period not found");

      if (!userId) {
        const response = await GlobalApi.getResultEvaluateDetail(
          period.period_id
        );
        const data = response?.data;
        // console.log("data", data);
        if (data) {
          setResultEvaluateDetail(data);
        }
      } else {
        const response = await GlobalApi.getResultEvaluateDetailForAdmin(
          period.period_id,
          userId
        );
        const data = response?.data;
        console.log("data for admin", data);
        if (data) {
          setResultEvaluateDetail(data);
        }
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
  if (resultEvaluateDetail === null) {
    return <Loading />;
  }

  return resultEvaluateDetail ? (
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
      <Tabs defaultValue="all-result" className="w-full">
        <div className="flex justify-center items-center">
          <TabsList className="w-auto">
            <TabsTrigger value="all-result">ผลรวมทั้งหมด</TabsTrigger>
            {resultEvaluateDetail?.formResults.map((item, index) => (
              <TabsTrigger value={`${item.formId}`} key={index + "trigger"}>
                {item.formName}
              </TabsTrigger>
            ))}
            {(["LEVEL_2", "LEVEL_3", "LEVEL_4"].includes(
              ProfileDetail.role?.role_level || ""
            ) ||
              ProfileDetail.role?.role_name === "admin") && (
              <TabsTrigger value="individual-overview">
                ภาพรวมของแต่ละบุคคล
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        <TabsContent value="all-result">
          <OverviewOfResults resultEvaluateDetail={resultEvaluateDetail} />
        </TabsContent>
        {resultEvaluateDetail?.formResults.map((item, index) => (
          <TabsContent value={`${item.formId}`} key={index + "tabsContent"}>
            <CategorizedTable formResultsItem={item} />
          </TabsContent>
        ))}
        {(["LEVEL_2", "LEVEL_3", "LEVEL_4"].includes(
          ProfileDetail.role?.role_level || ""
        ) ||
          ProfileDetail.role?.role_name === "admin") && (
          <TabsContent value="individual-overview">
            <IndividualOverview period={period} userId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  ) : (
    <div className="mx-auto w-full  overflow-auto scrollbar-gemini">
      <div className="mx-auto w-full max-w-xl ">
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle className="text-xl"></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col w-full h-[540px] items-center justify-center ">
          <h2 className="text-9xl animate-wiggle-float">😿</h2>
          <p className="text-3xl mt-20 text-orange-500">
            ไม่พบผลการประเมินในรอบการประเมินนี้
          </p>
        </div>
      </div>
    </div>
  );
};

export default Personal_result;
