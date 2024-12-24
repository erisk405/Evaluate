"use client";
import { DatabaseBackup, DatabaseZap } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useStore from "@/app/store/store";
import BackUpPeriodList from "./_components/backUp-period-list";
import { formatThaiDateTime } from "../../overview/_components/RightSection";
import UpComingPeriod from "../_components/upcoming-period";

const displayBackUp = [
  {
    id: "DBB01",
    title: "จากรอบการประเมิน 🗓️",
    quantity: "8 รอบ ",
  },
  {
    id: "DBB02",
    title: "เก็บข้อมูลไปทั้งหมด 🌐",
    quantity: "10,120คน",
  },
  {
    id: "DBB03",
    title: "พื้นที่ใช้งาน 🗄️",
    quantity: "400Mb",
  },
];

const page = () => {
  const { fetchCurrentPeriod, allPeriod } = useStore();
  useEffect(() => {
    if (!allPeriod) {
      const fetchInitailData = async () => {
        try {
          await fetchCurrentPeriod();
        } catch (error) {
          console.error({ message: error });
        }
      };

      fetchInitailData();
    }
  }, []);
  return (
    <div className="p-3 w-full">
      <h2 className="text-3xl">คลังเก็บข้อมูล</h2>
      <div className="grid grid-cols-2 bg-white shadow rounded-3xl overflow-hidden w-full p-5">
        <div className="flex  gap-3 items-center ">
          <div className="text-9xl bg-blue-500  text-white p-5 rounded-lg">
            <DatabaseBackup strokeWidth={2} size={50} />
          </div>
          <div>
            <h2 className="text-xl">รอบของข้อมูลที่ถูกบันทึก</h2>
            <p className="text-sm text-gray-500">
              การเก็บข้อมูลนี้ จะเก็บตามแต่ในรอบการประเมินที่
              ผู้ดูแลระบบเป็นคนกำหนด เพื่อเป็นการรักษาผลการประเมินไว้
              และไม่ส่งผลกระทบเมื่อมีการเปลี่ยนแปลงบางข้อมูล
              ผลที่ถูกเก็บนี้จะไม่ถูกเปลี่ยนแปลง ยังคงสภาพเดิมขณะตอนเก็บผล
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {displayBackUp.map((item) => (
            <div
              className="flex flex-col justify-around h-full p-2 rounded-xl shadow"
              key={item.id}
            >
              <h2 className="">{item.title}</h2>
              <p className="text-lg font-semibold">{item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Tabs defaultValue="account" className="w-full col-span-2 my-5">
          <div className="flex justify-start items-center">
            <TabsList className="w-auto">
              <TabsTrigger value="account">รอบการประเมิน</TabsTrigger>
              <TabsTrigger value="password">รายละเอียด</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>ผลที่เก็บในแต่ละรอบ</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <BackUpPeriodList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="my-5 w-full">
          <h2 className="text-xl my-3 font-bold">
            รอบการประเมินที่ยังไม่บันทึก
          </h2>
          <UpComingPeriod/>
        </div>
      </div>
    </div>
  );
};

export default page;
