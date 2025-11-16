"use client"

import { useEffect, useState } from "react"
import HomeHeader from "@/components/home/home-header"
import StatCards from "@/components/home/stat-cards"
import WeeklyView from "@/components/home/weekly-view"
import UpcomingList from "@/components/home/upcoming-list"
import { useHabitStore } from "@/store/habit-store"
import { useReminderStore } from "@/store/reminder-store"

export default function HomePage() {
  const { loadHabits, isLoading: habitsLoading } = useHabitStore()
  const { loadReminders, isLoading: remindersLoading } = useReminderStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    loadHabits()
    loadReminders()
  }, [loadHabits, loadReminders])

  useEffect(() => {
    if (!habitsLoading && !remindersLoading && isMounted) {
      setIsLoading(false)
    }
  }, [habitsLoading, remindersLoading, isMounted])

  if (!isMounted) {
    return null // Prevent hydration errors by not rendering anything on the server
  }

  return (
    <div className="tab-content active" id="home">
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
            <p>Loading your habits and reminders...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      ) : (
        <>
          <HomeHeader />
          <StatCards />

          <div className="section-header">
            <h3 className="section-title">This Week</h3>
          </div>
          <WeeklyView />

          <div className="section-header">
            <h3 className="section-title">Upcoming Today</h3>
          </div>
          <UpcomingList />
        </>
      )}
    </div>
  )
}
