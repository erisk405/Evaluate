"use client";
import { Input } from "@/components/ui/input";
import { Loader, Plus, RotateCcw, Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import GlobalApi from "@/app/_util/GlobalApi";
import AllListDepartment from "./_components/AllListDepartment";
import { toast } from "@/components/ui/use-toast";
import useStore from "@/app/store/store";
import ManageRole from "./_components/ManageRole";
import { Department } from "@/types/interface";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Please upload a file.",
  }),
});

const page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { setRole } = useStore();
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  // for load button
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "กลุ่มวิชาการ",
      image: undefined,
    },
  });

  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartmentForAdmin();
      // console.log("Department :",response?.data);
      setDepartmentData(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const formData = new FormData();
    formData.append("departmentName", values.name);
    formData.append("image", values.image as File);
    try {
      setIsLoading(false);
      const response = await GlobalApi.CreateDepartment(formData);
      console.log(response);
      setIsLoading(true);
      getDepartment();
      toast({
        description: `✅ Your are create department success`,
      });
    } catch (error) {
      console.error("Error updating user image:", error);
    }
  }
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      setRole(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartment();
    fetchRole();
  }, []);
  return (
    <div className="m-5 w-full grid grid-cols-6 gap-5">
      <div className="col-span-6 xl:col-span-4 ">
        <div className="bg-white w-full h-full shadow rounded-xl p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-stone-700 ">
              การจัดการ<span className="text-blue-400">หน่วยงาน</span>
            </h2>
            <div
              className="hover:bg-blue-100 p-2 hover:text-blue-500 
              rounded-full active:scale-95 hover:scale-110 transition-all
              hover:-rotate-[360deg]
              "
              title="refesh"
              onClick={getDepartment}
            >
              <RotateCcw />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 ">
            <div className="flex-1 max-w-[300px] relative">
              <Search
                size={18}
                className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-1/2 text-gray-500"
              />
              <Input
                type="text"
                placeholder="Department"
                className="rounded-lg pl-8"
              />
            </div>
            <div className="flex items-center gap-5">
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
                            สร้างหน่วยงาน
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
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="name" className="text-left">
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      className="col-span-4"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="grid grid-cols-4 items-center gap-2">
                                    <Label
                                      htmlFor="picture"
                                      className="text-left"
                                    >
                                      Picture
                                    </Label>
                                    <Input
                                      id="picture"
                                      type="file"
                                      className="col-span-4"
                                      onChange={(e) => {
                                        field.onChange(e.target.files?.[0]);
                                        handleImageChange(e);
                                      }}
                                      ref={fileInputRef}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-full text-end">
                          {isLoading ? (
                            <Button className="w-32" type="submit">
                              Save Change
                            </Button>
                          ) : (
                            <Button
                              className="w-32 animate-pulse"
                              type="button"
                            >
                              <Loader className="animate-spin" />
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          {/* All list departmemt */}
          <AllListDepartment department={departmentData} fetchDepart={getDepartment} />
        </div>
      </div>
      <div className="col-span-6 xl:col-span-2 ">
        <div className="bg-white w-full h-full shadow rounded-xl p-5">
          <ManageRole />
        </div>
      </div>
    </div>
  );
};

export default page;
