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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Bolt,
  ChevronDown,
  Currency,
  EarthLock,
  Hexagon,
  Lock,
  ShieldHalf,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

import {
  PageNumber,
  PeriodType,
  User,
  userHaveBeenEvaluatedType,
} from "@/types/interface";
import EvaluateSection from "./EvaluateSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import React, { memo, useMemo, useState } from "react";
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";

export function UserInDepartment({
  member,
  userHaveBeenEvaluated,
  fetchUserHaveBeenEvaluated,
}: {
  member: User[] | undefined;
  userHaveBeenEvaluated: userHaveBeenEvaluatedType[];
  fetchUserHaveBeenEvaluated: () => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const { ProfileDetail } = useStore();
  const styles = useThemeStyles();
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "index",
      header: "ลำดับ",
      cell: ({ row }) => {
        return (
          <div className="capitalize flex justify-center items-center gap-3">
            <span className="text-md">{row.index + 1}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "ชื่อ-นามสกุล",
      cell: ({ row }) => {
        const image = row.original.image;
        // console.log("image :", image);
        return (
          <div className="capitalize flex items-center gap-3">
            {image?.url ? (
              <Image
                src={image?.url}
                width={40}
                height={40}
                alt="profiletable"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            ) : (
              <Image
                src="/profiletest.jpg"
                width={40}
                height={40}
                alt="profiletable"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            )}
            {row.original?.prefix?.prefix_name}
            {row?.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "ตำแหน่ง",
      cell: ({ row }) => {
        const role_name = row.original.role.role_name;
        return (
          <div
            className={`capitalize inline-flex items-center  ${styles.text}`}
          >
            {role_name}
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "หน่วยงาน/กำกับดูแล",
      cell: ({ row }) => {
        const NameOfDepartment = row.original.department;

        return (
          <div
            className="inline-flex items-center
          justify-start gap-2 border-gray-200 py-1"
          >
            <h2 className={`${styles.text}`}>
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
      header: "Action",
      cell: ({ row }) => {
        // console.log(row.original);
        const checkEvaluated = userHaveBeenEvaluated?.some(
          (u) => u.evaluator.id === row.original.id
        );
        const [open, setOpen] = useState(false);
        // console.log("userHaveBeenEvaluated", userHaveBeenEvaluated);
        const defaultScoreOfUserHasEval = useMemo(() => {
          return userHaveBeenEvaluated?.find(
            (f) => f.evaluator.id === row.original.id
          );
        }, [row.original.id, userHaveBeenEvaluated]);
        const { currentlyEvaluationPeriod } = useStore();
        return (
          <div className="flex justify-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                {checkEvaluated ? (
                  <div className="flex items-center gap-3 active:scale-95 transition-all text-green-500 select-none">
                    <Bolt /> เสร็จสิ้นแล้ว
                  </div>
                ) : row.original.id === ProfileDetail.id ? (
                  <div className="flex items-center gap-3 active:scale-95 transition-all text-blue-500 select-none">
                    <ShieldHalf /> ไม่สามารถประเมินตนเองได้
                  </div>
                ) : currentlyEvaluationPeriod?.isAction ? (
                  <Button
                    variant="ghost"
                    className="flex border items-center gap-3 active:scale-95 transition-all"
                    onClick={() => setOpen(true)}
                  >
                    <Hexagon /> ประเมิน
                  </Button>
                ) : (
                  <div
                    className="flex items-center gap-3 font-bold active:scale-95  transition-all text-yellow-500 select-none"
                    onClick={() => setOpen(true)}
                  >
                    <Lock size={18} className="min-w-[18px]" />
                    <h2 className="">ยังไม่เปิดใช้งาน</h2>
                  </div>
                )}
              </SheetTrigger>
              {currentlyEvaluationPeriod?.isAction === true &&
                row.original.id !== ProfileDetail.id && (
                  <SheetContent
                    side="bottom"
                    className="h-[calc(100vh-10%)] xl:mx-52 rounded-tr-2xl rounded-tl-2xl overflow-scroll scrollbar-gemini"
                  >
                    <SheetHeader>
                      <SheetTitle
                        className={`text-3xl text-center ${styles.text}`}
                      >
                        แบบฟอร์มการประเมิน
                      </SheetTitle>
                    </SheetHeader>
                    {/* ------------------------------------------------------- */}
                    {/*        Conponent   Question and score input             */}
                    {/* ------------------------------------------------------- */}
                    <EvaluateSection
                      defaultScoreOfUserHasEval={defaultScoreOfUserHasEval}
                      evaluatorUserTarget={row.original}
                      fetchUserHaveBeenEvaluated={fetchUserHaveBeenEvaluated}
                      setOpen={setOpen}
                    />
                    <SheetDescription>
                      Tip : การลงคะแนนแต่ละครั้งสามารถเปลี่ยนคะแนนได้ทุกเมื่อ
                      หากอยู่ภายในช่วงเวลาการประเมิน เพียงกดคำว่า{" "}
                      <span className="text-green-500">"เสร็จสิ้นแล้ว"</span>{" "}
                      อีกครั้ง
                    </SheetDescription>
                  </SheetContent>
                )}
            </Sheet>
          </div>
        );
      },
    },
  ];
  const filterMember = useMemo(() => {
    return member?.filter(f => f.role.role_name !== "admin" && f.role.role_name !== "member");
  }, [member]);
  
  const table = useReactTable({
    data: filterMember ?? [],
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
    member!.length / table.getState().pagination.pageSize
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
      <div className="flex items-center py-4">
        <div className="flex items-center w-full gap-3">
          <Input
            placeholder="Filter by name or email..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm rounded-lg"
          />
          {/* ปุ้ม switch ที่ใช้ในเลือกเฉพาะที่ดำเนินการเสร็จแล้ว */}
          <div className="flex items-center space-x-2 w-full col-span-1">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">success</Label>
          </div>
        </div>
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
      <div className={`rounded-xl border ${styles.text} overflow-hidden`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-md ${
                        header.id === "actions" || header.id === "index"
                          ? "text-center"
                          : ""
                      }  ${styles.background_secondary} `}
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
          <TableBody className={`${styles.background_body_table}`}>
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
        <div className="flex-1 text-sm text-muted-foreground"></div>
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
