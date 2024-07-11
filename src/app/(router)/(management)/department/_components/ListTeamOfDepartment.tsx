import Image from "next/image";
import React from "react";
import SetStatusSection from "./SetStatusSection";
import { EllipsisVertical } from "lucide-react";

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
            <li>Krittaphat Samrit</li>
            <li className="text-neutral-500">copter1177@gmail.com</li>
          </ul>
        </div>
        {/* Date Time  */}
        <div className="col-span-2 flex items-center">31/51/2554</div>
        {/* Role Manage */}
        <div className="col-span-3 flex items-center">
          <SetStatusSection />
        </div>
        {/* Action */}
        <div className="col-span-1 flex items-center">
          <EllipsisVertical />
        </div>
      </div>
      <hr />
    </>
  );
};

export default ListTeamOfDepartment;
