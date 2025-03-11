"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface PlasticReductionChartProps {
  data: { month: string; value: number }[]
}

export function PlasticReductionChart({ data }: PlasticReductionChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        plasticReduction: {
          label: "Plastic Reduction",
          color: "hsl(280, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-plasticReduction)"
            fill="var(--color-plasticReduction)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

