"use client"

import { useEffect, useRef } from "react"
import { initCategoryChart } from "@/lib/charts"
import { useHabitStore } from "@/store/habit-store"

export default function CategoryBreakdown() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const { habits } = useHabitStore()

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
      
      // Create new chart and store the instance
      chartInstanceRef.current = initCategoryChart(chartRef.current, habits)
    }

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
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
