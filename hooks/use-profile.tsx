"use client"

import React from "react"

export type Profile = {
  name: string
  email: string
  bio: string
  timezone: string
  avatarColor: string
  notifications: {
    emailReminders: boolean
    pushReminders: boolean
  }
}

const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  bio: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  avatarColor: "#8a2be2", // matches --purple-primary
  notifications: {
    emailReminders: true,
    pushReminders: false,
  },
}

type Ctx = {
  profile: Profile
  updateProfile: (patch: Partial<Profile>) => void
  resetProfile: () => void
}

const ProfileContext = React.createContext<Ctx | null>(null)
const STORAGE_KEY = "userProfile"

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<Profile>(DEFAULT_PROFILE)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Profile
        setProfile({ ...DEFAULT_PROFILE, ...parsed })
      }
    } catch {
      // ignore corrupted local storage
    }
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // ignore write failures
    }
  }, [profile])

  const updateProfile = (patch: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...patch }))

  const resetProfile = () => setProfile(DEFAULT_PROFILE)

  return <ProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = React.useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}
