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
import { AlignCenter, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { User } from "@/types/interface";
import GlobalApi from "@/app/_unit/GlobalApi";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ResultSection from "@/app/(router)/history/_components/ResultSection";
export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: "ชื่อ-นามสกุล",
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-3">
        <Image
          src={row.original.image ? row.original.image.url : "/profiletest.jpg"} // ดึง url จาก image object row.original.image.url เข้าถึง property image ซึ่งเป็น object แล้วดึง url จาก UserImage object นั้น
          width={40}
          height={40}
          alt="profiletable"
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "ตำแหน่ง",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">{row.original.role.role_name}</div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-md"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "period",
    header: "รอบการประเมิน",
    cell: ({ row }) => {
      return (
        <div className="capitalize flex items-center gap-3 ">
          <h2>รอบที่ 1</h2>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "รายละเอียด",
    cell: ({ row }) => {
      return (
        <div className="capitalize flex items-center gap-3 ">
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center active:scale-95 transition-all"
              >
                ดูรายละเอียด
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[calc(100dvh-10%)] ">
              <div className="mx-auto w-full overflow-auto scrollbar-gemini">
                <div className="mx-auto w-full max-w-lg ">
                  <DrawerHeader className="flex flex-col justify-center items-center">
                    <DrawerTitle className="text-xl">
                      สรุปผลการประเมินสมรรถนะ 360 องศา นายกฤตภาส สัมฤทธิ์
                    </DrawerTitle>
                    <DrawerDescription>
                      รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567 (1 กันยายน 2566 - 28
                      กุมภาพันธ์ 2567)
                    </DrawerDescription>
                  </DrawerHeader>
                </div>
                <div className="mx-auto w-full max-w-7xl">
                  <ResultSection />
                </div>
                <div className="mx-auto w-full max-w-lg">
                  <DrawerFooter>
                    <Button>Export</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      );
    },
  },
];

export function ListAllEmployee() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [allUser, setAllUser] = useState<User[]>([]);

  // ใช้งานเพื่อจัดเรียงข้อมูล แต่ละหน้าของ ต่างๆภายใน table ออกมา
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  // จำนวนpage ทั้งหมด อิง
  const [totalPages, setTotalPages] = useState(0);

  // select ตัวนี้ใช้กับ การที่ต้องการ select ข้อมูลทั้งตารางมาใช้ได้ในส่วนของ employee ในdepartment นั้นๆ
  const [rowSelection, setRowSelection] = useState({});

  const getDataOfEmployee = async () => {
    const response = await GlobalApi.getAllUsers();
    if (response?.data) {
      setAllUser(response.data);
    } else {
      setAllUser([]);
    }
  };

  useEffect(() => {
    getDataOfEmployee();
  }, []);
  useEffect(() => {
    console.log(allUser);
  }, [allUser]);

  const table = useReactTable({
    data: allUser ?? [],
    columns,
    pageCount: totalPages, // จำนวนหน้าทั้งหมดที่ได้จาก backend
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    manualPagination: true, // กำหนดว่า pagination ทำที่ backend
    onPaginationChange: setPagination, // ใช้ในการจัดหน้าใน ตาราง
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: (row, columnId, filterValue) => {
    //   const name = row.original.name.toLowerCase();
    //   const email = row.original.email.toLowerCase();
    //   const searchValue = filterValue.toLowerCase();
    //   return name.includes(searchValue) || email.includes(searchValue);
    // },
  });

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between py-4">
        {/* ปุ่มค้นหาชื่อหรือ email */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter by name or email..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm rounded-lg"
          />
          {/* filter แต่ว่าจะเอารอบไหร */}
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {/* เมนูเมือต้องการจะ export */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Export</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>
                  Make changes to your Export here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* for filter attribute from table  */}
          {/* แสดงข้อมูลตามที่กำหนด */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
      {/* table employee on department  */}

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          {/* หัวตาราง */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-md bg-gray-100"
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
          {/* ข้อมูลภายในตาราง */}
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
      {/* ส่วนของ pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
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
