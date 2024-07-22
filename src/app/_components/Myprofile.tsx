"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import axios from "axios";
import { apiUrl } from "@/app/data/data-option";
import Image from "next/image";
import Link from "next/link";
import { Check, LinkIcon, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SetStatusSection from "./SetStatusSection";

const formSchema = z.object({
    image: z.instanceof(File).refine((file) => file.size > 0, {
        message: "Please upload a file.",
    }),
    firstName: z.string().min(2, {
        message: "FirstName is required",
    }),
    lastName: z.string().min(2, {
        message: "LastName is required",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    Department: z.string().min(10,{
        message: "Department must be at least 10 characters",
    })
});

export default function Myprofile() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "Krittphat",
            lastName: "Samrit",
            image: undefined,
            email:"copter1177@gmail.com",
            Department:"สำนักงานวิชาการ"
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        
        const formData = new FormData();
        formData.append("image", values.image);

        const response = await axios.put(`${apiUrl}/usersImage`, formData, {
            withCredentials: true, // เพื่อให้ cookies ถูกส่งไปด้วย
            headers: {
                "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
            },
        });
        console.log(response.data);
    }

    return (
        <div className="">
            <div className="relative bg-gray-100 w-full h-[100px]">
                <div className="absolute bottom-0 translate-y-1/2 px-4">
                    <Image
                        src={"/profiletest.jpg"}
                        width={100}
                        height={100}
                        alt={"profile"}
                        className="w-[85px] h-[85px] rounded-full object-cover border border-neutral-50 p-[2px] shadow-lg bg-white"
                    />
                    <div className="absolute button-0 right-0 -translate-x-full -translate-y-full bg-blue-500 text-white rounded-full p-1">
                        <Check strokeWidth={3} size={12} />
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="relative flex justify-end text-sm">
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center border gap-1 border-gray-300 py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all active:scale-95">
                            <LinkIcon size={16} />
                            <Link href={"#"}>Copy link</Link>
                        </div>
                        <div className="border border-gray-300 py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all active:scale-95">
                            <Link href={"#"}>View profile</Link>
                        </div>
                    </div>
                </div>
                <div className="my-3">
                    <h2 className="text-xl font-bold">Krittaphat Samrit</h2>
                    <h2 className="text-sm text-gray-500">Copter1177@gmail.com</h2>
                </div>
                <Separator className="my-3" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <div className="grid grid-cols-11 items-center gap-3">
                            <h2 className="col-span-3">Name</h2>
                            {/* firstName */}
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="firstName"
                                                    type="text"
                                                    className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            {/* lastName */}
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl className="col-span-4">
                                                <Input
                                                    id="lastName"
                                                    type="text"
                                                    className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator />
                        {/* email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-11 items-center gap-3">
                                        <h2 className="col-span-3">Email address</h2>
                                        <FormControl className="col-span-8">
                                            <div className="relative">
                                                <Mail strokeWidth={1.5} className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500" />
                                                <Input
                                                    id="email"
                                                    type="text"
                                                    className="pl-10  focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator />
                        {/* department */}
                        <FormField
                            control={form.control}
                            name="Department"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-11 items-center gap-3">
                                        <h2 className="col-span-3">Department</h2>
                                        <FormControl className="col-span-8">
                                            <div className="relative">
                                                <Input
                                                    id="Department"
                                                    type="text"
                                                    disabled
                                                    className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator />
                        {/* Role */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-11 items-center gap-3">
                                        <h2 className="col-span-3">Role</h2>
                                        <FormControl className="col-span-8">
                                            <div className="relative">
                                                <div className="flex items-center gap-3">
                                                    <SetStatusSection/>
                                                    <div className="bg-blue-500 text-white rounded-full p-1">
                                                        <Check strokeWidth={3} size={10} />
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-11 items-center gap-3">
                                        <h2 className="col-span-3">Picture</h2>
                                        <FormControl>
                                            <Input
                                                id="picture"
                                                type="file"
                                                onChange={(e) => {
                                                    field.onChange(e.target.files?.[0]); // Set the first file from the FileList
                                                }}
                                                className="col-span-8"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormDescription>
                                        This is your public display image.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full text-right">
                            <Button className="" type="submit">
                                Save Change
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
