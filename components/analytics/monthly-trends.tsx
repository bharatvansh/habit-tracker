"use client"

import { useMemo } from "react"
import { useHabitStore } from "@/store/habit-store"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"

export default function MonthlyTrends() {
  const { habits } = useHabitStore()

  const data = useMemo(() => {
    const now = new Date()
    // Last 9 months labels
    const labels: string[] = []
    for (let i = 8; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(d.toLocaleString("en-US", { month: "short" }))
    }
    // Naive completion estimate: scale by completed count vs expected occurrences
    const currentYear = now.getFullYear()
    const series = labels.map((label, idx) => {
      const monthIndex = now.getMonth() - (8 - idx)
      const month = (monthIndex + 12) % 12
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
      let totalPossible = 0
      let actual = 0
      habits.forEach((h) => {
        const daysPerWeek = h.days?.length || 7
        totalPossible += Math.round((daysPerWeek / 7) * daysInMonth)
        actual += h.completed || 0
      })
      const rate = totalPossible > 0 ? Math.min(100, Math.round((actual / totalPossible) * 100)) : 0
      return { month: label, rate }
    })
    return series
  }, [habits])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Monthly Trends</div>
      </div>
      <div className="chart-container" style={{ height: 240 }}>
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#aaa" tickLine={false} axisLine={false} />
              <YAxis stroke="#aaa" tickFormatter={(v) => `${v}%`} domain={[0, 100]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="rate" stroke="#8A2BE2" fill="rgba(138,43,226,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
