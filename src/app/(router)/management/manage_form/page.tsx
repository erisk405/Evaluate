"use client";
import {
  CircleHelp,
  EllipsisVertical,
  MessageCircleQuestion,
  Plus,
  Settings2,
  ShieldAlert,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_unit/GlobalApi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

interface SlideStates {
  [key: string]: boolean;
}

interface formStates {
  id: string;
  name: string;
}

const formSchema = z.object({
  formName: z
    .string()
    .min(5, { message: "Role name must be at least 5 characters." }) // ขั้นต่ำ 5 ตัวอักษร
    .max(50, { message: "Role name must not exceed 50 characters." }), // สูงสุด 50 ตัวอักษร
});

const DataQuestion = [
  {
    id: "Q001",
    question: "ปริมาณผลงาน",
  },
  {
    id: "Q002",
    question: "ความอุสาหพยายาม",
  },
  {
    id: "Q003",
    question: "การบำรุงรักษาเครื่องมือและอุปกรณ์ที่ใช้",
  },
  {
    id: "Q004",
    question: "การตัดสินใจและแก้ปัญหาเฉพาะหน้า",
  },
  {
    id: "Q005",
    question: "ความคิดริเริ่มในการปฎิบัติงาน",
  },
  {
    id: "Q006",
    question:
      "ความรับผิดชอบต่อหน้าที่ ที่ได้รับมอบหมายความรับผิดชอบต่อหน้าที่ ",
  },
  {
    id: "Q007",
    question: "ความรวดเร็วในการปฏิบัติงาน",
  },
  {
    id: "Q008",
    question: "ตรงต่อเวลาในการทำงาน",
  },
];

const page = () => {
  const [slideStates, setSlideStates] = useState<SlideStates>({});
  const [formState, setFormState] = useState<formStates[]>([]);
  const { openForm, setOpenForm } = useStore();

  // ตัว icon slide ตอนจะตั้งค่า
  const toggleSlide = (id: string) => {
    setSlideStates((prevStates) => ({
      ...prevStates,
      [id]: !(prevStates[id] ?? false),
    }));
  };

  // เพื่อให้ง่ายเรางานกด create โดยไม่ต้องใส่ชื่อมาเลย จะให้ใส่ชื่อภายหลัง ในส่วนของการเพิ่มฟอร์ม
  const addForm = async (name: string) => {
    try {
      const response = await GlobalApi.createForm(name);
      const newform = response?.data;
      setFormState((prev) => [...prev, newform]);
    } catch (error) {
      console.error({ message: error });
    }
  };

  const deleteForm = async (id: string) => {
    try {
      await GlobalApi.deleteForm(id);
      fetchForm();
    } catch (error) {
      console.error({ message: error });
    }
  };

  // แสดงรายการแบบฟอร์มทั้งหมเ
  const fetchForm = async () => {
    try {
      const response = await GlobalApi.getForm();
      setFormState(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };

  // ใช้ตอนที่เมื่อคลิกที่แบบฟอร์มไหนจะให้เห็นคำถามของฟอร์มนั้น
  const handleItemClick = (id: string) => {
    setOpenForm(id);
  };

  // set ค่า defualt
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formName: "",
    },
  });

  // ที่ต้องใช้ handleSubmit ที่เรียกจาก function แบบนี้ เพราะเราอยากได้ id จาก formState มาด้วยจึงต้องทำแยก
  const handleSaveChanges = (formId: string) => {
    form.handleSubmit((values) => onSubmit(values, formId))();
  };
  // onSubmit ของ Edit form ในการเปลี่ยนชื่อ
  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    formId: string
  ) => {
    try {
      const data = {
        id: formId,
        name: values.formName,
      };
      console.log(data);
      await GlobalApi.updateForm(data);
      fetchForm();
    } catch (error) {
      console.error({ message: error });
    }
  };
  useEffect(() => {
    fetchForm();
  }, []);
  return (
    <div className="m-5 w-full">
      <div className="bg-white shadow h-screen p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShieldAlert size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl text-stone-700 font-bold">Form setting</h2>
        </div>
        <div className="grid @container grid-cols-5 h-[500px] ">
          <div className="col-span-5 @[65rem]:col-span-2 border-r p-5 ">
            <div className="flex justify-between my-2">
              <h2 className="text-xl text-stone-700 font-semibold">
                แบบฟอร์มทั้งหมด
              </h2>
              <CircleHelp className="text-yellow-500" />
            </div>
            {formState &&
              formState.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-b w-full h-16 rounded-sm flex items-center p-3  group cursor-pointer ${
                    openForm.id === item.id
                      ? "bg-neutral-100 text-stone-700 "
                      : "bg-white hover:bg-neutral-100"
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex justify-between w-full items-center overflow-hidden">
                    <h2 className="text-md select-none truncate">{item.name}</h2>
                    <div className={`flex justify-end gap-3 ${slideStates[item.id] ? 'pl-48' : 'w-auto'}`}>
                      <div className="relative">
                        <div
                          className={`absolute top-0 ${
                            slideStates[item.id]
                              ? "transition-all -translate-x-full -left-1/2"
                              : "transition-all translate-x-0"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="hover:bg-blue-100 hover:text-blue-500 rounded-lg">
                                  <div className="w-[100px] flex gap-2 justify-center  items-center">
                                    <Settings2 strokeWidth={1.25} size={20} />
                                    <h2>เปลี่ยนชื่อ</h2>
                                  </div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit From</DialogTitle>
                                  <DialogDescription className="text-red-500">
                                    ชื่อของแบบฟอร์มจะส่งผลกับการ Export
                                    เอกสารด้วย โปรดตรวจสอบให้แน่ใจ
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                  <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid gap-2 ">
                                      <div className="">
                                        <FormField
                                          control={form.control}
                                          name="formName"
                                          render={({ field }) => (
                                            <FormItem>
                                              <Label htmlFor="name">Name</Label>
                                              <FormControl>
                                                <Input
                                                  id="name"
                                                  className="col-span-3 mt-2"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <p className="text-sm text-muted-foreground">
                                                Your message will be copied to
                                                the describtion role.
                                              </p>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button
                                          type="submit"
                                          className="mt-3"
                                          onClick={() =>
                                            handleSaveChanges(item.id)
                                          }
                                        >
                                          Save changes
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div className="hover:bg-neutral-300 rounded-full">
                                  <div className="w-[60px] flex gap-2 justify-center items-center">
                                    <Trash2 strokeWidth={1.25} size={20} />
                                    <h2>ลบ</h2>
                                  </div>
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-red-500">
                                    โปรดตรวจสอบให้แน่ใจ หากลบแบบฟอร์มนี้
                                    คำถามทั้งหมดของแบบฟอร์มนี้จะหายไป
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteForm(item?.id)}
                                  >
                                    Sure
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div
                          onClick={() => toggleSlide(item.id)}
                          className={`  top-0 z-20 relative
                          ${
                            openForm.id === item.id
                              ? "bg-neutral-100 text-black "
                              : "bg-white text-black group-hover:bg-neutral-100"
                          }  
                    `}
                        >
                          <div
                            className={`${
                              slideStates[item.id] ? "rotate-180" : "rotate-0"
                            } transition-all`}
                          >
                            {slideStates[item.id] ? (
                              <X strokeWidth={1.25} size={25} />
                            ) : (
                              <EllipsisVertical strokeWidth={1.25} size={25} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <Button
              variant="outline"
              className="w-full h-10 active:scale-95 transition-all mt-3 select-none gap-2"
              onClick={() => addForm("untitle_" + (formState.length + 1))}
            >
              <Plus />
              Add form
            </Button>
          </div>
          <div className="col-span-5 @[65rem]:col-span-3 p-5 grid ">
            {/* ------------------------------------------------------ */}
            {/*                   Question Section                     */}
            {/* ------------------------------------------------------- */}
            {openForm.id === null ? (
              <div className="flex justify-center items-center gap-3 flex-col">
                <div className="relative">
                  <MessageCircleQuestion
                    size={150}
                    className="text-blue-500 "
                  />
                  <MessageCircleQuestion
                    size={150}
                    className="absolute top-0 text-blue-500 opacity-10 animate-ping"
                  />
                </div>
                <h2 className="text-lg">Click any form your created.</h2>
              </div>
            ) : (
              <div className="text-stone-700">
                <h2 className="text-xl text-stone-700 my-3 font-bold">
                  คำถามของ{" "}
                  {formState.find((item) => item.id === openForm.id)?.name ||
                    "Unknow"}
                </h2>
                <div className="border rounded-lg">
                  <Table>
                    <TableCaption>A list of your recent question.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ลำดับ</TableHead>
                        <TableHead className="w-full">ข้อคำถาม</TableHead>
                        <TableHead className="text-right">action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DataQuestion.map((question, index) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>{question.question}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Edit</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 active:scale-95 transition-all mt-3 select-none gap-2"
                    >
                      <Plus />
                      Add question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Craete Question</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message-2">Your Content</Label>
                        <Textarea
                          placeholder="Type your content here."
                          id="message-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          Your message will be copied to the support team.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Change</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
