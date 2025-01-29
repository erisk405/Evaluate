"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Fingerprint,
  Loader,
  RectangleEllipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStyles } from "@/hooks/useTheme";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, {
        message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      })
      .regex(/[a-z]/, {
        message: "รหัสผ่านจะต้องมีตัวอักษรพิมพ์เล็กอย่างน้อยหนึ่งตัว",
      })
      .regex(/[A-Z]/, {
        message: "รหัสผ่านต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว",
      })
      .regex(/[0-9]/, {
        message: "รหัสผ่านต้องมีตัวเลขอย่างน้อยหนึ่งตัว",
      }),
    newPassword: z
      .string()
      .min(8, {
        message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      })
      .regex(/[a-z]/, {
        message: "รหัสผ่านจะต้องมีตัวอักษรพิมพ์เล็กอย่างน้อยหนึ่งตัว",
      })
      .regex(/[A-Z]/, {
        message: "รหัสผ่านต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว",
      })
      .regex(/[0-9]/, {
        message: "รหัสผ่านต้องมีตัวเลขอย่างน้อยหนึ่งตัว",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"], // Error message will be displayed under confirmPassword field
  });
const page = () => {
  const [loading, setLoading] = useState(false);
  const { countdownTime, setCountdownTime } = useStore();
  const styles = useThemeStyles();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const payload = {
        old_pass: values.oldPassword,
        new_pass: values.newPassword,
      };
      const response = await GlobalApi.changePassword(payload);
      if (response && response.status === 201) {
        toast({
          description: `${response.data.message}`,
        });
        // Clear form
        form.reset({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // เริ่มนับถอยหลัง 30 วิ
        setCountdownTime(30);
        const timer = setInterval(() => {
          setCountdownTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      handleErrorOnAxios(error);
    } finally {
      setLoading(false);
    }
  };
  const isSubmitDisabled = loading || countdownTime > 0;
  return (
    <div
      className={`px-4 flex flex-col items-center  rounded-lg h-screen ${styles.text}`}
    >
      <div className="w-[428px]">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex gap-3 items-center border p-2 rounded-lg shadow">
            <Fingerprint size={50} />
          </div>
          <h2 className="text-2xl font-semibold my-3">Change password?</h2>
          <h2 className="text-gray-500">Must be at least 8 charector</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full my-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสผ่านเดิม</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="********"
                            {...field}
                            type={`${showPassword ? "text" : "password"}`}
                          />
                          {!showPassword ? (
                            <EyeOff
                              onClick={() => setShowPassword(!showPassword)}
                              strokeWidth={1.8}
                              size={18}
                              className="absolute top-1/2 -translate-y-1/2 right-3"
                            />
                          ) : (
                            <Eye
                              onClick={() => setShowPassword(!showPassword)}
                              strokeWidth={1.8}
                              size={18}
                              className="absolute top-1/2 -translate-y-1/2 right-3"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="newPassword"
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
              className="w-full mt-10 h-[40px] active:scale-95 transition-all"
              type="submit"
              disabled={isSubmitDisabled}
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : countdownTime > 0 ? (
                `โปรดรอ ${countdownTime} วินาที`
              ) : (
                "เปลี่ยนรหัสผ่าน"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
