"use client";
import {
  EllipsisVertical,
  MessageCircleQuestion,
  Plus,
  Settings2,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useStore from "@/app/store/store";

const data = [
  {
    id: "FO01",
    title: "Form จิตพิสัย",
  },
  {
    id: "FO02",
    title: "Form การปฎิบัติงาน",
  },
  {
    id: "FO03",
    title: "Form ความรู้ด้านวิชาการ",
  },
];
interface SlideStates {
  [key: string]: boolean;
}
const page = () => {
  const [slideStates, setSlideStates] = useState<SlideStates>({});
  const { openForm, setOpenForm } = useStore();

  const toggleSlide = (id: string) => {
    setSlideStates((prevStates) => ({
      ...prevStates,
      [id]: !(prevStates[id] ?? false),
    }));
  };

  const handleItemClick = (id: string) => {
    setOpenForm(id);
  };

  useEffect(() => {
    console.log(openForm);
  }, [openForm]);
  return (
    <div className="m-5 w-full">
      <div className="bg-white shadow h-screen p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShieldAlert size={40} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold">Form setting</h2>
        </div>
        <div className="grid grid-cols-5 h-[500px] ">
          <div className="col-span-2 border-r p-5 ">
            {data.map((item, index) => (
              <div
                key={item.id}
                className={`border-b w-full h-16 rounded-sm flex items-center p-3  group cursor-pointer ${
                  openForm.id === item.id
                    ? "bg-neutral-100 text-black "
                    : "bg-white hover:bg-neutral-100"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex justify-between w-full items-center overflow-hidden">
                  <h2 className="text-lg font-semibold select-none">
                    {item.title}
                  </h2>
                  <div className="flex gap-3 ">
                    <div className="relative">
                      <div
                        className={`absolute top-0 ${
                          slideStates[item.id]
                            ? "transition-all -translate-x-full -left-1/2"
                            : "transition-all translate-x-0"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Settings2 />
                          <Trash2 />
                        </div>
                      </div>
                      <div
                        onClick={() => toggleSlide(item.id)}
                        className={`  top-0 z-20 relative
                          ${
                            openForm.id === item.id
                              ? "bg-neutral-100 text-black "
                              : "bg-white text-black group-hover:bg-neutral-100"
                          }  
                    `}
                      >
                        <div
                          className={`${
                            slideStates[item.id] ? "rotate-180" : "rotate-0"
                          } transition-all`}
                        >
                          {slideStates[item.id] ? <X /> : <EllipsisVertical />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full h-10 active:scale-95 transition-all mt-3 select-none gap-2"
            >
              <Plus />
              Create
            </Button>
          </div>
          <div className="col-span-3 p-5 grid place-items-center">
            {openForm.id === null ? (
              <div className="flex justify-center items-center gap-3 flex-col">
                <div className="relative">
                  <MessageCircleQuestion
                    size={150}
                    className="text-blue-500 "
                  />
                  <MessageCircleQuestion
                    size={150}
                    className="absolute top-0 text-blue-500 opacity-10 animate-ping"
                  />
                </div>
                <h2 className="text-lg">Click any form your created.</h2>
              </div>
            ) : (
              <div>
                <h2>Question {data.find(item => item.id === openForm.id)?.title || 'Unknow'}</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
