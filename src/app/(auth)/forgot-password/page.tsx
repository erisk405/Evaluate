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

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
});

const page = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
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
            {!status ? (
              <>
                <div className="flex flex-col gap-6 items-center">
                  <div className="border-2 p-2 rounded-xl">
                    <Fingerprint size={40} />
                  </div>
                  <h2 className="text-3xl font-semibold">Forgot password?</h2>
                  <h2 className="text-gray-500">
                    No worries, we'll send you reset instructions.
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
                              <FormLabel>Enter your email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is your public display name.
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
                <h2 className="text-3xl font-semibold">Send Email Success.</h2>
                <h2 className="text-gray-500">
                  please check your email for reset your
                </h2>
              </div>
            )}
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
