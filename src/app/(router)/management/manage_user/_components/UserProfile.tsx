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
import { Check, Loader, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import GlobalApi from "@/app/_util/GlobalApi";
import SetRoleUserOptions from "./SetRoleUserOptions";
import SetDepartmentUserOptions from "./SetDepartmentUserOptions";
import SetPrefixSelection from "@/app/_components/SetPrefixSelection";
import { useProfileComparison } from "@/app/lib/adapters/user-profile/useProfileComparison";
import { ProfileDetailType } from "@/app/lib/adapters/user-profile/types";

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
  department: z
    .string()
    .min(1, {
      message: "Department is required",
    })
    .optional(),
  role: z.string().min(1, {
    message: "Role is required",
  }),
  prefix: z.string().min(1, {
    message: "prefix is required",
  }),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: "Phone number must be a valid format.",
  }),
});

interface UserProfileProps {
  userDetail: ProfileDetailType;
  refreshData: () => void;
}
const UserProfile = ({ userDetail, refreshData }: UserProfileProps) => {
  // for image changing
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
      firstName: userDetail?.name?.split(" ")[0],
      lastName: userDetail?.name?.split(" ")[1],
      image: undefined,
      email: userDetail?.email ? userDetail?.email : "",
      department: userDetail?.department?.id, // Ensure a string is provided
      role: userDetail?.role?.id,
      prefix: userDetail.prefix?.prefix_id ?? "",
      phoneNumber: userDetail.phone || "ไม่พบเบอร์โทร",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(false);
      console.log(values);

      const formData = new FormData();
      if (values.image) {
        formData.append("image", values.image);
        try {
          const response = await GlobalApi.updateUserImage(formData);
          console.log(response);
          // const { id, name, image, email, role } = response.data;
        } catch (error) {
          console.error("Error updating user image:", error);
        } finally {
          setIsLoading(true);
          toast({
            description: `✅ Your are save success`,
          });
        }
      }
      const data = {
        userId: userDetail.id!,
        name: values.firstName + " " + values.lastName,
        department: values?.department ?? null,
        email: values.email,
        role: values.role,
        prefixId: values.prefix,
        phone: values.phoneNumber,
      };
      const response = await GlobalApi.updateUserProfileByAdmin(data);
      console.log(response);
      refreshData();
      setIsLoading(true);
    } catch (error) {
      console.log("error", { message: error });
    }
  }
  const isProfileUnchanged = useProfileComparison(form.getValues(), userDetail);
  return (
    <div className="">
      <div className="relative w-full h-[60px]">
        <div
          className="absolute flex gap-3 items-center top-1/2 -translate-y-1/2  px-4 cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="relative">
            {selectedImage ? (
              <div className="relative">
                <Image
                  src={selectedImage}
                  width={100}
                  height={100}
                  alt={"profile"}
                  className="w-[60px] h-[60px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            ) : userDetail.image ? (
              <div className="relative">
                <Image
                  src={
                    (userDetail?.image && userDetail?.image.url) ||
                    "profiletest.jpg"
                  }
                  width={100}
                  height={100}
                  alt={"profile"}
                  className="w-[60px] h-[60px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={"/profiletest.jpg"}
                  width={100}
                  height={100}
                  alt={"profile"}
                  className="w-[60px] h-[60px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            )}
            <div className="absolute button-0 right-0 -translate-y-full bg-blue-500 text-white rounded-full p-1">
              <Check strokeWidth={3} size={12} />
            </div>
          </div>
          <div className="my-3">
            <h2 className="text-lg font-bold">{userDetail?.name}</h2>
            <h2 className="text-sm text-gray-500">{userDetail?.email}</h2>
          </div>
        </div>
      </div>
      <div className="px-4">
        <Separator className="my-3" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-11 items-center gap-3">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SetPrefixSelection
                          userPrefix={
                            userDetail?.prefix ? userDetail?.prefix : ""
                          }
                          value={field.value}
                          onChange={field.onChange}
                          isAdmin={true} // บอกว่าเรียกใช้งานจากหน้า Admin
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    <h2 className="col-span-3 text-sm">Email address</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <Mail
                          strokeWidth={1.5}
                          className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500"
                        />
                        <Input
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
            {/* phoneNumber */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3 text-sm">เบอร์โทรศัพท์</h2>
                    <FormControl className="col-span-8">
                      <Input placeholder="097-xxx-xxxx" {...field} />
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
              name="department"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3 text-sm">หน่วยงานที่สังกัด</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetDepartmentUserOptions
                            isAdmin={userDetail.role?.role_name === "admin"}
                            defaultValue={userDetail.department || undefined}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </div>
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
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3 text-sm">ตำแหน่ง</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetRoleUserOptions
                            userIdForCheckAdmin={userDetail.id!}
                            defaultValue={userDetail.role}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {/* Picture */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3 text-sm">รูปภาพโปรไฟล์</h2>
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
                <Button
                  className="w-32"
                  type="submit"
                  disabled={isProfileUnchanged}
                >
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
};

export default UserProfile;
