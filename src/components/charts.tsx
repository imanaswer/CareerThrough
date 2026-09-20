"use client";

import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const radarConfig = {
  level: { label: "Your level", color: "var(--chart-1)" },
  target: { label: "Role target", color: "var(--chart-2)" },
} satisfies ChartConfig;

/** Answers: where is my shape different from the role's shape? */
export function SkillsRadar({ data }: { data: { skill: string; level: number; target: number }[] }) {
  return (
    <ChartContainer config={radarConfig} className="mx-auto aspect-square max-h-[320px] w-full">
      <RadarChart data={data} outerRadius="70%">
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
        <Radar dataKey="target" stroke="var(--color-target)" fill="var(--color-target)" fillOpacity={0.08} strokeDasharray="4 4" />
        <Radar dataKey="level" stroke="var(--color-level)" fill="var(--color-level)" fillOpacity={0.3} />
      </RadarChart>
    </ChartContainer>
  );
}

const trendConfig = { score: { label: "Readiness", color: "var(--chart-1)" } } satisfies ChartConfig;

/** Answers: is my readiness improving? One point per stored snapshot. */
export function ReadinessTrend({ data }: { data: { date: string; score: number }[] }) {
  return (
    <ChartContainer config={trendConfig} className="h-[180px] w-full">
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} minTickGap={24} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="score" type="monotone" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}
