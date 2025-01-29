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
import GlobalApi, { apiUrl } from "@/app/_util/GlobalApi";
import { Department } from "@/types/interface";

const formSchema = z
  .object({
    FirstName: z.string().min(2, {
      message: "ต้องมีอย่างน้อย 2 ตัวอักษร",
    }),
    LastName: z.string().min(2, {
      message: "ต้องมีอย่างน้อย 2 ตัวอักษร",
    }),
    email: z.string().email({
      message: "กรอกที่อยู่อีเมลให้ถูกต้อง",
    }),
    phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
      message: "หมายเลขโทรศัพท์ต้องอยู่ในรูปแบบที่ถูกต้อง",
    }),
    password: z
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
    prefix: z.string().optional(),
    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"], // Error message will be displayed under confirmPassword field
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
    // console.log(values);
    const new_user = {
      name: values.FirstName + " " + values.LastName,
      email: values.email,
      password: values.password,
      phone: values.phoneNumber,
      prefix: values.prefix || null, // Use null if prefix is not provided
      department: values.department || null, // Use null if department is not provided
    };

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/sign-up`, new_user);
      toast({
        title: "Sigup success",
        description: `✅ ${response.data.message}`,
        className: "bg-black text-white",
      });
      // console.log(response);
      Router.push("/sign-in");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }
  return (
    <div
      className={` relative w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen`}
    >
      <div className="hidden bg-muted lg:block overflow-hidden">
        <Image
          src="/wallpaperLogin.png"
          alt="Image"
          width={1280}
          height={980}
          className="h-full w-full object-cover"
          unoptimized={true}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex items-center `}
        >
          <Card
            className={`mx-auto max-w-max shadow-none border-none bg-transparent`}
          >
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
                        <FormLabel>คำนำหน้า</FormLabel>
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
                  {/* department */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หน่วยงานที่สังกัด</FormLabel>
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
                        <FormLabel>ชื่อ</FormLabel>
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
                        <FormLabel>นามสกุล</FormLabel>
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
                      <FormLabel>เบอร์โทรศัพท์</FormLabel>
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
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <span className="text-sm">
                        รหัสผ่านต้องมี 8 ตัวขึ้นไป มีตัวพิมพ์เล็ก พิมพ์ใหญ่
                        และตัวเลขอย่างน้อย 1 ตัว*
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" className="w-full">
                  {loading ? <Loader className="animate-spin" /> : "สร้างบัญชี"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                หากคุณมีบัญชีที่พร้อมใช้งานแล้ว{" "}
                <Link href="/sign-in" className="underline">
                  เข้าสู่ระบบที่นี่
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
