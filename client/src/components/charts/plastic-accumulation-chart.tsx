"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface PlasticAccumulationChartProps {
  data: { location: string; tons: number; change: number }[]
}

export function PlasticAccumulationChart({ data }: PlasticAccumulationChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        tons: {
          label: "Plastic Accumulation (tons)",
          color: "hsl(280, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="location"
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="tons"
            fill="var(--color-tons)"
            radius={[4, 4, 0, 0]}
            label={{
              position: "top",
              fill: "#94a3b8",
              formatter: (value: number) => `${(value / 1000).toFixed(1)}k`,
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

