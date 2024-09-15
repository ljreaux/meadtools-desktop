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
export const API_URL = "https://mead-tools-api.vercel.app/api";

const FormSchema = z.object({
  brand: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  nitrogen_requirement: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  tolerance: z.number().min(2, {
    message: "email must be at least 2 characters.",
  }),
  low_temp: z.number().min(2, {
    message: "email must be at least 2 characters.",
  }),
  high_temp: z.number().min(2, {
    message: "email must be at least 2 characters.",
  }),
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
      toast({ description: "Yeast Edited Successfully." });
      nav("/yeasts");
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
        <h1 className="text-4xl">Edit Yeast {yeast?.id}</h1>
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
            name="nitrogen_requirement"
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
            name="low_temp"
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
            name="high_temp"
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
          <div className="flex gap-4">
            <Button type="button" variant="destructive" onClick={() => nav(-1)}>
              Cancel
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
