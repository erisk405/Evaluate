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
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

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

interface SortConfig {
  key: "score" | "mean";
  direction: "asc" | "desc";
}
const IndividualOverview = ({
  period,
  userId,
}: {
  period: PeriodType;
  userId?: string;
}) => {
  const styles = useThemeStyles();
  const [individual, setIndividual] = useState<IndividualType>();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "score",
    direction: "desc",
  });
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
        <TableHead
          rowSpan={2}
          className={`text-center border ${styles.text}`}
          onClick={() => handleSort("score")}
        >
          <div className="flex items-center justify-center gap-2">
            ผลคะแนน
            <SortIndicator column="score" />
          </div>
        </TableHead>
      </TableRow>
      <TableRow className={`text-lg ${styles.background_head_table}`}>
        <TableHead
          className={`border flex items-center gap-2 justify-center ${styles.text}`}
          onClick={() => handleSort("mean")}
        >
          ค่าเฉลี่ย
          <SortIndicator column="mean" />
        </TableHead>
        <TableHead className={`text-center border ${styles.text}`}>
          ค่า SD
        </TableHead>
      </TableRow>
    </>
  );
  // Sorting function
  const sortData = (data: resultUserType[]) => {
    return [...data].sort((a, b) => {
      const sortValue = sortConfig.direction === "asc" ? 1 : -1;
      return (a[sortConfig.key] - b[sortConfig.key]) * sortValue;
    });
  };
  // Handle sort click
  const handleSort = (key: "score" | "mean") => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  // Sort indicator component
  const SortIndicator = ({ column }: { column: "score" | "mean" }) => {
    if (column === "mean" && sortConfig.key !== "mean") {
      return <ChevronsUpDown size={20} className={`inline-block ml-1 ${styles.text}`} />;
    }
    if (sortConfig.key !== column) return null;
    return (
      <span className={`ml-1 ${styles.text} text-sm`}>
        {sortConfig.direction === "asc" ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronUp size={20} />
        )}
      </span>
    );
  };
  useEffect(() => {
    const fetchIndividualOverview = async () => {
      try {
        const response = await GlobalApi.getAllResultIndividualOverview(
          period.period_id,
          userId
        );

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
            {individual?.resultUser &&
              sortData(individual.resultUser).map((item, index) => (
                <TableRow className="text-[16px]" key={item.user.id}>
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.user.departmentName}</TableCell>
                  <TableCell className="text-center">
                    {item.mean.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.standardDeviation.toFixed(2)}
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
