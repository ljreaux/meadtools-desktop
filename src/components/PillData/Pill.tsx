import readXlsxFile from "read-excel-file";
import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { HydrometerData } from "./LineChart";
import { calcABV } from "@/hooks/useAbv";
import convertToJson from "read-excel-file/map";
import { parse } from "papaparse";

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
  Battry: {
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
const tiltCsvSchema = {
  Timepoint: {
    prop: "date",
    type: String,
  },
  SG: {
    prop: "gravity",
    type: String,
  },

  "Temp (°F)": {
    prop: "temperature",
    type: String,
  },
  "Temp (°C)": {
    prop: "temperature",
    type: String,
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
  abv: number;
  signalStrength?: number;
  battery?: number;
};

type FileTypes = "tilt" | "pill";

function Pill() {
  const [data, setData] = useState<FileData[] | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileTypes>("pill");
  const [recipeName, setRecipeName] = useState<string | null>(null);
  const [tempUnits, setTempUnits] = useState<"C" | "F">("F");

  const schema =
    fileType === "tilt" && filePath?.endsWith("xlsx")
      ? tiltSchema
      : fileType === "tilt"
      ? tiltCsvSchema
      : pillSchema;

  const findFilePath = async () => {
    const file = await open({
      filters: [{ name: "Pill", extensions: ["xlsx", "csv"] }],
      multiple: false,
    });

    if (file) {
      setFilePath(file as string);
    }
  };

  const handleFile = (file: any) => {
    const { rows } = file;
    const sgIndex = fileType === "tilt" ? rows.length - 1 : 0;
    const og = rows[sgIndex].gravity as number;

    const recipeName = rows[0].name as string | undefined;
    if (recipeName) setRecipeName(recipeName);
    else setRecipeName(null);

    const parsedData = rows.map((row: any) => {
      const abv = Math.round(calcABV(og, row.gravity as number) * 1000) / 1000;

      const rowCopy = {
        ...row,
        temperature: Number(row.temperature),
        gravity: Number(row.gravity),
        date: new Date(row.date as string).toISOString(),
        abv,
      } as FileData & { name?: string };

      if (row.name) delete rowCopy.name;

      return rowCopy;
    });
    if (fileType === "tilt") parsedData.reverse();
    return parsedData;
  };

  useEffect(() => {
    (async () => {
      if (filePath) {
        if (filePath.endsWith("xlsx")) {
          const binary = await readBinaryFile(filePath);
          const parsed = await readXlsxFile(binary);
          if (fileType === "tilt") {
            const tempUnits = parsed[4][1];
            setTempUnits(tempUnits === "Fahrenheit" ? "F" : "C");
          }
          const file = convertToJson(parsed, schema) as any;

          if (file && !file.errors.length) {
            const parsedData = handleFile(file);
            setData(parsedData);
          }
        } else {
          const text = await readTextFile(filePath);
          const parsed: { data: any[]; errors: any[]; meta: {} } = parse(text);
          const tempUnits = parsed.data[4][1];
          setTempUnits(tempUnits === "Fahrenheit" ? "F" : "C");
          const file = convertToJson(parsed.data, schema) as any;
          if (file && !file.errors.length) {
            const parsedData = handleFile(file);
            setData(parsedData);
          }
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
      {fileType === "pill" && (
        <Select
          value={tempUnits}
          onValueChange={(val: "C" | "F") => setTempUnits(val)}
        >
          <SelectTrigger>
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="F">°F</SelectItem>
            <SelectItem value="C">°C</SelectItem>
          </SelectContent>
        </Select>
      )}
      <button onClick={findFilePath}>Open {fileType} file</button>

      {data && (
        <HydrometerData
          chartData={data}
          name={recipeName || ""}
          tempUnits={tempUnits}
        />
      )}
    </div>
  );
}

export default Pill;
