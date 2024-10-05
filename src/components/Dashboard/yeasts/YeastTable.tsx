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

import { Yeast } from "@/components/Nutrients/MainInputs";
import { useNavigate } from "react-router-dom";
import { deleteYeast } from "@/helpers/getAllYeasts";
import { useTranslation } from "react-i18next";

export default function YeastTable({
  yeasts,
  setYeasts,
}: {
  yeasts: Yeast[];
  setYeasts: (yeast: Yeast[]) => void;
}) {
  const { t } = useTranslation();
  const deleteYeastListItem = (i: number, id: number) => {
    deleteYeast(id.toString())
      .then((data) => {
        if (data.rowsAffected === 0) throw new Error(`Could not delete`);
        else toast({ description: t("desktop.deleteSuccessful") });
      })

      .then(() => setYeasts(yeasts.filter((_, index) => index !== i)))
      .catch(() => toast({ description: t("desktop.deleteUnsuccessful") }));
  };

  const nav = useNavigate();

  return (
    <TableBody>
      {yeasts.map((yeast, i) => (
        <TableRow key={yeast.id}>
          <TableCell className="font-medium">{yeast.id}</TableCell>
          <TableCell>
            <Input value={yeast.name} disabled />
          </TableCell>
          <TableCell>
            <Input value={yeast.brand} disabled />
          </TableCell>
          <TableCell>
            <Input value={yeast.nitrogen_requirement} disabled />
          </TableCell>
          <TableCell>
            <Input value={yeast.tolerance} disabled />
          </TableCell>
          <TableCell>
            <Input value={yeast.low_temp} disabled />
          </TableCell>
          <TableCell>
            <Input value={yeast.high_temp} disabled />
          </TableCell>
          <TableCell className="flex items-center gap-2">
            <Button
              onClick={() => {
                nav(`/yeasts/edit/${yeast.id}`);
              }}
              variant="secondary"
            >
              Edit
            </Button>
            <DeleteButton
              handleClick={() => deleteYeastListItem(i, yeast.id)}
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
        {t("desktop.delete")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("desktop.yeastDelete")}
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
