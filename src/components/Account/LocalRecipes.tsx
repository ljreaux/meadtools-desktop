import { deleteRecipe, getAllRecipes, updateRecipe } from "@/db";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "../ui/button";
import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import Title from "../Title";
import { useTranslation } from "react-i18next";
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
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { usePathContext } from "@/hooks/usePathContext";

type Recipe = {
  name: string;
  id: number;
  file_path: string;
  hydrometer_data_path: string | null;
};
function LocalRecipes({
  setFilePath,
}: {
  setFilePath: (filePath: string) => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const localRecipes = await getAllRecipes();
      setRecipes(localRecipes);
    })();
  }, []);

  const openRecipe = async (
    {
      name,
      file_path,
      hydrometer_data_path,
    }: {
      name: string;
      file_path: string;
      hydrometer_data_path: string | null;
    },
    pdf?: boolean,
    hydro?: boolean
  ) => {
    const fileExists = await exists(file_path);
    if (fileExists) {
      const hydroPath = hydrometer_data_path
        ? `&hydroPath=${hydrometer_data_path}`
        : "";
      setFilePath(file_path);

      const goToPdf = "/?pdf=true" + hydroPath;
      const goToHydro = `/?hydro=true` + hydroPath;

      if (pdf) navigate(goToPdf);
      else if (hydro) navigate(goToHydro);
      else navigate("/");
    } else {
      toast({
        title: t("desktop.error"),
        description: t("desktop.notFound"),
        action: (
          <ToastAction
            onClick={() =>
              relinkFile({ name, file_path, hydrometer_data_path })
            }
            altText="Relink file."
          >
            {t("desktop.relink")}
          </ToastAction>
        ),
      });
    }
  };
  const relinkFile = async ({
    name,
    hydrometer_data_path,
  }: {
    name: string;

    file_path: string;
    hydrometer_data_path: string | null;
  }) => {
    const file = await open({
      filters: [{ name: "Pill", extensions: ["mead"] }],
      multiple: false,
    });
    if (file) {
      updateRecipe(name, { file_path: file as string, hydrometer_data_path });
      setFilePath(file as string);
      navigate("/");
    }
  };

  const addHydrometerData = async ({
    id,
    file_path,
  }: {
    id: number;

    file_path: string;
  }) => {
    const file = await open({
      filters: [{ name: "Pill", extensions: ["xlsx", "csv"] }],
      multiple: false,
    });
    if (file) {
      updateRecipe(id.toString(), {
        hydrometer_data_path: file as string,
        file_path,
      });
      setFilePath(file_path);
      navigate(`/?hydro=true&hydroPath=${file}`);
    }
  };

  const validatePath = async ({
    id,
    file_path,
  }: {
    id: number;

    file_path: string;
  }) => {
    const fileExists = await exists(file_path);
    if (fileExists) return;
    toast({
      title: t("desktop.notFound"),
      description: t("desktop.notFound"),
      action: (
        <ToastAction
          onClick={() => addHydrometerData({ id, file_path })}
          altText="Relink file."
        >
          {t("desktop.relink")}
        </ToastAction>
      ),
    });
  };
  const { setDefaultPath } = usePathContext();
  const definePath = async () => {
    let path = (await open({ directory: true })) ?? "/";
    if (!path.endsWith("/")) path += "/";
    setDefaultPath(path);
  };
  return (
    <div className="relative flex flex-col items-center w-11/12 p-8 my-24 sm:w-9/12 rounded-xl bg-background">
      <Button className="ml-auto" variant={"secondary"} onClick={definePath}>
        Set Default Path
      </Button>
      <Title header={t("localRecipes")} />
      <div
        className={`flex flex-wrap justify-center items-center gap-4 text-center mt-4 `}
      >
        {!recipes.length && (
          <div>
            <p>{t("desktop.noRecipes")}</p>
          </div>
        )}

        {recipes.map((recipe: Recipe) => {
          return (
            <div
              className="grid items-center justify-center gap-2"
              key={recipe.id}
            >
              <h2>{recipe.name}</h2>
              <div className="flex gap-1">
                <Button
                  onClick={() => openRecipe(recipe)}
                  variant={"secondary"}
                >
                  {t("accountPage.viewRecipe")}
                </Button>

                <Button
                  onClick={() => openRecipe(recipe, true)}
                  variant={"secondary"}
                >
                  {t("PDF.title")}
                </Button>
                {recipe.hydrometer_data_path ? (
                  <Button
                    onClick={() => {
                      validatePath(recipe).then(() =>
                        openRecipe(recipe, false, true)
                      );
                    }}
                    variant={"secondary"}
                  >
                    {t("desktop.openHydro")}
                  </Button>
                ) : (
                  <>
                    <Popover>
                      <PopoverTrigger
                        className={buttonVariants({ variant: "secondary" })}
                      >
                        {t("desktop.addHydro")}
                      </PopoverTrigger>
                      <PopoverContent className="grid gap-4 ">
                        <Link
                          to={`/manualEntry/${recipe.id}`}
                          className={buttonVariants({ variant: "secondary" })}
                        >
                          {t("desktop.manual")}
                        </Link>
                        <Button
                          variant={"secondary"}
                          onClick={() => addHydrometerData(recipe)}
                        >
                          {t("desktop.manual")}
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    {t("accountPage.deleteRecipe")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("desktop.confirm")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("desktop.dialogDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className={buttonVariants({ variant: "default" })}
                    >
                      {t("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={() =>
                        deleteRecipe(recipe.id.toString()).then(() =>
                          setRecipes((prev: Recipe[]) =>
                            prev.filter((rec: Recipe) => recipe.id !== rec.id)
                          )
                        )
                      }
                    >
                      {t("continue")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LocalRecipes;
