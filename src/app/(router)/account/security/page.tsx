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
const formSchema = z
  .object({
    oldPassword: z
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
const page = () => {
  const [loading, setLoading] = useState(false);
  const styles = useThemeStyles();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log(values);
      const payload = {
        old_pass:values.oldPassword,
        new_pass:values.newPassword
      }
      const response = await GlobalApi.changePassword(payload);
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
                      <FormLabel>Current Password</FormLabel>
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
            <Button
              className="w-full mt-10 h-[40px] active:scale-95 transition-all"
              type="submit"
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                "Change account password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
