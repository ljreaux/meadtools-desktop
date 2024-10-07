import { Ingredient as IngredientType, List } from "../../App";
import React, { FormEvent } from "react";
import { FaMinusSquare } from "react-icons/fa";
import { useEffect } from "react";
import getAllIngredients from "../../helpers/getAllIngredients";
import { toSG } from "../../helpers/unitConverters";
import lodash from "lodash";
import { useTranslation } from "react-i18next";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "../ui/table";

export interface IngredientListItem {
  id: number;
  name: string;
  sugar_content: string;
  water_content: string;
  category: string;
}

function IngredientOptions({
  ingredients,
  setIngredients,
  setLoading,
}: {
  ingredients: List;
  setIngredients: (obj: List) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t, i18n } = useTranslation();

  const sortingFn = (a: IngredientListItem, b: IngredientListItem) => {
    // putting Honey and Water at top of list
    if (a.name === "Honey" || (a.name === "Water" && b.name !== "Honey"))
      return -1;
    if (b.name === "Honey" || (b.name === "Water" && a.name !== "Honey"))
      return 1;

    const nameA = t(`${lodash.camelCase(a.name)}`).toLowerCase(); // ignore upper and lowercase
    const nameB = t(`${lodash.camelCase(b.name)}`).toLowerCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  };
  useEffect(() => {
    (async () => {
      const ingredients = await getAllIngredients();
      setIngredients(
        ingredients.sort((a: IngredientListItem, b: IngredientListItem) =>
          sortingFn(a, b)
        )
      );
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    const sorted = [...ingredients].sort(
      (a: IngredientListItem, b: IngredientListItem) => sortingFn(a, b)
    );
    setIngredients(sorted);
  }, [i18n.language]);

  return (
    <>
      {ingredients.map((ingredient) => {
        const camelCase = lodash.camelCase(ingredient.name);
        const nameExists = i18n.exists(camelCase);
        const ingredientDisplay = nameExists ? camelCase : ingredient.name;
        return (
          <SelectItem
            key={ingredientDisplay}
            value={ingredient.name.toLowerCase()}
          >
            {t(`${ingredientDisplay}`)}
          </SelectItem>
        );
      })}
    </>
  );
}
export default function Ingredient({
  ingredient,
  index,
  ingredientsList: ingredients,
  filterTerms,
  units,
  setIngredients,
  removeLine,
  setChecked,
  setIndividual,
  setLoading,
  showBrix,
  deleteable,
}: {
  ingredient: IngredientType;
  index: number;
  ingredientsList: List;
  filterTerms: null | string[];
  units: {
    weight: "lbs" | "kg";
    volume: "gal" | "liter";
  };
  setIngredients: (obj: List) => void;
  removeLine: (index: number) => void;
  setChecked: (index: number) => void;
  setIndividual: (index: number, obj: Partial<IngredientType>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showBrix: boolean;
  deleteable: boolean;
}) {
  const converter =
    units.weight === "kg" && units.volume === "liter"
      ? (8.345 * 0.453592) / 3.78541
      : units.weight === "kg"
      ? 8.345 * 0.453592
      : units.volume === "liter"
      ? 8.345 / 3.78541
      : 8.345;

  const filtered = filterTerms
    ? ingredients.filter((ingredient) =>
        filterTerms.includes(ingredient.category)
      )
    : ingredients;
  function changeIngredient(ingName: string, index: number) {
    const found = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === ingName.toLowerCase()
    );

    if (found)
      setIndividual(index, {
        brix: Number(found.sugar_content),
        name: found.name,
        details: [
          ingredient.details[0],
          Math.round(
            (ingredient.details[0] /
              converter /
              toSG(Number(found.sugar_content))) *
              10000
          ) / 10000,
        ],
        category: found.category,
      });
  }

  function handleChange(
    e: FormEvent<EventTarget>,
    index: number,
    detailIndex: number | null
  ) {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    if (typeof detailIndex === "number") {
      const otherIndex = detailIndex === 0 ? 1 : 0;
      const detailCopy = [];
      detailCopy[detailIndex] = value;
      detailCopy[otherIndex] =
        otherIndex === 0
          ? Math.round(value * converter * toSG(ingredient.brix) * 10000) /
            10000
          : Math.round((value / converter / toSG(ingredient.brix)) * 10000) /
            10000;

      setIndividual(index, {
        details: detailCopy,
      });
    } else {
      setIndividual(index, {
        brix: value,
        details: [
          ingredient.details[0],
          Math.round(
            (ingredient.details[0] / converter / toSG(value)) * 10000
          ) / 10000,
        ],
      });
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Select
          value={ingredient.name.toLowerCase()}
          onValueChange={(val) => changeIngredient(val, index)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select an ingredient." />
          </SelectTrigger>
          <SelectContent>
            <IngredientOptions
              ingredients={filtered}
              setIngredients={setIngredients}
              setLoading={setLoading}
            />
          </SelectContent>
        </Select>
      </TableCell>
      {showBrix && (
        <TableCell>
          <Input
            type="number"
            name="ingredientBrix"
            value={ingredient.brix}
            className="h-8"
            onChange={(e) => handleChange(e, index, null)}
            onFocus={(e) => e.target.select()}
          />
        </TableCell>
      )}
      <TableCell>
        <Input
          type="number"
          name="ingredientWeight"
          value={ingredient.details[0]}
          className="h-8"
          onChange={(e) => handleChange(e, index, 0)}
          onFocus={(e) => e.target.select()}
        />
      </TableCell>

      <TableCell>
        <Input
          type="number"
          name="ingredientVolume"
          value={ingredient.details[1]}
          className="h-8"
          onChange={(e) => handleChange(e, index, 1)}
          onFocus={(e) => e.target.select()}
        />
      </TableCell>
      <TableCell className="relative flex items-center justify-center gap-4">
        <Switch
          checked={ingredient.secondary}
          onCheckedChange={() => setChecked(index)}
        />

        {deleteable && (
          <button
            className="absolute right-0 w-8 text-xl"
            onClick={() => removeLine(index)}
            type="button"
          >
            <FaMinusSquare />
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}
