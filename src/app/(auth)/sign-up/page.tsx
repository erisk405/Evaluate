"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/app/data/data-option";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  FirstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  LastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: "Phone number must be a valid format.",
  }),
  password: z.string().min(8,{
    message: "Password must be at least 8 characters long."
  }).regex(/[a-z]/,{
    message: "Password must contain at least one lowercase letter.",
  }).regex(/[A-Z]/,{
    message: "Password must contain at least one uppercase letter."
  }).regex(/[0-9]/,{
    message: "Password must contain at least one number.",
  })
});

const page = () => {
  const [loading, setLoading] = useState(false);
  
  const Router = useRouter();
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:"",
      FirstName: "",
      LastName: "",
      phoneNumber:"",
      password: ""
    },
  });
 async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const new_user = {
      name: values.FirstName + " " + values.LastName,
      email: values.email,
      password: values.password,
      phone: values.password,
      dateofbirth: "2544-12-05",
    };

    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/sign-up`, new_user);
      toast({
        title: "Login success",
        description: `${response.data.message}`,
        className: "text-green-500"
      });
      console.log(response);
      Router.push('/sign-in');
    } catch (error) {
      setLoading(false)
      console.error("Error fetching data:", error);
    }
  }
  return (
    <div className="relative w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="hidden bg-muted lg:block overflow-hidden">
        <Image
          src="/profiletest.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center"
        >
          <Card className="mx-auto max-w-max shadow-none border-none">
            <CardHeader>
              <CardTitle className="text-4xl my-5">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-10">
                <div className="grid grid-cols-2 gap-10">
                  {/* first name */}
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* lastname */}
                  <FormField
                    control={form.control}
                    name="LastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* phone */}
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="097-xxx-xxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                {/* email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="*******" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <Button type="submit" className="w-full">
                  {loading ? <Loader  className="animate-spin"/> : "Create an account"}
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with GitHub
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default page;
