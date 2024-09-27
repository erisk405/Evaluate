import { Button } from "@/components/ui/button";
import { AlignCenter, Cloudy } from "lucide-react";
import React from "react";
import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

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
import ResultSection from "./_components/ResultSection";
const historyList = [
  {
    id: "His01",
    title: "การประเมิน ปี 2568 รอบที่ 1",
  },
  {
    id: "His02",
    title: "การประเมิน ปี 2568 รอบที่ 2",
  },
  {
    id: "His03",
    title: "การประเมิน ปี 2567 รอบที่ 1",
  },
  {
    id: "His04",
    title: "การประเมิน ปี 2567 รอบที่ 2",
  },
];

const page = () => {
  return (
    <div className="m-5 bg-white w-full p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold ">My history</h2>
      <div className="grid grid-cols-1 gap-3">
        {historyList.map((item) => (
          <div
            key={item.id}
            className="flex justify-between m-3 p-6 shadow rounded-xl 
          hover:shadow-md transition-all mb-3  "
          >
            <div className="flex items-center gap-3">
              <Cloudy size={30} className="text-blue-500" />
              <h2 className="text-lg">{item.title}</h2>
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <AlignCenter />
                  ดูรายละเอียด
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[calc(100dvh-10%)]">
                <div className="mx-auto w-full ">
                  <div className="mx-auto w-full max-w-lg">
                    <DrawerHeader>
                      <DrawerTitle>
                        สรุปผลการประเมินสมรรถนะ 360 องศา นายกฤตภาส สัมฤทธิ์
                      </DrawerTitle>
                      <DrawerDescription>
                        รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567 (1 กันยายน 2566 - 28 กุมภาพันธ์ 2567)
                      </DrawerDescription>
                    </DrawerHeader>
                  </div>
                  <div className="mx-auto w-full max-w-6xl"> 
                    <ResultSection/>
                  </div>
                  <div className="mx-auto w-full max-w-lg">
                    <DrawerFooter>
                      <Button>Export</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
