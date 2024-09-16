import readXlsxFile from "read-excel-file";
import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { HydrometerData } from "./LineChart";

const pillSchema = {
  Date: {
    prop: "date",
    type: String,
  },
  Temperature: {
    prop: "temperature",
    type: Number,
  },
  Gravity: {
    prop: "gravity",
    type: Number,
  },
  "Signal Strength": {
    prop: "signalStrength",
    type: Number,
  },
  Battery: {
    prop: "battery",
    type: Number,
  },
};

const tiltSchema = {
  Timepoint: {
    prop: "date",
    type: Date,
  },
  SG: {
    prop: "gravity",
    type: Number,
  },

  "Temp (°F)": {
    prop: "temperature",
    type: Number,
  },
  "Temp (°C)": {
    prop: "temperature",
    type: Number,
  },

  Beer: {
    prop: "name",
    type: String,
  },
  Comment: {
    prop: "comment",
    type: String,
    optional: true,
  },
};
export type FileData = {
  date: string;
  temperature: number;
  gravity: number;
  signalStrength?: number;
  battery?: number;
};

type FileTypes = "tilt" | "pill";

function Pill() {
  const [data, setData] = useState<FileData[] | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileTypes>("pill");
  const [recipeName, setRecipeName] = useState<string | null>(null);

  const schema = fileType === "tilt" ? tiltSchema : pillSchema;

  const findFilePath = async () => {
    const file = await open({
      filters: [{ name: "Pill", extensions: ["xlsx"] }],
      multiple: false,
    });
    console.log(file);
    if (file) {
      setFilePath(file as string);
    }
  };

  useEffect(() => {
    (async () => {
      if (filePath) {
        const binary = await readBinaryFile(filePath);
        const file = await readXlsxFile(binary, { schema });
        if (file && !file.errors.length) {
          const { rows } = file;
          const recipeName = rows[0].name as string | undefined;
          if (recipeName) setRecipeName(recipeName);
          const parsedData = rows.map((row) => {
            const rowCopy = {
              ...row,
              date: new Date(row.date as string).toISOString(),
            } as FileData & { name?: string };

            if (row.name) delete rowCopy.name;

            return rowCopy;
          });
          if (fileType === "tilt") parsedData.reverse();
          setData(parsedData);
        }
      }
    })();
  }, [filePath]);

  return (
    <div className="w-11/12">
      <Select
        value={fileType}
        onValueChange={(val: FileTypes) => setFileType(val)}
      >
        <SelectTrigger>
          <SelectValue></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pill">Pill</SelectItem>
          <SelectItem value="tilt">Tilt</SelectItem>
        </SelectContent>
      </Select>
      <button onClick={findFilePath}>Open {fileType} file</button>

      {data && <HydrometerData chartData={data} name={recipeName || ""} />}
    </div>
  );
}

export default Pill;
