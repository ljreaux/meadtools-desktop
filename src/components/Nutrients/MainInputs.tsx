import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import lodash from "lodash";
import { FormData } from "./NutrientCalc";
import Title from "../Title";
import FirstLineInputs from "./FirstLineInputs";
import useTargetYan from "../../hooks/useTargetYan";
import useYeastAmount from "../../hooks/yeastAmount";
import getAllYeasts from "../../helpers/getAllYeasts";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import Tooltip from "../Tooltips";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
export interface YeastType {
  Lalvin: Yeast[];
  Fermentis: Yeast[];
  MangroveJack: Yeast[];
  RedStar: Yeast[];
  Other: Yeast[];
}
export type Yeast = {
  brand: string;
  id: number;
  name: string;
  nitrogen_requirement: string;
  tolerance: number | string;
  low_temp: number;
  high_temp: number;
};

interface MainInputs {
  selected: FormData["selected"];
  inputs: FormData["inputs"];
  outputs: FormData["outputs"];
  maxGpl: FormData["maxGpl"];
}

export default function MainInputs({
  yeasts,
  selected,
  inputs,
  outputs,
  maxGpl,
  setData,
  setYeasts,
  recalc,
  setRecalc,
}: MainInputs & {
  setData: Dispatch<SetStateAction<FormData>>;
  yeasts: YeastType;
  setYeasts: Dispatch<SetStateAction<YeastType>>;
  recalc: boolean;
  setRecalc: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getYeasts() {
      try {
        const allYeasts = await getAllYeasts();
        const Lalvin = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Lalvin"
        );
        const Fermentis = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Fermentis"
        );
        const MangroveJack = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Mangrove Jack"
        );
        const RedStar = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Red Star"
        );
        const Other = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Other"
        );

        const data = {
          Lalvin,
          Fermentis,
          MangroveJack,
          RedStar,
          Other,
        };

        setYeasts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getYeasts();
  }, []);
  const { t, i18n } = useTranslation();
  const keyArr = Object.keys(maxGpl);

  const handleChange = (e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLFormElement;
    setData((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [target.name]: Number(target.value) },
    }));
  };

  useEffect(() => {
    const yeastDetails = yeasts[selected.yeastBrand].find(
      (yeast: Yeast) => yeast.name === selected.yeastStrain
    );
    setData((prev) => {
      return yeastDetails
        ? {
            ...prev,
            selected: {
              ...prev.selected,
              yeastDetails: { ...yeastDetails },
              n2Requirement: yeastDetails.nitrogen_requirement,
            },
          }
        : prev;
    });
  }, [selected.yeastBrand, selected.yeastStrain]);

  const { target } = useTargetYan(
    selected?.n2Requirement,
    inputs?.sg,
    inputs?.offset
  );

  const { yeastAmount, setYeastAmount } = useYeastAmount(
    inputs?.volume,
    inputs?.sg,
    selected?.volumeUnits,
    outputs.yeastAmount,
    recalc
  );

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      outputs: {
        targetYan: target.target,
        yeastAmount,
      },
    }));
  }, [target, yeastAmount]);

  useEffect(() => {
    setRecalc(true);
  }, [target]);

  return (
    <>
      {!loading ? (
        <div className="flex flex-col items-center justify-center w-11/12 p-2 mt-24 mb-8 text-xs sm:w-9/12 rounded-xl bg-background sm:p-8 aspect-video sm:text-base text-wrap">
          <Title header={t("nutesHeading")} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pb-4 text-center">
                  {t("yeastBrand")}
                </TableHead>
                <TableHead className="pb-4 text-center">
                  {t("yeastStrain")}
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex flex-col items-center justify-center gap-2">
                    <label htmlFor="volume">{t("nuteVolume")}</label>
                    <Select
                      onValueChange={(val) => {
                        setData((prev) => {
                          return {
                            ...prev,
                            selected: {
                              ...prev.selected,
                              volumeUnits: val,
                            },
                          };
                        });
                      }}
                      value={selected.volumeUnits}
                      name="volumeUnits"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("GAL")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gal">{t("GAL")}</SelectItem>
                        <SelectItem value="liter">{t("LIT")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("nuteSgLabel")}{" "}
                    <Tooltip body={t("tipText.nutrientSg")} />
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("offset")}
                    <Tooltip body={t("tipText.offsetPpm")} />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select
                    onValueChange={(val: FormData["selected"]["yeastBrand"]) =>
                      setData((prev) => ({
                        ...prev,
                        selected: {
                          ...prev.selected,
                          yeastBrand: val,
                          yeastStrain: yeasts[val][0].name,
                        },
                      }))
                    }
                    name="yeastBrand"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Lalvin"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(yeasts).map((yeast) => {
                        return (
                          <SelectItem key={yeast} value={yeast}>
                            {t(`${lodash.camelCase(yeast)}.label`)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={selected.yeastStrain}
                    onValueChange={(val) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          selected: {
                            ...prev.selected,
                            yeastStrain: val,
                          },
                        };
                      });
                    }}
                    name="yeastStrain"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yeasts[selected.yeastBrand].map((yeast) => {
                        const brand = lodash.camelCase(selected.yeastBrand);
                        const camelCase = lodash.camelCase(yeast.name);
                        const fullKey = `${brand}.yeasts.${camelCase}`;
                        const exists = i18n.exists(fullKey);

                        const display = exists ? fullKey : yeast.name;
                        return (
                          <SelectItem key={yeast.name} value={yeast.name}>
                            {t(display)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <FirstLineInputs inputs={inputs} handleChange={handleChange} />
              </TableRow>
            </TableBody>

            <TableHeader>
              <TableRow>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("n2Requirement.label")}
                    <Tooltip body={t("tipText.nitrogenRequirements")} />
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("nuteSchedules.label")}
                    <Tooltip
                      body={t("tipText.preferredSchedule")}
                      link="https://meadmaking.wiki/en/process/nutrient_schedules"
                    />
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("targetYan")}
                    <Tooltip body={t("tipText.yan")} />
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("numberOfAdditions")}
                    <Tooltip body={t("tipText.numberOfAdditions")} />
                  </span>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {t("yeastAmount")}
                    <Tooltip body={t("tipText.yeastAmount")} />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select
                    name="n2Requirement"
                    value={selected.n2Requirement}
                    onValueChange={(val) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          selected: {
                            ...prev.selected,
                            n2Requirement: val,
                          },
                        };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        {t("n2Requirement.low")}
                      </SelectItem>
                      <SelectItem value="Medium">
                        {t("n2Requirement.medium")}
                      </SelectItem>
                      <SelectItem value="High">
                        {t("n2Requirement.high")}
                      </SelectItem>
                      <SelectItem value="Very High">
                        {t("n2Requirement.veryHigh")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    name="schedule"
                    value={selected.schedule}
                    onValueChange={(val: FormData["selected"]["schedule"]) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          selected: {
                            ...prev.selected,
                            schedule: val,
                          },
                        };
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {maxGpl &&
                        keyArr.map((key) => {
                          return (
                            <SelectItem key={key} value={key}>
                              {t(`nuteSchedules.${key}`)}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  {target.targetString}
                </TableCell>
                <TableCell>
                  <Select
                    value={inputs?.numberOfAdditions.toString()}
                    onValueChange={(val) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          inputs: {
                            ...prev.inputs,
                            numberOfAdditions: Number(val),
                          },
                        };
                      });
                    }}
                    name="numberOfAdditions"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"1"}>1</SelectItem>
                      <SelectItem value={"2"}>2</SelectItem>
                      <SelectItem value={"3"}>3</SelectItem>
                      <SelectItem value={"4"}>4</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={yeastAmount}
                    onChange={(e) => {
                      setRecalc(false);
                      setYeastAmount(Number(e.target.value));
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
