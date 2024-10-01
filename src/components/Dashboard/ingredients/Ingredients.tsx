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
import { useTranslation } from "react-i18next";

function AllIngredients() {
  const { t } = useTranslation();
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
          <TableCaption>{t("desktop.ingredientTableCaption")}</TableCaption>
          <LoadingTable isLoading={loading}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">I.D.</TableHead>
                <TableHead>{t("yeastTable.tableHeadings.name")}</TableHead>
                <TableHead>
                  {t("desktop.ingredientHeadings.sugarContent")}
                </TableHead>
                <TableHead>
                  {t("desktop.ingredientHeadings.waterContent")}
                </TableHead>
                <TableHead>
                  {t("desktop.ingredientHeadings.category")}
                </TableHead>
                <TableHead>{t("desktop.editOrDelete")}</TableHead>
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
