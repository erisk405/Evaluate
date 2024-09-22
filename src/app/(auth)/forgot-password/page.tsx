import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Fingerprint, MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center h-screen ">
      <div className="w-[980px] h-screen bg-white  p-10">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={"/logo.png"} width={50} height={50} alt="logo" />
              <h2 className="text-xl font-bold">Evalute 360</h2>
            </div>
            <Link
              href={"/sign-up"}
              className="text-blue-500 underline font-bold"
            >
              Create an account
            </Link>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-6 items-center">
              <div className="border-2 p-2 rounded-xl">
                <Fingerprint size={40} />
              </div>
              <h2 className="text-3xl font-semibold">Forgot password?</h2>
              <h2 className="text-gray-500">
                No worries, we'll send you reset instructions.
              </h2>
            </div>
            <div className="flex justify-center w-full ">
              <div className="flex-1 max-w-[400px] ">
                <h2 className="mb-3">Email</h2>
                <Input className="h-[50px]" placeholder="Enter your email" />
                <Button className="w-full mt-10 h-[50px]">Reset password</Button>
              </div>
            </div>
            <Link href={"/sign-in"} className="flex items-center gap-3 hover:text-blue-500">
              <ChevronLeft />
              Back to log in
            </Link>
          </div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            beatae sequi dicta aperiam repellendus, qui, consequatur expedita
            quasi dolor, dolores sit ad cupiditate itaque. Excepturi repudiandae
            minima quidem natus officiis!
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
