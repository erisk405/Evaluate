import React from "react";
import SideBar from "../_components/SideBar";
import Header from "../_components/Header";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex w-full relative">
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-center sticky top-0 bg-white shadow-sm">
          <div className="flex-1 max-w-[1560px] ">
            <Header />
          </div>
        </div>
        <div className="flex justify-center bg-gray-50">
          <div className="flex-1 min-h-screen bg-white max-w-[1560px]">
            <div className="flex bg-gray-50 flex-grow text-neutral-700">
              <SideBar />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
