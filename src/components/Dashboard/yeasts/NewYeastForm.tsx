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
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { createYeast } from "@/db";
import { useTranslation } from "react-i18next";

const FormSchema = z.object({
  brand: z.string().min(2, {
    message: "brand must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  nitrogenRequirement: z.string().min(2, {
    message: "N2 requirement must be at least 2 characters.",
  }),
  tolerance: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  lowTemp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  highTemp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
});

export function NewYeastForm() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(body: z.infer<typeof FormSchema>) {
    console.log("submitted");
    setLoading(true);
    try {
      const ingredient = await createYeast(body);
      console.log(ingredient);
      if (!ingredient) throw new Error();
      toast({ description: t("desktop.createdSuccessfully") });
      nav("/yeasts");
    } catch (err) {
      console.error(err);
      toast({
        description: t("desktop.createUnsuccessful"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-4xl">{t("desktop.addYeast")}</h1>
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
                  <Input placeholder="Lalvin" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nitrogenRequirement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("n2Requirement.label")}</FormLabel>
                <FormControl>
                  <Input placeholder="Low" {...field} />
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
            name="lowTemp"
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
            name="highTemp"
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

          <Button type="submit" variant={"secondary"}>
            {loading ? <Spinner variant="small" /> : t("SUBMIT")}
          </Button>
        </form>
      </div>
    </Form>
  );
}
