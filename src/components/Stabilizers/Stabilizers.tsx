import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltips";
import useStabilizers from "./useStabilizers";

export default function Stabilizers() {
  const {
    setVolume,
    volume,
    volumeUnits,
    setVolumeUnits,
    sorbate,
    sulfite,
    campden,
    phReading,
    setPhReading,
    abv,
    setAbv,
    takingReading,
    setTakingReading,
  } = useStabilizers();

  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-11/12 p-2 mt-24 mb-8 text-xs text-center rounded-xl bg-background sm:p-8 sm:text-base ">
      <h1 className="text-3xl">{t("calculators.extraCalcs.stabilizers")}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("batchSize")}</TableHead>
            <TableHead>{t("UNITS")}:</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input
                value={volume.toString()}
                onChange={(e) => setVolume(Number(e.target.value))}
                type="number"
                step={0.001}
                onFocus={(e) => e.target.select()}
              />
            </TableCell>
            <TableCell>
              <Select
                onValueChange={(val) => {
                  setVolumeUnits(val as "gal" | "lit");
                }}
                value={volumeUnits}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gal">{t("GAL")}</SelectItem>
                  <SelectItem value="lit">{t("LIT")}</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>{t("ABV")}:</TableHead>
            <TableHead>
              <span className="flex gap-4 py-4 text-center">
                <p>{t("pH")}</p>
                <Select
                  value={takingReading ? "yes" : "no"}
                  onValueChange={(val) => setTakingReading(val === "yes")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </span>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableCell>
              <Input
                value={abv}
                onChange={(e) => setAbv(Number(e.target.value))}
                type="number"
                step={0.01}
                onFocus={(e) => e.target.select()}
              />
            </TableCell>
            <TableCell>
              <Input
                value={phReading}
                onChange={(e) => setPhReading(Number(e.target.value))}
                type="number"
                step={0.01}
                onFocus={(e) => e.target.select()}
                disabled={!takingReading}
              />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              {sorbate.toFixed(3)}g {t("kSorb")}
            </TableCell>
            <TableCell>
              <p>
                {sulfite.toFixed(3)}g {t("kMeta")}
              </p>{" "}
              <p>{t("accountPage.or")}</p>{" "}
              <p className="flex items-center justify-center gap-2">
                {Math.round(campden * 10) / 10} {t("list.campden")}
                <Tooltip body={t("tipText.campden")} />
              </p>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
