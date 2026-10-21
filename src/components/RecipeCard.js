import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import StarRating from './StarRating';

export default function RecipeCard({ recipe, onPress, onToggleFavorite }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Photo Container */}
      <View style={styles.imageContainer}>
        {recipe.photo ? (
          <Image source={{ uri: recipe.photo }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={44} color={COLORS.accent} />
          </View>
        )}

        {/* Category Badge */}
        {recipe.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={recipe.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={recipe.isFavorite ? COLORS.danger : COLORS.text}
          />
        </TouchableOpacity>
      </View>

      {/* Info Container */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <StarRating rating={recipe.rating || 0} size={15} showValue />
          <Text style={styles.reviewsCount}>
            ({(recipe.reviews && recipe.reviews.length) || 0})
          </Text>
        </View>

        {/* Meta badges row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{totalTime > 0 ? `${totalTime} min` : '-'}</Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{recipe.servings || 4} pers.</Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={14}
              color={
                recipe.difficulty === 'Difficile'
                  ? COLORS.danger
                  : recipe.difficulty === 'Moyen'
                  ? COLORS.warning
                  : COLORS.success
              }
            />
            <Text
              style={[
                styles.metaText,
                {
                  color:
                    recipe.difficulty === 'Difficile'
                      ? COLORS.danger
                      : recipe.difficulty === 'Moyen'
                      ? COLORS.warning
                      : COLORS.success,
                  fontWeight: '600',
                },
              ]}
            >
              {recipe.difficulty || 'Facile'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 180,
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
    top: 12,
    left: 12,
    backgroundColor: 'rgba(28, 25, 23, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
