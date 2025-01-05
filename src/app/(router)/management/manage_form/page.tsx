"use client";
import {
  AlignJustify,
  CircleHelp,
  DiscAlbum,
  EllipsisVertical,
  GitFork,
  Logs,
  MessageCircleQuestion,
  Plus,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
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
import GlobalApi from "@/app/_util/GlobalApi";

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

import { QuestionList } from "./_components/QuestionList";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { formStates, Role } from "@/types/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralEditPage from "../manage_form/_components/GeneralEditPage";
import FormLevelEditPage from "../manage_form/_components/FormLevelEditPage";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";

interface SlideStates {
  [key: string]: boolean;
}

enum SideBarEditSection {
  General = "General",
  FormLevel = "FormLevel",
}

const page = () => {
  const { roles, setRole } = useStore();
  const [slideStates, setSlideStates] = useState<SlideStates>({});
  const [formState, setFormState] = useState<formStates[]>([]);
  const { openForm, setOpenForm } = useStore();
  const [loading, setLoading] = useState(false);
  const { getThemeClass } = useThemeClass();
  const styles = useThemeStyles();
  const [sideBarEdit, setSideBarEdit] = useState<SideBarEditSection>(
    SideBarEditSection.General
  );

  // ตัว icon slide ตอนจะตั้งค่า
  const toggleSlide = (id: string) =>
    setSlideStates((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleApiError = (error: any, message: string) => {
    console.error({ message: error });
    toast("เกิดข้อผิดพลาด", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(error?.response?.data?.message, null, 2)}
          </code>
        </pre>
      ),
    });
  };

  const showToast = (title: string, description: string) => {
    toast(title, { description });
  };

  // เพื่อให้ง่ายเรางานกด create โดยไม่ต้องใส่ชื่อมาเลย จะให้ใส่ชื่อภายหลัง ในส่วนของการเพิ่มฟอร์ม
  const addForm = async (name: string) => {
    try {
      const response = await GlobalApi.createForm(name);
      const newform = response?.data.form;
      console.log("newform", newform);

      fetchForm();
      setFormState((prev) => [...prev, newform]);
      showToast("สร้างฟอร์มเรียนร้อย", `ชื่อฟอร์ม : ${newform.name}`);
    } catch (error: any) {
      console.error({ message: error });
      handleApiError(error, "Error while creating form");
    }
  };

  const deleteForm = async (id: string) => {
    try {
      const response = await GlobalApi.deleteForm(id);
      if (!response) {
        throw new Error("cannot delete");
      }
      showToast("ลบฟอร์มเรียนร้อย", `ชื่อฟอร์ม : ${response?.data.name}`);
      fetchForm();
    } catch (error: any) {
      console.error({ message: error });
      handleApiError(error, "Error while delete form");
    }
  };

  // แสดงรายการแบบฟอร์มทั้งหมเ
  const fetchForm = async () => {
    setLoading(true);
    try {
      const response = await GlobalApi.getForm();
      console.log("form", response?.data);
      setFormState(response?.data);
    } catch (error) {
      console.error({ message: error });
    } finally {
      setLoading(false);
    }
  };

  // ใช้ตอนที่เมื่อคลิกที่แบบฟอร์มไหนจะให้เห็นคำถามของฟอร์มนั้น
  const handleItemClick = (id: string) => {
    setOpenForm(id);
  };

  const renderSectionContent = (item: formStates) => {
    switch (sideBarEdit) {
      case SideBarEditSection.General:
        return <GeneralEditPage formItem={item} fetchForm={fetchForm} />;
      case SideBarEditSection.FormLevel:
        return <FormLevelEditPage formItem={item} fetchForm={fetchForm} />;
      default:
        return <div className="col-span-3 h-[400px] pl-7">Not found page</div>;
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);
  // useEffect(() => {
  //   console.log("openForm", openForm);
  // }, [openForm]);
  return (
    <div className={`m-5 w-full rounded-lg h-full ${styles.text}`}>
      <div className={`${styles.background} shadow p-6`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShieldAlert size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold">Form setting</h2>
        </div>
        <div className="grid @container grid-cols-5 h-full ">
          <div className="col-span-5 @[65rem]:col-span-2 @[65rem]:border-r p-5 ">
            <div className="flex justify-between my-2">
              <h2 className="text-xl font-semibold">แบบฟอร์มทั้งหมด</h2>
              <CircleHelp className="text-blue-500" strokeWidth={1.5} />
            </div>
            {formState &&
              formState.map((item, index) => (
                <div
                  className={getThemeClass(
                    {
                      light:
                        openForm.id === item.id
                          ? "bg-zinc-100"
                          : "bg-white hover:bg-zinc-50",
                      dark:
                        openForm.id === item.id
                          ? "bg-zinc-700"
                          : "bg-white hover:bg-zinc-500",
                    },
                    `relative overflow-hidden px-3 ${styles.background}`
                  )}
                  key={item.id + "main"}
                >
                  <div
                    className={`border-b w-full h-16 flex items-center group cursor-pointer`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex justify-between w-full items-center overflow-hidden ">
                      <div className="flex items-center">
                        <span className="text-3xl">📖</span>
                        <h2 className="text-md select-none truncate">
                          {item.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute top-1/2 -translate-y-1/2 right-2 gap-3 ${
                      slideStates[item.id] ? "pl-48" : "w-auto"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`absolute top-0 ${
                          slideStates[item.id]
                            ? "transition-all -translate-x-full -left-1/2 "
                            : "transition-all translate-x-full left-full top-1/2 -translate-y-1/2"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="hover:bg-blue-100 hover:text-blue-500 rounded-lg">
                                <div className="w-[80px] flex gap-2 justify-center cursor-pointer items-center">
                                  <Settings2 strokeWidth={1.25} size={20} />
                                  <h2>ตั้งค่า</h2>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[825px]  grid-cols-4">
                              <DialogHeader className="col-span-4">
                                <DialogTitle className="text-xl">
                                  Edit From
                                </DialogTitle>
                                <DialogDescription className="text-red-500">
                                  ชื่อของแบบฟอร์มจะส่งผลกับการ Export เอกสารด้วย
                                  โปรดตรวจสอบให้แน่ใจ
                                </DialogDescription>
                              </DialogHeader>
                              <Separator className="shrink-0 h-[0.5px] w-full col-span-4 bg-gray-200" />
                              <div className="col-span-1 flex flex-col gap-2">
                                {Object.values(SideBarEditSection).map(
                                  (section) => (
                                    <div
                                      className={getThemeClass(
                                        // จัดการสีพื้นหลังตาม theme
                                        {
                                          light: `${
                                            sideBarEdit === section &&
                                            "bg-zinc-100"
                                          }`,
                                          dark: `${
                                            sideBarEdit === section &&
                                            "bg-zinc-700"
                                          }`,
                                        },
                                        // classes อื่นๆ ที่ใช้ร่วมกัน
                                        `rounded-lg cursor-pointer p-2`
                                      )}
                                      onClick={() => setSideBarEdit(section)}
                                    >
                                      <h2 className="text-sm">{section}</h2>
                                    </div>
                                  )
                                )}
                              </div>
                              {renderSectionContent(item)}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="hover:bg-neutral-300 rounded-full">
                                <div className="w-[60px] flex gap-2 justify-center cursor-pointer items-center">
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
                        className={`top-0 z-20 relative`}
                      >
                        <div
                          className={`${
                            slideStates[item.id] ? "rotate-180" : "rotate-0"
                          } transition-all rounded-md group`}
                        >
                          {slideStates[item.id] ? (
                            <X strokeWidth={1.25} size={25} />
                          ) : (
                            <div
                              className={getThemeClass(
                                {
                                  light: "group-hover:bg-zinc-200",
                                  dark: "group-hover:bg-zinc-600",
                                },
                                `${styles.background} group-hover:bg-neutral-200 flex items-center 
                                cursor-pointer border py-1 gap-1 px-2 rounded-lg`
                              )}
                            >
                              <AlignJustify strokeWidth={1.25} size={15} />
                              เมนู
                            </div>
                          )}
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
            {/* ------------------------------------------------------ */}
            {openForm.id === null ? ( // openForm.id คือจะเก็บ id ของ form นั้นๆไว้
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
              <div className={`${styles.text}`}>
                <h2 className="text-xl my-3 font-bold">
                  คำถามของ{" "}
                  {formState.find((item) => item.id === openForm.id)?.name ||
                    "Unknow"}
                </h2>
                <div className="">
                  <QuestionList formId={openForm.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
