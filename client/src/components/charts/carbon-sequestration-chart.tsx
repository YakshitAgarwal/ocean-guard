"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface CarbonSequestrationChartProps {
  data: { ecosystem: string; capacity: number; potential: number }[]
}

export function CarbonSequestrationChart({ data }: CarbonSequestrationChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        capacity: {
          label: "Current Capacity",
          color: "hsl(170, 100%, 70%)",
        },
        potential: {
          label: "Potential Capacity",
          color: "hsl(210, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="ecosystem"
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          />
          <YAxis
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            label={{
              value: "Gigatons CO₂ per year",
              angle: -90,
              position: "insideLeft",
              fill: "#94a3b8",
            }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="capacity" fill="var(--color-capacity)" radius={[4, 0, 0, 4]} />
          <Bar dataKey="potential" fill="var(--color-potential)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

