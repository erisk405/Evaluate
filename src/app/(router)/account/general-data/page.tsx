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
import {
  Bolt,
  Check,
  CircleDashed,
  Dock,
  Hexagon,
  LinkIcon,
  Loader,
  Mail,
  RollerCoaster,
  ScanFace,
  Shell,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import socket from "@/lib/socket";
import { Role } from "@/types/interface";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import SetPrefixSelection from "@/app/_components/SetPrefixSelection";
import SetStatusSection from "@/app/_components/SetStatusSection";
import Loading from "@/app/_components/Loading";
import { useTheme } from "next-themes";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import { useProfileComparison } from "@/app/lib/adapters/user-profile/useProfileComparison";

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
  department: z.string().min(10, {
    message: "Department must be at least 10 characters",
  }),
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

export default function page() {
  // for image changing
  const { ProfileDetail, updateProfileDetail } = useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useThemeStyles();
  const { getThemeClass } = useThemeClass();
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
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(false); // Set to true at the start
    console.log(values);

    try {
      // Image update
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const response = await GlobalApi.updateUserImage(formData);
        if (response?.data) {
          const { id, name, image, prefix, email, role } = response.data;
          updateProfileDetail({
            id,
            prefix,
            name,
            email,
            image: image?.url ?? "/profiletest.jpg",
            role,
          });
        }
      }
      // Name update
      let nameCombi = `${values.firstName} ${values.lastName}`;
      const payload = {
        name: nameCombi,
        prefixId: values.prefix,
        phone: values.phoneNumber,
      };

      const response = await GlobalApi.updateProfileName(payload);
      console.log("nameResponse", response);

      if (response?.data) {
        const { name, prefix, phone } = response.data;
        updateProfileDetail({ name, prefix, phone });
      }

      // Role request logic
      if (ProfileDetail.role && ProfileDetail.role.id !== values.role) {
        if (ProfileDetail.roleRequests?.length === 0) {
          await requestRole(values.role);
        } else {
          console.log("Don't request role, pending request exists!");
        }
      }

      // Success toast
      toast({
        description: "✅ Your changes were saved successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        description: "❌ Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(true);
    }
  }
  //use Socket io for sendRoleRequest to admin
  const requestRole = async (roleId: string) => {
    try {
      const response = await GlobalApi.sendRoleRequest(
        ProfileDetail?.id,
        roleId
      );
      // หาว่ามีการร้องขอมามั้ย ถ้ามีก็ให้ updateProfileDetailไว้ เพื่อคงสถานะ แล้วนำไปใช้ในการ disable button
      // console.log("response:", response);
      const { id, role_name, description, role_level } =
        response?.data.data.role;
      const roleRequests: { role: Role; status: string }[] = [
        {
          role: {
            id,
            description,
            role_name,
            role_level,
            permissionsAsAssessor: [],
          },
          status: "PENDING",
        },
      ];
      updateProfileDetail({
        roleRequests: roleRequests,
      });
      // Emit an event to notify admins ขนข้อูลทั้งหมดที่ได้จาก response ไปให้ admin
      const data = response?.data;
      // console.log("requestRole:", data);
      socket.emit("newRoleRequest", {
        data,
      });
    } catch (error) {
      console.error("Failed to request role:", error);
    }
  };
  // ใช้ useEffect เพื่อรอให้ ProfileDetail มีข้อมูลก่อน
  const isProfileUnchanged = useProfileComparison(
    form.getValues(),
    ProfileDetail
  );
  useEffect(() => {
    if (ProfileDetail) {
      form.reset({
        firstName: ProfileDetail.name?.split(" ")[0] || "",
        lastName: ProfileDetail.name?.split(" ")[1] || "",
        prefix: ProfileDetail.prefix?.prefix_id || "",
        image: undefined,
        email: ProfileDetail?.email || "",
        department:
          ProfileDetail?.department?.department_name || "Don't have department",
        role: ProfileDetail?.role?.id || "",
        phoneNumber: ProfileDetail.phone
          ? ProfileDetail.phone
          : "ไม่พบเบอร์โทร",
      });
    }

    setIsLoading(true);
  }, [ProfileDetail]);

  if (!isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-[600px] ${styles.text} `}>
      <div className="flex gap-3 items-center my-3">
        <Bolt size={30} strokeWidth={1.2} />
        <h2 className="text-xl ">ประวัติส่วนตัว</h2>
      </div>
      <div
        className={getThemeClass(
          {
            light: `bg-white`,
            dark: `bg-blue-700 `,
          },
          `flex items-center gap-3  p-3 rounded-3xl shadow`
        )}
      >
        <div className=" px-4 cursor-pointer" onClick={handleImageClick}>
          {selectedImage ? (
            <Image
              src={selectedImage}
              width={100}
              height={100}
              alt={"profile"}
              className="w-[70px] h-[70px] rounded-full object-cover border border-neutral-50 p-[2px] shadow bg-white"
              loading="lazy"
            />
          ) : (
            <Image
              src={
                (ProfileDetail?.image && ProfileDetail?.image.url) ||
                "/profiletest.jpg"
              }
              width={100}
              height={100}
              alt={"profile"}
              className="w-[70px] h-[70px] rounded-full object-cover border border-neutral-50 p-[2px] shadow bg-white"
              loading="lazy"
            />
          )}
        </div>
        <div className="my-3">
          <h2 className="">{ProfileDetail?.name}</h2>
          <h2 className={`text-sm  ${styles.text_description}`}>
            {ProfileDetail?.email}
          </h2>
        </div>
      </div>
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* prefix */}
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3 rounded-lg">
                    <h2 className="">คำนำหน้า</h2>
                    <FormControl className="col-span-8 w-full">
                      <SetPrefixSelection
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              {/* firstName */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <h2 className="col-span-3 text-sm">ชื่อ</h2>
                    <div className="grid grid-cols-11 items-center gap-3 ">
                      <FormControl className="col-span-11">
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="ชื่อ"
                          className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* lastName */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <h2 className="col-span-1 text-sm">นามสกุล</h2>
                    <div className="grid grid-cols-11 items-center gap-3">
                      <FormControl className="col-span-11">
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="นามสกุล"
                          className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <h2 className="col-span-3 text-sm">Email address</h2>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <FormControl className="col-span-11">
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
            />{" "}
            <Separator />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <h2 className="col-span-3 text-sm">Phone</h2>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <FormControl className="col-span-11">
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
                  <h2 className="col-span-3 text-sm">หน่วยงานที่สังกัด</h2>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <FormControl className="col-span-11">
                      <div className="relative">
                        <Input
                          id="department"
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
              render={({ field }) => (
                <FormItem>
                  <h2 className="col-span-3 text-sm">ตำแหน่ง</h2>
                  <div className="grid grid-cols-11 items-center gap-3">
                    <FormControl className="col-span-11">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetStatusSection
                            value={field.value}
                            onChange={field.onChange}
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
                  <h2 className="col-span-3 text-sm">รูปภาพ</h2>
                  <div className="grid grid-cols-11 items-center gap-3">
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
}
