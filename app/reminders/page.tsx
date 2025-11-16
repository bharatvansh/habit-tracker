"use client"

import { useEffect, useState } from "react"
import ReminderModal from "@/components/reminders/reminder-modal"
import RemindersList from "@/components/reminders/reminders-list"
import ReminderHeader from "@/components/reminders/reminder-header"
import ReminderSummary from "@/components/reminders/reminder-summary"
import { useReminderStore } from "@/store/reminder-store"

export default function RemindersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { loadReminders, isLoading, reminders } = useReminderStore()
  const [isMounted, setIsMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "upcoming" | "completed">("all")

  useEffect(() => {
    setIsMounted(true)
    loadReminders()
  }, [loadReminders])

  const getFilteredReminders = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    switch (activeFilter) {
      case "today":
        return reminders.filter((r) => {
          const reminderDate = new Date(r.datetime)
          return reminderDate >= today && reminderDate < tomorrow && !r.completed
        })
      case "upcoming":
        return reminders.filter((r) => {
          const reminderDate = new Date(r.datetime)
          return reminderDate >= now && !r.completed
        })
      case "completed":
        return reminders.filter((r) => r.completed)
      default:
        return reminders
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="tab-content active" id="reminders">
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
            <p>Loading your reminders...</p>
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
          <ReminderHeader onAddReminder={() => setIsModalOpen(true)} />
          <ReminderSummary />

          <div className="section-header">
            <h2 className="section-title">My Reminders</h2>
            <div className="reminder-filters">
              <button
                className={`category-pill ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`category-pill ${activeFilter === "today" ? "active" : ""}`}
                onClick={() => setActiveFilter("today")}
              >
                Today
              </button>
              <button
                className={`category-pill ${activeFilter === "upcoming" ? "active" : ""}`}
                onClick={() => setActiveFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`category-pill ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => setActiveFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          <RemindersList />

          {isModalOpen && <ReminderModal onClose={() => setIsModalOpen(false)} />}
        </>
      )}
    </div>
  )
}
