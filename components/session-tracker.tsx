import { useEffect } from "react"
import { AppState, AppStateStatus } from "react-native"
import { useSessionStore } from "../store/session-store"

export function SessionTracker() {
  const { startSession, endSession } = useSessionStore()

  useEffect(() => {
    startSession()

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        startSession()
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        endSession()
      }
    })

    return () => {
      subscription.remove()
      endSession()
    }
  }, [startSession, endSession])

  return null
}
