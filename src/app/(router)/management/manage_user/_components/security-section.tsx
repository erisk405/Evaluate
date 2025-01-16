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
import { Fingerprint, Loader, RectangleEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStyles } from "@/hooks/useTheme";
import GlobalApi from "@/app/_util/GlobalApi";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/interface";
const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
      })
      .regex(/[a-z]/, {
        message: "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว",
      })
      .regex(/[A-Z]/, {
        message: "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว",
      })
      .regex(/[0-9]/, {
        message: "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Error message will be displayed under confirmPassword field
  });
const SecuritySection = ({ userDetail }: { userDetail: User }) => {
  const [loading, setLoading] = useState(false);
  const styles = useThemeStyles();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log(values);
      const payload = {
        new_pass: values.confirmPassword,
      };
      const response = await GlobalApi.changePassword(payload,userDetail.id);
      console.log(response);
      toast({
        description: "Server is updated your password success.",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${{ message: error }}`,
      });
    }
  };
  return (
    <div>
      <h2 className="text-lg font-semibold ">เปลี่ยนรหัสผ่าน?</h2>
      <h2 className="text-sm text-gray-500">ต้องมีอย่างน้อย 8 ตัวอักษร</h2>
      <Separator />
      <div
        className={`px-4 flex flex-col items-start  rounded-lg h-full ${styles.text}`}
      >
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full my-3"
            >
              <div className="grid grid-cols-1 gap-3">
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
              <div className="text-end">
                <Button
                  className="w-[100px] mt-3 text-end h-[40px] active:scale-95 transition-all"
                  type="submit"
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "บันทึกข้อมูล"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
