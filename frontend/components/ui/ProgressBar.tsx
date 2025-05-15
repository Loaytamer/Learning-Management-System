import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 100
  width?: number;
  height?: number;
  showLabel?: boolean;
  backgroundColor?: string;
  progressColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 250,
  height = 8,
  showLabel = true,
  backgroundColor = '#374151',
  progressColor = '#6200EE',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const animatedWidth = useAnimatedStyle(() => {
    return {
      width: withTiming(`${clampedProgress}%`, { duration: 1000 }),
    };
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>{`${Math.round(clampedProgress)}% Complete`}</Text>
      )}
      <View
        style={[
          styles.background,
          {
            width,
            height,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              height,
              backgroundColor: progressColor,
            },
            animatedWidth,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 12,
    marginBottom: 4,
  },
  background: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;