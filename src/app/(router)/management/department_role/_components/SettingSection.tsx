import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cog, Loader } from "lucide-react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Department } from "@/types/interface";
import GlobalApi from "@/app/_unit/GlobalApi";
import { ListEmployeeOfDepartment } from "./ListEmployeeOfDepartment";
import { useEffect, useRef, useState } from "react";
import useStore from "@/app/store/store";
import { toast } from "@/components/ui/use-toast";
import SetHeadOfDepartmentSection from "./SetHeadOfDepartmentSection";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    image: z.any().optional(),
    head: z.string().nullable().optional(),
    deputy: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.head && data.deputy) {
        return data.head !== data.deputy;
      }
      return true;
    },
    {
      message: "Head and Deputy cannot be the same person",
      path: ["deputy"],
    }
  );

interface SettingSectionProps {
  department: Department; // Replace 'string' with the appropriate type for departmentId
}
export default function SettingSection({ department }: SettingSectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department.department_name,
      image: undefined,
    },
  });
  const { setDepartments } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // for change when select file image
  const [selectedImage, setSelectImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      setDepartments(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(department);
    console.log("values", values);
    try {
      setIsLoading(false);
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image as File);
        const response = await GlobalApi.updateDepartmentImage(
          formData,
          department
        );
        console.log("responseChangeImage", response);
      }
      if (values.head != values.deputy || values.name != department.department_name) {
        const data = {
          department_id: department.id,
          department_name: values.name,
          headOfDepartment_id: values.head || null,
          deputyDirector_id: values.deputy || null,
        };

        await GlobalApi.updateDepartment(data);
      }

      getDepartment();
      toast({
        description: `✅ Your are edit department success`,
      });
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageClick = () => {
    // Trigger the click event on the file input
    fileInputRef.current?.click();
  };

  const { setValue } = form;
  const handleHeadChange: any = (newHead: any) => {
    setValue("head", newHead);
  };
  const handleDeputyChange: any = (newDeputy: any) => {
    setValue("deputy", newDeputy);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Cog scale={13} /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-scroll sm:max-w-5xl scrollbar-gemini pb-10">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>
            Make changes to your Department here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="flex justify-center items-end gap-3 my-5">
                <div
                  onClick={handleImageClick}
                  className="relative cursor-pointer overflow-hidden group rounded-full"
                >
                  {department.image ? (
                    <Image
                      src={selectedImage ? selectedImage : department.image.url}
                      width={400}
                      height={300}
                      alt="ProfileDepartment"
                      className="w-[200px] h-[200px] object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src={selectedImage ? selectedImage : "/test.png"}
                      width={400}
                      height={300}
                      alt="ProfileDepartment"
                      className="w-[200px] h-[200px] object-cover rounded-full"
                    />
                  )}
                  <div
                    className="absolute top-0 bg-black bg-opacity-70
                            left-0 bottom-0 right-0 text-white rounded-lg   
                            translate-x-full group-hover:translate-x-0 transition-all duration-300"
                  >
                    <div className="flex  justify-center font-bold items-center h-full text-3xl">
                      Click!!
                    </div>
                  </div>
                </div>
                <div className=" grid gap-3 w-[400px]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="name" className="text-left">
                              Name
                            </Label>
                            <Input
                              id="name"
                              {...field}
                              className="col-span-4"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="image" className="text-left">
                              image
                            </Label>
                            <Input
                              id="image"
                              onChange={(e) => {
                                field.onChange(e.target.files?.[0]);
                                handleImageChange(e);
                              }}
                              type="file"
                              className="col-span-4"
                              ref={fileInputRef}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="deputy"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label
                                htmlFor="deputy"
                                className="text-left col-span-4"
                              >
                                รองผู้อำนวยการ
                              </Label>
                              <div className="col-span-4">
                                <SetHeadOfDepartmentSection
                                  onDeputyChange={handleDeputyChange}
                                  department={department}
                                  defaultValue={department.deputyDirector}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="head"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <div className="grid grid-cols-4 items-center gap-2">
                              <Label
                                htmlFor="head"
                                className="text-left col-span-4"
                              >
                                หัวหน้างาน
                              </Label>
                              <div className="col-span-4">
                                <SetHeadOfDepartmentSection
                                  onHeadChange={handleHeadChange}
                                  department={department}
                                  defaultValue={department.headOfDepartment}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="my-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold ">Team Members</h2>
                    <p className="text-sm text-neutral-500">
                      Invite your team members to collaborate.
                    </p>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      <h2 className="text-right font-bold">รองผู้อำนวยการ</h2>
                      <div className="col-span-2">
                        {department.deputyDirector
                          ? department.deputyDirector.name
                          : "-"}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <h2 className="text-right font-bold">หัวหน้างาน</h2>
                      <div className="col-span-2">
                        {department.headOfDepartment
                          ? department.headOfDepartment.name
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* List Team of department */}
                <div className="">
                  <ListEmployeeOfDepartment department={department} />
                </div>
              </div>
            </div>
            <div className="fixed right-5 bottom-5">
              {isLoading ? (
                <Button className="w-32" type="submit">
                  Save Change
                </Button>
              ) : (
                <Button className="w-32 animate-pulse" type="button">
                  <Loader className="animate-spin" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
