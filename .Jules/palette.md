## 2024-05-23 - Interactive Elements and Opacity
**Learning:** The application uses `opacity-0 group-hover:opacity-100` to hide actions (like Delete/Play on tasks) until the user hovers. This makes these actions inaccessible to keyboard users because focusing them does not reveal them.
**Action:** Always include `group-focus-within:opacity-100` (or similar focus-visible logic) alongside hover effects for action buttons to ensure they are visible when accessed via keyboard navigation.
