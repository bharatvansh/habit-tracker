"use client"

import { useEffect, useState } from "react"
import AnalyticsHeader from "@/components/analytics/analytics-header"
import StatisticsGrid from "@/components/analytics/statistics-grid"
import MonthlyTrends from "@/components/analytics/monthly-trends"
import WeeklyActivity from "@/components/analytics/weekly-activity"
import CategoryBreakdown from "@/components/analytics/category-breakdown"
import OverallProgress from "@/components/analytics/overall-progress"
import HabitHistory from "@/components/analytics/habit-history"
import { useHabitStore } from "@/store/habit-store"

export default function AnalyticsPage() {
  const [initialized, setInitialized] = useState(false)
  const { isLoading } = useHabitStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (!initialized) {
      setInitialized(true)
    }
  }, [initialized])

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <div className="tab-content active" id="analytics">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                border: "4px solid rgba(138, 43, 226, 0.1)",
                borderTop: "4px solid var(--purple-primary)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            ></div>
            <p>Loading analytics data...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : (
        <div id="analytics-dashboard">
          <AnalyticsHeader />
          <StatisticsGrid />

          <div className="grid-container">
            <MonthlyTrends />
            <WeeklyActivity />
          </div>

          <div className="grid-container">
            <CategoryBreakdown />
            <OverallProgress />
          </div>

          <HabitHistory />
        </div>
      )}
    </div>
  )
}
