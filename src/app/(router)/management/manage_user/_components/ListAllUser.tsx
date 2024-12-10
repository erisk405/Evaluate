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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserProfile from "./UserProfile";
import GlobalApi from "@/app/_util/GlobalApi";
import { PageNumber, User } from "@/types/interface";
import React, { useEffect, useState } from "react";

export function ListEmployee() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [allUser, setAllUser] = useState<User[]>([]);
  const fetchUserList = async () => {
    const response = await GlobalApi.getAllUsers();
    // console.log("AllUser", response?.data);
    setAllUser(response?.data);
  };
  useEffect(() => {
    fetchUserList();
  }, []);
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "index",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-neutral-800"
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
      header: "Name",
      cell: ({ row }) => {
        const image = row.original.image;
        console.log("image :", image);

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
                width={50}
                height={50}
                alt="profiletable"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            )}
            <h2 className="truncate">{row.getValue("name")}</h2>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role_name = row.original.role.role_name;
        return (
          <div
            className={`capitalize inline-flex items-center gap-2 p-2 rounded-lg 
              ${role_name != "member" ? "text-stone-800" : "text-gray-500"}
            `}
          >
            <div
              className={`p-1 rounded-full ${
                role_name != "member"
                  ? "bg-emerald-50 text-emerald-500"
                  : "text-gray-500"
              } `}
            >
              <Ribbon size={20} />
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
            className="text-neutral-800"
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
        const NameOfDepartment = row.original.department;
        return (
          <div
            className="inline-flex items-center text-stone-800
          justify-center gap-2  rounded-xl max-w-52"
          >
            <div
              className={`p-2 ${
                NameOfDepartment
                  ? "bg-cyan-50 text-cyan-500"
                  : "bg-gray-100 text-gray-500"
              } rounded-full`}
            >
              <Building2 strokeWidth={2} size={20} />
            </div>
            <h2
              className={`${
                NameOfDepartment ? "text-stone-800" : "text-gray-500"
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
      header: "Action",
      cell: ({ row }) => {
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
                <DialogTitle>
                  <div className="flex items-center gap-2">
                    <div className="bg-cyan-50 p-2 rounded-full">
                      <UserRoundCog size={30} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl">Edit user</h2>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              {/* User Profile */}
              <UserProfile
                userDetail={row.original}
                refreshData={fetchUserList}
              />
            </DialogContent>
          </Dialog>
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

  return (
    <div className="w-full ">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name or email..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm rounded-xl"
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
      <div className="rounded-lg border ">
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
          <TableBody className="bg-white">
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
