import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Habit Tracker & Reminder WebApp",
  description: "Track your habits and set reminders to stay on track",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout children={children} />
}


import './globals.css'
