"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FileData } from "./Pill";
import { useTranslation } from "react-i18next";

export const description = "A multiple line chart";

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  gravity: {
    label: "Specific Gravity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HydrometerData({
  chartData,
  name,
}: {
  chartData: FileData[];
  name?: string;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en-US";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleString(lang, {
                  month: "short",
                  weekday: "short",
                  day: "numeric",
                })
              }
              minTickGap={50}
            />
            <YAxis
              domain={[0.99, "dataMax + 0.01"]}
              tickCount={15}
              tickMargin={8}
              dataKey={"gravity"}
              yAxisId={"gravity"}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              orientation="right"
              dataKey={"temperature"}
              yAxisId={"temperature"}
              tickCount={10}
              tickFormatter={(val) => val.toFixed(1)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(val) => {
                    const date = new Date(val);

                    const dateString = date.toLocaleString(lang, {
                      timeStyle: "medium",
                      dateStyle: "short",
                    });

                    return dateString;
                  }}
                />
              }
            />
            <Line
              dataKey="temperature"
              type="monotone"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
              yAxisId={"temperature"}
            />
            <Line
              dataKey="gravity"
              type="monotone"
              stroke="var(--color-gravity)"
              strokeWidth={2}
              dot={false}
              yAxisId={"gravity"}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-start w-full gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this date <TrendingUp className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 dates
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
