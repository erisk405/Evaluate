"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/data/data-option";

import { useToast } from "@/components/ui/use-toast"
import { useState } from "react";
import { Loader } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
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
});

const page = () => {
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setError , formState: { errors }} = useForm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/sign-in`,values,{withCredentials:true});
      if(!response){
        throw new Error("Invalid token"); 
      }
      toast({
        title: "Login success",
        description: `✅ Your are login success`,
        className:"bg-black text-white"
      });
      Router.push('/overview');
    } catch (error:any) {
      setLoading(false);
      const errorMessage = error?.response?.data.message;
      setError('password', { type: 'manual', message: errorMessage });
    }
  };
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl my-5 font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          {/* email */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} action="">
              <div className="grid gap-7">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
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
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display password.
                      </FormDescription>
                      {errors.password?.message && (
                        <FormMessage>
                          {typeof errors.password.message === 'string'
                            ? errors.password.message
                            : 'An error occurred'}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <Button  type="submit" className="w-full">
                  {loading ? <Loader  className="animate-spin"/> : "Login"}
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block overflow-hidden">
        <Image
          src="/profiletest.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default page;
