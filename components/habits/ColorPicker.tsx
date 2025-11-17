import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export const HABIT_COLORS = [
  "#8a2be2",
  "#f44336",
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#e91e63",
  "#00bcd4",
  "#ffc107",
  "#9c27b0",
  "#ff5722",
  "#3f51b5",
  "#009688",
]

interface ColorPickerProps {
  selectedColor?: string
  onColorSelect: (color: string) => void
}

export default function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Color</Text>
      <View style={styles.colorGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => onColorSelect(color)}
            activeOpacity={0.7}
          >
            {selectedColor === color && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
})
