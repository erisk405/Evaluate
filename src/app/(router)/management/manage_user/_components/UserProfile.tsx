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
import { Role, User } from "@/types/interface";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import SetRoleUserOptions from "./SetRoleUserOptions";
import SetDepartmentUserOptions from "./SetDepartmentUserOptions";

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
  Department: z.string().min(1, {
    message: "Department is required",
  }),
  role: z.string().min(1, {
    message: "Role is required",
  }),
});

interface UserProfileProps {
  userDetail: User;
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
      Department: userDetail?.department?.id || "", // Ensure a string is provided
      role: userDetail?.role?.id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(false);
      console.log(values);
      // console.log("userDetail",userDetail);

      const formData = new FormData();
      if (values.image) {
        formData.append("image", values.image);
        try {
          const response = await GlobalApi.updateUserImage(formData);
          console.log(response);
          const { id, name, image, email, role } = response.data;
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
        userId: userDetail.id,
        name: values.firstName + " " + values.lastName,
        department: values.Department,
        email: values.email,
        role: values.role,
      };
      const response = await GlobalApi.updateUserProfileByAdmin(data);
      console.log(response);
      refreshData();
      setIsLoading(true);
    } catch (error) {
      console.log("error",{message:error});
      
    }
  }

  // function เอาไว้ใชักับ SetStatusSection เพื่อให้สามารถนำ valueจาก component ด้านนอกมาใช้ได้
  const { setValue } = form;
  const handleRoleChange: any = (newRole: any) => {
    setValue("role", newRole);
  };
  const handleDepertmentChange: any = (newData: any) => {
    setValue("Department", newData);
  };

  return (
    <div className="">
      <div className="relative w-full h-[100px]">
        <div
          className="absolute flex gap-3 items-center top-1/2 -translate-y-1/2  px-4 cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="relative">
            {selectedImage ? (
              <div className="relative">
                <Image
                  src={selectedImage}
                  width={500}
                  height={500}
                  alt={"profile"}
                  className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            ) : userDetail.image ? (
              <div className="relative">
                <Image
                  src={userDetail?.image.url}
                  width={500}
                  height={500}
                  alt={"profile"}
                  className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={"/profiletest.jpg"}
                  width={500}
                  height={500}
                  alt={"profile"}
                  className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                  loading="lazy"
                />
              </div>
            )}
            <div className="absolute button-0 right-0 -translate-y-full bg-blue-500 text-white rounded-full p-1">
              <Check strokeWidth={3} size={12} />
            </div>
          </div>
          <div className="my-3">
            <h2 className="text-xl font-bold">{userDetail?.name}</h2>
            <h2 className="text-sm text-gray-500">{userDetail?.email}</h2>
          </div>
        </div>
      </div>
      <div className="px-4">
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
                        <div className="flex items-center gap-3">
                          <SetDepartmentUserOptions
                            onDepartmentChange={handleDepertmentChange}
                            defaultValue={userDetail.department}
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
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3">Role</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetRoleUserOptions
                            onRoleChange={handleRoleChange}
                            defaultValue={userDetail.role}
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
            <Separator />
            <FormItem>
              <div className="grid grid-cols-11 items-center gap-3">
                <h2 className="col-span-3">Reset Password</h2>
                <Button variant={"outline"} className="px-16 active:scale-95">
                  Reset
                </Button>
              </div>
              <FormDescription>
                You can reset password for member
              </FormDescription>
              <FormMessage />
            </FormItem>
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
};

export default UserProfile;
