import { columns, Yeast } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { getAllYeasts } from "@/db";

export default function YeastTable() {
  const [data, setData] = useState<Yeast[]>(null!);
  useEffect(() => {
    getAllYeasts().then((res: any) => setData(res));
  }, []);
  if (!data || !data.length) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen mt-12">
      <div className="container py-10 pl-1 pr-1 md:px-6">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
