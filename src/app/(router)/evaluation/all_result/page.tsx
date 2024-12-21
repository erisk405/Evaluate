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

const page = () => {
  const [open, setOpen] = useState(true);
  const [openPeriod, setOpenPeriod] = useState(true);
  const [openRole, setOpenRole] = useState(true);
  const { departments, setDepartments } = useStore();
  const { roles, setRole } = useStore();

  const FormSchema = z.object({
    departments: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    itemsRole: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
  });
  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      setDepartments(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
      // console.log("departments", departments);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      departments: [],
      itemsRole: [], // เพิ่มค่าเริ่มต้นเป็น array ว่าง
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
  useEffect(() => {
    if (roles && roles.length > 0) {
      const roleIds = roles
        .filter(
          (role) => role.role_name !== "member" && role.role_name !== "admin"
        )
        .map((role) => role.id);
      form.setValue("itemsRole", roleIds);
    }
    if (departments && departments.length > 0) {
      const departmentIds = departments.map((dep) => dep.id);
      form.setValue("departments", departmentIds);
    }
  }, [roles, form, departments]);
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
                  name="departments"
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
                          {departments.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="departments"
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
                                    {item.department_name}
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
                      <Collapsible open={openRole} onOpenChange={setOpenRole}>
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
                          {roles.map(
                            (item) =>
                              item.role_name !== "member" &&
                              item.role_name !== "admin" && (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="itemsRole"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            item.id
                                          )}
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
                              )
                          )}
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
