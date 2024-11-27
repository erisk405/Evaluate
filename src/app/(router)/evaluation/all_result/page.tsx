"use client";
import React, { useEffect, useState } from "react";
import { ListAllEmployee } from "./_components/ListAllEmployee";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
const items = [
  {
    id: "IT01",
    label: "สำนักงานอำนวยการ",
  },
  {
    id: "IT02",
    label: "งานบริหารงานทั่วไป",
  },
  {
    id: "IT03",
    label: "งานประกันคุณภาพและประเมินผล",
  },
  {
    id: "IT04",
    label: "งานพัฒนาวิชาการและส่งเสริมการศึกษา",
  },
  {
    id: "IT05",
    label: "งานทะเบียนและประมวลผล",
  },
  {
    id: "IT06",
    label: "งานฝึกประสบการณ์วิชาชีพนักศึกษา",
  },
] as const;

const page = () => {
  const [open, setOpen] = useState(true);
  const [openPeriod, setOpenPeriod] = useState(true);
  const [openRole, setOpenRole] = useState(true);

  const { roles, setRole } = useStore();

  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
    itemsRole: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    itemsPeriod: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["IT04", "IT05"],
      itemsRole: [
        "81911879-52c6-4c8f-9732-fda56aac0e54",
        "7d3cd037-67fa-4771-8885-a406622f7e39",
        "3ee8b849-cc18-4e30-b0df-6aaab9e942b3",
      ], // เพิ่มค่าเริ่มต้นเป็น array ว่าง
      itemsPeriod: ["IP03", "IP04"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
    } catch (error) {
      console.error({ message: data });
    }
  }
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      // console.log("role:", response);
      setRole(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRole();
  }, []);
  // useEffect(() => {
  //   console.log(roles);
  // }, [roles]);
  return (
    <div className="m-5 grid grid-cols-4 w-full gap-3">
      <div className="w-full col-span-3">
        <h2 className="text-3xl font-bold text-stone-700">รายชื่อทั้งหมด</h2>
        <ListAllEmployee />
      </div>
      <div className="col-span-1">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-stone-700">Filter area</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem>
                      <Collapsible open={open} onOpenChange={setOpen}>
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between w-full text-left mb-4">
                            <div>
                              <FormLabel className="text-base">
                                หน่วยงาน
                              </FormLabel>
                              <FormDescription>
                                สามารถหน่วยงานที่ต้องการในการกรองข้อมูล
                              </FormDescription>
                            </div>
                            <ChevronDown
                              className={`h-6 w-6 transition-transform duration-200 ${
                                open ? "transform rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-4 pl-6">
                          {items.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="items"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemsRole"
                  render={() => (
                    <FormItem>
                      <Collapsible
                        open={openRole}
                        onOpenChange={setOpenRole}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between w-full text-left mb-4">
                            <div>
                              <FormLabel className="text-base">
                                ตำแหน่ง
                              </FormLabel>
                              <FormDescription>
                                เลือกตำแหน่งที่ต้องการจะกรองข้อมูล
                              </FormDescription>
                            </div>
                            <ChevronDown
                              className={`h-6 w-6 transition-transform duration-200 ${
                                openRole ? "transform rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-4 pl-6">
                          {roles.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="itemsRole"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.role_name}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="flex justify-end">
                  <Button type="submit">Submit</Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
