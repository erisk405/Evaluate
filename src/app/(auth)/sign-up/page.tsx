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
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlobalApi from "@/app/_unit/GlobalApi";
import { Department } from "@/types/interface";

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
  prefix: z.string().min(1, { message: "กรุณาใส่คำนำหน้าชื่อ" }),
  department: z.string().min(1, { message: "กรุณาใส่หน่วยงานที่ประจำอยู่" }),
});

const page = () => {
  const [loading, setLoading] = useState(false);
  const [prefix, setPrefix] = useState<
    { prefix_id: string; prefix_name: string }[] | null
  >(null);
  const [department, setDepartment] = useState<Department[]>([]);

  const fetchDataOfSelection = async () => {
    const prefixResponse = await GlobalApi.getPrefix();
    const departmentResponse = await GlobalApi.getDepartment();
    setDepartment(departmentResponse?.data);
    setPrefix(prefixResponse?.data);
  };
  useEffect(() => {
    fetchDataOfSelection();
  }, []);
  const Router = useRouter();
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      FirstName: "",
      LastName: "",
      phoneNumber: "",
      password: "",
      prefix: "", // ค่าเริ่มต้นของ select
      department: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const new_user = {
      name: values.FirstName + " " + values.LastName,
      email: values.email,
      password: values.password,
      phone: values.phoneNumber,
      prefix: values.prefix,
      department: values.department,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/sign-up`, new_user);
      toast({
        title: "Sigup success",
        description: `✅ ${response.data.message}`,
        className: "bg-black text-white",
      });
      console.log(response);
      Router.push("/sign-in");
    } catch (error) {
      setLoading(false);
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
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a prefix</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="คำนำหน้าชื่อ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>คำนำหน้า</SelectLabel>

                              {prefix?.map((item) => (
                                <SelectItem
                                  key={`${item.prefix_id}`}
                                  value={item.prefix_id}
                                >
                                  {item.prefix_name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a department</FormLabel>
                        <Select
                          onValueChange={field.onChange} // อัพเดตค่าเมื่อเลือก
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="หน่วยงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>หน่วยงาน</SelectLabel>
                              {department?.map((item) => (
                                <SelectItem key={`${item.id}`} value={item.id}>
                                  {item.department_name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <Input
                          placeholder="*******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Create an account"
                  )}
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
