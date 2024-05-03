import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteRecipe } from "../../helpers/getAllYeasts";

export default function RecipeCard({
  recipe,
  token,
  setReload,
}: {
  recipe: { id: number; user_id: number; name: string };
  token: string | null;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="grid items-center justify-center gap-2">
      <p>{recipe.name}</p>
      <button
        onClick={() => token && navigate(`/recipes/${recipe.id}`)}
        className="border-2 border-solid border-textColor  hover:bg-sidebar hover:border-background md:text-lg py-1 disabled:bg-sidebar disabled:hover:border-textColor disabled:hover:text-sidebar disabled:cursor-not-allowed bg-background rounded-2xl px-2 mt-4"
      >
        {t("accountPage.viewRecipe")}
      </button>
      <button
        onClick={async () => {
          const deleted = await deleteRecipe(recipe.id, token);
          if (
            deleted.message === `${recipe.name} has been successfully deleted.`
          )
            setReload((prev) => !prev);
          else alert(deleted.message);
        }}
        className="border-2 border-solid border-textColor  hover:bg-sidebar hover:border-background md:text-lg py-1 disabled:bg-sidebar disabled:hover:border-textColor disabled:hover:text-sidebar disabled:cursor-not-allowed bg-background rounded-2xl px-2"
      >
        {t("accountPage.deleteRecipe")}
      </button>
    </div>
  );
}
