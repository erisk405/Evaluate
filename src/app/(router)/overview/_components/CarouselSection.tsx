"use client";
import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
const CarouselSection = () => {
  const plugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));
  const AdminRol = [
    {
      id: "AR01",
      name: "Krittaphat Samrit",
      img: "/profiletest.jpg",
      massage: "ทำไรหนิเห้ย ดึกๆดื่นๆไม่หลับไม่นอนนะเห้ยตัวนี้",
    },
    {
      id: "AR02",
      name: "Amphon",
      img: "/amphon.jpg",
      massage: "ทำไรหนิเห้ย อย่าลืมทำวิชา Computer Vision ด้วย",
    },
    {
      id: "AR03",
      name: "GasGas",
      img: "/gas.jpg",
      massage: "ก็เพราะว่าฉ้านนนน ชอบบเธออ ตั้งแต่แรกเจ้ออ แต่ไม่กล้าบอกก",
    },
    {
      id: "AR04",
      name: "Kla dog",
      img: "/kla.jpg",
      massage: "กลัวว่าเธอออนั้นจะมาหลอกกก คนบ้านนอกอย่างฉ้านนน โอ้วว",
    },
  ];
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-auto mx-10"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {AdminRol.map((item) => (
          <CarouselItem key={item.id}>
            <div className="flex items-end gap-2">
              <div className="min-w-[40px]">
                <Image
                  src={item?.img}
                  width={50}
                  height={50}
                  alt="adminProfile"
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
              </div>
              <div className="bg-violet-100 p-3 rounded-lg ">
                <h2 className="text-violet-700 flex items-center gap-1">
                  <ShieldCheck />
                  {item?.name}
                </h2>
                <p>{item?.massage}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselSection;
