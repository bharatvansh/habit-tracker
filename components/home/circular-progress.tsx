import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  color: string;
  text: string;
}

const { width } = Dimensions.get('window');
const size = Math.min(width * 0.2, 72);
const strokeWidth = 6;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;
const strokeDashoffset = circumference - (circumference * percentage) / 100;

export default function CircularProgress({ percentage, color, text }: CircularProgressProps) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke="#333333"
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
          origin={size / 2}
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
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});