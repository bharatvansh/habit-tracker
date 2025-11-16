"use client"

import { useEffect, useState } from "react"
import HabitModal from "@/components/habits/habit-modal"
import HabitHeader from "@/components/habits/habit-header"
import HabitSummary from "@/components/habits/habit-summary"
import HabitList from "@/components/habits/habit-list"
import { useHabitStore } from "@/store/habit-store"

export default function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { loadHabits, isLoading } = useHabitStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    loadHabits()
  }, [loadHabits])

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <div className="tab-content active" id="habits">
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
            <p>Loading your habits...</p>
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
          <HabitHeader onAddHabit={() => setIsModalOpen(true)} />
          <HabitSummary />
          <HabitList />

          {isModalOpen && <HabitModal onClose={() => setIsModalOpen(false)} />}
        </>
      )}
    </div>
  )
}
