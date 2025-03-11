"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface ConservationHotspotsChartProps {
  data: { name: string; value: number; status: string }[]
}

export function ConservationHotspotsChart({ data }: ConservationHotspotsChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Improving":
        return "hsl(120, 100%, 70%)"
      case "Stable":
        return "hsl(210, 100%, 70%)"
      case "At Risk":
        return "hsl(40, 100%, 70%)"
      case "Declining":
        return "hsl(0, 100%, 70%)"
      default:
        return "hsl(210, 100%, 70%)"
    }
  }

  return (
    <ChartContainer
      config={{
        conservation: {
          label: "Conservation Score",
          color: "hsl(210, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            width={100}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

