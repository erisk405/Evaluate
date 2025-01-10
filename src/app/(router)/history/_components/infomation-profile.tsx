"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { Separator } from "@/components/ui/separator";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import { Dot } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

const InfomationProfile = () => {
  const {
    ProfileDetail,
    resultEvaluate,
    currentlyEvaluationPeriod,
    setResultEvaluate,
  } = useStore();
  const styles = useThemeStyles();
  const fetchResultEvaluate = async () => {
    try {
      if (!ProfileDetail?.id || !currentlyEvaluationPeriod?.period_id) {
        console.log("Missing required data for fetching result evaluation");
        return;
      }
      const payload = {
        period_id: currentlyEvaluationPeriod.period_id,
      };
      const response = await GlobalApi.getResultEvaluate(payload);
      console.log("response", response?.data);

      setResultEvaluate(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  const { getThemeClass } = useThemeClass();
  useEffect(() => {
    if (!resultEvaluate) {
      fetchResultEvaluate();
    }
  }, [ProfileDetail?.id, currentlyEvaluationPeriod?.period_id]);
  return (
    <div className={`p-3 `}>
      <div className="relative h-32 shadow rounded-xl">
        <Image
          src={"/bannerInfo.jpg"}
          width={800}
          height={800}
          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full object-cover z-20 rounded-xl"
          alt="BannerInfo"
        />
        <Image
          src={
            ProfileDetail.image ? ProfileDetail.image.url : "/profiletest.jpg"
          }
          width={100}
          height={100}
          className="absolute left-3 -bottom-1/2 -translate-y-1/2 rounded-full w-[60px] h-[60px] object-cover z-50 border-2"
          alt="Info Profile"
        />
      </div>
      <div className="mt-10">
        <h2>
          <span>{ProfileDetail.prefix?.prefix_name}</span>
          {ProfileDetail.name}
        </h2>
        <p className="text-sm text-gray-500">{ProfileDetail.role?.role_name}</p>
        <div
          className={getThemeClass(
            {
              light: "bg-neutral-100",
              dark: "bg-neutral-950",
            },
            `rounded-xl p-3`
          )}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">🏬</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">สังกัดอยู่ที่</p>
              <h2 className="text-sm">
                {ProfileDetail.department?.department_name}
              </h2>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">📧</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">สังกัดอยู่ที่</p>
              <h2 className="text-sm">{ProfileDetail.email}</h2>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">📱</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
              <h2 className="text-sm">0906652652</h2>
            </div>
          </div>
        </div>
        <div className="relative mt-3">
          <h2 className={`${styles.text_description} text-sm`}>
            ภาพรวม ณ ช่วงเวลาปัจจุบัน
          </h2>
          {currentlyEvaluationPeriod ? (
            <div className="flex items-center">
              <Dot
                strokeWidth={6}
                className="absolute text-emerald-500 animate-ping"
              />
              <Dot strokeWidth={6} className="text-emerald-500" />
              <h2 className="text-sm">{currentlyEvaluationPeriod?.title}</h2>
            </div>
          ) : (
            <h2 className="text-sm text-yellow-500">
              ยังไม่ได้อยู่ในช่วงเวลาประเมินผล
            </h2>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 my-3">
          {resultEvaluate &&
            resultEvaluate?.formResults.map((item) => (
              <div
                className={`${styles.background_card} shadow rounded-lg px-2 py-1`}
                key={item.formId}
              >
                <p className={`text-sm ${styles.text_description} truncate`}>
                  {item.formName}
                </p>
                <h2 className="text-md text-end mt-auto">
                  {item.totalAVGPerForm}
                </h2>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InfomationProfile;
