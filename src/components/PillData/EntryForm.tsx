"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingButton } from "../ui/loading-button";
import { FileData } from "./Pill";
import { Input } from "../ui/input";
import { calcABV } from "@/hooks/useAbv";
import { buttonVariants } from "../ui/button";

const FormSchema = z.object({
  datetime: z.date(),
  temperature: z
    .preprocess((a) => Number(z.string().parse(a)), z.number())
    .optional(),
  gravity: z
    .preprocess((a) => Number(z.string().parse(a)), z.number().min(0.98))
    .optional(),
});

const DEFAULT_VALUE = {
  datetime: new Date(),
  gravity: 1.0,
};

const EntryForm = ({
  addEntry,
  og,
  takingTemp,
}: {
  addEntry: (data: FileData) => void;
  og: number;
  takingTemp: boolean;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: DEFAULT_VALUE,
    resolver: zodResolver(FormSchema),
  });

  const [loading, setLoading] = React.useState(false);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const abv =
        og !== 1 ? Math.round(calcABV(og, data.gravity || 1) * 1000) / 1000 : 0;
      const formData = {
        date: data.datetime?.toISOString(),
        temperature: data.temperature || undefined,
        gravity: data.gravity || 1,
        abv,
      };

      addEntry(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-11/12 gap-6"
      >
        <div className="flex items-center justify-between w-full gap-2">
          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel htmlFor="datetime">Date time</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    granularity="minute"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {takingTemp && (
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel htmlFor="datetime">Temperature</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="max-w-max" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="gravity"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel htmlFor="datetime">Gravity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step={0.001}
                    className="max-w-max"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton
          loading={loading}
          type="submit"
          className={buttonVariants({ variant: "secondary" })}
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};
export default EntryForm;
