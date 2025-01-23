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
  Loader,
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
import ResultSection from "@/app/(router)/history/_components/list-history-section";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Personal_result from "@/app/(router)/personal_evaluation/_components/Personal-result";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainResultHistory from "@/app/(router)/history/_components/main-result-history";
import { useThemeStyles } from "@/hooks/useTheme";
import { toast } from "@/components/ui/use-toast";

const ResultUserList = ({ period }: { period: PeriodType }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const styles = useThemeStyles();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [allUser, setAllUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // select ตัวนี้ใช้กับ การที่ต้องการ select ข้อมูลทั้งตารางมาใช้ได้ในส่วนของ employee ในdepartment นั้นๆ
  const [rowSelection, setRowSelection] = useState({});
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
            <h2>{period?.title}</h2>
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
                  <div className="mx-auto w-full max-w-7xl">
                    <MainResultHistory
                      period={period}
                      userId={row.original.id}
                      userRoleLevel={row.original.role.role_level}
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
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      // Process each export sequentially to handle downloads properly
      if (selectData.length === 0) {
        toast({
          title: "Uh oh! การใช้งาน Export",
          description: "จะต้องเลือกบุคคลที่จะExportข้อมูล อย่างน้อย 1 คน",
        });
        return null;
      } else {
        toast({
          title: "กำลังดำเนินการ",
          description: "ระบบกำลังนำข้อมูลมาประมวลผลโปรดรอสักครู่...",
        });
      }
      for (const user of selectData) {
        const response = await GlobalApi.getExportEvaluationByUserId(
          period.period_id,
          user.id
        );

        // สร้าง Blob object จากข้อมูลที่ได้จาก API
        // Blob คือ object ที่เก็บข้อมูลไฟล์ในรูปแบบ binary
        // type คือการระบุประเภทของไฟล์ ในที่นี้คือไฟล์ Excel
        const blob = new Blob([response?.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // สร้าง URL ชั่วคราวจาก Blob
        // URL นี้จะใช้สำหรับดาวน์โหลดไฟล์
        const url = window.URL.createObjectURL(blob);

        // สร้าง element <a> (link) แบบชั่วคราวเพื่อใช้ในการดาวน์โหลด
        const link = document.createElement("a");
        // กำหนด URL ที่สร้างจาก Blob ให้กับ link
        link.href = url;
        link.download = `${period.title}_${user.name}.xlsx`;
        document.body.appendChild(link);
        // จำลองการคลิกที่ link เพื่อเริ่มการดาวน์โหลด
        link.click();
        // ทำความสะอาด: ลบ link และ URL ชั่วคราวออก เพื่อเริ่มรอบต่อไป
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      toast({
        title: "ดำเนินการเสร็จสิ้น",
        description: "ระบบได้ประมวลผลเสร็จสิ้นแล้ว",
      });
    } catch (error) {
      console.error({ message: error });
      toast({
        title: "Uh oh! การใช้งาน Export",
        description:
          "หากตำแหน่งของบุคคลที่คุณเลือกมา Level 1 จะไม่สามารถ Export ได้",
      });
      // handleErrorOnAxios(error);
    } finally {
      setIsLoading(false);
    }
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

        setAllUser(filteredData || []);
      } catch (error) {
        console.error("Error filtering employees:", error);
        setAllUser([]);
      }
    };

    filterEmployees();
  }, []); // Run when filterDataArea changes
  return (
    <div className={`w-full mx-3 px-5 ${styles.text}`}>
      <div className="flex items-center w-full gap-3 justify-between py-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 items-center gap-3 w-full">
          {/* ปุ่มค้นหาชื่อหรือ email */}
          <div className="col-span-2 w-full">
            <Input
              placeholder="ค้นหา: ชื่อ-นามสกุล"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className=" rounded-lg "
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* เมนูเมือต้องการจะ export */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Export</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>
                  รายละเอียดผลการประเมินที่ต้องการจะส่งออกไฟล์
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="detail" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="detail"
                    className="flex items-center gap-2"
                  >
                    <BriefcaseBusiness size={18} />
                    Detail
                  </TabsTrigger>
                  <TabsTrigger
                    value="export"
                    className="flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export
                  </TabsTrigger>
                </TabsList>
                {/* ใช้ในการ ตรวจสอบข้อมูลการจะ export */}
                <TabsContent value="detail">
                  {/* search bor */}
                  <div className="relative space-y-6">
                    <Search
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
                      size={14}
                    />
                    <Input
                      className="w-full pl-7"
                      placeholder="Add other people"
                    />
                  </div>
                  {/* เลือกรอบการประเมินที่จะ export ออกมา */}
                  <h2 className="my-3 text-sm">กำหนดการตั้งค่าต่างๆ</h2>
                  <div className="grid grid-cols-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-200 rounded-full">
                          <CalendarX size={18} />
                        </div>
                        <h2>รอบการประเมิน</h2>
                      </div>
                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="รอบการประเมิน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>การประเมิน</SelectLabel>
                            <SelectItem value="apple">
                              รอบที่ 1 ประจำปีงบประมาณ 2568
                            </SelectItem>
                            <SelectItem value="banana">
                              รอบที่ 2 ประจำปีงบประมาณ 2568
                            </SelectItem>
                            <SelectItem value="blueberry">
                              รอบที่ 1 ประจำปีงบประมาณ 2567
                            </SelectItem>
                            <SelectItem value="grapes">
                              รอบที่ 2 ประจำปีงบประมาณ 2567
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* รายชื่อทั้งหมดที่กำลังจะดำเนินการต่อใป ในการ export */}
                  <h2 className="my-3 text-sm">รายชื่อที่จะดำเนินการทั้งหมด</h2>
                  <div className="flex flex-wrap gap-2">
                    <ScrollArea className="max-h-[200px]">
                      {table.getSelectedRowModel().rows.map((row) => (
                        <div
                          key={row.original.id}
                          className="inline-flex px-2 items-center gap-1 rounded-xl border"
                        >
                          <Dot strokeWidth={6} className="text-blue-500" />
                          <h2 className="text-sm">{row.original.name}</h2>
                          <X size={14} />
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </TabsContent>
                <TabsContent value="export">
                  {/* รายชื่อทั้งหมดที่กำลังจะดำเนินการต่อใป ในการ export */}
                  <h2 className="my-3 text-sm">
                    รายชื่อที่จะดำเนินการทั้งหมด ของรอบการประเมินที่ 1
                    ประจำปีงบประมาณ 2567
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <ScrollArea className="max-h-[200px]">
                      {table.getSelectedRowModel().rows.map((row) => (
                        <div
                          key={row.original.id}
                          className="inline-flex px-2 items-center gap-1 rounded-xl border"
                        >
                          <Dot strokeWidth={6} className="text-blue-500" />
                          <h2 className="text-sm">{row.original.name}</h2>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <Separator className="my-3" />
                  <h2 className="text-sm">
                    โปรดเลือกว่าจะ export เป็นไฟล์อะไร
                  </h2>
                  <ToggleGroup type="multiple" defaultValue={["exel"]}>
                    <div className="grid grid-cols-2 w-full gap-3 my-3">
                      <ToggleGroupItem
                        value="exel"
                        className="flex items-center gap-3 border"
                      >
                        <Sheet size={20} />
                        <h2 className="text-md">Excel file</h2>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="pdf"
                        disabled
                        className="flex items-center gap-3 border"
                      >
                        <FileText size={20} />
                        <h2 className="text-md">
                          PDF file{"(ยังไม่พร้อมใช้งาน)"}
                        </h2>
                      </ToggleGroupItem>
                    </div>
                  </ToggleGroup>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => handleExport()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="px-6">
                      <Loader className="animate-spin" />
                    </div>
                  ) : (
                    "Export file"
                  )}
                </Button>
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

      <div className={`rounded-xl border ${styles.background} overflow-hidden`}>
        <Table>
          {/* หัวตาราง */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`${styles.background_third_head_table}`}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md">
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
};

export default ResultUserList;
