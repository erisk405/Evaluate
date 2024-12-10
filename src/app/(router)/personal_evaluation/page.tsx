"use client";
import { Dot } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStore from "@/app/store/store";
import { PeriodType } from "@/types/interface";
import { Button } from "@/components/ui/button";

const page = () => {
  const { fetchCurrentPeriod } = useStore();
  const [data, setData] = useState<PeriodType[]>([]);

  useEffect(() => {
    const fetchInitailData = async () => {
      try {
        const PeriodData = await fetchCurrentPeriod();
        setData(PeriodData);
      } catch (error) {
        console.error({ message: error });
      }
    };
    fetchInitailData();
  }, []);
  return (
    <div className="m-5 w-full gap-3">
      <h2 className="text-3xl font-bold text-stone-700">
        รายละเอียดผลงานประเมิน
      </h2>
      <div className="flex flex-wrap justify-around my-3 gap-3">
        <div className="bg-white border shadow rounded-3xl w-[340px] h-[200px] overflow-hidden"></div>
        <div className="bg-white border shadow rounded-3xl w-[340px] h-[200px] overflow-hidden"></div>
        <div className="bg-white border shadow rounded-3xl w-[340px] h-[200px] overflow-hidden"></div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">ลำดับ</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.period_id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="w-[120px]">
                  <div className="bg-white cursor-pointer inline-flex border p-2 shadow rounded-xl items-center gap-1">
                    <div className="relative ">
                      <Dot strokeWidth={3} className="text-green-500" />
                      <Dot
                        strokeWidth={3}
                        className="absolute top-0 animate-ping text-green-500"
                      />
                    </div>
                    <h2>ขณะนี้</h2>
                  </div>
                </TableCell>
                <TableCell>
                  <p>รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567</p>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={"outline"}
                    className="active:scale-95 transition-all"
                  >
                    ตรวจสอบรายละเอียด
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
