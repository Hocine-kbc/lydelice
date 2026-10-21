import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CATEGORIES, COLORS } from '../constants/theme';

function AnimatedPill({ cat, isSelected, onSelect }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.pill, isSelected && styles.pillSelected]}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
      >
        <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
          <MaterialCommunityIcons
            name={cat.icon}
            size={14}
            color={isSelected ? COLORS.primary : COLORS.primaryMedium}
          />
        </View>
        <Text style={[styles.label, isSelected && styles.labelSelected]}>
          {cat.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <AnimatedPill
              key={cat.id}
              cat={cat}
              isSelected={isSelected}
              onSelect={() => onSelectCategory(cat.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconCircleSelected: {
    backgroundColor: COLORS.surface,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  labelSelected: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
});
