import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import StarRating from './StarRating';

export default function RecipeCard({ recipe, onPress, onToggleFavorite }) {
  const cardScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.97,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = (e) => {
    e.stopPropagation();

    // Heart bounce animation
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite(recipe.id);
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.92}
      >
        {/* Photo Container */}
        <View style={styles.imageContainer}>
          {recipe.photo ? (
            <Image source={{ uri: recipe.photo }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialCommunityIcons name="chef-hat" size={48} color={COLORS.mint} />
            </View>
          )}

          {/* Category Badge - Glassmorphism style */}
          {recipe.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{recipe.category}</Text>
            </View>
          )}

          {/* Animated Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleFavoritePress}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={recipe.isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={recipe.isFavorite ? COLORS.danger : COLORS.primaryMedium}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Info Container */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>

          {/* Rating Row with animated stars */}
          <View style={styles.ratingRow}>
            <StarRating rating={recipe.rating || 0} size={16} showValue />
            <Text style={styles.reviewsCount}>
              ({(recipe.reviews && recipe.reviews.length) || 0} avis)
            </Text>
          </View>

          {/* Meta badges row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="timer-outline" size={15} color={COLORS.primaryMedium} />
              <Text style={styles.metaText}>{totalTime > 0 ? `${totalTime} min` : 'Rapide'}</Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={15} color={COLORS.primaryMedium} />
              <Text style={styles.metaText}>{recipe.servings || 4} pers.</Text>
            </View>

            <View style={styles.metaDivider} />

            <View
              style={[
                styles.difficultyBadge,
                recipe.difficulty === 'Difficile'
                  ? styles.diffDifficile
                  : recipe.difficulty === 'Moyen'
                  ? styles.diffMoyen
                  : styles.diffFacile,
              ]}
            >
              <MaterialCommunityIcons
                name="chef-hat"
                size={13}
                color={
                  recipe.difficulty === 'Difficile'
                    ? COLORS.danger
                    : recipe.difficulty === 'Moyen'
                    ? COLORS.warning
                    : COLORS.primaryMedium
                }
              />
              <Text
                style={[
                  styles.difficultyText,
                  {
                    color:
                      recipe.difficulty === 'Difficile'
                        ? COLORS.danger
                        : recipe.difficulty === 'Moyen'
                        ? COLORS.warning
                        : COLORS.primaryMedium,
                  },
                ]}
              >
                {recipe.difficulty || 'Facile'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    backgroundColor: COLORS.surfaceVariant,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(27, 67, 50, 0.88)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryText: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  diffFacile: {
    backgroundColor: COLORS.primaryLight,
  },
  diffMoyen: {
    backgroundColor: '#FEF3C7',
  },
  diffDifficile: {
    backgroundColor: COLORS.dangerLight,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
