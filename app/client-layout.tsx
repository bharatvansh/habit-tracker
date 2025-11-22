"use client"

import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/sidebar"
import { useHabitStore } from "@/store/habit-store"
import { Toaster } from "@/components/ui/toaster"
import { ProfileProvider } from "@/hooks/use-profile"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Client component for weekly reset
function WeeklyResetHandler() {
  const { resetWeeklyStats } = useHabitStore()

  React.useEffect(() => {
    // Check if it's the start of a new week (Monday)
    const today = new Date()
    if (today.getDay() === 1) {
      // Monday
      const lastResetKey = "lastWeeklyReset"
      const lastReset = localStorage.getItem(lastResetKey)
      const thisMonday = today.toISOString().split("T")[0]

      if (lastReset !== thisMonday) {
        resetWeeklyStats()
        localStorage.setItem(lastResetKey, thisMonday)
      }
    }
  }, [resetWeeklyStats])

  return null
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProfileProvider>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <WeeklyResetHandler />
                {children}
              </div>
            </div>
            <Toaster />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
