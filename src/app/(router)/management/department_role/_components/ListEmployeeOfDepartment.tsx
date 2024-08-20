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
  Check,
  ChevronDown,
  Circle,
  CirclePlus,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";

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
import { Department, User } from "@/types/interface";
import SetStatusSection from "./SetStatusSection";
import GlobalApi from "@/app/_unit/GlobalApi";
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-3">
        <Image
          src={row.original.image ? row.original.image.url : "/profiletest.jpg"} // ดึง url จาก image object row.original.image.url เข้าถึง property image ซึ่งเป็น object แล้วดึง url จาก UserImage object นั้น
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
        <div className="flex items-center">
          <SetStatusSection defaultValue={row.original.role.role_name} />
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
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
interface SettingSectionProps {
  department: Department; // Replace 'string' with the appropriate type for departmentId
}

export function ListEmployeeOfDepartment({ department }: SettingSectionProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [allUser, setAllUser] = React.useState<User[]>([]);

  const getDataOfEmployee = async () => {
    const response = await GlobalApi.getDepartmentById(department.id);
    if (response?.data?.user) {
      setAllUser(response.data.user);
    } else {
      setAllUser([]); // ตั้งค่าเป็นอาเรย์เปล่าเมื่อข้อมูลไม่ถูกต้อง
    }
  };
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

  React.useEffect(() => {
    getDataOfEmployee();
  }, []);
  React.useEffect(() => {
    console.log(allUser);
  }, [allUser]);

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [usersEmptyDepartment, setUsersEmptyDepartment] = React.useState<any>();
  const handleToggle = (value: string) => {
    console.log("handleToggle:", value);

    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const fetchUserEmptyDepartment = async () => {
    try {
      const response = await GlobalApi.findUserEmptyDepartment();
      setUsersEmptyDepartment(response?.data);
    } catch (error) {
      console.log(error);
      
    }
  };

  const onsubmit = async () => {
    try {
      const payload = {
        userIds: selectedItems,  // selectedItems is an array of user IDs
        departmentId: department.id,
      };
  
      console.log('Payload:', payload); // For debugging
  
      const response = await GlobalApi.addUsersToDepartment(payload);
    } catch (error) {
      console.log(error);
    }
  };
  
  

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by name or email..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm rounded-2xl"
        />
        <div className="flex items-center gap-3">
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex gap-2" onClick={fetchUserEmptyDepartment}>
                <CirclePlus />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="flex justify-between items-center">
                  <Input
                    className="max-w-[200px] h-8"
                    placeholder="Search Employee"
                    type="text"
                  />

                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Airplane Mode</Label>
                  </div>
                </div>

                <ToggleGroup
                  type="multiple"
                  className="flex flex-col gap-2 w-full mt-5"
                >
                  {usersEmptyDepartment ? (
                    usersEmptyDepartment.map((item: any) => (
                      <ToggleGroupItem
                        key={item.id}
                        value={item.id}
                        aria-label="Toggle bold"
                        className="py-2 justify-between h-auto w-full "
                        onClick={() => handleToggle(item.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={item.image ? item.image.url : '/profiletest.jpg'}
                            width={80}
                            height={80}
                            alt="profile"
                            className="w-[50px] h-[50px] object-cover rounded-full"
                          />
                          <ul className="text-left">
                            <li>{item.name}</li>
                            <li className="text-gray-500">{item.role.role_name}</li>
                          </ul>
                        </div>

                        {selectedItems.includes(item.id) ? (
                          <div className="p-1 bg-blue-500 rounded-full">
                            <Check
                              className="text-white"
                              size={18}
                              strokeWidth={4}
                            />
                          </div>
                        ) : (
                          <div className="p-1 w-[26px] h-[26px] border-2 border-dashed border-blue-600 rounded-full"></div>
                        )}
                      </ToggleGroupItem>
                    ))
                  ) : (
                    <div>No items found.</div>
                  )}
                </ToggleGroup>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={onsubmit}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
