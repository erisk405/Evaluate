import React from "react";
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

const data = [
  {
    id: "INV001",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV002",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    id: "INV003",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV004",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV005",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    id: "INV006",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV007",
    headTitle: "ทักษะการปฏิบัติงาน",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
const ResultSection = () => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow className="">
            <TableHead className="w-[50px] text-center">ลำดับ</TableHead>
            <TableHead>หัวข้อคำถาม</TableHead>
            <TableHead className="w-[500px]">ข้อคำถาม</TableHead>
            <TableHead className="text-center">ค่าเฉลี่ย</TableHead>
            <TableHead className="text-center">ค่า sd</TableHead>
            <TableHead className="text-center">เพิ่ม / ลด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="font-bold">ทักษะการปฏิบัติงาน</TableCell>
            <TableCell className="text-center">4.36</TableCell>
            <TableCell className="text-center">0.87</TableCell>
            <TableCell className="text-center">0.17</TableCell>
          </TableRow>
          {data.map((invoice,index) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium text-center">{index+1}</TableCell>
              <TableCell>{invoice.headTitle}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-center">
                {invoice.totalAmount}
              </TableCell>
              <TableCell className="text-center">0.87</TableCell>
              <TableCell className="text-center">0.87</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ResultSection;
