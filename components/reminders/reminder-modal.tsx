"use client"

import { useState } from "react"
import { useReminderStore, type Reminder } from "@/store/reminder-store"
import { useToast } from "@/hooks/use-toast"

interface ReminderModalProps {
  onClose: () => void
  editId?: string
  existingReminder?: Reminder
}

export default function ReminderModal({ onClose, editId, existingReminder }: ReminderModalProps) {
  const { addReminder, editReminder } = useReminderStore()
  const [title, setTitle] = useState(existingReminder?.title || "")
  const [datetime, setDatetime] = useState(existingReminder?.datetime || "")
  const [alarm, setAlarm] = useState(existingReminder?.alarm || false)
  const [notification, setNotification] = useState(existingReminder?.notification || false)
  const [priority, setPriority] = useState<"high" | "medium" | "low">(existingReminder?.priority || "medium")
  const [category, setCategory] = useState(existingReminder?.category || "General")
  const { toast } = useToast()

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title.")
      return
    }
    if (!datetime) {
      alert("Please enter a valid date & time.")
      return
    }

    const reminderData: Reminder = {
      title,
      datetime,
      alarm,
      notification,
      priority,
      category,
      completed: existingReminder?.completed || false,
      completedAt: existingReminder?.completedAt,
    }

    onClose()

    setTimeout(() => {
      if (editId) {
        editReminder(editId, reminderData)
        toast({ title: "Reminder updated", description: `"${title}" has been saved.` })
      } else {
        addReminder(reminderData)
        toast({ title: "Reminder added", description: `"${title}" has been created.` })
      }
    }, 50)
  }

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        style={{ overflowY: "auto", display: "flex", alignItems: "flex-start" }}
      >
        <div className="modal" id="reminderModal" style={{ margin: "2rem auto", maxHeight: "calc(100vh - 4rem)" }}>
          <div className="modal-header">
            <h2 className="modal-title">{editId ? "Edit Reminder" : "Add Reminder"}</h2>
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body" style={{ maxHeight: "calc(100vh - 12rem)", overflowY: "auto" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reminderTitle">
                Title:
              </label>
              <input
                className="form-control"
                type="text"
                id="reminderTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reminderDatetime">
                Date & Time:
              </label>
              <input
                className="form-control"
                type="datetime-local"
                id="reminderDatetime"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reminderPriority">
                Priority:
              </label>
              <select
                className="form-control form-select"
                id="reminderPriority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reminderCategory">
                Category:
              </label>
              <input
                className="form-control"
                type="text"
                id="reminderCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Work, Personal, Health"
              />
            </div>
            <div className="form-group">
              <div className="styled-checkbox-container">
                <label
                  className="form-label"
                  htmlFor="reminderAlarm"
                  onClick={() => setAlarm(!alarm)}
                  style={{ cursor: "pointer" }}
                >
                  Set Alarm:
                </label>
                <div className="styled-checkbox">
                  <input
                    type="checkbox"
                    id="reminderAlarm"
                    checked={alarm}
                    onChange={(e) => setAlarm(e.target.checked)}
                  />
                  <div className="checkbox-visual" onClick={() => setAlarm(!alarm)}>
                    {alarm && <i className="fa-solid fa-check"></i>}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="styled-checkbox-container">
                <label
                  className="form-label"
                  htmlFor="reminderNotification"
                  onClick={() => setNotification(!notification)}
                  style={{ cursor: "pointer" }}
                >
                  Enable Notification:
                </label>
                <div className="styled-checkbox">
                  <input
                    type="checkbox"
                    id="reminderNotification"
                    checked={notification}
                    onChange={(e) => setNotification(e.target.checked)}
                  />
                  <div className="checkbox-visual" onClick={() => setNotification(!notification)}>
                    {notification && <i className="fa-solid fa-check"></i>}
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
              {editId ? "Save Changes" : "Add Reminder"}
            </button>
          </div>
        </div>
      </div>


    </>
  )
}
