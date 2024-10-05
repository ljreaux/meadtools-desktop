import { z, ZodTypeAny } from "zod";

export const numericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === "string") {
      return Number(a);
    } else if (typeof a === "number") {
      return a;
    } else {
      return undefined;
    }
  }, schema);

export const convertToC = (num: number) => {
  return ((num - 32) * 5) / 9;
};
export const convertToF = (num: number) => {
  return (num * 9) / 5 + 32;
};

export const brands = [
  { label: "lalvin.label", name: "Lalvin" },
  { label: "fermentis.label", name: "Fermentis" },
  { label: "mangroveJack.label", name: "Mangrove Jack" },
  { label: "other.label", name: "Other" },
  { label: "redStar.label", name: "Red Star" },
];

export const n2Requirements = [
  { label: "n2Requirement.low", name: "Low" },
  { label: "n2Requirement.medium", name: "Medium" },
  { label: "n2Requirement.high", name: "High" },
  { label: "n2Requirement.veryHigh", name: "Very High" },
];

export const categories = [
  { label: "sugar", name: "sugar" },
  { label: "water", name: "water" },
  { label: "juice", name: "juice" },
  { label: "fruit", name: "fruit" },
  { label: "driedFruit", name: "dried fruit" },
  { label: "vegetable", name: "vegetable" },
  { label: "other.label", name: "other" },
];