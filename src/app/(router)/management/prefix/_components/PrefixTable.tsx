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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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

import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { PrefixType } from "@/types/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import EditPrefixName from "./EditPrefixName";
import { useThemeStyles } from "@/hooks/useTheme";

const formSchema = z.object({
  prefix_name: z
    .string()
    .min(1, { message: "massage must be at least 10 characters." }) // ขั้นต่ำ 10 ตัวอักษร
    .max(30, { message: "massage must not exceed 100 characters." }),
});

const PrefixTable = () => {
  const styles = useThemeStyles();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { prefixes, setPrefix } = useStore();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix_name: "",
    },
  });
  const fetchPrefix = async () => {
    try {
      const response = await GlobalApi.getPrefix();
      console.log("prefix", response?.data);
      setPrefix(response?.data);
    } catch (error) {
      console.log("error", { message: error });
    }
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // console.log("values", values);

      const response = await GlobalApi.createPrefix(values);

      fetchPrefix();
      setOpen(false);
      toast("Event has been created", {
        description: `ชื่อคำนำหน้า : ${response?.data.prefix_name}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const deletePrefix = async () => {
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      console.log("payload", selectData);

      const response = await GlobalApi.deletePrefix(selectData);
      console.log("selectData", selectData);
      if (!response) {
        throw new Error("prefix delete fail");
      }
      fetchPrefix();
      toast("Event has been delete", {
        description: `ลบ ${selectData.map(
          (item) => item.prefix_name + ","
        )} เรียบร้อย`,
      });
    } catch (error: any) {
      console.error({ message: error });
      toast("เกิดข้อผิดพลาด", {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(error?.response?.data?.message, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };
  const columns: ColumnDef<PrefixType>[] = [
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
      cell: ({ row }) => <div className="capitalize ">{row.index + 1}</div>,
    },
    {
      accessorKey: "prefix_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            คำนำหน้า
            <ArrowUpDown size={18} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("prefix_name")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const prefix = row.original;
        const [open, setOpen] = useState(false);
        const handleUpdate = async (values: any) => {
          try {
            const payload = {
              prefix_id: prefix.prefix_id,
              prefix_name: values.prefix_name,
            };
            const response = await GlobalApi.updatePrefix(payload);
            if (!response) {
              throw new Error("Question update fail");
            }
            fetchPrefix(); // fetch ข้อมูลใหม่
            console.log("response", response);
            toast("Event has been updated", {
              description: `แก้คำนำหน้าเป็น : "${response?.data.prefix_name}" เรียบร้อยแล้ว`,
            });
          } catch (error) {
            console.error({ message: error });
            toast("เกิดข้อผิดพลาด", {
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
                  <code className="text-white whitespace-pre-wrap break-words">
                    {JSON.stringify({ message: error }, null, 2)}
                  </code>
                </pre>
              ),
            });
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
                  onClick={() =>
                    navigator.clipboard.writeText(prefix.prefix_name)
                  }
                >
                  Copy prefix name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setOpen(true)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <EditPrefixName
              open={open} // สถานะการเปิด/ปิด Dialog (boolean)
              setOpen={setOpen} // function สำหรับเปลี่ยนสถานะ Dialog
              prefix={prefix} // ข้อมูล prefix ที่ต้องการแก้ไข
              onUpdate={handleUpdate}
            />
          </>
        );
      },
    },
  ];
  const table = useReactTable({
    data: prefixes,
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

  useEffect(() => {
    fetchPrefix();
  }, []);
  return (
    <div className={`w-full ${styles.text}`}>
      <div className="flex items-center py-4">
        <Input
          placeholder="ค้นหา: คำนำหน้าชื่อ"
          value={
            (table.getColumn("prefix_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("prefix_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />{" "}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className={`hover:bg-red-50 border-none text-red-500 ${styles.background}`}
                  disabled={
                    table.getFilteredSelectedRowModel().rows.length > 0
                      ? false
                      : true
                  }
                >
                  ลบคำนำหน้า
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    คุณแน่ใจในการตัดสินใจนี้ใช่ไหม?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-red-500">
                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    การดำเนินการนี้จะถูกลบออกอย่างถาวร
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <h2 className="">รายละเอียดข้อมูลที่จะลบ </h2>
                <ScrollArea className="h-52 w-full">
                  <div className="inline-flex flex-wrap gap-3 ">
                    {table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original)
                      .map((item) => (
                        <div
                          key={item.prefix_id}
                          className="rounded-full border py-1 text-sm px-2"
                        >
                          {item.prefix_name}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
                <AlertDialogFooter>
                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deletePrefix()}>
                    ลบคำนำหน้า
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
                  สร้างคำนำหน้า
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>สร้างคำนำหน้า</DialogTitle>
                  <DialogDescription>
                    สามารถสร้างคำนำหน้าต่างๆเพื่อนำไปใช้ในระบบได้
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="prefix_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid gap-4 py-4">
                              <div className="grid w-full gap-1.5">
                                <Label htmlFor="message-2">
                                  คำนำหน้าชื่อที่จะสร้าง
                                </Label>
                                <Input
                                  placeholder="Type your prefix here."
                                  id="message-2"
                                  {...field}
                                />
                                <p className="text-sm text-muted-foreground">
                                  สามารถสร้างคำนำหน้าต่างๆเพื่อนำไปใช้ในระบบได้
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={`rounded-md border ${styles.background}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`${styles.background_third_head_table} ${styles.text}`}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`${
                        header.id === "index" ? "max-w-[5px]" : ""
                      } `}
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
};

export default PrefixTable;
