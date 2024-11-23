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
import {
  ArrowUpDown,
  Building2,
  ChevronDown,
  Hexagon,
  Pencil,
  Ribbon,
  UserRoundCog,
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

import { User } from "@/types/interface";
import EvaluateSection from "./EvaluateSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const columns: ColumnDef<User>[] = [
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
          {row.getValue("name")}
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
          className={`capitalize inline-flex items-center
            ${role_name != "member" ? "text-black" : "text-gray-500"}
          `}
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
          <h2
            className={`${
              NameOfDepartment ? "text-stone-800" : "text-gray-500"
            }`}
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
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex border items-center gap-3 active:scale-95 transition-all"
              >
                <Hexagon /> ประเมิน
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[calc(100vh-10%)] xl:mx-52 rounded-tr-2xl rounded-tl-2xl overflow-scroll scrollbar-gemini"
            >
              <SheetHeader>
                <SheetTitle className="text-3xl text-center text-stone-700">
                  แบบฟอร์มการประเมิน
                </SheetTitle>
              </SheetHeader>
              {/* ------------------------------------------------------- */}
              {/*        Conponent   Question and score input             */}
              {/* ------------------------------------------------------- */}
              <EvaluateSection />
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
      );
    },
  },
];

export function UserInDepartment({ member }: { member: User[] | undefined }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: member ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
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
      <div className="rounded-xl border bg-white overflow-hidden">
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
                      }  bg-gray-100`}
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
        <div className="flex-1 text-sm text-muted-foreground"></div>
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
