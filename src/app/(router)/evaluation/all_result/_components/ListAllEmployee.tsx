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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpDown,
  BriefcaseBusiness,
  CalendarX,
  ChevronDown,
  Dot,
  Download,
  FileText,
  Search,
  Sheet,
  UserPlus,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { PageNumber, PeriodType, User } from "@/types/interface";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import FilterPeriod from "./FilterPeriod";
import Personal_result from "@/app/(router)/personal_evaluation/_components/Personal-result";
import ClearScoreSection from "./clear-score-section";
import { useThemeStyles } from "@/hooks/useTheme";

type ListAllEmployeeProp = {
  filterDataArea: filterAreaType | undefined;
};
type filterAreaType = {
  departments: string[];
  itemsRole: string[];
};
export function ListAllEmployee({ filterDataArea }: ListAllEmployeeProp) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const styles = useThemeStyles();
  const [allUser, setAllUser] = useState<User[]>([]);
  const [selectPeriod, setSelectPeriod] = useState<PeriodType | null>(null);
  // select ตัวนี้ใช้กับ การที่ต้องการ select ข้อมูลทั้งตารางมาใช้ได้ในส่วนของ employee ในdepartment นั้นๆ
  const [rowSelection, setRowSelection] = useState({});

  const onPeriodChange = (period: PeriodType) => {
    try {
      setSelectPeriod(period);
    } catch (error) {
      handleErrorOnAxios(error);
    }
  };
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
      accessorKey: "name",
      header: "ชื่อ-นามสกุล",
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-3">
          <Image
            src={
              row.original.image ? row.original.image.url : "/profiletest.jpg"
            } // ดึง url จาก image object row.original.image.url เข้าถึง property image ซึ่งเป็น object แล้วดึง url จาก UserImage object นั้น
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
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "period",
      header: "รอบการประเมิน",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex items-center gap-3 ">
            <h2>{selectPeriod?.title}</h2>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "รายละเอียด",
      cell: ({ row }) => {
        // console.log("row",row.original);

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
                  <div className="mx-auto w-full max-w-7xl">
                    <Personal_result
                      period={selectPeriod!!}
                      userId={row.original.id}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: allUser ?? [],
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
        pageIndex: 0,
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
  });
  // สร้างฟังก์ชันสำหรับสร้าง pagination items

  const totalPages = Math.ceil(
    allUser.length / table.getState().pagination.pageSize
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
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis1");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis2");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // กรองมาแค่ตัวที่ select Area เลือกมา
  useEffect(() => {
    const filterEmployees = async () => {
      try {
        const response = await GlobalApi.getAllUsers();
        let filteredData = response?.data.filter(
          (item: User) =>
            item.role.role_name !== "member" && item.role.role_name !== "admin"
        );

        if (filterDataArea) {
          filteredData = filteredData.filter((user: User) => {
            const departmentMatch =
              filterDataArea.departments.length === 0 ||
              filterDataArea.departments.includes(
                user.department ? user.department.id : ""
              );
            const roleMatch =
              filterDataArea.itemsRole.length === 0 ||
              filterDataArea.itemsRole.includes(user.role.id);

            return departmentMatch && roleMatch;
          });
        }
        setAllUser(filteredData || []);
      } catch (error) {
        console.error("Error filtering employees:", error);
        setAllUser([]);
      }
    };

    filterEmployees();
  }, [filterDataArea]); // Run when filterDataArea changes
  return (
    <div className={`w-full ${styles.text}`}>
      <div className="flex items-center w-full gap-3 justify-between py-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 items-center gap-3 w-full">
          {/* ปุ่มค้นหาชื่อหรือ email */}
          <div className="col-span-2 w-full">
            <Input
              placeholder="Filter by name or email..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className=" rounded-lg "
            />
          </div>
          <div className="col-span-1 w-full">
            <FilterPeriod onPeriodChange={onPeriodChange} />
          </div>
          {/* ปุ้ม switch ที่ใช้ในเลือกเฉพาะที่ดำเนินการเสร็จแล้ว */}
          <div className="flex items-center space-x-2 w-full col-span-1">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">success</Label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* เมนูเมือต้องการจะ export */}
          <ClearScoreSection table={table} selectPeriod={selectPeriod!!} />
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

      <div className={`rounded-xl border ${styles.background} overflow-hidden`}>
        <Table>
          {/* หัวตาราง */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`${styles.background_third_head_table}`}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md ">
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
