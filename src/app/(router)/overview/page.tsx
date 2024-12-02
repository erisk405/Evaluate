"use client";
import React, { useEffect, useState } from "react";
import MyEvaluated from "./_components/MyEvaluated";
import RightSection from "./_components/RightSection";
import GlobalApi from "@/app/_util/GlobalApi";
import ReportOverview from "./_components/ReportOverview";
import Loading from "@/app/_components/Loading";
import { PeriodType } from "@/types/interface";
import useStore from "@/app/store/store";
const page = () => {
  const [checkPermission, setCheckPermission] = useState(null); // ใช้ในการcheckว่า คนนี้เป็น admin หรือ user เพื่อใช้ในการแสดงInterface ต่างๆ
  const { currentlyEvaluationPeriod, fetchCurrentPeriod } = useStore();
  const [period, setPeriod] = useState<PeriodType[]>([]);

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await GlobalApi.fetchProtected();
        console.log(response?.data?.role);

        setCheckPermission(response?.data?.role);
      } catch (error) {
        console.error({ message: error });
      }
    };
    fetchProtected();
    const initializePeriod = async () => {
      try {
        const fetchedPeriods = await fetchCurrentPeriod();
        setPeriod(fetchedPeriods);
      } catch (error) {
        // Handle error (e.g., show error message)
      }
    };
    initializePeriod();
  }, []);

  if (checkPermission === null) {
    return <Loading />;
  }

  if (checkPermission === "error") {
    return <div>Error fetching permission data.</div>;
  }
  return (
    <div className="m-5 grid grid-cols-6 gap-5 w-full">
      <div className="xl:col-span-4 col-span-6 w-full">
        <h2 className="text-3xl font-bold text-stone-700">Overview</h2>
        {checkPermission && checkPermission !== "admin" ? (
          <MyEvaluated />
        ) : (
          <ReportOverview />
        )}
      </div>
      <div className="xl:col-span-2 col-span-6 w-full">
        <RightSection
          permission={checkPermission}
          period={period}
          setPeriod={setPeriod}
        />
      </div>
    </div>
  );
};

export default page;
