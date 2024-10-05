import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { updateYeast } from "@/db";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useChangeLogger from "@/hooks/useChangeLogger";
import {
  brands,
  convertToC,
  convertToF,
  n2Requirements,
  numericString,
} from "../dashboardData";

const FormSchema = z.object({
  brand: z.string().min(2, {
    message: "brand must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  nitrogen_requirement: z.string().min(2, {
    message: "N2 requirement must be at least 2 characters.",
  }),
  tolerance: numericString(z.number()),
  low_temp: numericString(z.number()),
  high_temp: numericString(z.number()),
});

export function EditYeastForm({
  yeast,
}: {
  yeast: {
    id: number;
    brand: string;
    name: string;
    nitrogen_requirement: string;
    tolerance: number;
    low_temp: number;
    high_temp: number;
  };
}) {
  const [tempUnits, setTempUnits] = useState<"F" | "C">("F");
  const [firstMount, setFirstMount] = useState(true);
  const isC = tempUnits === "C";

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...yeast,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const dataCopy = {
      ...data,
      low_temp: isC ? convertToF(data.low_temp) : data.low_temp,
      high_temp: isC ? convertToF(data.high_temp) : data.high_temp,
    };
    console.log(dataCopy);
    setLoading(true);
    try {
      await updateYeast(yeast.id.toString(), dataCopy);
      toast({ description: t("desktop.yeastEdit") });
      nav("/yeasts");
    } catch (err) {
      console.error(err);
      toast({
        description: t("desktop.yeastEditFail"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!firstMount) {
      const { low_temp, high_temp } = form.getValues();

      const lowTemp = isC ? convertToC(low_temp) : convertToF(low_temp);
      const highTemp = isC ? convertToC(high_temp) : convertToF(high_temp);

      form.setValue("low_temp", lowTemp);
      form.setValue("high_temp", highTemp);
      return;
    }
    setFirstMount(false);
  }, [tempUnits]);

  useChangeLogger(form.getValues());

  return (
    <Form {...form}>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-4xl">
          {t("edit")} {yeast?.name}
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("yeastTable.tableHeadings.name")}</FormLabel>
                <FormControl>
                  <Input placeholder="EC-Whatever..." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("yeastBrand")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a yeast brand." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.name} value={brand.name}>
                        {t(brand.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nitrogen_requirement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("n2Requirement.label")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a n2 brand." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {n2Requirements.map((req) => (
                      <SelectItem key={req.name} value={req.name}>
                        {t(req.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("PDF.tolerance")}</FormLabel>
                <FormControl>
                  <Input placeholder="15" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>{t("UNITS")}</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="low_temp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("yeastTable.tableHeadings.low_temp")}</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="high_temp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("yeastTable.tableHeadings.high_temp")}</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="button" variant="destructive" onClick={() => nav(-1)}>
              {t("cancel")}
            </Button>
            <Button type="submit" variant={"secondary"}>
              {loading ? <Spinner variant="small" /> : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
