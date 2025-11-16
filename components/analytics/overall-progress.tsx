"use client"

import { useHabitStore } from "@/store/habit-store"
import { useEffect, useRef } from "react"
import { calculateCompletionRate } from "@/lib/habit-utils"

export default function OverallProgress() {
  const { habits } = useHabitStore()
  const circleRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Calculate overall progress based on actual data using the utility function
  const progress = calculateCompletionRate(habits, "month")

  useEffect(() => {
    if (circleRef.current) {
      const radius = 70
      const circumference = 2 * Math.PI * radius

      // Set the stroke-dasharray to the circumference
      circleRef.current.style.strokeDasharray = `${circumference}`

      // Calculate the stroke-dashoffset based on progress
      const offset = circumference - (progress / 100) * circumference
      circleRef.current.style.strokeDashoffset = `${offset}`
    }
  }, [progress])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Overall Progress</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", width: "200px", height: "200px" }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="15" />
            <circle
              ref={circleRef}
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="var(--purple-primary)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDashoffset="440"
            />
          </svg>
          <div
            ref={textRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "auto",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: 0,
              padding: 0,
              lineHeight: 1,
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: "bold", lineHeight: 1 }}>{progress}%</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1 }}>Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
