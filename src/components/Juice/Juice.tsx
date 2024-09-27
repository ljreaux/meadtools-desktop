import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useJuice from "@/hooks/useJuice";
import { useTranslation } from "react-i18next";

function Juice() {
  const {
    sugar,
    setSugar,
    sugarUnits,
    setSugarUnits,
    servingSize,
    setServingSize,
    servingSizeUnits,
    setServingSizeUnits,
    servings,
    setServings,
    brix,
    sg,
    totalSugar,
  } = useJuice();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-11/12 gap-4 p-8 my-40 md:my-8 md:w-1/2 rounded-xl bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={3} className="py-4 text-3xl text-center">
              <h1>{t("juiceHeading")}</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{t("sugPerServe")}</TableCell>
            <TableCell>
              <Input
                className="min-w-16"
                type="number"
                onFocus={(e) => e.target.select()}
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Select value={sugarUnits} onValueChange={setSugarUnits}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">{t("G")}</SelectItem>
                  <SelectItem value="mg">{t("MG")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("servingSize")}</TableCell>
            <TableCell>
              <Input
                className="min-w-16"
                type="number"
                onFocus={(e) => e.target.select()}
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Select
                value={servingSizeUnits}
                onValueChange={setServingSizeUnits}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">{t("ML")}</SelectItem>
                  <SelectItem value="floz">{t("FLOZ")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("perContainer")}</TableCell>
            <TableCell colSpan={2}>
              <Input
                type="number"
                onFocus={(e) => e.target.select()}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="py-4 text-3xl text-center">
              {brix} {t("BRIX")}, {sg.toFixed(3)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="py-4 text-3xl text-center">
              {totalSugar}
              {sugarUnits} {t("juiceUnits")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default Juice;
