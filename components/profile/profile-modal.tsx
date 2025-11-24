"use client"

import React from "react"
import { useProfile } from "@/hooks/use-profile"

export default function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { profile, updateProfile } = useProfile()
  const [draft, setDraft] = React.useState(profile)

  React.useEffect(() => {
    if (isOpen) setDraft(profile)
  }, [isOpen, profile])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit profile">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Edit Profile</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">
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
              rows={3}
              maxLength={500}
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              placeholder="A short description about you"
              style={{ resize: "vertical", minHeight: "80px", maxHeight: "200px" }}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem", textAlign: "right" }}>
              {draft.bio.length}/500 characters
            </div>
          </div>
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div className="styled-checkbox">
                <input
                  id="emailReminders"
                  type="checkbox"
                  checked={draft.notifications.emailReminders}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, emailReminders: e.target.checked },
                    })
                  }
                />
                <div
                  className="checkbox-visual"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, emailReminders: !draft.notifications.emailReminders },
                    })
                  }
                >
                  {draft.notifications.emailReminders && <i className="fa-solid fa-check" />}
                </div>
              </div>
              <label
                htmlFor="emailReminders"
                onClick={() =>
                  setDraft({
                    ...draft,
                    notifications: { ...draft.notifications, emailReminders: !draft.notifications.emailReminders },
                  })
                }
                style={{ cursor: "pointer", margin: 0 }}
              >
                Email reminders
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="styled-checkbox">
                <input
                  id="pushReminders"
                  type="checkbox"
                  checked={draft.notifications.pushReminders}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, pushReminders: e.target.checked },
                    })
                  }
                />
                <div
                  className="checkbox-visual"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      notifications: { ...draft.notifications, pushReminders: !draft.notifications.pushReminders },
                    })
                  }
                >
                  {draft.notifications.pushReminders && <i className="fa-solid fa-check" />}
                </div>
              </div>
              <label
                htmlFor="pushReminders"
                onClick={() =>
                  setDraft({
                    ...draft,
                    notifications: { ...draft.notifications, pushReminders: !draft.notifications.pushReminders },
                  })
                }
                style={{ cursor: "pointer", margin: 0 }}
              >
                Push reminders
              </label>
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
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={() => {
              updateProfile(draft)
              onClose()
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
