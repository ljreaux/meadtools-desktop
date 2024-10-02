import useMultiStepForm from "../../hooks/useMultiStepForm";
import RecipeBuilder from "../Home/RecipeBuilder";
import { Additive, RecipeData } from "../../App";
import { initialIngredients } from "../Home/initialIngredients";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MainInputs, { YeastType } from "../Nutrients/MainInputs";
import AdvancedInputForm from "../Nutrients/AdvancedInputForm";
import NutrientCalcResults from "../Nutrients/NutrientCalcResults";
import useMaxGpl from "../../hooks/useMaxGpl";
import { initialData } from "../Nutrients/initialData";
import { useTranslation } from "react-i18next";
import { FormData } from "../Nutrients/NutrientCalc";
import Stabilizers from "../Home/Stabilizers";
import Additives from "../Home/Additives";
import MyDocument from "../Home/PDF";
import Loading from "../Loading";
import { List } from "../../App";
import { usePDF } from "@react-pdf/renderer";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import Title from "../Title";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API_URL } from "../../main";
import Notes from "../Home/Notes";
import SaveRecipeForm from "../Home/SaveRecipeForm";
import UpdateRecipeForm from "./UpdateRecipeForm";
import ResetButton from "../Home/ResetButton";
import { MdPictureAsPdf } from "react-icons/md";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "../ui/button";
import { LocalRecipeForm } from "./LocalRecipeForm";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { createRecipeLink } from "@/db";
import { usePathContext } from "@/hooks/usePathContext";

export default function Recipes({
  ingredientsList,
  setIngredientsList,
  token,
  userId,
}: {
  ingredientsList: List;
  setIngredientsList: Dispatch<SetStateAction<List>>;
  token: string | null;
  userId: number | null;
}) {
  const [showLocalForm, setShowLocalForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();
  const language = i18n.language;
  const isMetric = language !== "en" && language !== "en-US";
  const navigate = useNavigate();
  const [recipeUser, setRecipeUser] = useState(0);
  const notCurrentUser = recipeUser !== 0 && recipeUser !== userId;
  const [recipeName, setRecipeName] = useState("");
  const [updateForm, setUpdateForm] = useState(true);
  const [, setBlendSG] = useState([0.996, 0.996]);

  const [primaryNotes, setPrimaryNotes] = useState<string[][]>([["", ""]]);
  const [secondaryNotes, setSecondaryNotes] = useState<string[][]>([["", ""]]);

  const [recipeData, setRecipeData] = useState<RecipeData>({
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
  });
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [secondaryVolume, setSecondaryVolume] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const [nuteInfo, setNuteInfo] = useState<null | {
    ppmYan: number[];
    totalGrams: number[];
    perAddition: number[];
    totalYan: number;
    remainingYan: number;
    gf: {
      gf: number;
      gfWater: number;
      gfType?: string;
    };
  }>(null);

  useEffect(() => {
    if (advanced && !yanFromSource) setYanFromSource([0, 0, 0]);
    else setYanFromSource(null);
  }, [advanced]);

  function setSorbateSulfite(sorbate?: number, sulfite?: number): void {
    if (sorbate && sulfite)
      setRecipeData((prev) => ({
        ...prev,
        sorbate,
        sulfite,
      }));
    else
      setRecipeData((prev) => {
        const prevCopy = { ...prev };
        delete prevCopy.sorbate;
        delete prevCopy.sulfite;
        return {
          ...prevCopy,
        };
      });
  }

  function editAdditives(additive: Additive, index: number) {
    setRecipeData((prev) => ({
      ...prev,
      additives: prev.additives.map((prevAdd, i) =>
        i === index ? additive : prevAdd
      ),
    }));
  }

  function addAdditive() {
    setRecipeData((prev) => ({
      ...prev,
      additives: [...prev.additives, { name: "", amount: 0, unit: "g" }],
    }));
  }

  function deleteAdditive(index: number) {
    setRecipeData((prev) => ({
      ...prev,
      additives: prev.additives.filter((_, i) => i !== index),
    }));
  }
  const [recalc, setRecalc] = useState(true);
  const [yanContribution, setYanContribution] = useState([40, 100, 210]);
  const [yanFromSource, setYanFromSource] = useState<number[] | null>(null);
  const [data, setData] = useState<FormData>({
    ...initialData,
    inputs: {
      ...initialData.inputs,
      volume: recipeData.volume,
      sg: recipeData.OG - recipeData.FG + 1,
      offset: recipeData.offset,
    },
    selected: {
      ...initialData.selected,
      volumeUnits: recipeData.units.volume,
    },
  });
  const maxGPL = useMaxGpl(
    data.maxGpl,
    data.selected.schedule,
    data.inputs?.sg
  );
  const { toast } = useToast();

  useEffect(() => {
    setData((prev: FormData) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        volume: recipeData.volume,
        sg: Math.round((recipeData.OG - recipeData.FG + 1) * 1000) / 1000,
        offset: Math.round(recipeData.offset * 100) / 100,
      },
      selected: {
        ...prev.selected,
        volumeUnits: recipeData.units.volume,
      },
    }));
  }, [
    recipeData.volume,
    recipeData.OG,
    recipeData.FG,
    recipeData.offset,
    recipeData.units.volume,
  ]);
  const [yeasts, setYeasts] = useState<YeastType>({
    Lalvin: [],
    Fermentis: [],
    MangroveJack: [],
    RedStar: [],
    Other: [],
  });

  const [instance, setInstance] = usePDF({
    document: (
      <MyDocument
        {...recipeData}
        {...ingredientsList}
        {...data}
        {...yeasts}
        nuteInfo={nuteInfo}
        primaryNotes={primaryNotes}
        secondaryNotes={secondaryNotes}
      />
    ),
  });

  useEffect(() => {
    setInstance(
      <MyDocument
        {...recipeData}
        {...ingredientsList}
        {...data}
        {...yeasts}
        nuteInfo={nuteInfo}
        primaryNotes={primaryNotes}
        secondaryNotes={secondaryNotes}
      />
    );
  }, [recipeData, ingredientsList, data, yeasts, nuteInfo]);

  const { recipeId } = useParams();
  useEffect(() => {
    function cocatNotes(notes: string[]): string[][] {
      const newNotes = [];
      while (notes.length) newNotes.push(notes.splice(0, 2));

      return newNotes;
    }

    const getRecipe = async () => {
      const loginError = t("alerts.loginError");
      const notFoundError = "RecipeNotFoundError";

      try {
        if (!token) throw new Error(loginError);
        const res = await fetch(`${API_URL}/recipes/${recipeId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const { recipe } = await res.json();
        if (!recipe) throw new Error(loginError);
        if (recipe.name === notFoundError) throw new Error(recipe.message);
        const {
          name,
          recipeData,
          nutrientData,
          advanced,
          yanFromSource,
          yanContribution,
          nuteInfo,
          user_id,
          primaryNotes,
          secondaryNotes,
        } = recipe;
        setRecipeName(name);
        setRecipeUser(user_id);
        setRecipeData(JSON.parse(recipeData));
        setData(JSON.parse(nutrientData));
        setAdvanced(JSON.parse(advanced));
        setYanFromSource(JSON.parse(yanFromSource));
        setYanContribution(JSON.parse(yanContribution));
        setNuteInfo(JSON.parse(nuteInfo));
        setPrimaryNotes(cocatNotes(primaryNotes));
        setSecondaryNotes(cocatNotes(secondaryNotes));
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast({
          description: err?.toString(),
          variant: "destructive",
        });
        navigate("/");
      }
    };
    getRecipe();
  }, []);

  const noUserError = t("alerts.notCurrentUser");
  useEffect(() => {
    notCurrentUser &&
      toast({
        description: noUserError,
        action: (
          <ToastAction
            altText="Save Copy"
            onClick={() => goTo(steps.length - 1)}
            className="w-1/4 px-2 py-1 text-xs border-2 border-solid hover:bg-background rounded-2xl hover:border-foreground bg-background border-background md:text-sm disabled:bg-background disabled:hover:border-foreground disabled:hover:text-sidebar disabled:cursor-not-allowed"
          >
            Save Copy
          </ToastAction>
        ),
      });
  }, [recipeUser]);
  const { defaultPath } = usePathContext();
  const saveLocally = async () => {
    try {
      const file = await save({
        defaultPath: `${defaultPath}${recipeName}.mead`,
        filters: [{ name: "mead", extensions: ["mead"] }],
      });
      if (!file) throw new Error("Couldn't save file");
      await writeTextFile(
        file,
        JSON.stringify({
          name: recipeName,
          primaryNotes,
          secondaryNotes,
          recipeData,
          nutrientData: data,
          nuteInfo,
          yanContribution,
          yanFromSource,
          advanced,
        })
      );
      alert("File saved successfully: " + file);

      await createRecipeLink(recipeName, file);
    } catch (err) {
      toast({
        description: `Error saving file: ${err}`,
        variant: "destructive",
      });
      console.error(err);
    }
  };
  const { next, back, goTo, step, currentStepIndex, steps } = useMultiStepForm([
    <RecipeBuilder
      {...recipeData}
      setRecipeData={setRecipeData}
      ingredientsList={ingredientsList}
      setIngredientsList={setIngredientsList}
      setBlendFG={setBlendSG}
      setSecondaryVolume={setSecondaryVolume}
      recipeName={recipeName}
    />,
    <>
      <MainInputs
        {...data}
        setData={setData}
        yeasts={yeasts}
        setYeasts={setYeasts}
        recalc={recalc}
        setRecalc={setRecalc}
      />
      <button
        onClick={() => setAdvanced((prev: boolean) => !prev)}
        className="w-1/4 px-2 py-1 text-base border-2 border-solid hover:bg-background rounded-2xl hover:border-foreground bg-background border-background md:text-lg disabled:bg-background disabled:hover:border-foreground disabled:hover:text-sidebar disabled:cursor-not-allowed"
      >
        {t("buttonLabels.advanced")}
      </button>
      {advanced && (
        <AdvancedInputForm
          advanced={advanced}
          yanFromSource={yanFromSource}
          setYanFromSource={setYanFromSource}
          yanContribution={yanContribution}
          setYanContribution={setYanContribution}
        />
      )}{" "}
    </>,
    <NutrientCalcResults
      {...data}
      {...maxGPL}
      yanFromSource={yanFromSource}
      advanced={advanced}
      setNuteInfo={setNuteInfo}
      nuteInfo={nuteInfo}
    />,
    <Stabilizers
      abv={recipeData.ABV}
      batchVolume={secondaryVolume}
      volumeUnits={recipeData.units.volume}
      setSorbateSulfite={setSorbateSulfite}
    />,
    <Additives
      additives={recipeData.additives}
      editAdditives={editAdditives}
      addAdditive={addAdditive}
      deleteAdditive={deleteAdditive}
      volumeUnits={recipeData.units.volume}
      batchVolume={recipeData.volume}
    />,
    <Notes
      primaryNotes={primaryNotes}
      secondaryNotes={secondaryNotes}
      setPrimaryNotes={setPrimaryNotes}
      setSecondaryNotes={setSecondaryNotes}
    />,
    <>
      {instance.loading && <Loading />}
      {!instance.loading && instance.url && (
        <div className="flex flex-col items-center justify-center w-11/12 p-8 mt-24 mb-8 rounded-xl bg-background aspect-video">
          <Title header={t("PDF.title")} />
          <div className="w-[80%] h-[50vh]">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={instance.url}
                plugins={[
                  // Register plugins
                  defaultLayoutPluginInstance,
                ]}
              />
            </Worker>
          </div>
        </div>
      )}
    </>,
    <>
      {notCurrentUser ? (
        <SaveRecipeForm
          recipeData={recipeData}
          nutrientData={data}
          nuteInfo={nuteInfo}
          primaryNotes={primaryNotes}
          secondaryNotes={secondaryNotes}
          yanContribution={yanContribution}
          yanFromSource={yanFromSource}
          advanced={advanced}
        />
      ) : (
        <>
          {updateForm ? (
            <>
              {showLocalForm ? (
                <LocalRecipeForm
                  recipeName={recipeName}
                  setRecipeName={setRecipeName}
                  handleSubmit={async () => await saveLocally()}
                />
              ) : (
                <UpdateRecipeForm
                  name={recipeName}
                  updateName={setRecipeName}
                  recipeData={recipeData}
                  nutrientData={data}
                  nuteInfo={nuteInfo}
                  primaryNotes={primaryNotes}
                  secondaryNotes={secondaryNotes}
                  yanContribution={yanContribution}
                  yanFromSource={yanFromSource}
                  advanced={advanced}
                />
              )}
            </>
          ) : (
            <>
              {showLocalForm ? (
                <LocalRecipeForm
                  recipeName={recipeName}
                  setRecipeName={setRecipeName}
                  handleSubmit={async () => await saveLocally()}
                />
              ) : (
                <SaveRecipeForm
                  recipeData={recipeData}
                  nutrientData={data}
                  nuteInfo={nuteInfo}
                  primaryNotes={primaryNotes}
                  secondaryNotes={secondaryNotes}
                  yanContribution={yanContribution}
                  yanFromSource={yanFromSource}
                  advanced={advanced}
                />
              )}
            </>
          )}
          <p>{t("accountPage.or")}</p>
          <div className="flex flex-col w-1/4">
            {!showLocalForm && (
              <Button
                variant={"secondary"}
                onClick={() => setUpdateForm((prev) => !prev)}
              >
                {updateForm ? t("changesForm.saveAs") : t("changesForm.login")}
              </Button>
            )}
            <Button
              variant={"secondary"}
              onClick={() => setShowLocalForm(!showLocalForm)}
            >
              {showLocalForm ? t("meadtoolsOnline") : t("saveLocally")}
            </Button>
          </div>
        </>
      )}
    </>,
  ]);

  const [searchParams] = useSearchParams();
  const pdf = searchParams.get("pdf");
  useEffect(() => {
    pdf && goTo(steps.length - 2);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-12 mb-12">
      {loading ? <Loading /> : step}
      <div className="flex items-center justify-center w-1/4">
        {currentStepIndex > 0 && (
          <Button
            variant={"secondary"}
            onClick={back}
            className="flex-1 w-full"
          >
            {t("buttonLabels.back")}
          </Button>
        )}
        {currentStepIndex < steps.length - 1 && (
          <Button
            variant={"secondary"}
            className="flex-1 w-full"
            onClick={() => {
              setData((prev) => ({
                ...prev,
                yanContribution,
              }));
              next();
            }}
          >
            {t("buttonLabels.next")}
          </Button>
        )}
      </div>
      <div className="w-1/4 flex items-center justify-center  mb-[3rem]">
        <ResetButton
          setRecipeData={setRecipeData}
          setData={setData}
          recipeData={recipeData}
          setPrimaryNotes={setPrimaryNotes}
          setSecondaryNotes={setSecondaryNotes}
        />{" "}
        {currentStepIndex !== steps.length - 2 && (
          <Button
            variant={"secondary"}
            className="flex-1"
            onClick={() => goTo(steps.length - 2)}
          >
            <div className="flex items-center justify-center w-full h-full text-2xl">
              <MdPictureAsPdf />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
