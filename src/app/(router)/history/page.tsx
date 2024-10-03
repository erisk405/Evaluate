import { Button } from "@/components/ui/button";
import { AlignCenter, Cloudy, Sparkle, SquareStack } from "lucide-react";
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
    id: "year01",
    title: 2568,
    subData: [
      {
        id: "His01",
        title: "การประเมิน ปี 2568 รอบที่ 1",
      },
      {
        id: "His02",
        title: "การประเมิน ปี 2568 รอบที่ 2",
      },
    ],
  },
  {
    id: "year02",
    title: 2567,
    subData: [
      {
        id: "His03",
        title: "การประเมิน ปี 2567 รอบที่ 1",
      },
      {
        id: "His04",
        title: "การประเมิน ปี 2567 รอบที่ 2",
      },
    ],
  },
  {
    id: "year03",
    title: 2566,
    subData: [
      {
        id: "His05",
        title: "การประเมิน ปี 2566 รอบที่ 1",
      },
      {
        id: "His06",
        title: "การประเมิน ปี 2566 รอบที่ 2",
      },
    ],
  },
];

const page = () => {
  return (
    <div className="m-5 bg-white w-full p-6 rounded-xl shadow ">
      <h2 className="text-2xl font-bold ">My history</h2>
      <div className="grid grid-cols-1 gap-3">
        {historyList.map((item) => (
          <div key={item.id} className="">
            <div className="relative flex justify-between m-3 p-3 rounded-xl transition-all mb-3 ">
              <div className="relative left-10 flex items-center gap-3 z-10 px-2 bg-white">
                <Cloudy size={30} className="text-blue-500" />
                <h2 className="text-xl font-bold">Year {item.title}</h2>
              </div>
              <hr className="absolute z-0 top-1/2 w-full" />
            </div>
            <div className="relative w-full grid grid-cols-1 gap-3">
              {item.subData.map((subItem) => (
                <div
                  key={subItem.id}
                  className="grid grid-cols-2 items-center justify-center"
                >
                  <h2 className="text-lg flex items-center justify-center gap-3">
                    <SquareStack className="text-yellow-500" /> {subItem.title}
                  </h2>
                  <div className="flex justify-center">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center w-36 gap-3 border-none active:scale-95 transition-all"
                        >
                          <AlignCenter className="" />
                          ดูรายละเอียด
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-[calc(100dvh-10%)] ">
                        <div className="mx-auto w-full overflow-auto scrollbar-gemini">
                          <div className="mx-auto w-full max-w-lg ">
                            <DrawerHeader className="flex flex-col justify-center items-center">
                              <DrawerTitle className="text-xl">
                                สรุปผลการประเมินสมรรถนะ 360 องศา นายกฤตภาส
                                สัมฤทธิ์
                              </DrawerTitle>
                              <DrawerDescription>
                                รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567 (1 กันยายน
                                2566 - 28 กุมภาพันธ์ 2567)
                              </DrawerDescription>
                            </DrawerHeader>
                          </div>
                          <div className="mx-auto w-full max-w-7xl">
                            <ResultSection />
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
