import Image from "next/image";
import React from "react";
import SetStatusSection from "./SetStatusSection";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const member = [
  {
    id: "M01",
    name: "John Doe",
    img: "/profiletest.jpg",
    email: "test@gmail.com",
    date: "05/12/2564",
  },
  {
    id: "M02",
    name: "Amphon cat",
    img: "/profiletest.jpg",
    email: "test@gmail.com",
    date: "02/12/2564",
  },
  {
    id: "M03",
    name: "Krittaphat Doe",
    img: "/profiletest.jpg",
    email: "test@gmail.com",
    date: "04/12/2564",
  },

];

const ListTeamOfDepartment = () => {
  return (
    <>
      <div className="grid grid-cols-10">
        <h2 className="col-span-1 w-full text-center">#</h2>
        <h2 className="col-span-3 ">Title</h2>
        <h2 className="col-span-2">Date</h2>
        <h2 className="col-span-3">Role</h2>
        <h2 className="col-span-1">Action</h2>
      </div>
      <hr className="my-2" />
      {/* Member list */}
      {member?.map((item) => (
        <div key={item?.id}>
          <div className="grid grid-cols-10 my-3">
            {/* # */}
            <div className="col-span-1 flex items-center justify-center w-full">
              1
            </div>
            {/* title */}
            <div className="flex items-center col-span-3 gap-3">
              <Image
                src={"/profiletest.jpg"}
                width={50}
                height={50}
                alt="ProfileDepartment"
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
              <ul className="text-sm ">
                <li>{item?.name}</li>
                <li className="text-neutral-500">{item?.email}</li>
              </ul>
            </div>
            {/* Date Time  */}
            <div className="col-span-2 flex items-center text-sm ">
              {item?.date}
            </div>
            {/* Role Manage */}
            <div className="col-span-3 flex items-center">
              <SetStatusSection />
            </div>
            {/* Action */}
            <div className="col-span-1 flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </>
  );
};

export default ListTeamOfDepartment;
