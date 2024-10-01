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
import { buttonVariants } from "../ui/button";
import { resetIngredients, resetYeasts } from "@/db";
import { toast } from "../ui/use-toast";
import Title from "../Title";
import { useTranslation } from "react-i18next";

function Reset() {
  const { t } = useTranslation();
  return (
    <div className="w-11/12 h-full p-8 my-24 text-center bg-background rounded-2xl">
      <Title header="Reset Local Data" />
      <div className="grid items-center justify-center grid-cols-2 gap-4 text-center">
        <p>{t("desktop.resetYeasts")}</p>
        <p>{t("desktop.resetIngredients")}</p>
        <AlertDialog>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            {t("reset")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("desktop.dataConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() =>
                  resetYeasts().then(() =>
                    toast({ description: t("desktop.dataDialog") })
                  )
                }
              >
                {t("reset")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            {t("reset")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("desktop.dataConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() =>
                  resetIngredients().then(() =>
                    toast({ description: t("desktop.dataDialog") })
                  )
                }
              >
                {t("reset")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="col-span-2">{t("resetAll")}</p>
        <AlertDialog>
          <AlertDialogTrigger
            className={`${buttonVariants({
              variant: "destructive",
            })} col-span-2`}
          >
            {t("reset")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("desktop.dataConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() =>
                  resetYeasts()
                    .then(() => resetIngredients())
                    .then(() =>
                      toast({
                        description: t("desktop.dataDialog"),
                      })
                    )
                }
              >
                {t("reset")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Reset;
