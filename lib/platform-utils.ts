/**
 * Platform Utilities
 * Helper functions for platform detection and web-specific features
 */

import { Platform, Dimensions } from "react-native"

/**
 * Check if running on web
 */
export const isWeb = Platform.OS === "web"

/**
 * Check if running on mobile (iOS or Android)
 */
export const isMobile = Platform.OS === "ios" || Platform.OS === "android"

/**
 * Check if running on desktop
 */
export const isDesktop = Platform.OS === "windows" || Platform.OS === "macos"

/**
 * Get responsive breakpoints
 */
export const getBreakpoint = () => {
  const { width } = Dimensions.get("window")
  
  if (width < 640) return "mobile"
  if (width < 768) return "tablet"
  if (width < 1024) return "laptop"
  return "desktop"
}

/**
 * Check if device is in landscape mode
 */
export const isLandscape = () => {
  const { width, height } = Dimensions.get("window")
  return width > height
}

/**
 * Get safe viewport dimensions considering mobile browsers
 */
export const getSafeViewport = () => {
  if (!isWeb) {
    return Dimensions.get("window")
  }
  
  // For web, use window.innerHeight/innerWidth to account for browser chrome
  if (typeof window !== "undefined") {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  
  return Dimensions.get("window")
}

/**
 * Web-specific: Check if PWA is installed
 */
export const isPWAInstalled = (): boolean => {
  if (!isWeb || typeof window === "undefined") return false
  
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  )
}

/**
 * Web-specific: Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  if (!isWeb || typeof navigator === "undefined") return false
  return "serviceWorker" in navigator
}

/**
 * Web-specific: Check if notification API is supported
 */
export const isNotificationSupported = (): boolean => {
  if (!isWeb || typeof window === "undefined") return false
  return "Notification" in window
}

/**
 * Web-specific: Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return "denied"
  }
  
  return await Notification.requestPermission()
}

/**
 * Web-specific: Check if device is online
 */
export const isOnline = (): boolean => {
  if (!isWeb || typeof navigator === "undefined") return true
  return navigator.onLine
}

/**
 * Web-specific: Get device type based on user agent
 */
export const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
  if (!isWeb || typeof navigator === "undefined") {
    return isMobile ? "mobile" : "desktop"
  }
  
  const ua = navigator.userAgent
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet"
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile"
  }
  
  return "desktop"
}

/**
 * Web-specific: Check if touch is supported
 */
export const isTouchDevice = (): boolean => {
  if (!isWeb || typeof window === "undefined") {
    return isMobile
  }
  
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Web-specific: Detect browser
 */
export const getBrowser = (): string => {
  if (!isWeb || typeof navigator === "undefined") return "unknown"
  
  const ua = navigator.userAgent
  
  if (ua.indexOf("Firefox") > -1) return "firefox"
  if (ua.indexOf("SamsungBrowser") > -1) return "samsung"
  if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "opera"
  if (ua.indexOf("Trident") > -1) return "ie"
  if (ua.indexOf("Edge") > -1) return "edge"
  if (ua.indexOf("Chrome") > -1) return "chrome"
  if (ua.indexOf("Safari") > -1) return "safari"
  
  return "unknown"
}

/**
 * Web-specific: Copy to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isWeb || typeof navigator === "undefined") return false
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand("copy")
      return true
    } finally {
      document.body.removeChild(textArea)
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}

/**
 * Web-specific: Download file
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  if (!isWeb || typeof document === "undefined") return
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Web-specific: Share API
 */
export const webShare = async (data: {
  title?: string
  text?: string
  url?: string
}): Promise<boolean> => {
  if (!isWeb || typeof navigator === "undefined" || !navigator.share) {
    return false
  }
  
  try {
    await navigator.share(data)
    return true
  } catch (error) {
    console.error("Error sharing:", error)
    return false
  }
}

/**
 * Web-specific: Check if Share API is supported
 */
export const isShareSupported = (): boolean => {
  if (!isWeb || typeof navigator === "undefined") return false
  return !!navigator.share
}

/**
 * Responsive font size based on screen width
 */
export const getResponsiveFontSize = (baseFontSize: number): number => {
  const { width } = getSafeViewport()
  const breakpoint = getBreakpoint()
  
  switch (breakpoint) {
    case "mobile":
      return baseFontSize * 0.9
    case "tablet":
      return baseFontSize
    case "laptop":
      return baseFontSize * 1.1
    case "desktop":
      return baseFontSize * 1.2
    default:
      return baseFontSize
  }
}

/**
 * Lightweight haptic feedback helper
 */
export const triggerHapticFeedback = (type: "light" | "medium" | "heavy" = "medium") => {
  if (isWeb && typeof navigator !== "undefined" && "vibrate" in navigator) {
    const durationMap = {
      light: 10,
      medium: 20,
      heavy: 30,
    }
    navigator.vibrate(durationMap[type])
  }
  // Native haptics should be handled via platform-specific modules where available
}
