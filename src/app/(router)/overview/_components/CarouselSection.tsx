"use client";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowRight,
  CalendarClock,
  Clock9,
  Dot,
} from "lucide-react";
import { PeriodType } from "@/types/interface";

type CarouselSectionProp = {
  period: PeriodType[] | undefined;
  formatThaiDateTime: (isoString: string) => { date: string; time: string };
};
const CarouselSection = ({
  period,
  formatThaiDateTime,
}: CarouselSectionProp) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full"
    >
      <CarouselContent className="-mt-1 h-[230px]">
        {period?.map((item, index) => (
          <CarouselItem key={index} className="pt-1 md:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-3">
                  <div
                    key={item.period_id}
                    className="grid transition-all  w-full"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        {/*-------------------------------------------- ------*/}
                        {/*               card ของ ช่วงเวลา                    */}
                        {/*-------------------------------------------- ------*/}
                        <div className="flex items-center ">
                          {/* Dot สถานะ */}
                          <div className="relative">
                            {new Date(item.start) <= new Date() &&
                            new Date() <= new Date(item.end) ? (
                              // Currently active period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-emerald-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-green-500"
                                />
                              </>
                            ) : new Date() > new Date(item.end) ? (
                              // past period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-gray-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-gray-500"
                                />
                              </>
                            ) : (
                              // Future period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-yellow-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-yellow-500"
                                />
                              </>
                            )}
                          </div>
                          {/* ชื่อรอบของช่วงเวลา */}
                          <div className="">
                            <h2>{item.title}</h2>
                          </div>
                        </div>
                        {/* การแสดงผลช่วงเวลา */}
                        <div className="pl-6 ">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex gap-3 items-center">
                              <CalendarClock size={18} />
                              <h2 className="truncate ">
                                {formatThaiDateTime(item.start).date}
                              </h2>
                            </div>
                            <div className="flex gap-3 items-center">
                              <ArrowRight size={18} />
                              <h2 className="truncate ">
                                {formatThaiDateTime(item.end).date}
                              </h2>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex gap-3 items-center">
                              <Clock9 size={18} />
                              <h2 className="truncate ">
                                {formatThaiDateTime(item.start).time} น.
                              </h2>
                            </div>
                            <div className="flex gap-3 items-center">
                              <ArrowRight size={18} />
                              <h2 className="truncate ">
                                {formatThaiDateTime(item.end).time} น.
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
