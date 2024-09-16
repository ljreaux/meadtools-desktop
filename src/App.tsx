import ExtraCalcs from "./components/ExtraCalculators/ExtraCalcs";
import { useEffect, useState } from "react";
import Navbar from "./components/Navs/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import BottomBar from "./components/Navs/BottomBar";
import About from "./components/About/About";
import ContactUs from "./components/About/ContactUs";
import NutrientCalc from "./components/Nutrients/NutrientCalc";
import Home from "./components/Home/Home";
import { initialIngredients } from "./components/Home/initialIngredients";
import { IngredientListItem } from "./components/Home/Ingredient";
import Login from "./components/Account/Login";
import Account from "./components/Account/Account";
import useLocalStorage from "./hooks/useLocalStorage";
// import useAbv from "./hooks/useAbv";
import Recipes from "./components/Recipes/Recipes";
import LocalRecipe from "./components/Recipes/LocalRecipe";
import { listen } from "@tauri-apps/api/event";
import { seedDb } from "./db";
import YeastDashboard from "./components/Dashboard/yeasts/YeastDashboard";
import Pill from "./components/PillData/Pill";

export interface Additive {
  name: string;
  amount: number;
  unit: string;
}

export interface Ingredient {
  name: string;
  brix: number;
  details: number[];
  secondary: boolean;
  category: string;
}

export type List = IngredientListItem[];

export interface RecipeData {
  ingredients: Ingredient[];
  OG: number;
  volume: number;
  ABV: number;
  FG: number;
  offset: number;
  units: {
    weight: "lbs" | "kg";
    volume: "gal" | "liter";
  };
  sorbate?: number;
  sulfite?: number;
  campden?: number;
  additives: Additive[];
}

export type Opened = {
  menu: boolean;
  calcs: boolean;
  extraCalcs: boolean;
  account: boolean;
  links: boolean;
  settings: boolean;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    seedDb();
    navigate("/pill");
  }, []);

  const [filePath, setFilePath] = useState<string | null>(null);
  useEffect(() => {
    const root = document.querySelector("#root");
    const unlisten = listen("tauri://file-drop", (event) => {
      if (event.payload) {
        const [filePath] = event.payload as string[];
        if (root) {
          root.classList.remove("blur");
        }

        if (filePath.endsWith(".mead")) {
          setFilePath(filePath);
          navigate("/");
        } else alert("Please select a valid .mead file");
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);
  useEffect(() => {
    const root = document.querySelector("#root");
    const unlisten = listen("tauri://file-drop-hover", () => {
      if (root) {
        root.classList.add("blur");
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);
  const [isMetric, setIsMetric] = useLocalStorage("metric", false);
  const [theme, setTheme] = useLocalStorage("theme", true);

  const [ingredientsList, setIngredientsList] = useState<List>([]);
  const [recipeData, setRecipeData] = useLocalStorage<RecipeData>(
    "recipeData",
    {
      ingredients: initialIngredients,
      OG: 0,
      volume: 0,
      ABV: 0,
      FG: 0.996,
      offset: 0,
      units: {
        weight: isMetric ? "kg" : "lbs",
        volume: isMetric ? "liter" : "gal",
      },
      additives: [{ name: "", amount: 0, unit: "g" }],
    }
  );

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [user, setUser] = useLocalStorage<{
    id: number;
    role: "user" | "admin";
    email: string;
  } | null>("user", null);

  const [, setBlendSG] = useState([0.996, 0.996]);

  useEffect(() => {
    const body = document.querySelector("body");
    body?.setAttribute("data-theme", theme ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    setRecipeData((prev) => ({
      ...prev,
      units: {
        weight: isMetric ? "kg" : "lbs",
        volume: isMetric ? "liter" : "gal",
      },
    }));
  }, [isMetric]);

  return (
    <>
      <Navbar token={token} setToken={setToken} setUser={setUser} />
      <main className="flex items-center justify-center w-full min-h-[100vh] bg-secondary">
        <Routes>
          <Route
            path="/home"
            element={
              <Home
                recipeData={recipeData}
                setRecipeData={setRecipeData}
                ingredientsList={ingredientsList}
                setIngredientsList={setIngredientsList}
                token={token}
                setBlendFG={setBlendSG}
              />
            }
          />
          <Route path="/NuteCalc" element={<NutrientCalc />} />
          <Route path="/ExtraCalcs/*" element={<ExtraCalcs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/login"
            element={<Login setToken={setToken} theme={theme} />}
          />
          <Route
            path="/account"
            element={
              <Account
                token={token}
                setToken={setToken}
                setUser={setUser}
                user={user}
                isDarkTheme={theme}
                setTheme={setTheme}
                isMetric={isMetric}
                setIsMetric={setIsMetric}
              />
            }
          />
          <Route
            path="/recipes/:recipeId"
            element={
              <Recipes
                ingredientsList={ingredientsList}
                setIngredientsList={setIngredientsList}
                token={token}
                userId={user?.id || null}
              />
            }
          />
          <Route
            path="/"
            element={
              <LocalRecipe
                ingredientsList={ingredientsList}
                setIngredientsList={setIngredientsList}
                token={token}
                userId={user?.id || null}
                filePath={filePath}
              />
            }
          />
          <Route path="/yeasts/*" element={<YeastDashboard />} />
          <Route path="/pill" element={<Pill />} />
        </Routes>

        <BottomBar />
      </main>
    </>
  );
}

export default App;
