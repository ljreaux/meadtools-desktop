import { IngredientListItem } from '@/components/Home/Ingredient';
import { getAllIngredients as fetchIng, deleteIngredient as deleteIng } from '../db/index'

export default async function getAllIngredients(): Promise<IngredientListItem[]> {
  const ingredients = await fetchIng();
  return (ingredients as IngredientListItem[]);
}

export async function deleteIngredient(id: string) {

  return await deleteIng(id)

}