import EstOGRunButton from "./EstOGRunButton";
import Title from "./Title";
import GravityInput from "./GravityInput";

function EstimatedOG({
  handleGravity,
  abvObj,
  handleEstOG,
  abvCalc,
  toBrix,
  handleHydroFG,
  estOGObj,
}) {
  function delle(fg, abv) {
    return toBrix(fg) + 4.5 * abv;
  }
  function estimatedOG(fgh, fgr) {
    return (-1.728 * fgh + 0.01085 * fgr + 2.728).toFixed(3);
  }
  return (
    <>
      <Title header="Estimated OG Without Reading" />
      <GravityInput
        gravity="hydroFG"
        handleGravity={handleHydroFG}
        toBrix={toBrix}
        abvObj={estOGObj}
        readingType="hydroFG"
        initial={""}
        labelText="Enter Hydrometer FG: "
      />
      <div>
        <label>Enter Refractometer FG: </label>
        <input onChange={handleGravity}></input>
      </div>
      <div>
        <EstOGRunButton
          estimatedOG={estimatedOG}
          abvObj={abvObj}
          handleEstOG={handleEstOG}
          abvCalc={abvCalc}
          delle={delle}
          toBrix={toBrix}
        />
      </div>
    </>
  );
}

export default EstimatedOG;
