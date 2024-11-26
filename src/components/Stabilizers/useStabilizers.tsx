import { useEffect, useState } from "react";

const useStabilizers = () => {
  const [firstMount, setFirstMount] = useState(true);
  const [volume, setVolume] = useState(1);
  const [volumeUnits, setVolumeUnits] = useState<"gal" | "lit">("gal");
  const [abv, setAbv] = useState(12);

  const [phReading, setPhReading] = useState(3.6);
  const [sorbate, setSorbate] = useState(0);
  const [sulfite, setSulfite] = useState(0);
  const [campden, setCampden] = useState(0);
  const [takingReading, setTakingReading] = useState(false);

  useEffect(() => setFirstMount(false), []);
  useEffect(() => {
    if (!takingReading) setPhReading(3.6);
  }, [takingReading]);

  useEffect(() => {
    const ph = Math.round(phReading * 10) / 10;
    const vol = volumeUnits == "gal" ? volume * 0.003785411784 : volume / 1000;
    const sorbate = ((-abv * 25 + 400) / 0.75) * vol;
    setSorbate(sorbate);

    let ppm = 50;
    if (ph <= 2.9) ppm = 11;
    if (ph == 3) ppm = 13;
    if (ph == 3.1) ppm = 16;
    if (ph == 3.2) ppm = 21;
    if (ph == 3.3) ppm = 26;
    if (ph == 3.4) ppm = 32;
    if (ph == 3.5) ppm = 39;
    if (ph == 3.6) ppm = 50;
    if (ph == 3.7) ppm = 63;
    if (ph == 3.8) ppm = 98;
    if (ph >= 3.9) ppm = 123;

    const sulfite =
      volumeUnits == "gal"
        ? (volume * 3.785 * ppm) / 570
        : (volume * ppm) / 570;
    setSulfite(sulfite);

    const campden =
      volumeUnits !== "gal"
        ? (ppm / 75) * (volume / 3.785)
        : (ppm / 75) * volume;
    setCampden(campden);
  }, [abv, volume, phReading]);

  useEffect(() => {
    if (firstMount) return;
    if (volumeUnits === "lit") {
      setVolume(Math.round(volume * 3.785 * 1000) / 1000);
    } else {
      setVolume(Math.round((volume / 3.785) * 1000) / 1000);
    }
  }, [volumeUnits]);

  return {
    phReading,
    sorbate,
    sulfite,
    campden,
    volume,
    setVolume,
    volumeUnits,
    setVolumeUnits,
    abv,
    setAbv,
    setPhReading,
    takingReading,
    setTakingReading,
  };
};

export default useStabilizers;
