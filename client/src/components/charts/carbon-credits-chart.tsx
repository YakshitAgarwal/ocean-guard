"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface CarbonCreditsChartProps {
  data: { month: string; value: number }[]
}

export function CarbonCreditsChart({ data }: CarbonCreditsChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        carbonCredits: {
          label: "Carbon Credits",
          color: "hsl(170, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="value" fill="var(--color-carbonCredits)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

