"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useProfile } from "@/hooks/use-profile"
import ProfileModal from "@/components/profile/profile-modal"

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("home")
  const { profile } = useProfile()
  const [isProfileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Extract the tab from the pathname
    const path = pathname.split("/")[1] || "home"
    setActiveTab(path)
  }, [pathname])

  const initials = (profile.name || "You")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      className="sidebar"
      style={{ position: "fixed", height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}
    >
      <div className="app-title">
        <div className="logo">
          <i className="fa-solid fa-check"></i>
        </div>
        <h1>Habitual</h1>
      </div>

      <Link href="/" className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>

      <Link href="/analytics" className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}>
        <i className="fa-solid fa-chart-line"></i>
        <span>Analytics</span>
      </Link>

      <Link href="/reminders" className={`nav-item ${activeTab === "reminders" ? "active" : ""}`}>
        <i className="fa-solid fa-bell"></i>
        <span>Reminders</span>
      </Link>

      <Link href="/habits" className={`nav-item ${activeTab === "habits" ? "active" : ""}`}>
        <i className="fa-solid fa-list-check"></i>
        <span>Habits</span>
      </Link>

      {/* Spacer to push profile section to bottom */}
      <div style={{ flex: 1 }} />

      {mounted && (
        <div className="theme-toggle-section">
          <div className="theme-toggle-container">
            <button
              onClick={() => setTheme("light")}
              className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
              title="Light Mode"
            >
              <i className="fa-solid fa-sun"></i>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
              title="Dark Mode"
            >
              <i className="fa-solid fa-moon"></i>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`theme-toggle-btn ${theme === 'system' ? 'active' : ''}`}
              title="System Default"
            >
              <i className="fa-solid fa-laptop"></i>
            </button>
          </div>
        </div>
      )}

      <div className="profile-section">
        <button className="profile-card" onClick={() => setProfileOpen(true)} aria-label="Open profile quick edit">
          <div className="avatar-circle" style={{ backgroundColor: profile.avatarColor }} aria-hidden="true">
            {initials}
          </div>
          <div className="profile-meta">
            <div className="profile-name">{profile.name || "Your Profile"}</div>
            <div className="profile-email">{profile.email || "Set up your details"}</div>
          </div>
          <i className="fa-solid fa-pen-to-square profile-edit-icon" aria-hidden="true" />
        </button>
        <Link href="/profile" className="profile-link">
          <i className="fa-solid fa-user" aria-hidden="true" /> <span>Profile</span>
        </Link>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}
