/**
 * Universal Storage Adapter
 * Provides a consistent storage interface across web and native platforms.
 */

import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { StateStorage } from "zustand/middleware"

/**
 * In-memory fallback storage for environments where localStorage is not available
 */
const createMemoryStorage = (): StateStorage => {
  const memory = new Map<string, string | null>()

  return {
    getItem: async (name) => memory.get(name) ?? null,
    setItem: async (name, value) => {
      memory.set(name, value)
    },
    removeItem: async (name) => {
      memory.delete(name)
    },
  }
}

/**
 * Web storage backed by localStorage (with graceful error handling)
 */
const createWebStorage = (): StateStorage => ({
  getItem: async (name) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return null
      }
      return window.localStorage.getItem(name)
    } catch (error) {
      console.error("localStorage.getItem error", error)
      return null
    }
  },
  setItem: async (name, value) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return
      }
      window.localStorage.setItem(name, value)
    } catch (error) {
      console.error("localStorage.setItem error", error)
    }
  },
  removeItem: async (name) => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return
      }
      window.localStorage.removeItem(name)
    } catch (error) {
      console.error("localStorage.removeItem error", error)
    }
  },
})

/**
 * Native storage backed by AsyncStorage
 */
const nativeStorage: StateStorage = {
  getItem: async (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value)
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name)
  },
}

/**
 * Returns a universal StateStorage implementation depending on the platform
 */
export const getUniversalStorage = (): StateStorage => {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") {
      return createMemoryStorage()
    }
    return createWebStorage()
  }
  return nativeStorage
}

/**
 * Helper factory for Zustand persist configuration
 */
export const createUniversalStorage = (): StateStorage => getUniversalStorage()
