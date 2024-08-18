"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Check, CircleDashed, LinkIcon, Loader, Mail, RollerCoaster } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SetStatusSection from "./SetStatusSection";
import { useRef, useState } from "react";
import useStore from "../store/store";
import GlobalApi from "../_unit/GlobalApi";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { apiUrl } from "../data/data-option";
import socket from "@/lib/socket";
import { Role, RoleRequest } from "@/types/interface";

const formSchema = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size > 0, {
      message: "Please upload a valid file.",
    }),
  firstName: z.string().min(2, {
    message: "FirstName is required",
  }),
  lastName: z.string().min(2, {
    message: "LastName is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  Department: z.string().min(10, {
    message: "Department must be at least 10 characters",
  }),
  role: z.string().min(1, {
    message: "Role is required",
  }),
});

export default function Myprofile() {
  // for image changing
  const { ProfileDetail, updateProfileDetail } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //  image
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
  //   when click image
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  //   useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: ProfileDetail?.name?.split(" ")[0],
      lastName: ProfileDetail?.name?.split(" ")[1],
      image: undefined,
      email: ProfileDetail?.email ? ProfileDetail?.email : "",
      Department: ProfileDetail?.department? ProfileDetail.department : 'no department',
      role: ProfileDetail?.role?.id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(false);
    console.log(values);

    const formData = new FormData();
    if (values.image) {
      formData.append("image", values.image);
      try {
        const response = await GlobalApi.updateUserImage(formData);
        console.log(response);
        const { id, name, image, email, role } = response.data;
        updateProfileDetail({
          id,
          name,
          email,
          image: image ? image.url : "/profiletest.jpg",
          role,
        });
      } catch (error) {
        console.error("Error updating user image:", error);
      } finally {
        setIsLoading(true);
        toast({
          description: `✅ Your are save success`,
        });
      }
    }
    if(ProfileDetail.role && ProfileDetail.role.id === values.role){
      console.log('request role เดิม ',values.role,":  ",ProfileDetail.role.id);
    }
    else if (ProfileDetail.roleRequests?.length == 0) {

      requestRole(values.role);
    }else{
      console.log("don't request role ,cause have pending request!!");
      
    }

    setIsLoading(true);
  }

  // function เอาไว้ใชักับ SetStatusSection เพื่อให้สามารถนำ valueจาก component ด้านนอกมาใช้ได้
  const { setValue } = form;
  const handleRoleChange: any = (newRole: any) => {
    setValue("role", newRole);
  };
  //use Socket io for sendRoleRequest to admin
  const requestRole = async (roleId: any) => {
    try {
      const response = await axios.post(`${apiUrl}/sendRoleRequest`, {
        userId: ProfileDetail?.id, // userId จะต้องเป็นค่าที่มาจากการล็อกอิน
        roleId,
      });

      // หาว่ามีการร้องขอมามั้ย ถ้ามีก็ให้ updateProfileDetailไว้ เพื่อคงสถานะ แล้วนำไปใช้ในการ disable button
      const { id, role_name, description } = response.data.data.role;
      const roleRequests: { role: Role; status: string }[] = [
        {
          role: {
            id,
            description,
            role_name,
          },
          status: "PENDING",
        },
      ];

      updateProfileDetail({
        roleRequests: roleRequests,
      });
      // Emit an event to notify admins ขนข้อูลทั้งหมดที่ได้จาก response ไปให้ admin
      const data = response.data;
      console.log("requestRole:", data);
      socket.emit("newRoleRequest", {
        data,
      });
    } catch (error) {
      console.error("Failed to request role:", error);
    }
  };

  return (
    <div className="">
      <div className="relative bg-gray-100 w-full h-[100px]">
        <div
          className="absolute bottom-0 translate-y-1/2 px-4 cursor-pointer"
          onClick={handleImageClick}
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              width={500}
              height={500}
              alt={"profile"}
              className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
              loading="lazy"
            />
          ) : ProfileDetail.image ? (
            <Image
              src={ProfileDetail?.image}
              width={500}
              height={500}
              alt={"profile"}
              className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
              loading="lazy"
            />
          ) : (
            <div className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-neutral-600 animate-pulse">
              <div className="flex text-white h-full justify-center items-center animate-spin">
                <Loader size={30} />
              </div>
            </div>
          )}

          <div className="absolute button-0 right-0 -translate-x-full -translate-y-full bg-blue-500 text-white rounded-full p-1">
            <Check strokeWidth={3} size={12} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="relative flex justify-end text-sm">
          <div className="flex gap-3 items-center">
            <div className="flex items-center border gap-1 border-gray-300 py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all active:scale-95">
              <LinkIcon size={16} />
              <Link href={"#"}>Copy link</Link>
            </div>
            <div className="border border-gray-300 py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all active:scale-95">
              <Link href={"#"}>View profile</Link>
            </div>
          </div>
        </div>
        <div className="my-3">
          <h2 className="text-xl font-bold">{ProfileDetail?.name}</h2>
          <h2 className="text-sm text-gray-500">{ProfileDetail?.email}</h2>
        </div>
        <Separator className="my-3" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-11 items-center gap-3">
              <h2 className="col-span-3">Name</h2>
              {/* firstName */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="firstName"
                          type="text"
                          className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* lastName */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="col-span-4">
                        <Input
                          id="lastName"
                          type="text"
                          className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3">Email address</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <Mail
                          strokeWidth={1.5}
                          className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500"
                        />
                        <Input
                          disabled
                          id="email"
                          type="text"
                          className="pl-10  focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {/* department */}
            <FormField
              control={form.control}
              name="Department"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3">Department</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <Input
                          id="Department"
                          type="text"
                          disabled
                          className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3">Role</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetStatusSection
                            onRoleChange={handleRoleChange}
                            defaultValue={
                              ProfileDetail.roleRequests?.length &&
                              ProfileDetail.roleRequests.length > 0
                                ? ProfileDetail.roleRequests[0].role.role_name
                                : ProfileDetail?.role?.role_name
                            }
                            isPending={
                              ProfileDetail.roleRequests?.length &&
                              ProfileDetail.roleRequests.length > 0
                                ? true
                                : false
                            }
                          />
                          <div className="flex items-center gap-2 select-none">
                            {ProfileDetail.roleRequests?.length &&
                            ProfileDetail.roleRequests.length > 0 ? (
                              <div className=" text-orange-400 rounded-full p-1">
                                <CircleDashed strokeWidth={3} size={18} />
                              </div>
                            ) : (
                              <div className="bg-blue-500 text-white rounded-full p-1">
                                <Check strokeWidth={3} size={10} />
                              </div>
                            )}
                            <div>
                              {ProfileDetail.roleRequests?.length &&
                              ProfileDetail.roleRequests.length > 0 ? (
                                <h2 className="font-bold text-sm text-orange-400 ">
                                  Pending
                                </h2>
                              ) : (
                                <h2 className="font-bold text-sm text-blue-600 ">
                                  Approved
                                </h2>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3">Picture</h2>
                    <FormControl>
                      <Input
                        id="picture"
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]); // Set the first file from the FileList
                          handleImageChange(e);
                        }}
                        ref={fileInputRef}
                        className="col-span-8"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    This is your public display image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full text-right">
              {isLoading ? (
                <Button className="w-32" type="submit">
                  Save Change
                </Button>
              ) : (
                <Button className="w-32 animate-pulse" type="button">
                  <Loader className="animate-spin" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
