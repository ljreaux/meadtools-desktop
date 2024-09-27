const listOrder = ["Low", "Medium", "High", "Very High"];

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Yeast = {
  id: number;
  name: number;
  brand: "Lalvin" | "Fermentis" | "Mangrove Jack" | "Red Star" | "Other";
  nitrogen_requirement: string;
  tolerance: string;
  low_temp: string;
  high_temp: string;
};

export const columns: ColumnDef<Yeast>[] = [
  {
    accessorKey: "brand",
    header: () => <Translate accessor="tableHeadings.brand" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-1 -ml-2 font-extrabold"
        >
          <Translate accessor="tableHeadings.name" />
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nitrogen_requirement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-1 -ml-2 font-extrabold"
        >
          <Translate accessor="tableHeadings.nitrogen_requirement" />
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      return (
        listOrder.indexOf(rowA.original.nitrogen_requirement) -
        listOrder.indexOf(rowB.original.nitrogen_requirement)
      );
    },
    cell: ({ row }) => {
      const keys: {
        [key: string]: string;
      } = {
        Low: "low",
        Medium: "medium",
        High: "high",
        "Very High": "veryHigh",
      };
      const nitrogenRequirement = row.getValue(
        "nitrogen_requirement"
      ) as string;

      return (
        <Translate accessor={`nitrogenOptions.${keys[nitrogenRequirement]}`} />
      );
    },
  },
  {
    accessorKey: "tolerance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-1 -ml-2 font-extrabold"
        >
          <Translate accessor="tableHeadings.tolerance" />
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <>{`${row.getValue("tolerance")}%`}</>;
    },
  },
  {
    accessorKey: "low_temp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-1 -ml-2 font-extrabold"
        >
          <Translate accessor="tableHeadings.low_temp" />
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const { unit } = table.options.meta as any;
      const value = row.getValue("low_temp") as string;
      const celsius = Math.round((parseInt(value) - 32) * (5 / 9));

      if (unit === "F") return <>{`${value}°F`}</>;
      else return <>{`${celsius}°C`}</>;
    },
  },
  {
    accessorKey: "high_temp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-1 -ml-2 font-extrabold"
        >
          <Translate accessor="tableHeadings.high_temp" />
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const { unit } = table.options.meta as any;
      const value = row.getValue("high_temp") as string;
      const celsius = Math.round((parseInt(value) - 32) * (5 / 9));

      if (unit === "F") return <>{`${value}°F`}</>;
      else return <>{`${celsius}°C`}</>;
    },
  },
];

import { useTranslation } from "react-i18next";

function Translate({ accessor }: { accessor: string }) {
  const { t } = useTranslation(undefined, { keyPrefix: "yeastTable" });
  return <span>{t(accessor)}</span>;
}

export default Translate;
