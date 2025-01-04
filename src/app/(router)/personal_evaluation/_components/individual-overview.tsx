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
import { useTheme } from "next-themes";
import { useThemeStyles } from "@/hooks/useTheme";

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
    departmentId: string;
    departmentName: string;
    id: string;
    name: string;
    roleName: string;
  };
}

const IndividualOverview = ({ period,userId }: { period: PeriodType ,userId?:string }) => {
  const styles = useThemeStyles();
  const [individual, setIndividual] = useState<IndividualType>();
  const renderTableHeaders = () => (
    <>
      <TableRow className={`text-lg ${styles.background_head_table}`}>
        <TableHead rowSpan={2} className={`text-center ${styles.text}`}>
          ลำดับ
        </TableHead>
        <TableHead rowSpan={2} className={`text-center border ${styles.text}`}>
          รายชื่อผู้รับการประเมิน
        </TableHead>
        <TableHead rowSpan={2} className={`text-center border ${styles.text}`}>
          สังกัดหน่วยงาน
        </TableHead>
        <TableHead colSpan={2} className={`text-center border ${styles.text}`}>
          ผลการประเมินการปฏิบัติงาน
        </TableHead>
        <TableHead rowSpan={2} className={`text-center border ${styles.text}`}>
          ผลคะแนน
        </TableHead>
      </TableRow>
      <TableRow className={`text-lg ${styles.background_head_table}`}>
        <TableHead className={`text-center border ${styles.text}`}>
          ค่าเฉลี่ย
        </TableHead>
        <TableHead className={`text-center border ${styles.text}`}>
          ค่า SD
        </TableHead>
      </TableRow>
    </>
  );
  useEffect(() => {
    const fetchIndividualOverview = async () => {
      try {
        const response = await GlobalApi.getAllResultIndividualOverview(period.period_id,userId);
        setIndividual(response?.data);
      } catch (error) {
        handleErrorOnAxios(error);
      }
    };
    fetchIndividualOverview();
  }, []);
  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <div className="border rounded-lg">
        <Table>
          <TableCaption>ผลการประเมินรายละเอียด</TableCaption>

          <TableHeader>{renderTableHeaders()}</TableHeader>

          <TableBody>
            {/* Questions Rows */}
            {individual?.resultUser.map((item, index) => (
              <TableRow className="text-[16px]" key={item.user.id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>{item.user.departmentName}</TableCell>
                <TableCell className="text-center">{item.mean}</TableCell>
                <TableCell className="text-center">
                  {item.standardDeviation}
                </TableCell>
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
