"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import GlobalApi from "@/app/_unit/GlobalApi";
import EditQuestionDialog from "./EditQuestionDialog";

import { toast } from "sonner"
export type questionProp = {
  id: string;
  content: string;
};

const formSchema = z.object({
  content: z
    .string()
    .min(10, { message: "massage must be at least 10 characters." }) // ขั้นต่ำ 10 ตัวอักษร
    .max(100, { message: "massage must not exceed 100 characters." }),
});

export const columns: ColumnDef<questionProp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "index",
    header: "ลำดับ",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "content",
    header: "ข้อคำถาม",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("content")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const question = row.original;
      const [open, setOpen] = useState(false);
      const handleUpdate = async (values: any) => {
        try {
          const payload = {
            questionId: question.id, 
            content: values.content,
          }
          // console.log("value",payload);
          const response = await GlobalApi.updateQuestion(payload);
          if (!response) {
            throw new Error("Question update fail");
          }
        } catch (error) {
          console.error({ message: error });
        }
      };
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(question.content)}
              >
                Copy question
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Edit section  */}
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* 1. การส่ง Props ไปยัง EditQuestionDialog */}
          <EditQuestionDialog
            open={open} // สถานะการเปิด/ปิด Dialog (boolean)
            setOpen={setOpen} // function สำหรับเปลี่ยนสถานะ Dialog
            question={question} // ข้อมูล question ที่ต้องการแก้ไข
            onUpdate={handleUpdate} // function callback สำหรับการ update
          />
        </>
      );
    },
  },
];
type QuestionListProp = {
  formId: string;
};
export function QuestionList({ formId }: QuestionListProp) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [question, setQuestion] = useState([]);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // ใช้  spread operator เพื่อ ประกอบ Json มาใหม่
      const data = {
        ...values,
        formId: formId,
      };
      const response = await GlobalApi.createQuestion(data);
      // console.log("response", response);
      fetchQuestion();
      setOpen(false);
      toast("Event has been created", {
        description: `ชื่อคำถาม : ${response?.data.content}`,
      })
    } catch (error) {
      console.log(error);
    }
  };
  const deleteQuestion = async () => {
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      console.log("payload", selectData);

      const response = await GlobalApi.deleteQuestion(selectData);
      console.log("response", response);
      if (!response) {
        throw new Error("Question delete fail");
      }
      toast("Event has been delete", {
        description: `message : ${response?.data.message}`,
      })
      fetchQuestion();
    } catch (error:any) {
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
    }
  };
  const fetchQuestion = async () => {
    const response = await GlobalApi.getQuestion(formId);
    setQuestion(response?.data);
    // console.log(response?.data);
  };
  useEffect(() => {
    fetchQuestion();
  }, [formId]);
  useEffect(() => {
    const selectData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    console.log("rowSelection", selectData);
  }, [rowSelection]);
  const table = useReactTable({
    data: question,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter question..."
          value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("content")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="hover:bg-red-50 border-none text-red-500 bg-white"
                disabled={
                  table.getFilteredSelectedRowModel().rows.length > 0
                    ? false
                    : true
                }
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-red-500">
                  This action cannot be undone. This will permanently delete.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <h2 className="text-stone-700 ">รายละเอียดข้อมูลที่จะลบ </h2>
              <ScrollArea className="h-52 w-full">
                <div className="inline-flex flex-wrap gap-3 ">
                  {table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-full border py-1 text-stone-700 text-sm px-2"
                      >
                        {item.content}
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteQuestion()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="active:scale-95 transition-all select-none gap-2"
              >
                <Plus />
                Add question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Craete Question</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid gap-4 py-4">
                            <div className="grid w-full gap-1.5">
                              <Label htmlFor="message-2">Your Content</Label>
                              <Textarea
                                placeholder="Type your content here."
                                id="message-2"
                                {...field}
                              />
                              <p className="text-sm text-muted-foreground">
                                Your message will be copied to the support team.
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Change</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`${
                        header.id === "index" ? "text-center" : ""
                      }`}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
