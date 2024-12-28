"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { PeriodType, User } from "@/types/interface";

interface IndividualType {
  headData: headDataIndividuaType;
  resultUser: resultUserType[];
}
interface headDataIndividuaType {
  department: string;
  name: string;
  numberOFUser: number;
  roleLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
  roleName: string;
}
interface resultUserType {
  mean: number;
  score: number;
  standardDeviation: number;
  user: {
    departmentId:string;
    departmentName:string;
    id:string;
    name:string;
    roleName:string;
  };
}

const IndividualOverview = ({ period }: { period: PeriodType }) => {
  const { ProfileDetail } = useStore();
  const [individual, setIndividual] = useState<IndividualType>();
  const renderTableHeaders = () => (
    <>
      <TableRow className="text-lg bg-blue-300">
        <TableHead rowSpan={2} className="text-center text-stone-800">
          ลำดับ
        </TableHead>
        <TableHead rowSpan={2} className="text-center border text-stone-800">
          รายชื่อผู้รับการประเมิน
        </TableHead>
        <TableHead rowSpan={2} className="text-center border text-stone-800">
          สังกัดหน่วยงาน
        </TableHead>
        <TableHead colSpan={2} className="text-center border text-stone-800">
          ผลการประเมินการปฏิบัติงาน
        </TableHead>
        <TableHead rowSpan={2} className="text-center border text-stone-800">
          ผลคะแนน
        </TableHead>
      </TableRow>
      <TableRow className="text-lg bg-blue-300">
        <TableHead className="text-center border text-stone-800">
          ค่าเฉลี่ย
        </TableHead>
        <TableHead className="text-center border text-stone-800">
          ค่า SD
        </TableHead>
      </TableRow>
    </>
  );
  useEffect(() => {
    const fetchIndividualOverview = async () => {
      try {
        if (ProfileDetail.id) {
          const response = await GlobalApi.getAllResultIndividualOverview(
            period.period_id,
            ProfileDetail.id
          );
          setIndividual(response?.data);
        //   console.log("Individual",response?.data);
          
        }
      } catch (error) {
        handleErrorOnAxios(error);
      }
    };
    fetchIndividualOverview();
  }, [ProfileDetail]);
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="border rounded-lg">
        <Table>
          <TableCaption>ผลการประเมินรายละเอียด</TableCaption>

          <TableHeader>{renderTableHeaders()}</TableHeader>

          <TableBody>
            {/* Questions Rows */}
            {individual?.resultUser.map((item,index) => (
              <TableRow className="text-[16px]" key={item.user.id}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>{item.user.departmentName}</TableCell>
                <TableCell className="text-center">{item.mean}</TableCell>
                <TableCell className="text-center">{item.standardDeviation}</TableCell>
                <TableCell className="text-center">{item.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IndividualOverview;
