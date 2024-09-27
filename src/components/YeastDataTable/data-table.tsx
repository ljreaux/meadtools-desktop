import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectSeparator } from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation(undefined, { keyPrefix: "yeastTable" });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");

  const [brand, setBrand] = useState<string | undefined>(undefined);
  const [key, setKey] = useState(+new Date());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      unit: tempUnit,
    },
  });

  useEffect(() => table.getColumn("brand")?.setFilterValue(brand), [brand]);

  return (
    <div className="p-0 border rounded-md sm:rounded-xl sm:p-6 bg-background">
      <h1 className="p-6 text-4xl text-center">{t("title")}</h1>
      <div className="flex flex-col gap-4 px-4 py-6 md:flex-row md:justify-between md:px-2 md:items-end">
        <Input
          placeholder={t("searchPlaceholder")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-full"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end ">
          <div className="flex flex-col gap-2">
            <h2>{t("units.title")}</h2>
            <Select
              value={tempUnit}
              onValueChange={(val: "C" | "F") => setTempUnit(val)}
            >
              <SelectTrigger className="lg:w-[180px] w-full">
                <SelectValue placeholder="°F" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="F">{t("units.fahrenheit")}</SelectItem>
                  <SelectItem value="C">{t("units.celsius")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Select
            key={key}
            value={brand}
            onValueChange={(val) => setBrand(val)}
          >
            <SelectTrigger className="sm:w-[180px] w-full">
              <SelectValue placeholder={t("brandPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Lalvin">{t("brands.lalvin")}</SelectItem>
                <SelectItem value="Mangrove Jack">
                  {t("brands.mangrove")}
                </SelectItem>
                <SelectItem value="Red Star">{t("brands.redstar")}</SelectItem>
                <SelectItem value="Fermentis">
                  {t("brands.fermentis")}
                </SelectItem>
                <SelectItem value="Other">{t("brands.other")}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <Button
                className="w-full px-2"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrand(undefined);
                  setKey(+new Date());
                }}
              >
                {t("brands.clear")}
              </Button>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-extrabold text-foreground"
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end py-4 mr-4 space-x-2">
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
  );
}
