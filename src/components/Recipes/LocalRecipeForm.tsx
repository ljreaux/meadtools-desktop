import { useTranslation } from "react-i18next";
import Title from "../Title";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const LocalRecipeForm = ({
  recipeName,
  setRecipeName,
  handleSubmit,
}: {
  recipeName: string;
  setRecipeName: (name: string) => void;
  handleSubmit: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <form
      className="flex flex-col items-center justify-center w-11/12 gap-4 p-8 mt-24 mb-8 rounded-xl bg-background aspect-video max-w-[750px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Title header={t("saveLocally")} />
      <label
        htmlFor="recipeName"
        className="flex items-center justify-center w-full gap-4 text-center"
      >
        <p>{t("recipeForm.subtitle")}</p>
        <Input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className="max-w-56"
        />
      </label>
      <Button variant={"secondary"}>{t("recipeForm.submit")}</Button>
    </form>
  );
};
