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
      name: "GasGas",
      img: "/gas.jpg",
      massage: "ดั่งมี....!!!!! ใบมีดทิ่มแทงงงง~~ ช้าาๆ มันแทงงลงไปป",
    },
    {
      id: "AR02",
      name: "Kla dog",
      img: "/kla.jpg",
      massage: "ไม่มี...!!! ไม่มีเรี่ยวแรงงงง~~ ไม่อาจแกล้งง ว่าไม่~ เป็นไรรรร",
    },
    {
      id: "AR03",
      name: "Krittaphat Samrit",
      img: "/profiletest.jpg",
      massage: "อยู่อยู่ ก็มีแต่น้ำ...~~ ตาาาาาา~ จิตใจก็เริ่มอ่อนล่า มลายหายไปป~~",
    },
    {
      id: "AR04",
      name: "Amphon",
      img: "/amphon.jpg",
      massage: "ช่วยบอกกันทีได้มั้ย ฉันทำวิ่งใดด ถึงต้องมาเจ็บช้ำ...~~",
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
