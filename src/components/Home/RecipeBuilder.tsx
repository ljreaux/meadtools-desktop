import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { RecipeData } from "../../App";
import Title from "../Title";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import Ingredient from "./Ingredient";
import { toBrix, toSG } from "../../helpers/unitConverters";
import useBlend from "../../hooks/useBlend";
import useAbv from "../../hooks/useAbv";
import { Ingredient as IngredientType } from "../../App";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import { List } from "../../App";
import Tooltip from "../Tooltips";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";

export default function RecipeBuilder({
  ingredients,
  ingredientsList,
  FG,
  units,
  setRecipeData,
  setIngredientsList,
  setBlendFG,
  setSecondaryVolume,
  recipeName,
}: RecipeData & {
  setRecipeData: Dispatch<SetStateAction<RecipeData>>;
  ingredientsList: List;
  setIngredientsList: Dispatch<SetStateAction<List>>;
  setBlendFG: Dispatch<SetStateAction<number[]>>;
  setSecondaryVolume: Dispatch<SetStateAction<number>>;
  recipeName?: string;
}) {
  const { t } = useTranslation();
  const [firstMount, setFirstMount] = useState(true);
  useEffect(() => setFirstMount(false), []);

  const [showBrix, setShowBrix] = useState(false);

  const totalBlended = ingredients.map((ingredient) => {
    return [toSG(ingredient.brix), ingredient.details[1]];
  });
  const withOutSecondary: number[][] = [];
  const justSecondary: number[][] = [];
  const offsetArr: number[] = [];

  ingredients.forEach((ingredient) => {
    if (!ingredient.secondary) {
      withOutSecondary.push([toSG(ingredient.brix), ingredient.details[1]]);
      if (ingredient.category === "fruit")
        offsetArr.push(ingredient.details[0] * 25);
    } else {
      justSecondary.push([toSG(ingredient.brix), ingredient.details[1]]);
    }
  });

  const { blend, runBlendingFunction } = useBlend(totalBlended);
  const {
    blend: noSecondaryBlend,
    runBlendingFunction: secondaryBlendFunction,
  } = useBlend(withOutSecondary);
  const secondaryBlend = useBlend(justSecondary);

  function runBlends() {
    (async () => {
      runBlendingFunction();
      secondaryBlendFunction();
    })().then(() => {
      secondaryBlend.runBlendingFunction();
    });
  }

  const blendFG =
    Math.round(
      ((noSecondaryBlend.totalVolume * FG +
        secondaryBlend.blend.totalVolume * secondaryBlend.blend.blendedValue) /
        blend.totalVolume) *
        1000
    ) / 1000 || FG;

  function setIngredients(ingredientList: List) {
    setIngredientsList(ingredientList);
  }
  function setIndividual(index: number, ingredient: Partial<IngredientType>) {
    setRecipeData((prev) => {
      const newIngredient = prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, ...ingredient } : ing
      );

      return {
        ...prev,
        ingredients: newIngredient,
      };
    });
  }

  function addIngredientLine() {
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            name: "Honey",
            brix: 79.6,
            details: [0, 0],
            secondary: false,
            category: "sugar",
          },
        ],
      };
    });
    runBlends();
  }

  function removeLine(index: number) {
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      };
    });
    runBlends();
  }

  function setChecked(index: number) {
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: prev.ingredients.map((ingred, i) => {
          if (i === index) {
            return {
              ...ingred,
              secondary: !ingred.secondary,
            };
          } else {
            return ingred;
          }
        }),
      };
    });
    runBlends();
  }

  function calculateABV({ ABV, delle }: { ABV: number; delle: number }) {
    if (blend.blendedValue > noSecondaryBlend.blendedValue) {
      const numerator = ABV * noSecondaryBlend.totalVolume;
      const denominator = blend.totalVolume;
      ABV = numerator / denominator;
      delle = toBrix(FG) + 4.5 * ABV;
    }
    setRecipeData((prev) => ({
      ...prev,
      ABV,
    }));
    return { ABV, delle };
  }

  const ABVOBJ = useAbv({ OG: blend.blendedValue, FG: blendFG });

  const [{ ABV, delle }, setABVDelle] = useState({ ABV: 0, delle: 0 });

  useEffect(() => {
    setABVDelle(calculateABV(ABVOBJ));
  }, [ABVOBJ.ABV]);

  useEffect(() => {
    const multiplier = units.weight === "kg" ? 0.453592 : 2.20462;
    if (!firstMount)
      setRecipeData((prev) => {
        return {
          ...prev,
          ingredients: prev.ingredients.map((ing) => ({
            ...ing,
            details: [
              Math.round(ing.details[0] * multiplier * 1000) / 1000,
              ing.details[1],
            ],
          })),
        };
      });
  }, [units.weight]);

  useEffect(() => {
    const multiplier = units.volume === "liter" ? 3.78541 : 0.264172;
    if (!firstMount)
      setRecipeData((prev) => {
        return {
          ...prev,
          ingredients: prev.ingredients.map((ing) => ({
            ...ing,
            details: [
              ing.details[0],
              Math.round(ing.details[1] * multiplier * 1000) / 1000,
            ],
          })),
        };
      });
    runBlends();
  }, [units.volume]);

  useEffect(() => {
    if (!firstMount) {
      setRecipeData((prev) => {
        return {
          ...prev,
          OG: noSecondaryBlend.blendedValue,
          FG,
          offset: offsetArr.reduce((prev, curr) => {
            return curr / noSecondaryBlend.totalVolume + prev;
          }, 0),
          volume: noSecondaryBlend.totalVolume,
        };
      });
      setSecondaryVolume(blend.totalVolume);
    }
  }, [blend.blendedValue, noSecondaryBlend.blendedValue]);

  useEffect(() => {
    setBlendFG([blend.blendedValue, blendFG]);
  }, [FG, blend.blendedValue, noSecondaryBlend.blendedValue]);

  const [loading, setLoading] = useState(true);

  const scaleRecipe = (curVol: number, targetVol: number) => {
    const scale = targetVol / curVol;

    const newIngredients = ingredients.map((ing) => {
      const newDetails = ing.details.map(
        (det) => Math.round(det * scale * 1000) / 1000
      );
      return { ...ing, details: newDetails };
    });
    setRecipeData((prev) => {
      const newAdditives = prev.additives.map((add) => ({
        ...add,
        amount: Math.round(add.amount * scale * 1000) / 1000,
      }));

      return { ...prev, ingredients: newIngredients, additives: newAdditives };
    });
    runBlends();
  };

  const volumeRef = useRef<HTMLInputElement>(null!);

  const validateVolume = (volume: string) => {
    const parsed = volume.replace(",", ".");
    const currentVolume = Number(parsed);
    return { currentVolume, isValid: !isNaN(currentVolume) };
  };
  return (
    <>
      {loading && <Loading />}
      <form
        className={`w-11/12 flex flex-col items-center justify-center text-center rounded-xl bg-background p-2 sm:p-8 mt-24 mb-8 text-xs sm:text-base ${
          loading ? "hidden" : ""
        }`}
        onSubmit={(e) => {
          e.preventDefault();
          runBlends();
        }}
      >
        <Title header={t("recipeBuilder.homeHeading")} />{" "}
        {recipeName && <p className="text-3xl py-2.5">{recipeName}</p>}
        <span className="flex items-center justify-center gap-2 py-4 ml-auto">
          {t("showBrix")}
          <Switch
            checked={showBrix}
            onCheckedChange={() => setShowBrix(!showBrix)}
          />
        </span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pb-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  {t("recipeBuilder.labels.ingredients")}
                  <Tooltip body={t("tipText.volumeLines")} />
                </div>
              </TableHead>
              {showBrix && (
                <TableHead className="pb-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {t("recipeBuilder.labels.brix")}{" "}
                    <Tooltip body={t("tipText.brix")} />
                  </div>
                </TableHead>
              )}
              <TableHead className="pb-4 text-center">
                {t("recipeBuilder.labels.weight")}
                <Select
                  name="weightUnits"
                  value={units.weight}
                  onValueChange={(val) => {
                    setRecipeData((prev) => {
                      return val === "lbs" || val === "kg"
                        ? {
                            ...prev,
                            units: {
                              ...prev.units,
                              weight: val,
                            },
                          }
                        : prev;
                    });
                  }}
                >
                  <SelectTrigger className="h-8 mt-2">
                    <SelectValue placeholder={t("LBS")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">{t("LBS")}</SelectItem>
                    <SelectItem value="kg">{t("KG")}</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>

              <TableHead className="pb-4 text-center">
                {t("recipeBuilder.labels.volume")}
                <Select
                  name="volumeUnits"
                  value={units.volume}
                  onValueChange={(val) => {
                    setRecipeData((prev) => {
                      return val === "gal" || val === "liter"
                        ? {
                            ...prev,
                            units: {
                              ...prev.units,
                              volume: val,
                            },
                          }
                        : prev;
                    });
                  }}
                >
                  <SelectTrigger className="h-8 mt-2">
                    <SelectValue placeholder={t("GAL")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gal">{t("GAL")}</SelectItem>
                    <SelectItem value="liter">{t("LIT")}</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead className="pb-4 text-center">
                {t("recipeBuilder.labels.secondary")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient, i) => {
              const filterTerms = ["water", "juice"];
              const deletable = i >= 1;
              return (
                <Ingredient
                  ingredient={ingredient}
                  index={i}
                  ingredientsList={ingredientsList}
                  setIngredients={setIngredients}
                  setIndividual={setIndividual}
                  removeLine={removeLine}
                  filterTerms={
                    i <= 1 && filterTerms.includes(ingredient.category)
                      ? filterTerms
                      : null
                  }
                  units={units}
                  setChecked={setChecked}
                  key={i + ingredient.name}
                  setLoading={setLoading}
                  showBrix={showBrix}
                  deleteable={deletable}
                />
              );
            })}
          </TableBody>
        </Table>
        {ingredients.length < 9 && (
          <button onClick={addIngredientLine} type="button">
            {t("recipeBuilder.addNew")}
          </button>
        )}
        <div className="flex items-center justify-center col-span-5 gap-4 px-2 py-1 my-4 text-lg border border-solid rounded-lg bg-background text-foreground hover:bg-foreground hover:border-background hover:text-background sm:gap-8 group">
          <button
            type="button"
            className={`group w-fit text-sidebar hover:text-foreground transition-colors disabled:cursor-not-allowed`}
            disabled={ingredients.length > 9}
            onClick={addIngredientLine}
          >
            <FaPlusSquare className="group-hover:scale-125 group-hover:text-background" />
          </button>
          <button
            type="button"
            className={`group w-fit text-sidebar hover:text-foreground transition-colors disabled:cursor-not-allowed`}
            disabled={ingredients.length <= 1}
            onClick={() => removeLine(ingredients.length - 1)}
          >
            <FaMinusSquare className="group-hover:scale-125 group-hover:text-background" />
          </button>
        </div>
        <Button variant={"secondary"} type="submit">
          {t("recipeBuilder.submit")}
        </Button>
        {blend.blendedValue > 0 && (
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="pb-4 text-center">
                  {t("recipeBuilder.resultsLabels.estOG")}
                </TableHead>

                <TableHead className="pb-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {t("recipeBuilder.resultsLabels.estFG")}
                    <Tooltip body={t("tipText.estimatedFg")} />
                  </div>
                </TableHead>
                <TableHead className="pb-4 text-center">
                  {t("recipeBuilder.resultsLabels.backFG")}
                </TableHead>
                <TableHead className="pb-4 text-center">
                  {t("recipeBuilder.resultsLabels.abv")}
                </TableHead>
                <TableHead className="pb-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {t("recipeBuilder.resultsLabels.delle")}
                    <Tooltip
                      body={t("tipText.delleUnits")}
                      link="https://meadmaking.wiki/en/process/stabilization#via-yeast-alcohol-tolerance"
                    />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableFooter>
              <TableRow>
                <TableCell id="estOG">
                  <p className="flex items-center justify-center text-center">
                    {Math.round(noSecondaryBlend.blendedValue * 1000) / 1000}
                  </p>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={FG}
                    step={0.001}
                    className="h-8"
                    onChange={(e) => {
                      setRecipeData((prev) => {
                        return {
                          ...prev,
                          FG: Number(e.target.value),
                        };
                      });
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </TableCell>
                <TableCell id="backFG" className="text-center">
                  {blendFG}
                </TableCell>
                <TableCell className="text-center">
                  {Math.round(ABV * 100) / 100}
                  {t("recipeBuilder.percent")}
                </TableCell>
                <TableCell className="text-center">
                  {Math.round(delle)} {t("DU")}
                </TableCell>
              </TableRow>

              <TableRow className="bg-background">
                <TableCell colSpan={2}>
                  <div className="flex items-center justify-center gap-1">
                    {t("recipeBuilder.resultsLabels.totalPrimary")}
                    <Tooltip body={t("tipText.totalVolume")} />
                  </div>
                </TableCell>

                <TableCell colSpan={3}>
                  <div className="flex items-center justify-center gap-1">
                    {t("recipeBuilder.resultsLabels.totalSecondary")}
                    <Tooltip body={t("tipText.totalSecondary")} />
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell id="totalVolume" className="text-center" colSpan={2}>
                  {Math.round(noSecondaryBlend.totalVolume * 1000) / 1000}
                  {units.volume}
                </TableCell>
                <TableCell className="text-center" colSpan={3}>
                  {Math.round(blend.totalVolume * 1000) / 1000} {units.volume}
                </TableCell>
              </TableRow>
              <TableRow className="bg-background">
                <TableCell colSpan={5}>
                  <div className="flex items-center justify-center gap-1">
                    {t("scale.title")}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell id="totalVolume" className="text-center" colSpan={2}>
                  {t("scale.current")}
                </TableCell>
                <TableCell className="text-center" colSpan={3}>
                  <Input
                    value={Math.round(blend.totalVolume * 1000) / 1000}
                    disabled
                  ></Input>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell id="totalVolume" className="text-center" colSpan={2}>
                  {t("scale.target")}
                </TableCell>
                <TableCell className="text-center" colSpan={3}>
                  <Input
                    defaultValue={blend.totalVolume}
                    ref={volumeRef}
                  ></Input>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell id="totalVolume" className="text-center" colSpan={5}>
                  <Button
                    variant={"secondary"}
                    type="button"
                    onClick={() => {
                      const { currentVolume, isValid } = validateVolume(
                        volumeRef.current.value
                      );

                      if (isValid)
                        return scaleRecipe(blend.totalVolume, currentVolume);

                      toast({
                        description: t("validNumber"),
                        variant: "destructive",
                      });
                    }}
                  >
                    {t("scale.title")}
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </form>
    </>
  );
}
