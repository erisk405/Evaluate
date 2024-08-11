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
import { ChevronLeft, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const data: employee[] = [
    {
      id: "m5gr84i9",
      name: "amphon yyyy",
      status: "success",
      email: "ken99@yahoo.com",
      role: "CEO",
      phone: "095-454-4484",
      department: "CompanyA",
      img:'/profiletest.jpg'
    },
    {
      id: "3u1reuv4",
      name: "Krittaphat samrit",
      status: "success",
      email: "Abe45@gmail.com",
      role: "เสาหลัก",
      phone: "095-454-4484",
      department: "CompanyB",
      img:'/profiletest.jpg'
    },
    {
      id: "derv1ws0",
      name: "Panyakorn somawong",
      status: "processing",
      email: "Monserrat44@gmail.com",
      role: "Head",
      phone: "095-454-4484",
      department: "CompanyB",
      img:'/profiletest.jpg'
    },
    {
      id: "5kma53ae",
      name: "Wichaphon dogcat",
      status: "success",
      email: "Silas22@gmail.com",
      role: "COO",
      phone: "095-454-4484",
      department: "CompanyB",
      img:'/profiletest.jpg'
    },
    {
      id: "bhqecj4p",
      name: "Worakamon gogo",
      status: "failed",
      email: "carmella@hotmail.com",
      role: "CPE",
      phone: "095-454-4484",
      department: "CompanyC",
      img:'/profiletest.jpg'
    },
  ];
  
  export type employee = {
    id: string;
    name: string;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    role: string;
    phone: string;
    department: string;
    img:string;
  };
const page = () => {
  return (
    <div className="m-5 w-full flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white shadow rounded-lg">
            <ChevronLeft size={28} />
          </div>
          <span>Back to overview</span>
        </div>
        <div>
            <Button>Join this department</Button>
        </div>
      </div>
      <div className="xl:col-span-6 col-span-6">
        <div className="bg-white w-full shadow rounded-xl p-10">
          <h2 className="font-bold text-4xl">Department Name</h2>
          <div className="my-5 flex justify-between items-center">
            <Input type="text" placeholder="Search..." className="max-w-[400px]"/>
            <div className="">
                <Button className="flex items-center gap-3">
                    <ListFilter size={18} />
                    filter
                </Button>
            </div>
          </div>
          <div >
            <Table>
              <TableCaption>A list of your recent employee.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[250px]">Name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead>role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Image
                            src={item.img}
                            width={100}
                            height={100}
                            alt="profileUser"
                            className="w-[50px] h-[50px] rounded-full"
                        />
                      {item.name}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell className="text-right">
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">Dog</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
