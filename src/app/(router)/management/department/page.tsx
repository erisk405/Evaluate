"use client";
import { Department } from "@/app/data/data-option";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import FilterSection from "./_components/FilterSection";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingSection from "./_components/SettingSection";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageClick = () => {
    // Trigger the click event on the file input
    fileInputRef.current?.click();
  };
  return (
    <div className="m-5 w-full grid grid-cols-6  gap-5">
      <div className="col-span-4 ">
        <div className="bg-white w-full h-full shadow rounded-xl p-5">
          <h2 className="text-2xl font-bold">Department manage</h2>
          <div className="flex justify-between items-center mt-3 ">
            <div className="flex-1 max-w-[300px] relative">
              <Input
                type="email"
                placeholder="Email"
                className="rounded-full"
              />
              <Search
                size={18}
                className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-5">
              <FilterSection />
              <div>
                <Dialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="p-2 active:scale-95"
                          >
                            <Plus />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create Department</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Department</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div
                        onClick={handleImageClick}
                        className="flex justify-center items-center"
                      >
                        <div className="cursor-pointer relative overflow-hidden group rounded-lg">
                          {selectedImage ? (
                            <Image
                              src={selectedImage}
                              width={300}
                              height={300}
                              alt="ImageDepartment"
                              className="w-auto h-auto object-cover"
                            />
                          ) : (
                            <Image
                              src={"/test.png"}
                              width={300}
                              height={300}
                              alt="ImageDepartment"
                              className="w-auto h-auto object-cover "
                            />
                          )}
                          <div
                            className="absolute top-0 bg-black bg-opacity-70
                            left-0 bottom-0 right-0 text-white rounded-lg   
                            translate-x-full group-hover:translate-x-0 transition-all duration-300"
                          >
                            <div className="flex  justify-center font-bold items-center h-full text-3xl">
                              Click!!
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="name" className="text-left">
                          Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue="Pedro Duarte"
                          className="col-span-4"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="picture" className="text-left">
                          Picture
                        </Label>
                        <Input
                          id="picture"
                          type="file"
                          className="col-span-4"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 my-4">
            {Department?.map((item) => (
              <div
                key={item?.id}
                className="border-b p-4 rounded-xl flex items-center gap-3"
              >
                <Image
                  src={item?.img}
                  width={200}
                  height={200}
                  alt="banner"
                  className="w-[200px] h-[100px] object-cover rounded-lg"
                />
                <div className="flex justify-between w-full items-center">
                  <div className="ml-3">
                    <h2 className="text-lg">{item?.name}</h2>
                    <h2 className="text-gray-500">{item?.quantity} คน</h2>
                  </div>
                  <div>
                    <SettingSection />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-2 ">
        <div className="bg-white w-full h-full shadow rounded-xl p-5"></div>
      </div>
    </div>
  );
};

export default page;
