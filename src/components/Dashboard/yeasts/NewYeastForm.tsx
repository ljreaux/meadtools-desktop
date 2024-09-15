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
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

export const API_URL = "https://mead-tools-api.vercel.app/api";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Yeast name must be at least 2 characters.",
  }),
  nitrogenRequirement: z.string().min(2, {
    message: "Yeast nitrogen requirement must be at least 2 characters.",
  }),
  tolerance: z.string().min(2, {
    message: "Yeast nitrogen requirement must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "Yeast brand must be at least 2 characters.",
  }),
  lowTemp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
  highTemp: z.preprocess((a) => Number(z.string().parse(a)), z.number()),
});

export function NewYeastForm() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      brand: "Lalvin",
      nitrogenRequirement: "Low",
      tolerance: "",
      lowTemp: 0,
      highTemp: 0,
    },
  });

  async function onSubmit(body: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const { data: ingredient } = await axios.post("/api/yeasts", body);

      if (ingredient.status === 401) throw new Error();
      toast({ description: "Yeast successfully created." });
      nav("/dashboard/yeasts");
    } catch (err) {
      console.error(err);
      toast({
        description: "Failed to create yeast.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-4xl">Add New Yeast</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Yeast Brand</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
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
                <FormLabel>Nitrogen Requirement</FormLabel>
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
                <FormLabel>Tolerance</FormLabel>
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
                <FormLabel>Low Temp</FormLabel>
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
                <FormLabel>High Temp</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant={"secondary"}>
            {loading ? <Spinner variant="small" /> : "Submit"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
