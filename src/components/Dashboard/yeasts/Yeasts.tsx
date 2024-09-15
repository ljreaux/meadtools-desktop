import { Yeast } from "@/components/Nutrients/MainInputs";
import LoadingTable from "@/components/ui/LoadingTable";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import getAllYeasts from "@/helpers/getAllYeasts";
import { useEffect, useState } from "react";
import YeastTable from "./YeastTable";

function Yeasts() {
  const [loading, setLoading] = useState(true);
  const [yeasts, setYeasts] = useState<Yeast[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllYeasts();
      setYeasts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="flex items-center justify-center">
      {
        <Table>
          <TableCaption>A list of all yeasts.</TableCaption>
          <LoadingTable isLoading={loading}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">I.D.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Nitrogen Requirement</TableHead>
                <TableHead>Tolerance</TableHead>
                <TableHead>Low Temp</TableHead>
                <TableHead>High Temp</TableHead>
                <TableHead>Edit/Delete</TableHead>
              </TableRow>
            </TableHeader>
            <YeastTable yeasts={yeasts} setYeasts={setYeasts} />
          </LoadingTable>
        </Table>
      }
    </section>
  );
}

export default Yeasts;
