"use client";
import { ChevronDown, Dot } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useStore from "@/app/store/store";
import { PageNumber, PeriodType } from "@/types/interface";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import GlobalApi from "@/app/_util/GlobalApi";
import MainResultHistory from "./main-result-history";
export const columns: ColumnDef<PeriodType>[] = [
  {
    accessorKey: "index",
    header: "ลำดับ",
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-center w-[150px]">
          <div className=" cursor-pointer  inline-flex border p-2 rounded-xl items-center gap-1">
            <div className="relative">
              {new Date(item.start) <= new Date() &&
              new Date() <= new Date(item.end) ? (
                // Currently active period
                <div className="flex items-center">
                  <Dot
                    strokeWidth={6}
                    className="absolute text-yellow-500 animate-ping"
                  />
                  <Dot strokeWidth={6} className="text-yellow-500" />

                  <h2>กำลังดำเนินการ</h2>
                </div>
              ) : new Date() > new Date(item.end) ? (
                // past period
                <div className="flex items-center">
                  <Dot
                    strokeWidth={6}
                    className="absolute text-emerald-500 animate-ping"
                  />
                  <Dot strokeWidth={6} className="text-emerald-500" />
                  <h2>เสร็จสิ้น</h2>
                </div>
              ) : (
                // Future period
                <div className="flex items-center">
                  <Dot
                    strokeWidth={6}
                    className="absolute text-blue-500 animate-ping"
                  />
                  <Dot strokeWidth={6} className="text-blue-500" />
                  <h2>รอดำเนินการ</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "ชื่อ/รอบการประเมิน",
    cell: ({ row }) => {
      return <div className="font-medium ">{row.original.title}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            {new Date(row.original.start) > new Date() ? (
              <div className="text-center">
                <Button
                  variant={"outline"}
                  className="active:scale-95 transition-all"
                  disabled // Instead of forcing it closed
                >
                  ไม่สามารถตรวจสอบได้
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  variant={"outline"}
                  className="active:scale-95 transition-all"
                >
                  ตรวจสอบรายละเอียด
                </Button>
              </div>
            )}
          </DrawerTrigger>
          {new Date(row.original.start) < new Date() && (
            <DrawerContent className="h-[calc(100dvh-10%)] ">
              <MainResultHistory period={row.original} />
            </DrawerContent>
          )}
        </Drawer>
      );
    },
  },
];
const ListHistorySection = () => {
  const { fetchCurrentPeriod, allPeriod } = useStore();

  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const isStoredInHistory = useMemo(
    () => allPeriod?.filter((p) => p.backUp === true),
    [allPeriod]
  );
  const table = useReactTable({
    data: isStoredInHistory ?? [],
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
    onGlobalFilterChange: setGlobalFilter,
  });
  // สร้างฟังก์ชันสำหรับสร้าง pagination items

  const totalPages = Math.ceil(
    allPeriod ? allPeriod.length : 0 / table.getState().pagination.pageSize
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

  useEffect(() => {
    if (!allPeriod) {
      const fetchInitailData = async () => {
        try {
          await fetchCurrentPeriod();
        } catch (error) {
          console.error({ message: error });
        }
      };

      fetchInitailData();
    }
  }, []);
  return (
    <div className="w-full">
      <div className="">
        <div className="flex items-center py-4">
          <Input
            placeholder="รอบที่ x ประจำปี พ.ศ. xxxx"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`${
                          (header.id == "status" && "text-center w-[150px] ") ||
                          (header.id == "index" && "text-center  w-[100px] ") ||
                          (header.id == "actions" && "text-center w-full")
                        }} `}
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
                    className={`${
                      (row.id == "status" && "text-center w-full") ||
                      (row.id == "index" && "text-center w-full") ||
                      (row.id == "actions" && "text-center w-full")
                    }} `}
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
    </div>
  );
};

export default ListHistorySection;
