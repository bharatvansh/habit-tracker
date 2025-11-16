"use client"

import React from "react"
import { useProfile } from "@/hooks/use-profile"

export default function ProfilePage() {
  const { profile, updateProfile, resetProfile } = useProfile()
  const [draft, setDraft] = React.useState(profile)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    setDraft(profile)
  }, [profile])

  const initials = (draft.name || "You")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="tab-content active" id="profile">
      <div className="header">
        <h2 className="page-title">Profile</h2>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={() => {
              resetProfile()
              setSaved(false)
            }}
            aria-label="Reset profile to defaults"
          >
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              updateProfile(draft)
              setSaved(true)
              setTimeout(() => setSaved(false), 1800)
            }}
          >
            <i className="fa-solid fa-floppy-disk" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid-container">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Your Info</div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                className="avatar-circle"
                style={{ backgroundColor: draft.avatarColor, width: 56, height: 56, fontSize: 18 }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="status">
                <div className="status-dot status-completed" aria-hidden="true" />
                <span>{saved ? "Saved" : "Unsaved changes"}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="form-control"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                className="form-control"
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="A short description about you"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Preferences</div>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="tz">
                Time zone
              </label>
              <input
                id="tz"
                className="form-control"
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                placeholder="e.g. America/Los_Angeles"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notifications</label>
              <div className="form-check">
                <input
                  id="emailReminders"
                  className="form-check-input"
                  type="checkbox"
                  checked={draft.notifications.emailReminders}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, emailReminders: e.target.checked },
                    })
                  }
                />
                <label htmlFor="emailReminders">Email reminders</label>
              </div>
              <div className="form-check">
                <input
                  id="pushReminders"
                  className="form-check-input"
                  type="checkbox"
                  checked={draft.notifications.pushReminders}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, pushReminders: e.target.checked },
                    })
                  }
                />
                <label htmlFor="pushReminders">Push reminders</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="avatarColor">
                Avatar color
              </label>
              <input
                id="avatarColor"
                type="color"
                className="form-control"
                value={draft.avatarColor}
                onChange={(e) => setDraft({ ...draft, avatarColor: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
