"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Key, KeyRound, RectangleEllipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useParams, usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import axios from "axios";
import { decodeToken } from "@/hooks/serverAction";
import ProtectedLayout from "@/app/_components/layouts/ProtectedLayout";
import Loading from "@/app/_components/Loading";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      })
      .regex(/[a-z]/, {
        message: "รหัสผ่านต้องมีอักษรตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว",
      })
      .regex(/[A-Z]/, {
        message: "รหัสผ่านต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว",
      })
      .regex(/[0-9]/, {
        message: "รหัสผ่านต้องมีตัวเลขอย่างน้อยหนึ่งตัว",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Error message will be displayed under confirmPassword field
  });
type ResetPasswordFormValues = z.infer<typeof formSchema>;
type AuthCheckResponse = {
  redirect?: string;
};
const page = () => {
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useParams();
  const {
    setError,
    formState: { errors },
  } = useForm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await GlobalApi.resetPassword({
        newPassword: values.password,
        token: token as string,
      });
      console.log("response", response?.data);

      if (response && response.status === 200) {
        toast({
          description: response.data.message,
        });
        setStatus(response.data.success); // true or false
        // หลังจากเปลี่ยนรหัสผ่านสำเร็จ
        form.reset(); // clear form
      }
    } catch (error) {
      console.error({ message: error });
      handleErrorOnAxios(error);
    } finally {
      setIsLoading(false);
    }
  };
  const checkAuthorization = async (token: string) => {
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/auth/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, currentPath: pathname }),
      });

      if (!response.ok) {
        throw new Error("Authorization failed");
      }

      const data: AuthCheckResponse = await response.json();
      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (error) {
      console.error("Authorization error:", error);
      router.push("/sign-in");
    }
  };
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        router.push("/sign-in");
        return;
      }
      setIsLoadingPage(true);
      try {
        await checkAuthorization(token as string);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        router.push("/sign-in");
      } finally {
        setIsLoadingPage(false);
      }
    };

    verifyToken();
  }, [token, router, pathname]);

  if (isLoadingPage) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex justify-center h-screen ">
      <div className="w-[980px] h-screen p-10">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={"/logo.png"} width={50} height={50} alt="logo" />
              <h2 className="text-xl font-bold">Evaluate 360</h2>
            </div>
            <Link
              href={"/sign-up"}
              className="text-blue-500 underline font-bold"
            >
              สร้างบัญชีใหม่
            </Link>
          </div>

          {!status ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-6 items-center">
                <div className="border-2 px-4 py-2 rounded-xl">
                  <RectangleEllipsis size={40} />
                </div>
                <h2 className="text-3xl font-semibold">ตั้งรหัสผ่านใหม่?</h2>
                <h2 className="text-gray-500">
                  รหัสผ่านจะต้องมีอย่างน้อย8ตัวอักษร
                </h2>
              </div>
              <div className="flex justify-center w-full ">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 max-w-[400px] "
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>รหัสผ่านใหม่</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="********"
                                  {...field}
                                  type="password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="********"
                                  {...field}
                                  type="password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full mt-10 h-[50px] active:scale-95 transition-all"
                      type="submit"
                    >
                      {isLoading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Reset password"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              <Link
                href={"/sign-in"}
                className="flex items-center gap-3 hover:text-blue-500"
              >
                <ChevronLeft />
                กลับไปยังหน้าล็อกอิน
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-6 items-center">
                <div className="px-4 py-2 rounded-xl">
                  <KeyRound className="text-blue-500" size={80} />
                </div>
                <h2 className="text-3xl font-semibold">
                  ระบบได้ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว!!
                </h2>{" "}
                <Link
                  href={"/sign-in"}
                  className="flex items-center gap-3 hover:text-blue-500"
                >
                  <Button variant={"outline"} className="text-lg">
                    กลับไปยังหน้าล็อกอิน
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div>
            หมายเหตุ: เพื่อความปลอดภัย ลิงก์รีเซ็ตรหัสผ่านจะมีอายุการใช้งานจำกัด
            เช่น 15 นาที หากลิงก์หมดอายุ
            คุณสามารถขอใหม่ได้โดยทำตามขั้นตอนเดิมอีกครั้ง
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
