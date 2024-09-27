import { toSG } from "@/helpers/unitConverters";
import { useEffect, useState } from "react";

export default function useJuice() {
  const [sugar, setSugar] = useState("0");
  const [sugarUnits, setSugarUnits] = useState("g");
  const [servingSize, setServingSize] = useState("0");
  const [servingSizeUnits, setServingSizeUnits] = useState("ml");
  const [servings, setServings] = useState("0");
  const [brix, setBrix] = useState(0);
  const [sg, setSG] = useState(Math.round(toSG(brix) * 1000) / 1000);
  const [totalSugar, setTotalSugar] = useState(0)

  useEffect(() => {
    let multiplier = 1;
    if (sugarUnits === 'mg') multiplier = .1

    const mg = Number(sugar) * multiplier;

    let servingMultiplier = 1;
    if (servingSizeUnits === 'floz') servingMultiplier = 29.5735

    const serving = servingMultiplier * Number(servingSize)

    const brix = Math.round(((mg / serving) * 100) * 1000) / 1000;

    (isNaN(brix) || brix > 1000) ? setBrix(0) : setBrix(brix);

    const batchSugar = Math.round(Number(sugar) * Number(servings) * 1000) / 1000;

    isNaN(batchSugar) ? setTotalSugar(0) : setTotalSugar(batchSugar);


  }, [sugar, sugarUnits, servingSize, servingSizeUnits, servings]);

  const helper = (str: string, multiplier: number) => {
    return Math.round((Number(str) * multiplier * 10000) / 10000).toString()
  }

  useEffect(() => {
    if (sugarUnits === 'mg') setSugar(() => helper(sugar, 1000))
    else setSugar(() => helper(sugar, .001))
  }, [sugarUnits])
  useEffect(() => {
    if (servingSizeUnits === 'floz') setServingSize(() => helper(servingSize, 0.033814))
    else setServingSize(() => helper(servingSize, 29.5735))
  }, [servingSizeUnits])


  useEffect(() => setSG(Math.round(toSG(brix) * 1000) / 1000), [brix])



  return { sugar, servingSize, setSugar, setServingSize, setServingSizeUnits, servingSizeUnits, sugarUnits, setSugarUnits, brix, sg, servings, setServings, totalSugar }

}