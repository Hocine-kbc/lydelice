import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

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

    const iconName = isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline';
    const iconColor = isFilled || isHalf ? COLORS.star : COLORS.starEmpty;

    const StarComponent = interactive ? TouchableOpacity : View;

    stars.push(
      <StarComponent
        key={i}
        activeOpacity={0.7}
        onPress={() => interactive && onRatingChange && onRatingChange(i)}
        style={styles.starWrapper}
      >
        <Ionicons name={iconName} size={size} color={iconColor} />
      </StarComponent>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {showValue && (
        <Text style={[styles.ratingText, { fontSize: size * 0.75 }]}>
          {Number(rating).toFixed(1)}
        </Text>
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
    paddingHorizontal: 1,
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: '700',
    color: COLORS.text,
  },
});
