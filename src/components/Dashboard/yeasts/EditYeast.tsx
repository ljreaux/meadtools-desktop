import { useParams } from "react-router-dom";
import { EditYeastForm } from "./EditYeastForm";
import { useEffect, useState } from "react";
import { getYeastById } from "@/db";
import Spinner from "@/components/Spinner";

function EditYeast() {
  const { id } = useParams<{ id: string }>();
  const [yeast, setYeast] = useState<any>(null);

  useEffect(() => {
    if (id) getYeastById(id).then((yeast) => setYeast(yeast));
  }, [id]);

  if (!yeast) return <Spinner />;

  return (
    <div>
      <EditYeastForm yeast={yeast} />
    </div>
  );
}

export default EditYeast;
