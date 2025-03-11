"use client"

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface CoralHealthPredictionChartProps {
  data: { year: number; actual: number | null; predicted: number | null }[]
}

export function CoralHealthPredictionChart({ data }: CoralHealthPredictionChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  return (
    <ChartContainer
      config={{
        actual: {
          label: "Actual Health",
          color: "hsl(210, 100%, 70%)",
        },
        predicted: {
          label: "Predicted Health",
          color: "hsl(340, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            label={{ value: "Health Index", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="var(--color-predicted)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

