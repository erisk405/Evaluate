import React from "react";
import DatePicker from "./DatePicker";
import Image from "next/image";
import { ChevronRight, icons } from "lucide-react";
import CarouselSection from "./CarouselSection";

const RightSection = () => {
  const Ranking = [
    {
      id: "RO1",
      name: "You're Knowledge",
      rank: 19,
      describtion: "You moved up to the promotion zone!",
      img: "/rocket.png",
    },
    {
      id: "RO2",
      name: "You're ranked of active",
      rank: 3,
      describtion: "You moved up to the promotion active zone!",
      img: "/fire.png",
    },
    {
      id: "RO3",
      name: "You're ranked of project",
      rank: 45,
      describtion: "You moved up to the promotion project zone!",
      img: "/lightbulb.png",
    },
  ];
  return (
    <div className="flex gap-3 flex-col h-full">
      <div className="flex justify-center w-full">
        <DatePicker />
      </div>
      <div className="bg-white p-7 border h-full shadow-md rounded-2xl">
        <h2 className="font-bold text-lg">
          Notificate for better academic performance
        </h2>
        <div className="mt-5">
          {Ranking.map((item) => (
            <div key={item?.id} className="flex justify-between items-center mb-7">
              <div className="">
                <h2 className="text-lg font-bold">
                  {item?.name}{" "}
                  <span className={`${item?.id == 'RO1' ? 'text-violet-500' : item?.id == 'RO2' ? 'text-orange-500' : 'text-yellow-500'}`}>#{item?.rank}</span>
                </h2>
                <p className="">{item?.describtion}</p>
                <div className={`active:scale-90 ${item?.id == 'RO1' ? 'text-violet-500' : item?.id == 'RO2' ? 'text-orange-500' : 'text-yellow-500'} flex items-center hover:text-black transition-all`}>
                  <button className="font-bold">Go to Leaderboards </button>
                  <ChevronRight />
                </div>
              </div>
              <Image
                src={item?.img}
                width={200}
                height={200}
                alt="Fire"
                className="h-[50px] w-[50px] object-cover"
              />
            </div>
          ))}
        </div>
        <div>
          <CarouselSection/>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
