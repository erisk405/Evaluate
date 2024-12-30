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
  ArrowUpDown,
  BringToFront,
  Check,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  EllipsisVertical,
  Loader,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import Image from "next/image";
import { Department, PageNumber, User } from "@/types/interface";
import SetStatusSection from "./SetStatusSection";
import GlobalApi from "@/app/_util/GlobalApi";
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
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
import { Separator } from "@/components/ui/separator";

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
        {row.original.prefix?.prefix_name ?? ""}
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "ตำแหน่ง",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <h2>{row.original.role.role_name}</h2>
          {/* <SetStatusSection defaultValue={row.original.role.role_name} /> */}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-md inline-flex p-2 items-center cursor-pointer select-none hover:bg-gray-100 rounded-lg"
        >
          <h2>Email</h2>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "เบอร์โทร",
    cell: ({ row }) => {
      return (
        <div className="capitalize flex items-center gap-3">
          {row.getValue("phone")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Action",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BringToFront className="mr-2 h-4 w-4" />
                <span>Move to</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ChevronUp className="mr-2 h-4 w-4" />
                <span>Supervise</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
interface SettingSectionProps {
  department: Department | undefined; // Replace 'string' with the appropriate type for departmentId
  fetchData: () => void;
}

export function ListEmployeeOfDepartment({
  department,
  fetchData,
}: SettingSectionProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // select ตัวนี้ใช้กับ การที่ต้องการ select ข้อมูลทั้งตารางมาใช้ได้ในส่วนของ employee ในdepartment นั้นๆ
  const [rowSelection, setRowSelection] = useState({});

  // select ตัวนี้ใช้กับ การที่ select addemployee เข้ามาเท่านั้น ไม่เกี่ยวข้องกับส่วนอื่น
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [usersEmptyDepartment, setUsersEmptyDepartment] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleToggle = (value: string) => {
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const fetchUserEmptyDepartment = async () => {
    try {
      const response = await GlobalApi.findUserEmptyDepartment();
      response?.data && setUsersEmptyDepartment(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onsubmitAddEmployee = async () => {
    try {
      setIsLoading(false);
      const payload = {
        userIds: selectedItems, // selectedItems is an array of user IDs
        departmentId: department?.id,
      };
      console.log("Payload:", payload); // For debugging

      const response = await GlobalApi.addUsersToDepartment(payload);
      if (response?.data) {
        fetchUserEmptyDepartment(); // รอให้ addUsersToDepartment เสร็จสิ้นก่อน แล้วเรียก fetch อีกครั้ง เพื่อให้แสดงผลเลย ไม่ต้อง reload
      }
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  // ใช้กับ selection ตอนจะ ลบ employee ออกจาก department
  const handleUpdateSelectedRows = async () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id); // ที่ต้องการใช้มีแค่ Id ของ users คนนั้นๆ เลยselect มาแค่ Id เพียงเท่านั้น

    const payload = {
      userIds: selectedRows, // selectedItems is an array of user IDs
      departmentId: null, // ใช้เพื่อต้องการนำ user คนนั้นออกจาก department ที่สังกัดอยู่
    };

    try {
      const response = await GlobalApi.addUsersToDepartment(payload);
      if (response?.data) {
        fetchUserEmptyDepartment(); // รอให้ addUsersToDepartment เสร็จสิ้นก่อน แล้วเรียก fetch อีกครั้ง เพื่อให้แสดงผลเลย ไม่ต้อง reload
      }
    } catch (error) {
      console.log("message:", { message: error });
    }
  };

  useEffect(() => {
    fetchData();
  }, [usersEmptyDepartment]);

  const table = useReactTable({
    data: department?.user ?? [], // user ที่อยู่ภายในหน่วยงานนี้ทั้งหมด
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 7,
        pageIndex: 0, // หน้าเริ่มต้น
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      // สร้างอาร์เรย์ค่าทั้งหมดที่ต้องการค้นหา
      const searchableFields = [
        row.original.prefix?.prefix_name.toLocaleLowerCase(),
        row.original.name?.toLowerCase(),
        row.original.role?.role_name?.toLowerCase(),
        row.original.email?.toLowerCase(),
        row.original.phone?.toLowerCase(),
        row.original.department?.department_name?.toLowerCase(),
      ];
      // ตรวจสอบว่า searchValue ตรงกับค่าที่อยู่ใน searchableFields หรือไม่
      return searchableFields.some((field) => field?.includes(searchValue));
    },
  });
  // สร้างฟังก์ชันสำหรับสร้าง pagination items
  const totalPages = Math.ceil(
    (department?.user?.length ?? 0) / table.getState().pagination.pageSize
  );
  const currentPage = table.getState().pagination.pageIndex + 1;
  // สร้างฟังก์ชันสำหรับคำนวณว่าควรแสดงหน้าไหนบ้าง
  const getPageNumbers = (): PageNumber[] => {
    const pageNumbers: PageNumber[] = [];

    if (totalPages <= 7) {
      // ถ้ามีหน้าน้อยกว่า 7 หน้า แสดงทั้งหมด
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // ถ้ามีหน้ามากกว่า 7 หน้า ให้แสดงแบบมี ellipsis
      if (currentPage <= 4) {
        // กรณีอยู่ใกล้หน้าแรก
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // กรณีอยู่ใกล้หน้าสุดท้าย
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // กรณีอยู่ตรงกลาง
        pageNumbers.push(1);
        pageNumbers.push("ellipsis1");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis2");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  return (
    <div className="w-full ">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="ค้นหา: ชื่อ / ตำแหน่ง / หน่วยงาน"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm rounded-lg"
        />
        <div className="flex items-center gap-3">
          {/* for remove employee button  */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className=" text-red-500"
                variant="ghost"
                disabled={
                  table.getFilteredSelectedRowModel().rows.length > 0
                    ? false
                    : true
                }
              >
                Removes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-red-500">
                  This action cannot be undone. This will permanently delete.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdateSelectedRows}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* for add employee button  */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex gap-2" onClick={fetchUserEmptyDepartment}>
                <CirclePlus />
                เพิ่มสมาชิก
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-stone-700">
                  เพิ่มสมาชิก
                </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="">
                <div className="flex justify-between items-center ">
                  <Input
                    className="max-w-[200px] h-8"
                    placeholder="Search Employee"
                    type="text"
                  />

                  <div className="flex items-center space-x-2">
                    <Switch id="gogo" />
                    <Label htmlFor="gogo">Airplane Mode</Label>
                  </div>
                </div>

                <ToggleGroup
                  type="multiple"
                  className="flex flex-col gap-2 w-full mt-5 "
                >
                  <div className="flex justify-between w-full px-2">
                    <h2 className="text-sm text-neutral-800">Name</h2>
                    <h2 className="text-sm text-neutral-800">Select</h2>
                  </div>
                  <Separator className="h-[.5px]" />
                  <div className="w-full sm:max-h-[400px] overflow-scroll scrollbar-gemini">
                    {usersEmptyDepartment.length > 0 ? (
                      usersEmptyDepartment.map((item: any) => (
                        <ToggleGroupItem
                          key={item.id}
                          value={item.id}
                          aria-label="Toggle bold"
                          className="py-2 justify-between h-auto w-full"
                          onClick={() => handleToggle(item.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                item.image ? item.image.url : "/profiletest.jpg"
                              }
                              width={80}
                              height={80}
                              alt="profile"
                              className="w-[50px] h-[50px] object-cover rounded-full"
                            />
                            <ul className="text-left">
                              <li>{item.name}</li>
                              <li className="text-gray-500">
                                {item.role.role_name}
                              </li>
                            </ul>
                          </div>

                          {selectedItems.includes(item.id) ? (
                            <div className="p-1 bg-blue-500 rounded-full">
                              <Check
                                className="text-white"
                                size={14}
                                strokeWidth={4}
                              />
                            </div>
                          ) : (
                            <div className="p-1 w-[22px] h-[22px] border border-black rounded-full"></div>
                          )}
                        </ToggleGroupItem>
                      ))
                    ) : (
                      <div>No items found.</div>
                    )}
                  </div>
                </ToggleGroup>
              </div>
              <DialogFooter>
                {isLoading ? (
                  <Button
                    type="submit"
                    onClick={onsubmitAddEmployee}
                    disabled={selectedItems.length > 0 ? false : true}
                  >
                    Comfirm
                  </Button>
                ) : (
                  <Button className="w-32 animate-pulse" type="button">
                    <Loader className="animate-spin" />
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* for filter attribute from table  */}
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
      <div className="rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className=" text-neutral-800">
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) => (
                <React.Fragment key={index}>
                  {typeof pageNumber === "string" ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(pageNumber - 1);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </React.Fragment>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
