# 🚀 Quick Start: Using Habit DNA™

## For Users

### What is Habit DNA™?

Your Habit DNA is a unique visual representation of your habit-building journey. It's like a fingerprint - no two are alike!

### How to Access

1. Open the Habitual app
2. Tap the **"Habit DNA™"** tab (2nd icon in sidebar)
3. Your DNA will generate automatically from your habits

### What You'll See

- **DNA Helix**: A beautiful visualization of your habits
- **Segments**: Each colored segment represents one of your habits
- **Complexity Score**: Shows how developed your routine is (0-100%)
- **Mutations**: Achievement badges you unlock at milestones

### Understanding Your DNA

#### Colors
Each color represents a habit category:
- 🟢 **Green** = Health
- 🔴 **Red** = Work
- 🟣 **Purple** = Personal
- 🔵 **Blue** = Learning
- 🟡 **Yellow** = Finance

#### Size
Larger segments = longer streaks!

#### Mutations (Achievements)
- 🔥 **Week Warrior** - Keep any habit for 7 days
- ⭐ **Month Master** - Keep any habit for 30 days
- 👑 **Category King** - Build 5 habits in one category
- 💯 **Century Club** - Complete 100 total habits
- 🏆 **Consistent Champion** - Maintain 10+ habits
- 🌟 **Year Legend** - Keep any habit for 365 days

### How to Share

1. Scroll to the "Shareable DNA Card" section
2. Tap the **Share** button (📤)
3. Choose where to share (social media, messages, etc.)

### Tips

- Complete habits regularly to grow your DNA
- Try habits in different categories for more colors
- Build streaks to unlock mutations
- Share your DNA to inspire others!

---

## For Developers

### Quick Setup

The feature is already fully implemented. No setup needed!

### File Locations

```
store/
  └── habit-dna-store.ts         # State management

components/dna/
  ├── DNAVisualization.tsx       # Main DNA view
  ├── DNAStatsCard.tsx           # Stats display
  ├── MutationsGallery.tsx       # Achievement gallery
  └── ShareableDNACard.tsx       # Social sharing

components/home/
  └── DNAPreview.tsx             # Home widget

app/(tabs)/
  └── dna.tsx                    # Full DNA page
```

### Basic Usage

```typescript
import { useDNAStore } from '../store/habit-dna-store'
import { useHabitStore } from '../store/habit-store'

function MyComponent() {
  const { habits } = useHabitStore()
  const { dna, generateDNA } = useDNAStore()
  
  // Generate DNA
  useEffect(() => {
    generateDNA(habits)
  }, [habits])
  
  // Access DNA data
  console.log(dna?.complexity) // 0-100
  console.log(dna?.segments.length) // Number of habits
  console.log(dna?.mutations) // Unlocked achievements
}
```

### Key Functions

```typescript
// Generate DNA from habits
generateDNA(habits: Habit[]) => void

// Update DNA timestamp
updateDNA() => void

// Unlock specific mutation
unlockMutation(mutationId: string) => void

// Share DNA
shareDNA() => Promise<string>
```

### Extending the Feature

#### Add New Mutation

```typescript
// In habit-dna-store.ts, add to DEFAULT_MUTATIONS:
{
  id: 'my-new-mutation',
  name: 'My Achievement',
  description: 'Complete X to unlock',
  triggerCondition: 'custom logic',
  visualEffect: 'effect-name',
  icon: '🎯',
}

// Then add unlock logic in generateDNA function
if (yourCondition) {
  unlockedMutations.push(mutation)
}
```

#### Customize Colors

```typescript
// In habit-dna-store.ts, update getCategoryColor:
const colorMap: Record<string, string> = {
  'YourCategory': '#your-color',
  // ...
}
```

#### Modify Complexity Algorithm

```typescript
// In habit-dna-store.ts, update calculateComplexity:
const complexity = Math.min(100,
  (habitCount * yourWeight) +
  (avgStreak * yourWeight) +
  // your custom logic
)
```

### Testing

```bash
# Run the app
npm start

# Create a habit
# Complete it daily
# Check DNA page - should see:
# - DNA visualization
# - Stats updating
# - Mutations unlocking
```

---

## Troubleshooting

### DNA Not Showing
- **Cause**: No habits created yet
- **Fix**: Create at least one habit

### DNA Not Updating
- **Cause**: Need to manually refresh
- **Fix**: Tap the refresh button (🔄) on DNA page

### Mutations Not Unlocking
- **Cause**: Haven't met the requirements yet
- **Fix**: Check mutation descriptions, keep building streaks

### Share Not Working
- **Cause**: Platform doesn't support sharing
- **Fix**: Try on a different platform (mobile works best)

---

## FAQ

**Q: When does my DNA update?**  
A: Automatically whenever you complete a habit, or tap the refresh button.

**Q: Can I customize my DNA colors?**  
A: Not yet - colors are based on your habit categories to maintain consistency.

**Q: How is complexity calculated?**  
A: Based on: number of habits (×5), average streak (×2), number of categories (×10), and total completions (×0.5).

**Q: What happens when I delete a habit?**  
A: Your DNA will regenerate without that segment next time it updates.

**Q: Can I see my DNA history?**  
A: Not yet - this is a planned Phase 2 feature.

**Q: Are mutations permanent?**  
A: Yes! Once unlocked, you keep them forever.

---

## Support

For issues or questions:
1. Check documentation: `HABIT_DNA_IMPLEMENTATION_DOCUMENTATION.md`
2. Review code comments in source files
3. File an issue on GitHub

---

**Enjoy your unique Habit DNA™!** 🧬✨
