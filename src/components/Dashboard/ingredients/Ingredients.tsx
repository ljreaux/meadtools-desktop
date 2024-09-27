"use client";
import LoadingTable from "@/components/ui/LoadingTable";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import IngredientTable from "./IngredientTable";
import { getAllIngredients } from "@/db";

function AllIngredients() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllIngredients();
      setIngredients(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="flex items-center justify-center">
      {
        <Table>
          <TableCaption>A list of all ingredients.</TableCaption>
          <LoadingTable isLoading={loading}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">I.D.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sugar Content</TableHead>
                <TableHead>Water Content</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Edit/Delete</TableHead>
              </TableRow>
            </TableHeader>
            <IngredientTable
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          </LoadingTable>
        </Table>
      }
    </section>
  );
}

export default AllIngredients;
