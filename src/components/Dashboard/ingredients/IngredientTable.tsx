"use client";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { deleteIngredient } from "@/db";
import { useTranslation } from "react-i18next";

export default function IngredientTable({
  ingredients,
  setIngredients,
}: {
  ingredients: {
    id: number;
    name: string;
    sugar_content: number;
    water_content: number;
    category: string;
  }[];
  setIngredients: (
    recipes: {
      id: number;
      name: string;
      sugar_content: number;
      water_content: number;
      category: string;
    }[]
  ) => void;
}) {
  const nav = useNavigate();
  const deleteIngredientListItem = (i: number, id: number) => {
    deleteIngredient(id.toString())
      .then((data) => {
        if (data.rowsAffected === 0) throw new Error(`Could not delete`);
        else toast({ description: "Ingredient deleted successfully." });
      })
      .then(() => setIngredients(ingredients.filter((_, index) => index !== i)))
      .catch((err) =>
        toast({ description: err.message, variant: "destructive" })
      );
  };
  return (
    <TableBody>
      {ingredients.map((ing, i) => (
        <TableRow key={ing.id}>
          <TableCell className="font-medium">{ing.id}</TableCell>
          <TableCell>
            <Input value={ing.name} disabled />
          </TableCell>
          <TableCell>
            <Input value={ing.sugar_content} disabled />
          </TableCell>
          <TableCell>
            <Input value={ing.water_content} disabled />
          </TableCell>
          <TableCell>
            <Input value={ing.category} disabled />
          </TableCell>
          <TableCell className="flex items-center gap-2">
            <Button
              onClick={() => nav(`/ingredients/edit/${ing.id}`)}
              variant="secondary"
            >
              Edit
            </Button>
            <DeleteButton
              handleClick={() => deleteIngredientListItem(i, ing.id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

const DeleteButton = ({ handleClick }: { handleClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive" })}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("desktop.ingredientWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleClick}
          >
            {t("desktop.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
