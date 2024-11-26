// react icons
import { TbBeer } from "react-icons/tb";
import { FaPercent } from "react-icons/fa";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { SiOxygen } from "react-icons/si";
import { GiChemicalDrop, GiPowder } from "react-icons/gi";
import { PiRainbow } from "react-icons/pi";
import { TiThermometer } from "react-icons/ti";
import { RxBlendingMode } from "react-icons/rx";
import { useTranslation } from "react-i18next";

// Logos component
import Logos from "./Logos";

function ExtraCalcsSideBar() {
  const { t } = useTranslation();
  return (
    <div
      className="fixed max-h-max sm:w-12 w-fit sm:left-2 sm:right-0 sm:top-2/4 bottom-[2.5rem] sm:-translate-y-2/4 
    text-4xl bg-background border-2 border-foreground rounded-2xl justify-center items-center py-[.125rem] sm:py-0 z-[49]"
    >
      <nav className="flex justify-center mx-1 space-y-2 text-center sm:flex-col sm:my-4">
        <Logos link="/ExtraCalcs/" logo={<TbBeer />} calc={t("sideNav.abv")} />
        <Logos
          link="/ExtraCalcs/brixCalc"
          logo={<FaPercent />}
          calc={t("sideNav.brix")}
        />
        <Logos
          link="/ExtraCalcs/estOG"
          logo={<FaBalanceScaleLeft />}
          calc={t("sideNav.estOG")}
        />
        <Logos
          link="/ExtraCalcs/benchTrials"
          logo={<GiChemicalDrop />}
          calc={t("sideNav.benchTrials")}
        />
        <Logos
          link="/ExtraCalcs/sulfite"
          logo={<SiOxygen />}
          calc={t("sulfiteHeading")}
        />
        <Logos
          link="/ExtraCalcs/sorbate"
          logo={<GiPowder />}
          calc={t("sorbateHeading")}
        />
        <Logos
          link="/ExtraCalcs/RefractometerCorrection"
          logo={<PiRainbow />}
          calc={t("sideNav.refractometer")}
        />
        <Logos
          link="/ExtraCalcs/tempCorrection"
          logo={<TiThermometer />}
          calc={t("sideNav.tempCorrection")}
        />
        <Logos
          link="/ExtraCalcs/blending"
          logo={<RxBlendingMode />}
          calc={t("sideNav.blending")}
        />
      </nav>
    </div>
  );
}

export default ExtraCalcsSideBar;
