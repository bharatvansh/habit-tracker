# Visual Mockup Guide - UI/UX Concepts

This document describes the visual design concepts for the unique features. Use these descriptions to create mockups or implement directly.

---

## 🧬 Habit DNA™ Visualization - ✅ **COMPLETE**

**Status:** ✅ **FULLY IMPLEMENTED**  
**Files:** See `/components/dna/` and `/app/(tabs)/dna.tsx`  
**Documentation:** [HABIT_DNA_IMPLEMENTATION_DOCUMENTATION.md](./HABIT_DNA_IMPLEMENTATION_DOCUMENTATION.md)

### Main DNA View

```
┌─────────────────────────────────────────┐
│  ◀  Your Habit DNA              Share 📤│
├─────────────────────────────────────────┤
│                                         │
│         ╱╲    ╱╲    ╱╲    ╱╲          │
│        ╱  ╲  ╱  ╲  ╱  ╲  ╱  ╲         │
│       ●────●────●────●────●────●        │
│        ╲  ╱  ╲  ╱  ╲  ╱  ╲  ╱         │
│         ╲╱    ╲╱    ╲╱    ╲╱          │
│       🟣  🔴  🟢  🔵  🟠  🟡          │
│                                         │
│      [Gradient glow around helix]      │
│                                         │
├─────────────────────────────────────────┤
│  DNA Complexity: ████████░░ 82%        │
│                                         │
│  Active Segments:                      │
│  🟣 Health (4 habits)   Streak: 15d   │
│  🔴 Work (2 habits)     Streak: 7d    │
│  🟢 Personal (3 habits) Streak: 30d   │
│  🔵 Learning (1 habit)  Streak: 5d    │
│                                         │
│  Latest Mutation: 🔥 Week Warrior      │
│  Unlocked: Nov 17, 2024                │
│                                         │
│  [View Mutations Gallery] [Customize]  │
└─────────────────────────────────────────┘
```

### Color Palette
- **Primary DNA Strand**: Gradient from #8a2be2 (purple) to #4169e1 (blue)
- **Segment Colors**: Dynamic based on categories
  - Health: #4caf50 (green)
  - Work: #f44336 (red)
  - Personal: #8a2be2 (purple)
  - Learning: #2196f3 (blue)
  - Finance: #ffc107 (yellow)
- **Background**: #121212 with subtle glow effects
- **Mutations**: Gold (#ffd700) accent

### Animation
1. **On Load**: DNA helix rotates slowly (360° over 10 seconds)
2. **On Habit Complete**: New segment lights up and pulses
3. **On Mutation Unlock**: Burst of particles, segment changes shape
4. **Idle**: Gentle breathing animation (scale 1.0 → 1.02 → 1.0)

### DNA Shape Variations
Based on user's habit patterns:

```
Simple (1-3 habits)      Medium (4-7 habits)      Complex (8+ habits)
      ●                        ╱╲                    ╱╲╱╲╱╲
      │                       ╱  ╲                  ╱      ╲
      ●                      ●────●                ●────●────●
      │                       ╲  ╱                  ╲      ╱
      ●                        ╲╱                    ╲╱╲╱╲╱
```

### Shareable DNA Card

```
┌─────────────────────────────────────────┐
│                                         │
│        [DNA Helix Visualization]        │
│                                         │
│  My Habit DNA - November 2024          │
│                                         │
│  🔥 30-day streak on Personal Growth   │
│  💪 82% completion rate                │
│  🎯 15 active habits                    │
│                                         │
│  Built with Habitual                   │
│  [App Icon]                            │
└─────────────────────────────────────────┘
```
**Size**: 1200x630px (optimal for social media)
**Export formats**: PNG, JPG, SVG

---

## 🧠 Miss Intelligence System

### Miss Dialog (Appears when habit is skipped)

```
┌─────────────────────────────────────────┐
│  ✗  Why did you skip Morning Run?      │
├─────────────────────────────────────────┤
│                                         │
│  Understanding why helps us help you    │
│                                         │
│  ┌─────────┬─────────┬─────────┐      │
│  │  😴     │  ⏰     │  🤔     │      │
│  │ Too     │ Too     │ Forgot  │      │
│  │ Tired   │ Busy    │         │      │
│  └─────────┴─────────┴─────────┘      │
│                                         │
│  ┌─────────┬─────────┬─────────┐      │
│  │  😔     │  🌧️    │  🤒     │      │
│  │ Not     │ Weather │ Not     │      │
│  │ Motivated│        │ Well    │      │
│  └─────────┴─────────┴─────────┘      │
│                                         │
│  ┌─────────┬─────────────────────┐    │
│  │  ✈️     │  ...     │          │    │
│  │ Travel  │  Other   │          │    │
│  └─────────┴──────────┴──────────┘    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Add a note (optional)            │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [Skip]              [Log Miss] 👆     │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap reason → Highlights in purple
- Type note → Auto-save on blur
- Log Miss → Gentle animation, no red/negative colors

### Miss Patterns Card

```
┌─────────────────────────────────────────┐
│  🔍 Miss Patterns & Insights            │
├─────────────────────────────────────────┤
│                                         │
│  📚 Reading Before Bed                  │
│  Miss rate: 35% | Usually: Too Tired   │
│                                         │
│  ⚠️ Risk Factors:                       │
│     • Often missed on Fridays (60%)    │
│     • After long work days             │
│                                         │
│  💡 Suggestion:                         │
│  Try reading in the morning instead,   │
│  or reduce to 10 minutes on Fridays.   │
│                                         │
│  ──────────────────────────────────────│
│                                         │
│  🏃 Morning Run                         │
│  Miss rate: 15% | Usually: Weather     │
│                                         │
│  💚 Great consistency! You rarely miss │
│  this habit. Keep it up!               │
│                                         │
└─────────────────────────────────────────┘
```

**Color Coding:**
- High miss rate (>40%): Orange borders (#ff9800)
- Medium (20-40%): Yellow accents (#ffc107)
- Low (<20%): Green accents (#4caf50)

### Predictive Miss Alert (Home Screen)

```
┌─────────────────────────────────────────┐
│  ⚠️ Heads Up!                           │
├─────────────────────────────────────────┤
│                                         │
│  You often struggle with "Gym Workout" │
│  on rainy Mondays. Today is one!       │
│                                         │
│  💡 Set an extra reminder at 5pm?      │
│                                         │
│  [Dismiss]        [Set Reminder] 🔔    │
└─────────────────────────────────────────┘
```

**Positioning**: Top of home screen, above habit list  
**Dismissable**: Swipe away or tap X  
**Frequency**: Max 1 per day to avoid annoyance

---

## 📊 Habit Impact Calculator

### Impact Display (In Habit Detail)

```
┌─────────────────────────────────────────┐
│  📚 Reading Before Bed                  │
├─────────────────────────────────────────┤
│                                         │
│  Real Impact                           │
│  ═══════════════════════════════        │
│                                         │
│  📖 2,340 pages read                   │
│     That's 8 books!                    │
│                                         │
│  ⏱️ 39 hours invested                   │
│     Equivalent to a college course     │
│                                         │
│  🧠 78 reading sessions                 │
│     Your brain grew 2.3% stronger*    │
│                                         │
│  ──────────────────────────────────────│
│                                         │
│  If you continue for 1 year:           │
│  📚 30 books | ⏱️ 182 hours            │
│                                         │
│  [Share Progress] [Customize]          │
│                                         │
│  *Based on neuroplasticity research    │
└─────────────────────────────────────────┘
```

### Quick Impact Card (On Habit Card)

```
┌───────────────────────────────┐
│  💰 Skip Coffee                │
│  ✅ 45 of 60 this month        │
│                                │
│  💵 $157.50 saved this month   │
│  📈 $1,890 annual projection   │
│                                │
│  🎯 [Complete] [Skip]          │
└───────────────────────────────┘
```

### Pre-built Calculators

**Reading:**
- Pages → Books
- Hours invested
- Knowledge equivalents

**Exercise:**
- Calories → Marathons
- Distance → Mountains climbed
- Time → Fitness level gained

**Meditation:**
- Minutes → Days of peace
- Sessions → Stress reduction
- Consistency → Mental health improvement

**Savings:**
- Money saved
- Annual projection
- What you could buy

**Learning:**
- Hours → Courses completed
- Practice time → Skill level
- Consistency → Mastery progress

---

## 📈 Enhanced Analytics Dashboard

### Heatmap Calendar

```
┌─────────────────────────────────────────┐
│  🔥 Activity Heatmap - Last 90 Days     │
├─────────────────────────────────────────┤
│                                         │
│  Mon ■ □ ■ ■ ■ ■ ■ ■ ■ ■ □ ■ ■       │
│  Tue ■ ■ ■ ■ ■ ■ □ ■ ■ ■ ■ ■ ■       │
│  Wed ■ ■ ■ □ ■ ■ ■ ■ ■ ■ ■ ■ ■       │
│  Thu ■ ■ ■ ■ ■ ■ ■ ■ □ ■ ■ ■ ■       │
│  Fri ■ □ □ ■ ■ □ ■ ■ ■ ■ ■ ■ ■       │
│  Sat ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■       │
│  Sun ■ ■ ■ ■ □ ■ ■ ■ ■ ■ ■ ■ ■       │
│                                         │
│  ■ 3+ habits  ▣ 2 habits  □ 0-1 habit  │
│                                         │
│  Best week: Oct 14-20 (35 completions) │
│  Current streak: 12 days 🔥            │
└─────────────────────────────────────────┘
```

**Colors:**
- No activity: #1e1e1e (dark)
- 1 habit: rgba(138, 43, 226, 0.3)
- 2 habits: rgba(138, 43, 226, 0.6)
- 3+ habits: rgba(138, 43, 226, 1.0)

### Habit Relationships Network

```
┌─────────────────────────────────────────┐
│  🕸️ Habit Network                       │
├─────────────────────────────────────────┤
│                                         │
│         ╭─── 🏃 Run ────╮              │
│         │                │              │
│     💤 Sleep ──────── 🧘 Meditate      │
│         │                │              │
│         ╰─── 📚 Read ───╯              │
│              │                          │
│          💼 Work                        │
│                                         │
│  Legend:                               │
│  ━━━ Strong positive (often together)  │
│  ─ ─ Weak correlation                  │
│  ╳ ╳ ╳ Negative correlation            │
│                                         │
│  💡 Insights:                          │
│  • 🏃 Run is a keystone habit          │
│    (boosts others by 40%)              │
│  • 💤 Sleep affects 3 other habits     │
│  • Consider linking 📚 Read → 🧘      │
│                                         │
└─────────────────────────────────────────┘
```

**Interactive:**
- Tap habit → Highlight connections
- Pinch/zoom → Explore network
- Long press → See correlation details

---

## 🎯 Daily Goal Card (Home Screen)

```
┌─────────────────────────────────────────┐
│  🎯 Today's Goal                        │
├─────────────────────────────────────────┤
│                                         │
│  Wednesday, November 20                │
│                                         │
│  ████████████████░░░░ 5 of 7 habits    │
│                                         │
│  ✅ Morning Meditation                  │
│  ✅ Drink Water                         │
│  ✅ Exercise                            │
│  ✅ Read 20 Minutes                     │
│  ✅ Journal                             │
│  ⬜ Learn Spanish - 3h left            │
│  ⬜ Evening Walk - 5h left             │
│                                         │
│  71% complete - You're doing great! 🌟 │
└─────────────────────────────────────────┘
```

**Progress Bar Colors:**
- 0-30%: #f44336 (red)
- 31-70%: #ff9800 (orange)
- 71-99%: #8a2be2 (purple)
- 100%: #4caf50 (green) with sparkles ✨

---

## 🏆 Achievement System

### Achievement Card

```
┌─────────────────────────────────────────┐
│  🎉 Achievement Unlocked!               │
├─────────────────────────────────────────┤
│                                         │
│         ┏━━━━━━━━━━━━━┓                │
│         ┃             ┃                │
│         ┃     🔥      ┃                │
│         ┃             ┃                │
│         ┗━━━━━━━━━━━━━┛                │
│                                         │
│      Week Warrior                      │
│                                         │
│  Maintain a 7-day streak               │
│  on any habit                          │
│                                         │
│  Unlocked: Nov 17, 2024                │
│                                         │
│  [Share] [View All Achievements]       │
└─────────────────────────────────────────┘
```

**Animation:**
1. Card slides up from bottom
2. Badge pulses and rotates
3. Confetti burst
4. Sound effect (optional)

### Achievement Gallery

```
┌─────────────────────────────────────────┐
│  🏆 Achievements (12 of 30)             │
├─────────────────────────────────────────┤
│                                         │
│  ┏━━━┓ ┏━━━┓ ┏━━━┓ ┏━━━┓ ┏━━━┓      │
│  ┃🎯┃ ┃🔥┃ ┃⭐┃ ┃💎┃ ┃🏅┃      │
│  ┗━━━┛ ┗━━━┛ ┗━━━┛ ┗━━━┛ ┗━━━┛      │
│  First Week 30 Day Habit  100  Year   │
│  Habit Warrior Master Days Champ       │
│                                         │
│  ┏━━━┓ ┏━━━┓ ┏━━━┓ ┌───┐ ┌───┐      │
│  ┃📚┃ ┃💪┃ ┃🌟┃ │ ? │ │ ? │      │
│  ┗━━━┛ ┗━━━┛ ┗━━━┛ └───┘ └───┘      │
│  Book  Fitness Rising │ Locked │      │
│  Worm  Legend  Star                    │
│                                         │
│  Locked achievements: 18 remaining     │
│  Next: "10 Habits" (7/10) 70%         │
└─────────────────────────────────────────┘
```

**Badge Tiers:**
- Bronze: First achievement
- Silver: 7 days
- Gold: 30 days
- Platinum: 100 days
- Diamond: 365 days
- Legendary: Special milestones

---

## 🎨 Color Scheme & Design System

### Primary Colors
```
Purple Primary:   #8a2be2 (Brand color)
Purple Light:     #9d4edd
Purple Dark:      #7209b7

Background Dark:  #121212
Surface Dark:     #1e1e1e
Surface Light:    #252525
```

### Accent Colors
```
Success:   #4caf50 (Green)
Warning:   #ff9800 (Orange)
Error:     #f44336 (Red)
Info:      #2196f3 (Blue)
Gold:      #ffc107 (Yellow)
```

### Gradients
```
Primary Gradient:
  linear-gradient(135deg, #8a2be2 0%, #4169e1 100%)

Success Gradient:
  linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)

DNA Gradient:
  linear-gradient(90deg, 
    #8a2be2 0%,
    #4169e1 25%,
    #2196f3 50%,
    #00bcd4 75%,
    #4caf50 100%
  )
```

### Typography
```
Title (28px):     font-weight: 700
Subtitle (20px):  font-weight: 600
Body (16px):      font-weight: 400
Small (14px):     font-weight: 400
Label (12px):     font-weight: 500
```

### Spacing
```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  24px
2xl: 32px
3xl: 48px
```

### Border Radius
```
Small:  4px  (buttons)
Medium: 8px  (cards)
Large:  12px (containers)
XL:     16px (modals)
Full:   9999px (circles)
```

### Shadows
```
Small: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}

Medium: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
}

Large: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8,
}
```

---

## 🎭 Animation Guidelines

### Micro-interactions
- **Button press**: Scale 1.0 → 0.95 (100ms)
- **Card tap**: Scale 1.0 → 1.02 (150ms)
- **Toggle**: Smooth slide with spring (200ms)
- **Checkbox**: Bouncy scale (250ms)

### Page Transitions
- **Slide**: Right to left (300ms ease-in-out)
- **Modal**: Slide up from bottom (400ms ease-out)
- **Fade**: Opacity transition (200ms)

### Celebration Animations
- **Confetti**: 3 seconds duration
- **Badge unlock**: Rotate 360° + scale pulse (1s)
- **Streak milestone**: Fire emoji growth (500ms)
- **Goal complete**: Green wave across progress bar (800ms)

### Loading States
- **Skeleton**: Shimmer left to right (1.5s loop)
- **Spinner**: Rotate 360° (1s loop)
- **Progress bar**: Smooth width transition (300ms)

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Bottom tab navigation
- Full-width cards
- Compact spacing

### Tablet (768px - 1024px)
- Two column layout for some sections
- Sidebar navigation
- Medium spacing
- Larger touch targets

### Desktop (> 1024px)
- Three column layout
- Persistent sidebar
- Hover states
- Keyboard shortcuts

---

## ♿ Accessibility

### Color Contrast
- All text minimum 4.5:1 contrast ratio
- Interactive elements 3:1 ratio
- Support high contrast mode

### Touch Targets
- Minimum 44x44pt (Apple guideline)
- 48x48dp (Android guideline)
- Adequate spacing between targets

### Screen Reader
- All images have alt text
- Proper heading hierarchy
- ARIA labels on interactive elements
- Announce achievement unlocks

### Reduced Motion
- Respect prefers-reduced-motion
- Provide option to disable animations
- Static alternatives for all animations

---

## 🎬 Onboarding Flow

```
Screen 1:
┌─────────────────────────────────────────┐
│                                         │
│        [DNA Helix Animation]            │
│                                         │
│  Welcome to Habitual                   │
│  Track habits, build your DNA          │
│                                         │
│  [Next]                                 │
└─────────────────────────────────────────┘

Screen 2:
┌─────────────────────────────────────────┐
│                                         │
│     [Miss Dialog Illustration]          │
│                                         │
│  Learn from Every Miss                 │
│  We don't punish failure,              │
│  we learn from it                      │
│                                         │
│  [Next]                                 │
└─────────────────────────────────────────┘

Screen 3:
┌─────────────────────────────────────────┐
│                                         │
│   [Impact Calculator Illustration]      │
│                                         │
│  See Your Real Impact                  │
│  Turn habits into tangible results     │
│                                         │
│  [Next]                                 │
└─────────────────────────────────────────┘

Screen 4:
┌─────────────────────────────────────────┐
│                                         │
│  Let's Create Your First Habit         │
│                                         │
│  What would you like to track?         │
│  ┌──────────────────────────────────┐  │
│  │ e.g., Morning meditation         │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [Start Building My DNA]                │
└─────────────────────────────────────────┘
```

---

*Use these mockups as a guide for implementation or design tool creation (Figma, Sketch, etc.)*
