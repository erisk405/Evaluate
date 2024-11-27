import React from "react";
import PrefixTable from "./_components/PrefixTable";

const page = () => {
  return (
    <div className="p-10 w-full ">
      <h2 className="text-2xl font-bold text-stone-800">Prefix management</h2>
      <div className="px-5 py-2 rounded-xl">
        <PrefixTable />
      </div>
    </div>
  );
};

export default page;
