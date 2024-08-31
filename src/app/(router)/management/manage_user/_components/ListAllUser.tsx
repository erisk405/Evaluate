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
  Dot,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Image from "next/image";

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
import UserProfile from "./UserProfile";

const data: employee[] = [
  {
    id: "m5gr84i9",
    name: "amphon yyyy",
    email: "ken99@yahoo.com",
    role: "CEO",
    phone: "095-454-4484",
    department: "CompanyA",
  },
  {
    id: "3u1reuv4",
    name: "Krittaphat samrit",
    email: "Abe45@gmail.com",
    role: "เสาหลัก",
    phone: "095-454-4484",
    department: "CompanyB",
  },
  {
    id: "derv1ws0",
    name: "Panyakorn somawong",
    email: "Monserrat44@gmail.com",
    role: "Head",
    phone: "095-454-4484",
    department: "CompanyB",
  },
  {
    id: "5kma53ae",
    name: "Wichaphon dogcat",
    email: "Silas22@gmail.com",
    role: "COO",
    phone: "095-454-4484",
    department: "CompanyB",
  },
  {
    id: "bhqecj4p",
    name: "Worakamon gogo",
    email: "carmella@hotmail.com",
    role: "CPE",
    phone: "095-454-4484",
    department: "CompanyC",
  },
];

export type employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
};

export const columns: ColumnDef<employee>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-3">
        <Image
          src="/profiletest.jpg"
          width={50}
          height={50}
          alt="profiletable"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <div className="capitalize font-semibold flex items-center gap-3 text-emerald-500">
          {row.getValue("role")}
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
          className="text-[16px] font-semibold text-neutral-800"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
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
    header: "Department",
    cell: ({ row }) => {
      return (
        <div
          className="inline-flex items-center font-semibold
        justify-center gap-2 bg-neutral-200 
        text-neutral-900 border border-neutral-500 px-3 py-1 rounded-xl max-w-28"
        >
          <div className="">
            <Building2 strokeWidth={2} size={16} />
          </div>
          {row.getValue("department")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Action",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="active:scale-90  transition-all">
              <Button variant="outline" className="flex gap-1">
                <div className="bg-blue-100 p-1 rounded-full items-center justify-center text-blue-500">
                  <Pencil size={16} />
                </div>
                Edit
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[565px]">
            <DialogHeader>
              <DialogTitle>Edit user</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {/* User Profile */}
            <UserProfile/>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export function ListEmployee() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
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
    globalFilterFn: (row, columnId, filterValue) => {
      const name = row.original.name.toLowerCase();
      const email = row.original.email.toLowerCase();
      const searchValue = filterValue.toLowerCase();
      return name.includes(searchValue) || email.includes(searchValue);
    },
  });

  return (
    <div className="w-full ">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or email..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm rounded-2xl"
        />
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
      <div className="rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[16px] font-semibold text-neutral-800"
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
