"use client";
import React from "react";
import DatePicker from "./DatePicker";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import CarouselSection from "./CarouselSection";
import { TextEffect } from "@/app/_components/motion/TextEffect";
import { motion } from "framer-motion";
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
      <motion.div
        className="bg-white p-7 border h-full shadow-md rounded-2xl"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <h2 className="font-bold text-lg">
          <TextEffect preset="slide">
            Notificate for better academic performance
          </TextEffect>
        </h2>
        <div className="mt-5">
          {Ranking.map((item, index) => (
            <motion.div
              key={item?.id}
              className="flex justify-between items-center mb-7"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <div className="">
                <h2 className="text-lg font-bold">
                  {item?.name}{" "}
                  <span
                    className={`${
                      item?.id == "RO1"
                        ? "text-violet-500"
                        : item?.id == "RO2"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    }`}
                  >
                    #{item?.rank}
                  </span>
                </h2>
                <p>{item?.describtion}</p>
                <div
                  className={`active:scale-90 ${
                    item?.id == "RO1"
                      ? "text-violet-500"
                      : item?.id == "RO2"
                      ? "text-orange-500"
                      : "text-yellow-500"
                  } flex items-center hover:text-black transition-all`}
                >
                  <button className="font-bold">Go to Leaderboards</button>
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
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.6,
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 100,
              restDelta: 0.001,
              delay: 0.6,
            },
          }}
        >
          <CarouselSection />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RightSection;
