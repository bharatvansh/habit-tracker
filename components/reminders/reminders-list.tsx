"use client"

import { useReminderStore } from "@/store/reminder-store"
import { useState } from "react"
import ReminderModal from "./reminder-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function RemindersList() {
  const { reminders, deleteReminder, toggleComplete } = useReminderStore()
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null)
  const [reminderToEdit, setReminderToEdit] = useState<string | null>(null)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isPast: date < new Date(),
    }
  }

  const getPriorityClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-danger"
      case "medium":
        return "bg-warning"
      case "low":
        return "bg-success"
      default:
        return "bg-info"
    }
  }

  const handleDeleteConfirm = () => {
    if (reminderToDelete !== null) {
      deleteReminder(reminderToDelete)
      setReminderToDelete(null)
    }
  }

  if (!reminders || reminders.length === 0) {
    return (
      <div className="reminders-container">
        <div className="empty-state">
          <i className="fa-solid fa-bell-slash"></i>
          <p className="empty-state-text">No reminders added yet. Add your first reminder to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reminders-container">
      <div className="reminder-cards">
        {reminders.map((reminder) => {
          const dateInfo = formatDate(reminder.datetime)
          return (
            <div key={reminder.id} className="card reminder-card" style={{ opacity: reminder.completed ? 0.6 : 1 }}>
              <div className="reminder-card-header">
                <div className="reminder-date">
                  <div className="reminder-day">{dateInfo.day}</div>
                  <div className="reminder-date-number">{dateInfo.date}</div>
                  <div className="reminder-month">{dateInfo.month}</div>
                </div>
                <div className="reminder-time">
                  <i className="fa-solid fa-clock"></i> {dateInfo.time}
                </div>
                <div className={`reminder-priority ${getPriorityClass(reminder.priority || "medium")}`}>
                  {(reminder.priority || "medium").charAt(0).toUpperCase() + (reminder.priority || "medium").slice(1)}
                </div>
              </div>
              <div className="reminder-card-body">
                <h3 className="reminder-title" style={{ textDecoration: reminder.completed ? "line-through" : "none" }}>
                  {reminder.title}
                </h3>
                <div className="reminder-category">
                  <span className="tag">{reminder.category || "General"}</span>
                  {reminder.completed && (
                    <span
                      className="tag"
                      style={{ backgroundColor: "var(--success)", color: "white", marginLeft: "0.5rem" }}
                    >
                      Completed
                    </span>
                  )}
                </div>
              </div>
              <div className="reminder-card-footer">
                <div className="reminder-indicators">
                  {reminder.alarm && (
                    <span className="reminder-indicator" title="Alarm">
                      <i className="fa-solid fa-bell"></i>
                    </span>
                  )}
                  {reminder.notification && (
                    <span className="reminder-indicator" title="Notification">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                  )}
                </div>
                <div className="reminder-actions">
                  <button
                    className="action-btn"
                    onClick={() => {
                      toggleComplete(reminder.id)
                      toast({
                        title: reminder.completed ? "Marked Incomplete" : "Marked Complete",
                        description: `"${reminder.title}" ${reminder.completed ? "reopened" : "completed"}.`,
                      })
                    }}
                    title={reminder.completed ? "Mark Incomplete" : "Mark Complete"}
                  >
                    <i className={reminder.completed ? "fa-solid fa-rotate-left" : "fa-solid fa-check"}></i>
                  </button>
                  <button className="action-btn" onClick={() => setReminderToEdit(reminder.id)} title="Edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="action-btn" onClick={() => setReminderToDelete(reminder.id)} title="Delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {reminderToDelete !== null && (
        <AlertDialog open={!!reminderToDelete} onOpenChange={(open) => !open && setReminderToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the reminder "{reminders.find((r) => r.id === reminderToDelete)?.title}
                "? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setReminderToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const title = reminders.find((r) => r.id === reminderToDelete)?.title || "Reminder"
                  deleteReminder(reminderToDelete!)
                  setReminderToDelete(null)
                  toast({ title: "Reminder deleted", description: `"${title}" has been removed.` })
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {reminderToEdit !== null && (
        <ReminderModal
          onClose={() => setReminderToEdit(null)}
          editId={reminderToEdit}
          existingReminder={reminders.find((r) => r.id === reminderToEdit)}
        />
      )}
    </div>
  )
}
