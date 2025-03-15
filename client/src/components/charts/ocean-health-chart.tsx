"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface OceanHealthChartProps {
  data: { month: string; value: number }[]
}

export function OceanHealthChart({ data }: OceanHealthChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        oceanHealth: {
          label: "Ocean Health Index",
          color: "hsl(210, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-oceanHealth)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-oceanHealth)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

