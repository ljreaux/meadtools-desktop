import { API_URL } from "../main";
import { getAllYeasts as fetchYeasts, deleteYeast as deleteYeastById } from '../db/index'
import { Yeast } from "@/components/Nutrients/MainInputs";

export default async function getAllYeasts(): Promise<Yeast[]> {
  const yeasts = await fetchYeasts()
  return (yeasts as Yeast[]).sort();
}
export async function deleteYeast(id: string) {
  return await deleteYeastById(id)
}

export const deleteRecipe = async (recipeId: number, token: string | null) => {
  if (token) {
    const result = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const deleted = await result.json();
    return deleted;
  }
  return { message: "You must be logged in to delete a recipe." };
};
