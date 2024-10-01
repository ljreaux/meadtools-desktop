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
import { useTranslation } from "react-i18next";

function Yeasts() {
  const { t } = useTranslation();
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
          <TableCaption>{t("desktop.yeastTableCaption")}</TableCaption>
          <LoadingTable isLoading={loading}>
            <TableHeader>
              <TableRow className="border-none">
                <TableHead
                  colSpan={8}
                  className="text-3xl text-center text-bold"
                >
                  {t("desktop.allYeasts")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="w-[100px]">I.D.</TableHead>
                <TableHead>{t("yeastTable.tableHeadings.name")}</TableHead>
                <TableHead>{t("yeastBrand")}</TableHead>
                <TableHead>{t("n2Requirement.label")}</TableHead>
                <TableHead>{t("PDF.tolerance")}</TableHead>
                <TableHead>{t("yeastTable.tableHeadings.low_temp")}</TableHead>
                <TableHead>{t("yeastTable.tableHeadings.high_temp")}</TableHead>
                <TableHead>{t("desktop.editOrDelete")}</TableHead>
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
