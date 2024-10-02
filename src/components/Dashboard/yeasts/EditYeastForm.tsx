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

import { useState } from "react";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import { updateYeast } from "@/db";
import { useTranslation } from "react-i18next";
export const API_URL = "https://mead-tools-api.vercel.app/api";

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
  tolerance: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  low_temp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  high_temp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
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
    setLoading(true);
    try {
      await updateYeast(yeast.id.toString(), data);
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
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>

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
                <FormControl>
                  <Input placeholder="14" {...field} />
                </FormControl>

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
                  <Input placeholder="15" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
