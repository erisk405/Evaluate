import React from "react";
import { ListAllEmployee } from "./_components/ListAllEmployee";

const page = () => {
  return (
    <div className="m-5 w-full">
      <h2 className="text-3xl font-bold">Total result</h2>
      <div className="w-full">
        <ListAllEmployee/>
      </div>
    </div>
  );
};

export default page;
