import React from "react";
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

interface EditPeriodProps {
  defaultPeriod: PeriodType;
  setTimeRange: React.Dispatch<React.SetStateAction<TimeRange>>;
  timeRange: TimeRange;
  setPeriod: (data: PeriodType[]) => void;
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
  setTimeRange,
  timeRange,
  setPeriod,
  setExpandedPeriodId,
}: EditPeriodProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultPeriod.title,
      isActive: defaultPeriod.isAction, // Add default value
    },
  });
  const {fetchCurrentPeriod} = useStore()
  const onUpdate = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        period_id: defaultPeriod.period_id,
        title: values.title,
        start: timeRange.from!.toISOString(),
        end: timeRange.to!.toISOString(),
        isAction: values.isActive ?? false,
      };
      const response = await GlobalApi.updatePeriod(data);
      const fetchedPeriods = await fetchCurrentPeriod();
      setPeriod(fetchedPeriods);
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
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onUpdate)}
        className="flex flex-col gap-3 items-center w-full bg-white rounded-br-lg rounded-bl-lg"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="grid gap-2 items-center w-full">
                  <Label className="">Title</Label>
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
          <Label className="col-span-1">From</Label>
          <div className="col-span-3">
            <DateTimePicker24h
              type="from"
              otherDate={new Date(defaultPeriod.end)} // Pass the 'to' date for comparison
              onTimeChange={
                (
                  date // date คือค่าที่ได้จาก newDate จาก DateTimePicker24h
                ) =>
                  setTimeRange((prev) => ({
                    ...prev,
                    from: date,
                  })) // อัพเดท state โดยเก็บค่าเดิมและอัพเดทเฉพาะ from
              }
              defaultValue={new Date(defaultPeriod.start)}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center w-full">
          <Label className="col-span-1">To</Label>
          <div className="col-span-3">
            <DateTimePicker24h
              type="to"
              otherDate={new Date(defaultPeriod.start)} // Pass the 'from' date for comparison
              onTimeChange={(date) =>
                setTimeRange((prev) => ({
                  ...prev,
                  to: date,
                }))
              }
              defaultValue={new Date(defaultPeriod.end)}
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
                  <Label htmlFor="period-active">Active</Label>
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
        <Button type="submit">Update Period</Button>
      </form>
    </Form>
  );
};

export default EditPariod;
