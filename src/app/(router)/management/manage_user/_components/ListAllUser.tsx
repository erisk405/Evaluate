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
  Building2,
  ChevronDown,
  Group,
  Layers,
  Layers2,
  Pencil,
  Ribbon,
  UserRoundCog,
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
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import { Department, PageNumber, User } from "@/types/interface";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import EditPageUser from "./edit-page-user";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FilterDeparment from "./filter-department";
import { toast } from "@/components/ui/use-toast";

type ListEmployeeProp = {
  allUser: User[];
  fetchUserList: () => void;
};
export function ListEmployee({ allUser, fetchUserList }: ListEmployeeProp) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const styles = useThemeStyles();
  const { getThemeClass } = useThemeClass();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showNoDepartment, setShowNoDepartment] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectDept, setSelectDept] = useState<Department | string | null>(
    "all"
  );

  // ปรับปรุง filterUserDept
  const filterUserDept = useMemo(() => {
    let filteredUsers = allUser;

    // กรองตาม department ก่อน
    if (selectDept !== "all" && selectDept !== null) {
      if (typeof selectDept === "object") {
        filteredUsers = allUser.filter(
          (a) => a.department?.id === selectDept.id
        );
      }
    }

    // ถ้า switch เปิดอยู่ กรองเฉพาะคนที่ไม่มีหน่วยงาน
    if (showNoDepartment) {
      filteredUsers = filteredUsers.filter((user) => !user.department);
    }

    return filteredUsers;
  }, [selectDept, allUser, showNoDepartment]);
  const columns: ColumnDef<User>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <h2>ลำดับ</h2>
            <ArrowUpDown className="" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase w-[80px] text-center">{row.index + 1}</div>
      ),
      // Add sorting logic
      sortingFn: (rowA, rowB) => {
        return rowA.index - rowB.index;
      },
    },
    {
      accessorKey: "name",
      header: "ชื่อ-นามสกุล",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center gap-3">
            <Image
              src={`${row.original.image?.url || "/profiletest.jpg"}`}
              width={40}
              height={40}
              alt="profiletable"
              className="w-[40px] h-[40px] rounded-full object-cover"
              unoptimized={true} // Try this if Next.js image optimization is causing issues
              loading="lazy"
            />
            <h2 className="truncate">
              {row.original.prefix?.prefix_name}
              {row.getValue("name")}
            </h2>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "ตำแหน่ง",
      cell: ({ row }) => {
        const role_name = row.original.role?.role_name;
        return (
          <div
            className={`capitalize inline-flex items-center gap-2 p-2 rounded-lg 
              ${role_name != "member" ? `${styles.text}` : "text-gray-500"}
            `}
          >
            <div
              className={getThemeClass(
                {
                  light: `${
                    role_name
                      ? `bg-gradient-to-tl from-emerald-50 from-10% to-50%  ${
                          role_name === "member"
                            ? "to-zinc-100 text-zinc-500"
                            : "to-emerald-100 text-emerald-500"
                        } `
                      : "bg-gray-100 text-gray-500"
                  }`,
                  dark: `${
                    role_name
                      ? "bg-gradient-to-tl from-emerald-500 from-10% to-emerald-800 to-50% text-zinc-50"
                      : "bg-gray-100 text-gray-500"
                  }`,
                },
                `p-2 rounded-full`
              )}
            >
              <Layers strokeWidth={2} size={18} />
            </div>
            {role_name}
          </div>
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
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "เบอร์โทรศัพท์",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center gap-3">
            {row.getValue("phone")}
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "หน่วยงานที่สังกัด",
      cell: ({ row }) => {
        const NameOfDepartment = row.original.department;
        return (
          <div
            className="inline-flex items-center 
          justify-center gap-2 rounded-xl max-w-52"
          >
            <div
              className={getThemeClass(
                {
                  light: `${
                    NameOfDepartment
                      ? "bg-gradient-to-tl from-blue-50 from-10% to-cyan-100 to-50% text-cyan-500"
                      : "bg-gray-100 text-gray-500"
                  }`,
                  dark: `${
                    NameOfDepartment
                      ? "bg-gradient-to-tl from-blue-950 from-10% to-background_secondary to-50% text-zinc-50"
                      : "bg-gray-100 text-gray-500"
                  }`,
                },
                `p-2 rounded-full`
              )}
            >
              <Layers2 strokeWidth={2} size={18} />
            </div>
            <h2
              className={`${
                NameOfDepartment ? `${styles.text}` : "text-gray-500"
              } truncate`}
            >
              {NameOfDepartment
                ? NameOfDepartment.department_name
                : "No Department"}
            </h2>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      // header: "Action",
      cell: ({ row }) => {
        return (
          <EditPageUser userDetail={row.original} refreshData={fetchUserList} />
        );
      },
    },
  ];
  const table = useReactTable({
    data: filterUserDept ?? [],
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
        pageSize: 12,
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      // สร้างอาร์เรย์ค่าทั้งหมดที่ต้องการค้นหา
      const searchableFields = [
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
    allUser?.length / table.getState().pagination.pageSize
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
  const handleDeleteUser = async () => {
    toast({
      title: "กำลังดำเนินการ",
      description: `ระบบกำลังดำเนินการลบผู้ใช้งาน โปรดรอสักครู่...`,
    });
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      const userID = selectData.map((item) => item.id);
      const response = await GlobalApi.deleteUserByAdmin(userID);
      if (response?.data) {
        toast({
          title: "ลบผู้ใช้งานเสร็จสิ้นแล้ว",
          description: `${response?.data.message}`,
        });
      }
      fetchUserList();
    } catch (error: unknown) {
      // จัดการ error
      console.error({ message: error });
      handleErrorOnAxios(error);
    }
  };
  return (
    <div className="w-full ">
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <Input
          placeholder="ค้นหา: ชื่อ-นามสกุล,เบอร์โทร,email"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm rounded-xl"
        />
        <div className="ml-3">
          <FilterDeparment onFilterDepartChange={setSelectDept} />
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <Switch
            id="not-have-role"
            checked={showNoDepartment}
            onCheckedChange={setShowNoDepartment}
          />
          <Label htmlFor="not-have-role">ยังไม่มีหน่วยงาน</Label>
        </div>
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
                ลบผู้ใช้งาน
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-red-500">
                  This action cannot be undone. This will permanently delete.
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
                        key={item.id}
                        className="rounded-full border py-1 text-sm px-2"
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <AlertDialogFooter>
                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteUser()}>
                  ยืนยัน
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
      <div className="rounded-lg border ">
        <Table>
          <TableHeader className={` `}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`${styles.text}`}>
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
          <TableBody className={`${styles.background}`}>
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
