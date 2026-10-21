import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

function AnimatedStar({ isFilled, isHalf, size, interactive, onPress, index }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (!interactive) return;

    // Bouncy spring animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress();
  };

  const iconName = isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline';
  const iconColor = isFilled || isHalf ? COLORS.star : COLORS.starEmpty;

  return (
    <TouchableOpacity
      activeOpacity={interactive ? 0.7 : 1}
      onPress={interactive ? handlePress : undefined}
      style={styles.starWrapper}
      disabled={!interactive}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name={iconName} size={size} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 18,
  onRatingChange,
  showValue = false,
  interactive = false,
}) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = rating >= i;
    const isHalf = !isFilled && rating >= i - 0.5;

    stars.push(
      <AnimatedStar
        key={i}
        index={i}
        isFilled={isFilled}
        isHalf={isHalf}
        size={size}
        interactive={interactive}
        onPress={() => onRatingChange && onRatingChange(i)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {showValue && (
        <View style={styles.badgeValue}>
          <Text style={[styles.ratingText, { fontSize: size * 0.75 }]}>
            {Number(rating).toFixed(1)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  badgeValue: {
    marginLeft: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontWeight: '800',
    color: COLORS.primaryMedium,
  },
});
