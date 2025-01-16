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
  Check,
  CircleDashed,
  LinkIcon,
  Loader,
  Mail,
  RollerCoaster,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SetStatusSection from "./SetStatusSection";
import { useRef, useState } from "react";
import useStore from "../store/store";
import GlobalApi, { handleErrorOnAxios } from "../_util/GlobalApi";
import socket from "@/lib/socket";
import { Department, Role } from "@/types/interface";
import SetPrefixSelection from "./SetPrefixSelection";
import { useProfileComparison } from "../lib/adapters/user-profile/useProfileComparison";
import SetDepartmentUserOptions from "../(router)/management/manage_user/_components/SetDepartmentUserOptions";
import { useThemeStyles } from "@/hooks/useTheme";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

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
    .min(10, {
      message: "Department must be at least 10 characters",
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

export default function Myprofile() {
  // for image changing
  const { isAdmin } = useAuthState();
  const { ProfileDetail, updateProfileDetail, currentlyEvaluationPeriod } =
    useStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const styles = useThemeStyles();
  const showToast = (title: string, description: string) => {
    toast(title, { description });
  };
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
      prefix: ProfileDetail.prefix?.prefix_id ?? "",
      image: undefined,
      email: ProfileDetail?.email ? ProfileDetail?.email : "",
      department: ProfileDetail.department?.id && ProfileDetail?.department.id,
      role: ProfileDetail?.role?.id,
      phoneNumber: ProfileDetail.phone ? ProfileDetail.phone : "ไม่พบเบอร์โทร",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(false); // Set to true at the start
    console.log(values);

    try {
      if (
        ProfileDetail?.role?.role_name !== "admin" &&
        currentlyEvaluationPeriod?.isAction === true
      ) {
        showToast(
          "ดำเนินการไม่สำเร็จ",
          `⚠️ เนื่องจากตอนนี้อยู่ในช่วงเวลาประเมิน ${currentlyEvaluationPeriod.title} จึงไม่สามารถดำเนินการได้ โปรดติดต่อที่ Admin`
        );

        return null;
      }
      // Image update
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const response = await GlobalApi.updateUserImage(formData);
        if (response?.data) {
          const { id, name, image, prefix, email, role, phone } = response.data;
          updateProfileDetail({
            id,
            prefix,
            name,
            email,
            phone,
            image,
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
      // console.log("nameResponse", response);

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
      if (values.department) {
        const updateDepartment = await GlobalApi.joinDepartment(
          values.department
        );
        const { department } = updateDepartment?.data;
        updateProfileDetail({
          department,
        });
      }
      // Success toast
      showToast(
        "ดำเนินการสำเร็จแล้ว",
        "✅ ระบบได้บันทึกข้อมูลใหม่ของคุณเรียบร้อยแล้ว"
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      handleErrorOnAxios(error);
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
      console.log("requestRole:", data);
      socket.emit("newRoleRequest", {
        data,
      });
    } catch (error) {
      console.error("Failed to request role:", error);
    }
  };
  const isProfileUnchanged = useProfileComparison(
    form.getValues(),
    ProfileDetail
  );
  return (
    <div className={` ${styles.text}`}>
      <div className="relative bg-gray-100 w-full h-[120px] rounded-xl ">
        <Image
          src={"/bannerInfo.jpg"}
          width={800}
          height={800}
          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full object-cover rounded-lg"
          alt="BannerInfo"
        />
        <div
          className="absolute bottom-0 translate-y-1/2 px-4 cursor-pointer"
          onClick={handleImageClick}
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              width={300}
              height={300}
              alt={"profile"}
              className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
              loading="lazy"
            />
          ) : (
            <Image
              src={
                (ProfileDetail?.image && ProfileDetail?.image.url) ||
                "/profiletest.jpg"
              }
              width={300}
              height={300}
              alt={"profile"}
              className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
              loading="lazy"
            />
          )}

          <div className="absolute button-0 right-0 -translate-x-full -translate-y-full bg-blue-500 text-white rounded-full p-1">
            <Check strokeWidth={3} size={12} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="relative flex justify-end text-sm">
          <div className="flex gap-3 items-center">
            {isAdmin ? (
              <a
                href="/evaluation/backup_result"
                className={`flex items-center border gap-1 border-gray-300 py-2 px-3 rounded-xl ${styles.hover} transition-all active:scale-95`}
              >
                <h2>คลังเก็บข้อมูล</h2>
              </a>
            ) : (
              <a
                href="/history"
                className={`flex items-center border gap-1 border-gray-300 py-2 px-3 rounded-xl ${styles.hover} transition-all active:scale-95`}
              >
                <h2>ประวัติผลการประเมิน</h2>
              </a>
            )}
            <a
              href="/account/security"
              className={`border border-gray-300 py-2 px-3 rounded-xl ${styles.hover} transition-all active:scale-95`}
            >
              <h2>เปลี่ยนรหัสผ่าน</h2>
            </a>
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
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SetPrefixSelection
                          value={field.value}
                          onChange={field.onChange}
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
            {/* เบอร์โทรศัพท์ */}
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
                        <SetDepartmentUserOptions
                          isAdmin={ProfileDetail.role?.role_name === "admin"}
                          defaultValue={field.value as Department | undefined}
                          value={field.value ?? ""}
                          onChange={field.onChange}
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
                  <div className="grid grid-cols-11 items-center gap-3">
                    <h2 className="col-span-3 text-sm">ตำแหน่ง</h2>
                    <FormControl className="col-span-8">
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SetStatusSection
                            value={field.value}
                            onChange={field.onChange}
                            defaultValue={
                              ProfileDetail.roleRequests?.length &&
                              ProfileDetail.roleRequests.length > 0
                                ? ProfileDetail.roleRequests[0].role.id
                                : ProfileDetail?.role?.id
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
}
