"use client";
import useStore from "@/app/store/store";
import React, { useState } from "react";
import { formatThaiDateTime } from "../../overview/_components/RightSection";
import { Button } from "@/components/ui/button";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import { Loader } from "lucide-react";

const UpComingPeriod = () => {
  const [loading, setLoading] = useState(false);
  const { allPeriod } = useStore();
  const savePeriod = async (period_id: string) => {
    try {
      const payload = {
        period_id,
      };
      const response = await GlobalApi.saveEvaluationToHistory(payload);
      console.log("Save", response?.data);
    } catch (error) {
      console.error("API saveEvaluationToHistory", { message: error });
      return handleErrorOnAxios(error);
    }
  };
  return (
    <div className="bg-white rounded-lg max-h-[800px] shadow">
      <div className="p-4">
        <h2>Upcoming period</h2>
      </div>
      <hr />
      {allPeriod?.map((item) =>
        !item.backUp ? (
          <div
            className="p-4 flex items-center justify-between"
            key={item.period_id}
          >
            <div>
              <h2>
                <span className="text-xl">📅</span> {item.title}
              </h2>
              <div className="ml-6">
                <h2>
                  <span className="text-xl">⏳</span>
                  {formatThaiDateTime(item.start).date +
                    "(" +
                    formatThaiDateTime(item.start).time +
                    ")"}
                </h2>
                <h2>
                  <span className="text-xl">⌛</span>
                  {formatThaiDateTime(item.end).date +
                    "(" +
                    formatThaiDateTime(item.end).time +
                    ")"}
                </h2>
              </div>
            </div>
            <Button
              variant={"outline"}
              onClick={() => savePeriod(item.period_id)}
            >
              {loading ? <Loader className="animate-spin" /> : "บันทึกผล"}
            </Button>
          </div>
        ) : (
          <div
            className="p-4 flex items-center justify-between"
            key={item.period_id}
          >
            <div>
              <h2>
                <span className="text-xl">📅</span> {item.title}
              </h2>
              <div className="ml-6">
                <h2>
                  <span className="text-xl">⏳</span>
                  {formatThaiDateTime(item.start).date +
                    "(" +
                    formatThaiDateTime(item.start).time +
                    ")"}
                </h2>
                <h2>
                  <span className="text-xl">⌛</span>
                  {formatThaiDateTime(item.end).date +
                    "(" +
                    formatThaiDateTime(item.end).time +
                    ")"}
                </h2>
              </div>
            </div>
            <Button variant={"outline"}>บันทึกผลแล้ว</Button>
          </div>
        )
      )}
      <hr />
    </div>
  );
};

export default UpComingPeriod;
