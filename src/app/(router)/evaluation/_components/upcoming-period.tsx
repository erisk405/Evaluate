import useStore from "@/app/store/store";
import React from "react";
import { formatThaiDateTime } from "../../overview/_components/RightSection";
import { Button } from "@/components/ui/button";

const UpComingPeriod = () => {
  const { allPeriod } = useStore();
  return (
    <div className="bg-white rounded-lg max-h-[400px] shadow">
      <div className="p-4">
        <h2>Upcoming period</h2>
      </div>
      <hr />
      {allPeriod?.map((item) => (
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
          <Button variant={"outline"}>บันทึกผล</Button>
        </div>
      ))}
    </div>
  );
};

export default UpComingPeriod;
