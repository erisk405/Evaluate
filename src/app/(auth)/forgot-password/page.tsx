"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  CircleCheckBig,
  Fingerprint,
  Loader,
  MoveLeft,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useThemeStyles } from "@/hooks/useTheme";

const formSchema = z.object({
  email: z.string().email({
    message: "อีเมลจะต้องเป็นที่อยู่อีเมลที่ถูกต้อง เช่น yourname@domain.com",
  }),
});

const page = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const styles = useThemeStyles();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await GlobalApi.forgotPassowrd(values.email);
      console.log("response", response);
      toast({
        title: "✅ Send to your email successful",
        description: "Please checking on your email.",
      });
      setStatus(response?.data?.success);
      setLoading(false);
    } catch (error) {
      console.error({ message: error });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${{ message: error }}`,
      });
    }
  };
  return (
    <div className="flex justify-center h-screen ">
      <div className={`w-[980px] h-screen  p-10`}>
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
          <div className="flex flex-col gap-6 items-center">
            {!status ? (
              <>
                <div className="flex flex-col gap-6 items-center">
                  <div className="border-2 p-2 rounded-xl">
                    <Fingerprint size={40} />
                  </div>
                  <h2 className="text-3xl font-semibold">ลืมรหัสผ่านใช่ไหม?</h2>
                  <h2 className="text-gray-500">
                    ไม่ต้องกังวล เราจะส่งคำแนะนำการรีเซ็ตให้คุณ
                  </h2>
                </div>
                <div className="flex justify-center w-full ">
                  <div className="flex-1 max-w-[400px] ">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} action="">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>กรอกอีเมลผู้ใช้ในระบบ</FormLabel>
                              <FormControl>
                                <Input placeholder="xxx@xxxx.xxx" {...field} />
                              </FormControl>
                              <FormDescription>
                                โปรดตรวจสอบอีเมลให้ถูกต้อง
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full my-3">
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "Send to email."
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <div className="">
                  <ShieldCheck size={60} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-semibold">ส่งอีเมลสำเร็จแล้ว.</h2>
                <h2 className="text-gray-500">
                  โปรดตรวจสอบอีเมลของคุณเพื่อรีเซ็ต
                </h2>
              </div>
            )}
            <Link
              href={"/sign-in"}
              className="flex items-center gap-3 hover:text-blue-500"
            >
              <ChevronLeft />
              กลับไปยังหน้าล็อกอิน
            </Link>
          </div>
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
