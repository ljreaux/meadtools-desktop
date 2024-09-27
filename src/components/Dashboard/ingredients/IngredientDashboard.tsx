import { Route, Routes } from "react-router-dom";
import { NewIngredientForm } from "./NewIngredientForm";
import AllIngredients from "./Ingredients";
import EditIngredient from "./EditIngredient";

function IngredientDashboard() {
  return (
    <div className="w-11/12 h-full p-8 my-24 bg-background rounded-2xl">
      <Routes>
        <Route path="/" element={<AllIngredients />} />
        <Route path="/create" element={<NewIngredientForm />} />{" "}
        <Route path="/edit/:id" element={<EditIngredient />} />
      </Routes>
    </div>
  );
}

export default IngredientDashboard;
