import { useEffect } from "react"
import { Platform, AppState, AppStateStatus } from "react-native"
import { useSessionStore } from "../store/session-store"

export function SessionTracker() {
  const { startSession, endSession } = useSessionStore()

  useEffect(() => {
    startSession()

    // Platform-specific session tracking
    if (Platform.OS === "web" && typeof document !== "undefined") {
      // Use document visibility API for web
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          startSession()
        } else {
          endSession()
        }
      }

      // Also track page lifecycle events
      const handleFocus = () => startSession()
      const handleBlur = () => endSession()
      const handleBeforeUnload = () => endSession()

      document.addEventListener("visibilitychange", handleVisibilityChange)
      window.addEventListener("focus", handleFocus)
      window.addEventListener("blur", handleBlur)
      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        window.removeEventListener("focus", handleFocus)
        window.removeEventListener("blur", handleBlur)
        window.removeEventListener("beforeunload", handleBeforeUnload)
        endSession()
      }
    } else {
      // Use AppState for native platforms
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState: AppStateStatus) => {
          if (nextAppState === "active") {
            startSession()
          } else if (nextAppState === "background" || nextAppState === "inactive") {
            endSession()
          }
        }
      )

      return () => {
        subscription.remove()
        endSession()
      }
    }
  }, [startSession, endSession])

  return null
}
