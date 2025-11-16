"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useHabitStore } from "@/store/habit-store"
import { useToast } from "@/hooks/use-toast"

export default function HabitModal({ onClose }: { onClose: () => void }) {
  const { addHabit, categories, addCategory } = useHabitStore()
  const { toast } = useToast()
  const [habitName, setHabitName] = useState("")
  const [habitTime, setHabitTime] = useState("")
  const [habitFrequency, setHabitFrequency] = useState("daily")
  const [habitCategory, setHabitCategory] = useState(categories[0] || "")
  const [newCategory, setNewCategory] = useState("")
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [habitReminder, setHabitReminder] = useState(false)
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  })

  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [timePickerMode, setTimePickerMode] = useState<"hour" | "minute">("hour")
  const [amPm, setAmPm] = useState<"AM" | "PM" | null>(null)

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "add_new_category") {
      setIsAddingNewCategory(true)
      setNewCategory("")
    } else {
      setIsAddingNewCategory(false)
      setHabitCategory(value)
    }
  }

  const handleSave = () => {
    if (!habitName.trim()) {
      alert("Please enter a habit name.")
      return
    }

    // Handle category validation
    let finalCategory = habitCategory
    if (isAddingNewCategory) {
      if (!newCategory.trim()) {
        alert("Please enter a category name.")
        return
      }
      finalCategory = newCategory.trim()
      // The category will be added when the habit is saved
    }

    const days = Object.keys(selectedDays).filter((day) => selectedDays[day])

    // For daily frequency, select all days
    // For mon-fri frequency, select Monday through Friday
    let finalDays = days
    if (habitFrequency === "daily") {
      finalDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    } else if (habitFrequency === "mon-fri") {
      finalDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }

    // Format the time properly without "null" text
    let savedTime = ""
    if (habitTime) {
      const [hStr, mStr] = habitTime.split(":")
      let h = Number.parseInt(hStr || "0", 10)
      const m = Number.parseInt(mStr || "0", 10)
      if (amPm) {
        if (amPm === "PM" && h < 12) h += 12
        if (amPm === "AM" && h === 12) h = 0
      }
      const hh = h.toString().padStart(2, "0")
      const mm = m.toString().padStart(2, "0")
      savedTime = `${hh}:${mm}`
    }

    const newHabit = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name: habitName,
      time: savedTime,
      frequency: habitFrequency,
      days: finalDays,
      category: finalCategory,
      reminder: habitReminder,
      completed: 0,
      streak: 0,
      lastCompletedDate: null,
      weeklyCompleted: 0,
      createdAt: new Date().toISOString(),
    }

    // Add the new category if needed
    if (isAddingNewCategory && newCategory.trim()) {
      addCategory(newCategory.trim())
    }

    // Close the modal first to prevent DOM manipulation conflicts
    onClose()

    // Add the habit after a small delay to ensure the modal is fully removed
    setTimeout(() => {
      addHabit(newHabit as any)
      toast({ title: "Habit added", description: `"${habitName}" has been created.` })
    }, 50)
  }

  useEffect(() => {
    if (timePickerOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const timePickerElement = document.querySelector(".time-picker-dropdown")
        const timePickerInputElement = document.querySelector(".time-picker-input")

        if (
          timePickerElement &&
          timePickerInputElement &&
          !timePickerElement.contains(event.target as Node) &&
          !timePickerInputElement.contains(event.target as Node) &&
          !timePickerInputElement.contains(event.target as Node)
        ) {
          setTimePickerOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [timePickerOpen])

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setTimePickerOpen(false)
          onClose()
        }
      }}
      style={{ overflowY: "auto", display: "flex", alignItems: "flex-start" }}
    >
      <div className="modal" style={{ margin: "2rem auto", maxHeight: "calc(100vh - 4rem)" }}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Habit</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            maxHeight: "calc(100vh - 12rem)",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--purple-primary) var(--bg-tertiary)",
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="habitName">
              Habit Name:
            </label>
            <input
              className="form-control"
              type="text"
              id="habitName"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="habitTime">
              Time (Optional):
            </label>
            <div className="custom-time-picker">
              <div
                className="form-control time-picker-input"
                onClick={() => {
                  setTimePickerOpen(!timePickerOpen)
                  setTimePickerMode("hour")
                }}
              >
                {habitTime ? (amPm ? `${habitTime} ${amPm}` : habitTime) : "Select time"}
                <i className="fa-regular fa-clock" style={{ marginLeft: "auto" }}></i>
              </div>

              {timePickerOpen && (
                <div className="time-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="time-picker-header">
                    <input
                      type="text"
                      value={habitTime ? (amPm ? `${habitTime} ${amPm}` : habitTime) : ""}
                      onChange={(e) => {
                        // Simple parsing for direct input
                        const value = e.target.value
                        if (value.includes(" ")) {
                          const [time, period] = value.split(" ")
                          setHabitTime(time)
                          if (period === "AM" || period === "PM") {
                            setAmPm(period)
                          }
                        } else {
                          setHabitTime(value)
                        }
                      }}
                      placeholder="HH:MM"
                    />
                  </div>

                  <div className="analog-clock">
                    <div className="clock-face">
                      {[...Array(12)].map((_, i) => {
                        const hourValue = i === 0 ? 12 : i
                        // Calculate position based on octagonal shape
                        const angle = (i * 30 - 90) * (Math.PI / 180)
                        let radius = 62 // Reduced from 75

                        // Adjust radius for corners to create octagonal positioning
                        if (i % 3 === 0) {
                          radius = 58 // Reduced from 70
                        } else if (i % 3 === 1 || i % 3 === 2) {
                          radius = 65 // Reduced from 78
                        }

                        const x = 75 + radius * Math.cos(angle) // Changed from 90 to 75
                        const y = 75 + radius * Math.sin(angle) // Changed from 90 to 75

                        return (
                          <div
                            key={i}
                            className="hour-marker"
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              transform: "translate(-50%, -50%)",
                              fontSize: "14px", // Reduced from 16px
                              fontWeight: timePickerMode === "hour" ? "normal" : "bold",
                            }}
                            onClick={() => {
                              if (timePickerMode === "hour") {
                                const hour = hourValue.toString().padStart(2, "0")
                                const minute = habitTime ? habitTime.split(":")[1] || "00" : "00"
                                setHabitTime(`${hour}:${minute}`)
                                setTimePickerMode("minute")
                              } else {
                                const hour = habitTime ? habitTime.split(":")[0] : "12"
                                const minute = (i * 5).toString().padStart(2, "0")
                                setHabitTime(`${hour}:${minute}`)
                                if (amPm) {
                                  setTimePickerOpen(false)
                                }
                              }
                            }}
                          >
                            {timePickerMode === "hour" ? hourValue : i * 5}
                          </div>
                        )
                      })}
                      <div className="clock-center"></div>
                      <div
                        className="hour-hand"
                        style={{
                          transform: `rotate(${
                            habitTime
                              ? (Number.parseInt(habitTime.split(":")[0]) % 12) * 30 +
                                Number.parseInt(habitTime.split(":")[1]) / 2
                              : 0
                          }deg)`,
                        }}
                      ></div>
                      <div
                        className="minute-hand"
                        style={{
                          transform: `rotate(${habitTime ? Number.parseInt(habitTime.split(":")[1]) * 6 : 0}deg)`,
                        }}
                      ></div>
                    </div>

                    <div className="am-pm-selector">
                      <div
                        className={`am-pm-option ${amPm === "AM" ? "active" : ""}`}
                        onClick={() => {
                          setAmPm("AM")
                          if (habitTime && habitTime.includes(":")) {
                            setTimePickerOpen(false)
                          }
                        }}
                      >
                        AM
                      </div>
                      <div
                        className={`am-pm-option ${amPm === "PM" ? "active" : ""}`}
                        onClick={() => {
                          setAmPm("PM")
                          if (habitTime && habitTime.includes(":")) {
                            setTimePickerOpen(false)
                          }
                        }}
                      >
                        PM
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="habitFrequency">
              Frequency:
            </label>
            <select
              className="form-control form-select"
              id="habitFrequency"
              value={habitFrequency}
              onChange={(e) => setHabitFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="mon-fri">Mon-Fri</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {habitFrequency === "weekly" && (
            <div className="form-group">
              <label className="form-label">Day of Week:</label>
              {Object.keys(selectedDays).map((day) => (
                <div className="form-check styled-day-checkbox" key={day}>
                  <div className="styled-radio">
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`day${day}`}
                      name="weekday"
                      checked={selectedDays[day]}
                      onChange={() => {
                        const newSelectedDays = Object.fromEntries(Object.keys(selectedDays).map((d) => [d, d === day]))
                        setSelectedDays(newSelectedDays)
                      }}
                    />
                    <div
                      className="radio-visual"
                      onClick={() => {
                        const newSelectedDays = Object.fromEntries(Object.keys(selectedDays).map((d) => [d, d === day]))
                        setSelectedDays(newSelectedDays)
                      }}
                    >
                      {selectedDays[day] && <div className="radio-dot"></div>}
                    </div>
                  </div>
                  <label
                    className="form-label"
                    htmlFor={`day${day}`}
                    onClick={() => {
                      const newSelectedDays = Object.fromEntries(Object.keys(selectedDays).map((d) => [d, d === day]))
                      setSelectedDays(newSelectedDays)
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
          )}

          {habitFrequency === "custom" && (
            <div className="form-group">
              <label className="form-label">Days of Week:</label>
              {Object.keys(selectedDays).map((day) => (
                <div className="form-check styled-day-checkbox" key={day}>
                  <div className="styled-checkbox">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`day${day}`}
                      checked={selectedDays[day]}
                      onChange={() => handleDayChange(day)}
                    />
                    <div className="checkbox-visual" onClick={() => handleDayChange(day)}>
                      {selectedDays[day] && <i className="fa-solid fa-check"></i>}
                    </div>
                  </div>
                  <label
                    className="form-label"
                    htmlFor={`day${day}`}
                    onClick={() => handleDayChange(day)}
                    style={{ cursor: "pointer" }}
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="habitCategory">
              Category:
            </label>
            {!isAddingNewCategory ? (
              <select
                className="form-control form-select"
                id="habitCategory"
                value={habitCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="add_new_category">Add New Category</option>
              </select>
            ) : (
              <input
                className="form-control"
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Type category name"
                onBlur={() => {
                  if (!newCategory.trim()) {
                    setIsAddingNewCategory(false)
                    setHabitCategory(categories[0] || "")
                  }
                }}
                autoFocus
              />
            )}
          </div>

          <div className="form-group">
            <div className="styled-checkbox-container">
              <label
                className="form-label"
                htmlFor="habitReminder"
                onClick={() => setHabitReminder(!habitReminder)}
                style={{ cursor: "pointer" }}
              >
                Set Reminder/Alarm:
              </label>
              <div className="styled-checkbox">
                <input
                  type="checkbox"
                  id="habitReminder"
                  checked={habitReminder}
                  onChange={(e) => setHabitReminder(e.target.checked)}
                />
                <div className="checkbox-visual" onClick={() => setHabitReminder(!habitReminder)}>
                  {habitReminder && <i className="fa-solid fa-check"></i>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Add Habit
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-time-picker {
          position: relative;
        }

        .time-picker-input {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .time-picker-dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          width: 240px;
          background-color: var(--bg-secondary);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          z-index: 100;
          overflow: hidden;
        }
        
        .time-picker-header {
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        
        .time-picker-header input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          text-align: center;
          width: 100%;
          outline: none;
        }
        
        .analog-clock {
          padding: 10px;
        }

        .clock-face {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 16px;
          background-color: var(--bg-tertiary);
          margin: 0 auto;
          clip-path: polygon(
            20% 0%, 
            80% 0%, 
            100% 20%, 
            100% 80%, 
            80% 100%, 
            20% 100%, 
            0% 80%, 
            0% 20%
          );
        }

        .hour-marker {
          position: absolute;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          border-radius: 50%;
          transition: var(--transition);
        }

        .hour-marker:hover {
          background-color: var(--purple-primary);
          color: white;
        }

        .am-pm-selector {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
        }

        .am-pm-option {
          padding: 6px 15px;
          background-color: var(--bg-tertiary);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
        }

        .am-pm-option.active {
          background-color: var(--purple-primary);
          color: white;
        }

        .am-pm-option:hover:not(.active) {
          background-color: rgba(138, 43, 226, 0.2);
        }
        
        .clock-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          margin-left: -6px;
          margin-top: -6px;
          background-color: var(--purple-primary);
          border-radius: 50%;
          z-index: 3;
        }
        
        .hour-hand {
          width: 45px; // Reduced from 55px
          height: 3px; // Reduced from 4px
          margin-top: -1.5px; // Adjusted for new height
          background-color: var(--purple-primary);
          border-radius: 4px;
        }
        
        .minute-hand {
          width: 60px; // Reduced from 70px
          height: 2px;
          margin-top: -1px;
          background-color: var(--purple-light);
          border-radius: 2px;
        }
        
        @media (max-width: 480px) {
          .time-picker-dropdown {
            width: 100%;
          }
          
          .clock-face {
            width: 180px;
            height: 180px;
          }
          
          .hour-hand {
            width: 50px;
          }
          
          .minute-hand {
            width: 70px;
          }
        }
      `}</style>
      <style jsx>{`
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .modal-body::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 4px;
        }
        
        .modal-body::-webkit-scrollbar-thumb {
          background: var(--purple-primary);
          border-radius: 4px;
          transition: var(--transition);
        }
        
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: var(--purple-light);
        }
      `}</style>
      <style jsx>{`
        .styled-checkbox-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .styled-checkbox, .styled-radio {
          position: relative;
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        
        .styled-checkbox input, .styled-radio input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .checkbox-visual {
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          background-color: var(--bg-tertiary);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .radio-visual {
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          background-color: var(--bg-tertiary);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .styled-checkbox input:checked + .checkbox-visual {
          background-color: var(--purple-primary);
          border-color: var(--purple-primary);
        }
        
        .styled-radio input:checked + .radio-visual {
          border-color: var(--purple-primary);
        }
        
        .styled-checkbox input:focus + .checkbox-visual,
        .styled-radio input:focus + .radio-visual {
          box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.3);
        }
        
        .checkbox-visual i {
          font-size: 14px;
        }
        
        .radio-dot {
          width: 12px;
          height: 12px;
          background-color: var(--purple-primary);
          border-radius: 50%;
        }
        
        .styled-day-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .styled-day-checkbox label {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
