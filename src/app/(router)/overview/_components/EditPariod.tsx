import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import DateTimePicker24h from "./DateTimePicker24h";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlobalApi from "@/app/_util/GlobalApi";
import { toast } from "@/components/ui/use-toast";
import { PeriodType, TimeRange } from "@/types/interface";
import { Switch } from "@/components/ui/switch";
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";
import { Loader } from "lucide-react";

interface EditPeriodProps {
  defaultPeriod: PeriodType;
  setExpandedPeriodId: React.Dispatch<React.SetStateAction<string | null>>;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "massage must be least 10 characters." })
    .max(100, { message: "massage must not exceed 100 characters." }),
  isActive: z.boolean().optional(), // Add this line
});

const EditPariod = ({
  defaultPeriod,
  setExpandedPeriodId,
}: EditPeriodProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultPeriod.title,
      isActive: defaultPeriod.isAction, // Add default value
    },
  });
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: new Date(defaultPeriod.start),
    to: new Date(defaultPeriod.end),
  });

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const { fetchCurrentPeriod } = useStore();
  const onUpdate = async (values: z.infer<typeof formSchema>) => {
    setIsUpdateLoading(true);
    try {
      const data = {
        period_id: defaultPeriod.period_id,
        title: values.title,
        start: timeRange.from!.toISOString(),
        end: timeRange.to!.toISOString(),
        isAction: values.isActive ?? false,
      };
      const response = await GlobalApi.updatePeriod(data);
      await fetchCurrentPeriod();
      setExpandedPeriodId(null); // พออัพเดทเสร็จก็ให้ ปิดถาดลง
      toast({
        title: "อัพเดทช่วงเวลาเรียบร้อยแล้ว",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(response?.data, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error: any) {
      console.error({ message: error });
      toast({
        title: "เกิดข้อผิดพลาด",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(error.response.data.message, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setIsUpdateLoading(false);
    }
  };
  useEffect(() => {
    console.log("timeRange", timeRange);
  }, [timeRange]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onUpdate)}
        className={`flex flex-col gap-3 items-center w-full rounded-br-lg rounded-bl-lg`}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="grid gap-2 items-center w-full">
                  <Label className="">ชื่อรอบการประเมิน</Label>
                  <div className="w-full">
                    <Input
                      placeholder="รอบที่ x ประจำปีงบประมาณ พ.ศ. xxxx"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4 items-center w-full">
          <Label className="col-span-1">เริ่มต้น</Label>
          <div className="col-span-3">
            <DateTimePicker24h
              type="from"
              otherDate={timeRange.to} // Pass the 'to' date for comparison
              onTimeChange={
                (
                  date // date คือค่าที่ได้จาก newDate จาก DateTimePicker24h
                ) =>
                  setTimeRange((prev) => ({
                    ...prev,
                    from: date,
                  })) // อัพเดท state โดยเก็บค่าเดิมและอัพเดทเฉพาะ from
              }
              defaultValue={timeRange.from}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center w-full">
          <Label className="col-span-1">สิ้นสุด</Label>
          <div className="col-span-3">
            <DateTimePicker24h
              type="to"
              otherDate={timeRange.from} // Pass the 'from' date for comparison
              onTimeChange={(date) =>
                setTimeRange((prev) => ({
                  ...prev,
                  to: date,
                }))
              }
              defaultValue={timeRange.to}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="grid grid-cols-4 items-center w-full">
                  <Label htmlFor="period-active">เปิดใช้งาน</Label>
                  <Switch
                    id="period-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdateLoading}>
          {isUpdateLoading ? (
            <div className="px-6">
              <Loader className="animate-spin" />
            </div>
          ) : (
            "บันทึกรอบการประเมิน"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditPariod;
