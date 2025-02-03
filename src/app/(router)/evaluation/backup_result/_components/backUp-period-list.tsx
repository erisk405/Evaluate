"use client";
import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import useStore from "@/app/store/store";
import { PeriodType } from "@/types/interface";
import { formatThaiDateTime } from "@/app/(router)/overview/_components/RightSection";
import ResultUserList from "./result-userList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeStyles } from "@/hooks/useTheme";
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
import { toast } from "sonner";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
export const columns: ColumnDef<PeriodType>[] = [
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
    accessorKey: "title",
    header: "ชื่อรอบ",
    cell: ({ row }) => <div className="capitalize">{row.original.title}</div>,
  },
  {
    accessorKey: "period",
    header: "ช่วงเวลาที่เริ่ม",
    cell: ({ row }) => (
      <div className="capitalize">
        {formatThaiDateTime(row.original.start).date}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => (
      <div className="capitalize text-green-500">เก็บข้อมูลแล้ว</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button>ตรวจสอบ</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[calc(100dvw-100px)] h-[calc(100dvh-100px)]">
            <DialogHeader>
              <DialogTitle>{row.original.title}</DialogTitle>
              <DialogDescription>
                รายชื่อแต่ละการประเมินที่ถูกบันทึกลงไปในฐานข้อมูลแล้ว
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100dvh-100px)]">
              <ResultUserList period={row.original} />
            </ScrollArea>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
const BackUpPeriodList = () => {
  const { fetchCurrentPeriod, allPeriod } = useStore();
  const [showBackupOnly, setShowBackupOnly] = React.useState(true);
  const styles = useThemeStyles();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const handleDeleteHistory = async () => {
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      toast("กำลังดำเนินการ", {
        description:
          "ขณะนี้ระบบกำลังดำเนินการลบข้อมูลการประเมิน โปรดรอสักครู่...",
      });

      const responses = await Promise.all(
        selectData.map((item) => GlobalApi.deleteHistory(item.period_id))
      );
      // ตรวจสอบว่ามีการลบสำเร็จทั้งหมด
      if (responses.some((response) => !response)) {
        throw new Error("Some items failed to delete");
      }
      // แสดง toast เมื่อสำเร็จ
      fetchCurrentPeriod();
      toast("ลบประวัติผลการประเมินเสร็จสิ้นแล้ว", {
        description: "ระบบได้ลบข้อมูลภายในรอบผลการประเมินออกจากประวัติแล้ว",
      });
    } catch (error: unknown) {
      // จัดการ error
      console.error({ message: error });

      handleErrorOnAxios(error);
    }
  };
  // กรองข้อมูลก่อนส่งให้ table
  const filteredData = React.useMemo(() => {
    if (!allPeriod) return [];
    return showBackupOnly ? allPeriod.filter((item) => item.backUp) : allPeriod;
  }, [allPeriod, showBackupOnly]);

  const table = useReactTable({
    data: filteredData,
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
    <div className={`w-full ${styles.text}`}>
      <div className="flex items-center py-4">
        <Input
          placeholder="ค้นหาโดยชื่อรอบ"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="ml-auto flex items-center gap-2">
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
                ลบประวิติผลการประเมิน
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
              <h2 className={`${styles.text}`}>รายละเอียดข้อมูลที่จะลบ </h2>
              <ScrollArea className="h-52 w-full">
                <div className="inline-flex flex-wrap gap-3 ">
                  {table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)
                    .map((item) => (
                      <div
                        key={item.period_id}
                        className="rounded-full border py-1 text-sm px-2"
                      >
                        {item.title}
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <AlertDialogFooter>
                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteHistory()}>
                  ลบประวัติการประเมินนี้
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
      <div className={`rounded-md border `}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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

export default BackUpPeriodList;
