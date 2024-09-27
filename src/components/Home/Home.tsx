import useMultiStepForm from "../../hooks/useMultiStepForm";
import RecipeBuilder from "./RecipeBuilder";
import { Additive, RecipeData } from "../../App";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MainInputs, { YeastType } from "../Nutrients/MainInputs";
import AdvancedInputForm from "../Nutrients/AdvancedInputForm";
import NutrientCalcResults from "../Nutrients/NutrientCalcResults";
import useMaxGpl from "../../hooks/useMaxGpl";
import { initialData } from "../Nutrients/initialData";
import { useTranslation } from "react-i18next";
import { FormData } from "../Nutrients/NutrientCalc";
import Stabilizers from "./Stabilizers";
import Additives from "./Additives";
import MyDocument from "./PDF";
import Loading from "../Loading";
import { List } from "../../App";
import { usePDF } from "@react-pdf/renderer";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import { MdPictureAsPdf } from "react-icons/md";
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import Title from "../Title";
import { Link } from "react-router-dom";
import Notes from "./Notes";
import SaveRecipeForm from "./SaveRecipeForm";
import ResetButton from "./ResetButton";
import { Button } from "../ui/button";
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";
import { createRecipeLink } from "@/db";
import { Input } from "../ui/input";
import Pill from "../PillData/Pill";
import { toast } from "../ui/use-toast";

export default function Home({
  recipeData,
  setRecipeData,
  ingredientsList,
  setIngredientsList,
  token,
  setBlendFG,
}: {
  recipeData: RecipeData;
  setRecipeData: Dispatch<SetStateAction<RecipeData>>;
  ingredientsList: List;
  setIngredientsList: Dispatch<SetStateAction<List>>;
  token: string | null;
  setBlendFG: Dispatch<SetStateAction<number[]>>;
}) {
  const [name, setName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [recipeId, setRecipeId] = useState(0);
  const [primaryNotes, setPrimaryNotes] = useLocalStorage<string[][]>(
    "primaryNotes",
    [["", ""]]
  );
  const [secondaryNotes, setSecondaryNotes] = useLocalStorage<string[][]>(
    "secondaryNotes",
    [["", ""]]
  );
  const [secondaryVolume, setSecondaryVolume] = useState(0);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { t } = useTranslation();
  const [advanced, setAdvanced] = useLocalStorage("advanced", false);
  const [nuteInfo, setNuteInfo] = useLocalStorage<null | {
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
  }>("nuteInfo", null);

  useEffect(() => {
    if (advanced) setYanFromSource([0, 0, 0]);
    else setYanFromSource(null);
  }, [advanced]);

  function setSorbateSulfite(
    sorbate?: number,
    sulfite?: number,
    campden?: number
  ): void {
    if (sorbate && sulfite && campden)
      setRecipeData((prev) => ({
        ...prev,
        sorbate,
        sulfite,
        campden,
      }));
    else
      setRecipeData((prev) => {
        const prevCopy = { ...prev };
        delete prevCopy.sorbate;
        delete prevCopy.sulfite;
        delete prevCopy.campden;
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

  const [yanContribution, setYanContribution] = useLocalStorage(
    "yanContribution",
    [40, 100, 210]
  );
  const [yanFromSource, setYanFromSource] = useLocalStorage<number[] | null>(
    "yanFromSource",
    null
  );
  const [recalc, setRecalc] = useState(true);
  const [data, setData] = useLocalStorage<FormData>("nutrientData", {
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
  }, [
    recipeData,
    ingredientsList,
    data,
    yeasts,
    nuteInfo,
    primaryNotes,
    secondaryNotes,
  ]);

  const saveLocally = async (file: string) => {
    try {
      const file = await save({
        title: name,
        filters: [{ name, extensions: ["mead"] }],
      });
      if (!file) throw new Error("Couldn't save file");
      await writeTextFile(
        file,
        JSON.stringify({
          name,
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

      setFilePath(file);
      const fileName = file.substring(
        file.lastIndexOf("/") + 1,
        file.length - ".mead".length
      );
      const { lastInsertId } = await createRecipeLink(name, file);
      setName(fileName);
      setRecipeId(lastInsertId);

      next();
    } catch (err) {
      toast({
        description: `Error saving file: ${err}`,
        variant: "destructive",
      });
    }
  };

  const { next, back, goTo, step, currentStepIndex, steps } = useMultiStepForm([
    <RecipeBuilder
      {...recipeData}
      setRecipeData={setRecipeData}
      ingredientsList={ingredientsList}
      setIngredientsList={setIngredientsList}
      setBlendFG={setBlendFG}
      setSecondaryVolume={setSecondaryVolume}
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
      <Button
        onClick={() => setAdvanced((prev: boolean) => !prev)}
        variant={"secondary"}
        className="md:w-1/4 md:max-w-56 "
      >
        {t("buttonLabels.advanced")}
      </Button>
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
      nuteInfo={nuteInfo}
      setNuteInfo={setNuteInfo}
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
      setPrimaryNotes={setPrimaryNotes}
      secondaryNotes={secondaryNotes}
      setSecondaryNotes={setSecondaryNotes}
    />,
    <>
      {instance.loading && <Loading />}
      {!instance.loading && instance.url && (
        <div className="flex flex-col items-center justify-center w-11/12 p-8 mt-24 mb-8 rounded-xl bg-background">
          <Title header={t("PDF.title")} />
          <div className="md:w-[80%] h-[50vh] w-full">
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
      {!token ? (
        <>
          <Link
            to={"/login"}
            className="flex items-center justify-center gap-4 px-8 py-2 my-4 text-lg border border-solid rounded-lg bg-background text-foreground hover:bg-foreground hover:border-background hover:text-background sm:gap-8 group"
          >
            {t("recipeForm.login")}
          </Link>
          OR
          <Input value={name} onChange={(e) => setName(e.target.value)}></Input>
          <Button variant={"secondary"} onClick={() => saveLocally(name)}>
            Save Recipe Locally
          </Button>
        </>
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
    </>,
    <Pill name={name} file_path={filePath as string} id={recipeId} />,
  ]);
  return (
    <div className="flex flex-col items-center justify-center w-full my-12">
      {step}
      <div className="flex items-center justify-center md:w-1/4 md:max-w-56 ">
        {currentStepIndex > 0 && (
          <Button
            variant={"secondary"}
            onClick={back}
            className="flex-1 w-full"
          >
            {t("buttonLabels.back")}
          </Button>
        )}
        {currentStepIndex < steps.length - 2 && (
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
      <div className="md:w-1/4 md:max-w-56 flex items-center justify-between mb-[3rem]">
        <ResetButton
          setRecipeData={setRecipeData}
          setData={setData}
          recipeData={recipeData}
          setPrimaryNotes={setPrimaryNotes}
          setSecondaryNotes={setSecondaryNotes}
        />
        {currentStepIndex !== steps.length - 3 && (
          <Button
            variant={"secondary"}
            className="flex-1"
            onClick={() => goTo(steps.length - 3)}
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
