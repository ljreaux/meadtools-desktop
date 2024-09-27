import { Route, Routes } from "react-router-dom";
import Yeasts from "./Yeasts";
import EditYeast from "./EditYeast";
import { NewYeastForm } from "./NewYeastForm";

function YeastDashboard() {
  return (
    <div className="w-11/12 h-full p-8 my-24 bg-background rounded-2xl">
      <Routes>
        <Route path="/" element={<Yeasts />} />
        <Route path="/create" element={<NewYeastForm />} />{" "}
        <Route path="/edit/:id" element={<EditYeast />} />
      </Routes>
    </div>
  );
}

export default YeastDashboard;
