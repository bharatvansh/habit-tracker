import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  color: string;
  text: string;
}

const { width } = Dimensions.get('window');
const size = Math.min(width * 0.25, 110);
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

export default function CircularProgress({
   percentage,
   color,
   text,
 }: CircularProgressProps) {
   const strokeDashoffset = circumference - (circumference * percentage) / 100;
   return (
     <View style={[styles.container, { width: size, height: size }]}>
       <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          fill="#0f0f0f"
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2}
        />
        {/* Background track */}
        <Circle
          stroke="rgba(255, 255, 255, 0.06)"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={color}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});