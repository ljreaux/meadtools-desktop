"use client";

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
import { createIngredient } from "@/db";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "../dashboardData";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }),
  sugarContent: z.preprocess(
    (a) => Number(z.string().parse(a)),
    z
      .number()
      .min(0.1, { message: "Sugar content must be greater than zero" })
      .max(100, { message: "Sugar content cannot be greater than 100" })
  ),
  waterContent: z.preprocess(
    (a) => Number(z.string().parse(a)),
    z
      .number()
      .min(0.1, { message: "Sugar content must be greater than zero" })
      .max(100, { message: "Sugar content cannot be greater than 100" })
  ),
  category: z.string().min(2, {
    message: "Ingredient category must be at least 2 characters.",
  }),
});

export function NewIngredientForm() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: categories[0].name,
      sugarContent: "" as unknown as number,
      waterContent: "" as unknown as number,
      name: "",
    },
  });

  async function onSubmit(body: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const dataCopy = { ...body, category: body.category.toLowerCase() };
      const ingredient = await createIngredient(dataCopy);

      if (!ingredient) throw new Error();
      toast({ description: "Ingredient successfully created." });
      nav("/ingredients/");
    } catch (err) {
      console.error(err);
      toast({
        description: "Failed to create ingredient.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-4xl">{t("desktop.addIng")}</h1>
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
                  <Input placeholder="Honey..." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sugarContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}
                  {t("desktop.ingredientHeadings.sugarContent")}
                </FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waterContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}
                  {t("desktop.ingredientHeadings.waterContent")}
                </FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("desktop.ingredientHeadings.category")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {t(cat.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
