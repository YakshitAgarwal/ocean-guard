"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface CoralReefHealthChartProps {
  data: { region: string; health: number }[]
}

export function CoralReefHealthChart({ data }: CoralReefHealthChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available</div>
  }

  const COLORS = [
    "hsl(210, 100%, 70%)",
    "hsl(340, 100%, 70%)",
    "hsl(50, 100%, 70%)",
    "hsl(170, 100%, 70%)",
    "hsl(280, 100%, 70%)",
  ]

  return (
    <ChartContainer
      config={{
        coralHealth: {
          label: "Coral Reef Health",
          color: "hsl(210, 100%, 70%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="health"
            nameKey="region"
            label={({ region, health, percent }) => `${region}: ${health}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

