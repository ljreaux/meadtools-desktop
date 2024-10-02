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
import { updateIngredient } from "@/db";
import { useTranslation } from "react-i18next";
export const API_URL = "https://mead-tools-api.vercel.app/api";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  sugar_content: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  water_content: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  category: z.string().min(2, {
    message: "category must be at least 2 characters.",
  }),
});

export function EditIngredientForm({
  ingredient,
}: {
  ingredient: {
    id: number;
    name: string;
    sugar_content: number;
    water_content: number;
    category: string;
  };
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...ingredient,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const dataCopy = { ...data, category: data.category.toLowerCase() };
      await updateIngredient(ingredient.id.toString(), dataCopy);
      toast({ description: "Ingredient Edited Successfully." });
      nav("/dashboard/ingredients");
    } catch (err) {
      console.error(err);
      toast({ description: "Failed to Edit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-4xl">Edit Ingredient {ingredient.name}</h1>
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
            name="sugar_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("desktop.ingredientHeadings.sugarContent")}
                </FormLabel>
                <FormControl>
                  <Input placeholder="14" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("desktop.ingredientHeadings.waterContent")}
                </FormLabel>
                <FormControl>
                  <Input placeholder="15" {...field} />
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
                <FormControl>
                  <Input {...field} />
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
