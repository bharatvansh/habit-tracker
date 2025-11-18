"use client"

import { useState } from "react"
import HabitModal from "@/components/habits/habit-modal"
import ReminderModal from "@/components/reminders/reminder-modal"
import { useProfile } from "@/hooks/use-profile"

export default function HomeHeader() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const { profile } = useProfile()

  const displayName = profile.name || "User"

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Welcome back, {displayName}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-btn" onClick={() => setIsHabitModalOpen(true)}>
            <i className="fa-solid fa-plus"></i>
            <span>Quick Add Habit</span>
          </button>
          <button className="add-btn" onClick={() => setIsReminderModalOpen(true)}>
            <i className="fa-solid fa-plus"></i>
            <span>Quick Add Reminder</span>
          </button>
        </div>
      </div>

      {isHabitModalOpen && <HabitModal onClose={() => setIsHabitModalOpen(false)} />}
      {isReminderModalOpen && <ReminderModal onClose={() => setIsReminderModalOpen(false)} />}
    </>
  )
}
