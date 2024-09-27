import { useEffect, useState } from "react";
import { FileData } from "./Pill";
import EntryForm from "./EntryForm";
import useChangeLogger from "@/hooks/useChangeLogger";
import { Button } from "../ui/button";
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { DateTimePicker } from "../ui/datetime-picker";
import { Input } from "../ui/input";
import { calcABV } from "@/hooks/useAbv";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById, updateHydro } from "@/db";
import Title from "../Title";

function ManualEntry() {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [tempUnits, setTempUnits] = useState<"F" | "C">("F");
  const [takingTemp, setTakingTemp] = useState(false);
  const [entries, setEntries] = useState<
    (FileData & { id: number; tempUnits: "F" | "C" })[]
  >([]);
  const addEntry = (entry: FileData) => {
    const id = entries.length + 1;
    setEntries([...entries, { ...entry, id, tempUnits }]);
  };
  const og = entries[0]?.gravity || 1.0;
  useChangeLogger(entries);

  const saveLocally = async () => {
    const name = "Hydro Data";
    try {
      const file = await save({
        title: name,
        filters: [{ name, extensions: ["hydro"] }],
      });
      if (!file) throw new Error("Couldn't save file");
      await writeTextFile(file, JSON.stringify(entries));

      await updateHydro(id || "0", {
        hydrometer_data_path: file as string,
      });
      alert("File saved successfully: " + file);
      nav("/localRecipes/");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  const updateEntry = (
    id: number,
    data: Partial<FileData & { id: number; tempUnits: "F" | "C" }>
  ) => {
    const abv =
      og !== 1 ? Math.round(calcABV(og, data.gravity || 1) * 1000) / 1000 : 0;
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, ...data, abv } : entry
      )
    );
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const [recipe] = await getRecipeById(id);
        console.log(recipe);
        setName(recipe.name);
      }
    })();
  }, []);

  return (
    <div className="w-11/12 p-24 bg-background rounded-xl">
      <Title header={name} />
      <div className="grid items-center justify-center w-full grid-cols-2 gap-6">
        <Label className="flex items-center justify-center gap-2 my-6">
          Taking Temperature Readings?
          <Switch checked={takingTemp} onCheckedChange={setTakingTemp}></Switch>
        </Label>
        {takingTemp && (
          <Select
            value={tempUnits}
            onValueChange={(val) => setTempUnits(val as "F" | "C")}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="F">°F</SelectItem>
              <SelectItem value="C">°C</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      <EntryForm addEntry={addEntry} og={og} takingTemp={takingTemp} />
      <div className="max-h-[500px] overflow-y-scroll my-12">
        <Table>
          {entries.length > 0 && (
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {takingTemp && <TableHead>Temperature °{tempUnits}</TableHead>}
                <TableHead>Gravity</TableHead>
                <TableHead>ABV</TableHead>
                <TableHead>Edit/Delete</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {entries.map((entry) => {
              return (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  takingTemp={takingTemp}
                  updateEntry={updateEntry}
                  deleteEntry={deleteEntry}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button variant={"secondary"} onClick={saveLocally}>
        Save Data
      </Button>
    </div>
  );
}

const EntryRow = ({
  entry,
  takingTemp,
  updateEntry,
  deleteEntry,
}: {
  entry: FileData & { id: number; tempUnits: "F" | "C" };
  takingTemp: boolean;
  updateEntry: (
    id: number,
    data: Partial<FileData & { id: number; tempUnits: "F" | "C" }>
  ) => void;
  deleteEntry: (id: number) => void;
}) => {
  const [editable, setEditable] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(entry.date));
  const [gravity, setGravity] = useState<string>(entry.gravity.toString());
  const [temperature, setTemperature] = useState<string | undefined>(
    entry.temperature?.toString()
  );
  const resetInputs = () => {
    setDate(new Date(entry.date));
    setGravity(entry.gravity.toString());
    setTemperature(entry.temperature?.toString());
    setEditable(false);
  };

  const handleUpdate = () => {
    updateEntry(entry.id, {
      date: (date as Date).toISOString(),
      gravity: Number(gravity),
      temperature: takingTemp && temperature ? Number(temperature) : undefined,
    });
    setEditable(false);
  };

  return (
    <TableRow>
      <TableCell>
        <DateTimePicker
          value={date}
          onChange={setDate}
          granularity="minute"
          disabled={!editable}
        />
      </TableCell>
      {takingTemp && (
        <TableCell>
          <Input
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            type="number"
            onFocus={(e) => e.target.select()}
            disabled={!editable}
          />
        </TableCell>
      )}
      <TableCell>
        <Input
          value={gravity}
          onChange={(e) => setGravity(e.target.value)}
          type="number"
          onFocus={(e) => e.target.select()}
          disabled={!editable}
        />
      </TableCell>
      <TableCell>{entry.abv.toFixed(3)}%</TableCell>
      <TableCell className="grid grid-flow-col gap-2 px-4">
        {editable ? (
          <>
            <Button onClick={handleUpdate}>Update</Button>
            <Button onClick={resetInputs} variant={"destructive"}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {" "}
            <Button onClick={() => setEditable(!editable)}>Edit</Button>
            <Button
              onClick={() => deleteEntry(entry.id)}
              variant={"destructive"}
            >
              Delete
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ManualEntry;
