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
import { ChevronLeft, GraduationCap, Hexagon, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const data: employee[] = [
  {
    id: "m5gr84i9",
    name: "amphon yyyy",
    status: "success",
    email: "ken99@yahoo.com",
    role: "CEO",
    phone: "095-454-4484",
    department: "CompanyA",
    img: "/profiletest.jpg",
  },
  {
    id: "3u1reuv4",
    name: "Krittaphat samrit",
    status: "success",
    email: "Abe45@gmail.com",
    role: "เสาหลัก",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "derv1ws0",
    name: "Panyakorn somawong",
    status: "processing",
    email: "Monserrat44@gmail.com",
    role: "Head",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "5kma53ae",
    name: "Wichaphon dogcat",
    status: "success",
    email: "Silas22@gmail.com",
    role: "COO",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "bhqecj4p",
    name: "Worakamon gogo",
    status: "failed",
    email: "carmella@hotmail.com",
    role: "CPE",
    phone: "095-454-4484",
    department: "CompanyC",
    img: "/profiletest.jpg",
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
  img: string;
};

const OptionEmployee = [
  {
    id: "OEP01",
    title: "รองผู้อำนวยการ",
    name: "นายกฤตภาส สัมฤทธิ์",
    role: "รองผู้อำนวยการ",
    quantity: 0,
    img: "/team.svg",
    color: "from-red-300 to-pink-300",
  },
  {
    id: "OEP02",
    title: "หัวหน้างานทะเบียน",
    name: "cat cat",
    role: "หัวหน้างานวิชาการ",
    quantity: 0,
    img: "/NewEmployee.svg",
    color: "from-green-200 to-emerald-300",
  },
  {
    id: "OEP03",
    title: "สมาชิกใหม่",
    name: "dog dog",
    role: "Gogo",
    quantity: 65,
    img: "/male.svg",
    color: "from-blue-300 to-cyan-300",
  },
];
const page = () => {
  return (
    <div className="m-5 w-full flex flex-col gap-3">
      <div className="flex justify-between">
        <Link href={"/overview"} className="flex items-center gap-3 group">
          <div className="bg-white shadow rounded-lg group-hover:bg-black group-hover:text-white">
            <ChevronLeft size={28} />
          </div>
          <span className="cursor-pointer">Back to overview</span>
        </Link>
        <div>
          <Button>Join this department</Button>
        </div>
      </div>{" "}
      <h2 className="font-bold text-4xl">Department Name</h2>
      <div className="flex justify-around gap-3 flex-wrap p-5 rounded-3xl">
        {OptionEmployee.map((item) => (
          <div
            key={item?.id}
            className="flex-1 min-w-[250px] max-w-full cursor-pointer "
          >
            <div
              className={`flex rounded-2xl gap-3 relative overflow-hidden
              items-center px-8 py-4 shadow-xl 
              bg-gradient-to-tl from-neutral-800 from-20% to-neutral-900 to-50%  group 
              transition-all `}
            >
              <div className="text-white w-full group-hover:text-white z-10">
                <div className="flex gap-3">
                  <Image
                    src={"/profiletest.jpg"}
                    width={100}
                    height={100}
                    alt="imageProsiden"
                    className="w-[70px] h-[80px] object-cover rounded-xl"
                  />
                  <div>
                    <h2 className="text-md text-gray-300">{item?.role}</h2>
                    <h2 className="text-lg">{item?.name}</h2>
                    <div
                      className="inline-flex items-center gap-2 bg-neutral-800 
                    px-4 py-1 rounded-full text-neutral-400"
                    >
                      <GraduationCap size={20} />
                      <h2 className="text-sm">หน่วยงานวิชาการ</h2>
                    </div>
                  </div>
                </div>
                <div className="inline-flex w-full justify-end mt-3 ">
                  <h2
                    className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 
                  text-neutral-200 px-2 py-1 rounded-xl transition-all active:scale-95"
                  >
                    <Hexagon /> Evaluate
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="xl:col-span-6 col-span-6">
        <div className="bg-white w-full shadow rounded-xl p-8">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search..."
              className="max-w-[400px] rounded-xl"
            />
            <div className="">
              <Select>
                <SelectTrigger className="w-[180px] flex items-center">
                  <ListFilter size={17} />
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Evaluate</SelectLabel>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[250px]">Name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead>role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
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
                    <TableCell className="text-center">
                      <h2
                        className={` ${
                          item.status === "success"
                            ? "font-semibold text-emerald-600 bg-emerald-100 rounded-xl border p-1 pr-4 border-emerald-500"
                            : item.status === "processing"
                            ? "font-semibold text-yellow-600 bg-yellow-100 rounded-xl border p-1 pr-4 border-yellow-500"
                            : "font-semibold text-red-600 bg-red-100 rounded-xl border p-1 pr-4 border-red-500"
                        }`}
                      >
                        {item.status}
                      </h2>
                    </TableCell>
                    <TableCell className="">
                      <div className="flex justify-end">
                        <Button className="flex items-center gap-3">
                          <Hexagon /> Evaluate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
