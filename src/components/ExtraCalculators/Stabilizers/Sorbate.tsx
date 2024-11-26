import { FormEvent, useState } from "react";
import Title from "../../Title";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Sorbate() {
  const { t } = useTranslation();
  const [sorbate, setSorbate] = useState({
    batchSize: 1,
    units: "gallons",
    abv: 12,
  });

  const sorbateAmount =
    sorbate.units === "gallons"
      ? ((-sorbate.abv * 25 + 400) / 0.75) * sorbate.batchSize * 0.003785411784
      : (((-sorbate.abv * 25 + 400) / 0.75) * sorbate.batchSize) / 1000;

  const handleChange = (e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setSorbate((prev) => ({
      ...prev,
      [target.id]: target.value,
    }));
  };
  return (
    <div className="w-11/12 sm:w-1/2 flex flex-col items-center justify-center rounded-xl bg-background p-8 my-[8rem] gap-6">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead colSpan={3}>
              <Title header={t("sorbateHeading")} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead>{t("batchSize")} </TableHead>
            <TableCell>
              <Input
                type="number"
                id="batchSize"
                onFocus={(e) => e.target.select()}
                onChange={handleChange}
              />
            </TableCell>
            <TableCell>
              <Select
                name="units"
                value={sorbate.units}
                onValueChange={(val) => {
                  setSorbate((prev) => ({ ...prev, units: val }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallons">{t("GAL")}</SelectItem>
                  <SelectItem value="liters">{t("LIT")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>{t("ABV")}: </TableHead>
            <TableCell colSpan={2}>
              <Input
                id="abv"
                type="number"
                onFocus={(e) => e.target.select()}
                onChange={handleChange}
                value={sorbate.abv}
              />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="my-4 text-lg text-center" colSpan={3}>
              {Math.round(sorbateAmount * 1000) / 1000}g {t("kSorb")}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
