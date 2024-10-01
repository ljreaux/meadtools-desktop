import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditIngredientForm } from "./EditIngredientForm";
import Spinner from "@/components/Spinner";
import { getIngredient } from "@/db";

function EditIngredient() {
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<any>(null);

  useEffect(() => {
    if (id)
      getIngredient(id).then((ing) => {
        setIngredient(ing);
      });
  }, [id]);

  if (!ingredient) return <Spinner />;
  return (
    <div>
      <EditIngredientForm ingredient={ingredient} />
    </div>
  );
}

export default EditIngredient;
