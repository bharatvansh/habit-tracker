"use client"

import { useEffect, useRef } from "react"
import { initCategoryChart } from "@/lib/charts"
import { useHabitStore } from "@/store/habit-store"

export default function CategoryBreakdown() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const { habits } = useHabitStore()

  useEffect(() => {
    if (chartRef.current) {
      // Pass habits to the chart initialization function
      initCategoryChart(chartRef.current, habits)
    }
  }, [habits])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Category Breakdown</div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} id="categoryChart"></canvas>
      </div>
    </div>
  )
}
