import readXlsxFile, { Row } from "read-excel-file";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile, readTextFile } from "@tauri-apps/plugin-fs";
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
import { updateRecipe } from "@/db";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type csvReturnType = { data: any[]; errors: any[]; meta: {} };
type JSONType = { data: any[]; errors: any[] };

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
const spindelSchema = {
  log_time: {
    prop: "date",
    type: String,
  },
  gravity: {
    prop: "gravity",
    type: String,
  },

  temp: {
    prop: "temperature",
    type: String,
  },
  temp_format: {
    prop: "tempUnit",
    type: String,
  },
  log_id: {
    prop: "name",
    type: String,
  },
};
export type FileData = {
  date: string;
  temperature?: number;
  gravity: number;
  abv: number;
  signalStrength?: number;
  battery?: number;
};

type FileTypes = "tilt" | "pill" | "iSpindel" | "hydro";

function Pill({
  name,
  file_path,
  hydroPath,
  id,
}: {
  name: string;
  file_path: string;
  hydroPath?: string;
  id: number;
}) {
  const isXlsx = (filePath: string) => filePath.endsWith(".xlsx");
  const isCsv = (filePath: string) => filePath.endsWith(".csv");
  const isHydro = (filePath: string) => filePath.endsWith(".hydro");

  const [data, setData] = useState<FileData[] | null>(null);
  const [filePath, setFilePath] = useState<string | null>(hydroPath ?? null);
  const [tempUnits, setTempUnits] = useState<"C" | "F">("F");
  const [enabled, setEnabled] = useState(true);

  const [fileType, setFileType] = useState<FileTypes>("pill");
  const schema =
    fileType === "tilt" && filePath?.endsWith("xlsx")
      ? tiltSchema
      : fileType === "tilt"
      ? tiltCsvSchema
      : fileType === "iSpindel"
      ? spindelSchema
      : pillSchema;

  const validateFileType = async (file: string) => {
    if (isHydro(file)) {
      setFileType("hydro");
      const parsed = readTextFile(file);
      return parsed;
    }

    if (isCsv(file)) {
      let isTilt = true;
      const text = await readTextFile(file);
      const parsed: { data: any[]; errors: any[]; meta: {} } = parse(text);
      if (parsed.data[0][0] !== "Report & Chart Settings:") {
        isTilt = false;
      }
      if (isTilt) setFileType("tilt");
      else setFileType("iSpindel");
      return parsed;
    }
    const binary = await readFile(file);
    const parsed = await readXlsxFile(binary);

    let isPill = false;
    const pillColumns = ["Date", "Temperature", "Gravity"];

    pillColumns.forEach((column) => {
      if (parsed[0].includes(column)) isPill = true;
      else isPill = false;
    });

    if (isPill) setFileType("pill");
    else setFileType("tilt");

    return parsed;
  };

  const extensions =
    fileType === "tilt"
      ? ["xlsx", "csv"]
      : fileType === "iSpindel"
      ? ["csv"]
      : fileType === "pill"
      ? ["xlsx"]
      : ["hydro"];

  const findFilePath = async () => {
    const file = await open({
      filters: [{ name: "Pill", extensions }],
      multiple: false,
    });

    if (file) {
      setFilePath(file as string);
      updateRecipe(id.toString(), {
        hydrometer_data_path: file as string,
        file_path,
      });
    }
  };

  const handleFile = (file: any) => {
    const { rows } = file;

    if (fileType === "hydro") {
      const parsed: string = handleFile(file as string);
      return parsed;
    }

    const sgIndex = fileType === "tilt" ? rows.length - 1 : 0;
    const og = rows?.[sgIndex].gravity as number;
    if (rows[0].tempUnit) {
      setTempUnits(rows[0].tempUnit as "C" | "F");
    }

    const removeJunk = rows.filter((row: any) => row.gravity);

    const parsedData = removeJunk.map((row: any) => {
      const abv = Math.round(calcABV(og, row.gravity as number) * 1000) / 1000;

      const parsedDate =
        fileType !== "iSpindel"
          ? row.date
          : row.date.replace(/T|\:\d\dZ/g, " ");

      const rowCopy = {
        ...row,
        temperature: Number(row.temperature),
        gravity: Number(row.gravity),
        date: new Date(parsedDate as string).toISOString(),
        abv,
      } as FileData & { name?: string };

      if (row.name) delete rowCopy.name;

      return rowCopy;
    });
    if (fileType === "tilt") parsedData.reverse();
    return parsedData;
  };

  useEffect(() => {
    const handleData = async () => {
      if (!filePath) return;
      try {
        const parsed = await validateFileType(filePath);
        if (isXlsx(filePath)) {
          const typedParse = parsed as Row[];

          const file = convertToJson(typedParse, schema) as unknown as JSONType;

          if (file && !file.errors.length) {
            const parsedData = handleFile(file);
            setData(parsedData);
          }

          const tempUnits = typedParse[4][1];
          if (fileType === "tilt")
            setTempUnits(tempUnits === "Fahrenheit" ? "F" : "C");
        } else if (fileType === "hydro") {
          const data = await validateFileType(filePath);
          const parsed = JSON.parse(data as string);
          setData(parsed);
        } else {
          const parsedType = parsed as csvReturnType;

          const file = convertToJson(
            parsedType.data,
            schema
          ) as unknown as JSONType;

          if (file && !file.errors.length) {
            const parsedData = handleFile(file);
            setData(parsedData);
          }

          const tempUnits = parsedType.data[4][1];
          if (fileType === "tilt")
            setTempUnits(tempUnits === "Fahrenheit" ? "F" : "C");
        }
      } finally {
        setEnabled(false);
      }
    };

    handleData();
  }, [filePath, fileType]);

  return (
    <div className="w-11/12 px-12 py-24">
      <Select
        value={fileType}
        onValueChange={(val: FileTypes) => setFileType(val)}
        disabled={!enabled}
      >
        <SelectTrigger>
          <SelectValue></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pill">Pill</SelectItem>
          <SelectItem value="tilt">Tilt</SelectItem>
          <SelectItem value="iSpindel">iSpindel</SelectItem>
          <SelectItem value="hydro">Hydrometer</SelectItem>
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
      )}{" "}
      <div
        className={cn(
          "flex items-center justify-center gap-4 my-8",
          data && "flex-col"
        )}
      >
        {data ? (
          <div className="w-full">
            <HydrometerData
              chartData={data}
              name={name || ""}
              tempUnits={tempUnits}
            />
          </div>
        ) : (
          <>
            <Button onClick={findFilePath} variant={"secondary"}>
              Open {fileType} file
            </Button>{" "}
            OR
            <Link
              to={`/manualEntry/${id}`}
              className={buttonVariants({ variant: "secondary" })}
            >
              Enter Manually
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Pill;
