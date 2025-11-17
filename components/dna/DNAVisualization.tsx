import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg'
import { useDNAStore } from '../../store/habit-dna-store'

const { width } = Dimensions.get('window')

export default function DNAVisualization() {
  const { dna } = useDNAStore()
  const rotation = React.useRef(new Animated.Value(0)).current
  const scale = React.useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [scale])

  if (!dna || dna.segments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🧬</Text>
        <Text style={styles.emptyTitle}>Your DNA Awaits</Text>
        <Text style={styles.emptyText}>
          Start building habits to create your unique Habit DNA™
        </Text>
      </View>
    )
  }

  const svgWidth = width - 32
  const svgHeight = 400

  // Generate helix path
  const generateHelixPath = () => {
    const segments = dna.segments.length
    const points: { x: number; y: number }[] = []
    
    for (let i = 0; i <= segments * 3; i++) {
      const x = (i / (segments * 3)) * (svgWidth - 40) + 20
      const y = svgHeight / 2 + Math.sin(i * 0.5) * 60
      points.push({ x, y })
    }
    
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    
    return path
  }

  const helixPath = generateHelixPath()

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Svg width={svgWidth} height={svgHeight}>
        <Defs>
          <LinearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            {dna.dominantColors.map((color, i) => (
              <Stop
                key={i}
                offset={`${(i / Math.max(dna.dominantColors.length - 1, 1)) * 100}%`}
                stopColor={color}
                stopOpacity="0.8"
              />
            ))}
          </LinearGradient>
          {dna.segments.map((segment, i) => (
            <LinearGradient key={`grad-${segment.id}`} id={`segGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={segment.color} stopOpacity="1" />
              <Stop offset="100%" stopColor={segment.color} stopOpacity="0.6" />
            </LinearGradient>
          ))}
        </Defs>

        {/* Background helix strands */}
        <Path
          d={helixPath}
          stroke="url(#dnaGrad)"
          strokeWidth={4}
          fill="none"
          opacity={0.3}
        />

        {/* Segments as nodes */}
        <G>
          {dna.segments.map((segment, index) => {
            const totalSegments = dna.segments.length
            const x = ((index + 1) / (totalSegments + 1)) * (svgWidth - 40) + 20
            const y = svgHeight / 2 + Math.sin(index * 0.5) * 60
            
            return (
              <G key={segment.id}>
                {/* Glow effect */}
                <Circle
                  cx={x}
                  cy={y}
                  r={segment.size + 5}
                  fill={segment.color}
                  opacity={0.2}
                />
                {/* Main segment */}
                <Circle
                  cx={x}
                  cy={y}
                  r={segment.size}
                  fill={`url(#segGrad-${index})`}
                />
                {/* Inner highlight */}
                <Circle
                  cx={x - segment.size / 4}
                  cy={y - segment.size / 4}
                  r={segment.size / 3}
                  fill="#ffffff"
                  opacity={0.3}
                />
              </G>
            )
          })}
        </G>

        {/* Connecting lines between segments */}
        {dna.segments.map((segment, index) => {
          if (index === dna.segments.length - 1) return null
          
          const totalSegments = dna.segments.length
          const x1 = ((index + 1) / (totalSegments + 1)) * (svgWidth - 40) + 20
          const y1 = svgHeight / 2 + Math.sin(index * 0.5) * 60
          const x2 = ((index + 2) / (totalSegments + 1)) * (svgWidth - 40) + 20
          const y2 = svgHeight / 2 + Math.sin((index + 1) * 0.5) * 60
          
          return (
            <Path
              key={`line-${segment.id}`}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              stroke={segment.color}
              strokeWidth={2}
              opacity={0.4}
            />
          )
        })}
      </Svg>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  emptyContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
  },
})
