"use client"
import { useHabitStore } from "@/store/habit-store"
import { useState } from "react"
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

export default function HabitList() {
  const { habits, markHabitComplete, deleteHabit, categories } = useHabitStore()
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All Habits")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleMarkComplete = (id: string, name: string) => {
    markHabitComplete(id)
    toast({ title: "Habit completed", description: `"${name}" marked complete for today.` })
  }

  const handleEditHabit = (index: number) => {
    // Edit functionality can be added later
    alert(`Edit functionality for "${habits[index].name}" will be implemented soon.`)
  }

  const handleDeleteConfirm = () => {
    if (habitToDelete !== null) {
      deleteHabit(habitToDelete)
      setHabitToDelete(null)
    }
  }

  // Filter habits based on selected category and search term
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory = activeCategory === "All Habits" || habit.category === activeCategory
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (habits.length === 0) {
    return (
      <div className="dashboard-section" id="habitListSection">
        <div className="section-header">
          <h2 className="section-title">Habits</h2>
        </div>
        <div className="habit-categories">
          <div
            className={`category-pill ${activeCategory === "All Habits" ? "active" : ""}`}
            onClick={() => setActiveCategory("All Habits")}
          >
            All Habits
          </div>
          {categories.map((category) => (
            <div
              key={category}
              className={`category-pill ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search for habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div
          className="habit-grid"
          style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "2rem",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            <div>
              <i className="fa-solid fa-list-check" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
              <p>No habits added yet. Click the "Add Habit" button to get started!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section" id="habitListSection">
      <div className="section-header">
        <h2 className="section-title">Habits</h2>
      </div>
      <div className="habit-categories">
        <div
          className={`category-pill ${activeCategory === "All Habits" ? "active" : ""}`}
          onClick={() => setActiveCategory("All Habits")}
        >
          All Habits
        </div>
        {categories.map((category) => (
          <div
            key={category}
            className={`category-pill ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <div className="search-container">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search for habits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="habit-grid">
        {filteredHabits.map((habit) => {
          return (
            <div className="card" key={habit.id}>
              <div className="card-header">
                <div className="card-title">{habit.name}</div>
                {habit.time && (
                  <div className="habit-time">
                    <i className="fa-regular fa-clock"></i> {habit.time}
                  </div>
                )}
              </div>
              <div className="card-body">
                <div className="habit-details">
                  <div className="habit-detail">
                    <i className="fa-solid fa-repeat"></i>
                    <span>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</span>
                  </div>
                  {habit.days && habit.days.length > 0 && (
                    <div className="habit-detail">
                      <i className="fa-regular fa-calendar"></i>
                      <span>{habit.days.length === 7 ? "Every day" : habit.days.join(", ")}</span>
                    </div>
                  )}
                  <div className="habit-detail">
                    <i className="fa-solid fa-fire"></i>
                    <span>{habit.streak || 0} day streak</span>
                  </div>
                  <div className="habit-detail">
                    <i className="fa-solid fa-tag"></i>
                    <span className="tag">{habit.category}</span>
                  </div>
                </div>
                <div className="habit-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-value"
                      style={{
                        width: `${Math.min(((habit.streak || 0) / 30) * 100, 100)}%`,
                        backgroundColor: (habit.streak || 0) > 7 ? "var(--success)" : "var(--purple-primary)",
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {Math.min(((habit.streak || 0) / 30) * 100, 100).toFixed(0)}% to 30 day goal
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="action-btn mark-complete-btn"
                  onClick={() => handleMarkComplete(habit.id, habit.name)}
                  title="Mark Complete"
                >
                  <i className="fa-solid fa-check"></i>
                </button>
                <button
                  className="action-btn"
                  onClick={() => alert(`Edit functionality for "${habit.name}" will be implemented soon.`)}
                  title="Edit Habit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="action-btn" onClick={() => setHabitToDelete(habit.id)} title="Delete Habit">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              {habit.lastCompletedDate === new Date().toISOString().split("T")[0] && (
                <div className="completed-badge">
                  <i className="fa-solid fa-check-circle"></i> Completed today
                </div>
              )}
            </div>
          )
        })}
        {habitToDelete !== null && (
          <AlertDialog open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the habit "{habits.find((h) => h.id === habitToDelete)?.name}"? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setHabitToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const name = habits.find((h) => h.id === habitToDelete)?.name || "Habit"
                    deleteHabit(habitToDelete!)
                    setHabitToDelete(null)
                    toast({ title: "Habit deleted", description: `"${name}" has been removed.` })
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
