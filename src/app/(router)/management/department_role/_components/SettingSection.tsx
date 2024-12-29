import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Cog,
  Flame,
  Gem,
  GraduationCap,
  Loader,
  MoonStar,
  ShieldCheck,
  Star,
  StarHalf,
} from "lucide-react";
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
import { Department, ImageType } from "@/types/interface";
import GlobalApi from "@/app/_util/GlobalApi";
import { ListEmployeeOfDepartment } from "./ListEmployeeOfDepartment";
import { useEffect, useRef, useState } from "react";
import useStore from "@/app/store/store";
import { toast } from "@/components/ui/use-toast";
import SetSuperviseOfDepartmentSection from "./SetSuperviseOfDepartmentSection";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.any().optional(),
  supervise: z.string().nullable().optional(),
});
interface SettingSectionProps {
  department: Department; // Replace 'string' with the appropriate type for departmentId
  fetchDepart: () => void;
}
export default function SettingSection({
  department,
  fetchDepart,
}: SettingSectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department.department_name,
      image: undefined,
    },
  });
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(department);
    console.log("values", values);
    try {
      setIsLoading(false);
      // ----------------------------
      // อัพเดทรูปหรือเพิ่มรูปใน department
      // ----------------------------
      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image as File);
        const response = await GlobalApi.updateDepartmentImage(
          formData,
          department
        );
        console.log("responseChangeImage", response);
      }
      // ----------------------------
      // อัพเดทเปลี่ยนชื่อ ของ department
      // ----------------------------
      const data = {
        department_id: department.id,
        department_name: values.name,
      };

      await GlobalApi.updateDepartment(data);
      // ----------------------------
      // อัพเดทส่วนของ supervise
      // ----------------------------
      // ถ้าไม่มีหรือไม่ได้กำหนด ก็จะเข้าเงื่อนไข if จะเป็นการสร้างขึ้น ในครั้งแรก
      const supervise = department?.supervise;
      const userId = values?.supervise;
      // ตรวจสอบเงื่อนไขก่อนดำเนินการ
      if (userId) {
        if (!supervise) {
          // กรณีไม่มี supervise ให้สร้างใหม่
          const payload = {
            userId,
            departmentId: department.id,
          };
          const response = await GlobalApi.createSupervise(payload);
          console.log("createSupervise", response?.data);
        } else {
          // กรณีมี supervise แล้ว ให้อัพเดท
          const payload = {
            superviseId: supervise.supervise_id,
            userId,
            departmentId: department.id,
          };
          const updateSupervise = await GlobalApi.updateSupervise(payload);
          console.log("updateSupervise", updateSupervise?.data);
        }
      }

      // ถ้าตรวจพบ supervise ว่ามีอยู่แล้วใน หน่วยงานนี้ จะเป็นการ Update แทน
      fetchDepart();
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
  const handleSuperviseChange: any = (newHead: any) => {
    setValue("supervise", newHead);
  };

  useEffect(() => {
    // console.log("department", department);
    fetchDepart();
  }, []);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <Cog scale={13} /> ตั้งค่า
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="overflow-y-scroll w-full sm:max-w-5xl scrollbar-gemini pb-10"
      >
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>
            Make changes to your Department here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="@container">
              <div className="grid grid-cols-4 mx-8 gap-3 my-5">
                <div
                  onClick={handleImageClick}
                  className="w-full h-full col-span-4 @[628px]:col-span-1 flex justify-center @[628px]:justify-center"
                >
                  <div className="relative group border w-[280px] max-h-[220px] rounded-lg  cursor-pointer overflow-hidden ">
                    <Image
                      src={
                        selectedImage || department.image?.url || "/test.png"
                      }
                      width={400}
                      height={220}
                      alt="ProfileDepartment"
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
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
                </div>
                <div className="col-span-4 @[628px]:col-span-3 ">
                  <div className="flex justify-center @[628px]:justify-start w-full">
                    <div className="grid grid-cols-1 gap-3 max-w-[400px]">
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
                      {/* ---------------------------- */}
                      {/* Select รองผู้อำนวยการ/กำกับดูแล  */}
                      {/* ---------------------------- */}
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="supervise"
                          render={({ field }) => (
                            <FormItem className="">
                              <FormControl>
                                <div className="grid grid-cols-4 items-center gap-2">
                                  <Label
                                    htmlFor="supervise"
                                    className="text-left col-span-4"
                                  >
                                    รองผู้อำนวยการ/กำกับดูแล
                                  </Label>
                                  <div className="col-span-4">
                                    <SetSuperviseOfDepartmentSection
                                      onSuperviserChange={handleSuperviseChange}
                                      defaultValue={department?.supervise}
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
                </div>
              </div>
              <div className="my-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="font-semibold ">Team Members</h2>
                    <p className="text-sm text-neutral-500">
                      Invite your team members to collaborate.
                    </p>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-2 rounded-lg">
                      <div className="flex justify-end items-center gap-2">
                        <ShieldCheck strokeWidth={1.5} className="text-blue-500" />
                        รองผู้อำนวยการ/กำกับดูแล :{" "}
                      </div>
                      <div className="flex items-center gap-2">
                        {department?.supervise?.user && (
                          <Image
                            src={
                              typeof department?.supervise?.user?.image ===
                              "string"
                                ? department?.supervise?.user?.image
                                : (
                                    department?.supervise?.user
                                      ?.image as ImageType
                                  )?.url || "/profiletest.jpg"
                            }
                            width={30}
                            height={30}
                            alt="ProfileDepartment"
                            className="w-[30px] h-[30px] object-cover object-center rounded-full"
                          />
                        )}

                        <h2 className="text-right text-stone-700">
                          {department?.supervise?.user?.name}
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-1 rounded-lg">
                      <div className="flex justify-end items-center gap-2">
                        <GraduationCap
                          strokeWidth={1.5}
                          className="text-green-500"
                        />
                        สังกัดที่หน่วยงาน :{" "}
                      </div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-right text-stone-700">
                          {
                            department?.supervise?.user?.department
                              ?.department_name
                          }
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* List Team of department */}
                <div className="">
                  <ListEmployeeOfDepartment
                    department={department}
                    fetchData={fetchDepart}
                  />
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
      </SheetContent>
    </Sheet>
  );
}
