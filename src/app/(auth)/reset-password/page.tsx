"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, RectangleEllipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"], // Error message will be displayed under confirmPassword field
  });


const page = () => {
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center h-screen ">
      <div className="w-[980px] h-screen bg-white  p-10">
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
              Create an account
            </Link>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-6 items-center">
              <div className="border-2 px-4 py-2 rounded-xl">
                <RectangleEllipsis size={40} />
              </div>
              <h2 className="text-3xl font-semibold">Set new password?</h2>
              <h2 className="text-gray-500">Must be at least 8 charector</h2>
            </div>
            <div className="flex justify-center w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 max-w-[400px] ">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <FormField
                        control={form.control}
                        name="password"
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
                    className="w-full mt-10 h-[50px] active:scale-95 transition-all"
                    type="submit"
                  >
                    {loading ? (
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
              Back to log in
            </Link>
          </div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            beatae sequi dicta aperiam repellendus, qui, consequatur expedita
            quasi dolor, dolores sit ad cupiditate itaque. Excepturi repudiandae
            minima quidem natus officiis!
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
