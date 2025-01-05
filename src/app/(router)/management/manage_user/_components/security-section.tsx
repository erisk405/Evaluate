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
        message: "Password must be at least 8 characters long.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
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
      <h2 className="text-lg font-semibold ">Change password?</h2>
      <h2 className="text-sm text-gray-500">Must be at least 8 charector</h2>
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
                        <FormLabel>Password</FormLabel>
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
                        <FormLabel>Confirm password</FormLabel>
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
