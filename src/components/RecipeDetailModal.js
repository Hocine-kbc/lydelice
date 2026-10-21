import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import StarRating from './StarRating';

export default function RecipeDetailModal({
  visible,
  recipe,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddReview,
  onAddAllToShoppingList,
  onOpenTimerWithTime,
}) {
  if (!recipe) return null;

  const baseServings = recipe.servings || 4;
  const [servings, setServings] = useState(baseServings);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  // Animations
  const servingsScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Sync servings when recipe changes
  React.useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 4);
      setCheckedIngredients({});
      setCheckedSteps({});
      setNewComment('');
      setNewRating(5);
    }
  }, [recipe]);

  const scaleRatio = servings / baseServings;

  const formatScaledAmount = (amount) => {
    if (!amount || isNaN(amount)) return amount;
    const scaled = amount * scaleRatio;
    return scaled % 1 === 0 ? scaled : scaled.toFixed(1);
  };

  const handleAdjustServings = (delta) => {
    const next = Math.max(1, servings + delta);
    setServings(next);

    // Spring animation on portions counter
    Animated.sequence([
      Animated.timing(servingsScale, {
        toValue: 1.35,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(servingsScale, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.45,
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

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepCheck = (idx) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSaveReview = () => {
    if (!newRating) return;
    onAddReview(recipe.id, {
      rating: newRating,
      comment: newComment,
    });
    setNewComment('');
    Alert.alert('⭐ Merci !', 'Votre note et avis ont bien été enregistrés.');
  };

  const confirmDelete = () => {
    Alert.alert(
      'Supprimer la recette',
      `Êtes-vous sûr de vouloir supprimer "${recipe.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            onDelete(recipe.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            {recipe.photo ? (
              <Image source={{ uri: recipe.photo }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <View style={styles.heroPlaceholder}>
                <MaterialCommunityIcons name="chef-hat" size={80} color={COLORS.mint} />
              </View>
            )}

            {/* Top Bar Actions */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.iconCircle} onPress={onClose} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={22} color={COLORS.primaryDark} />
              </TouchableOpacity>

              <View style={styles.topRightActions}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={handleFavoritePress}
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <Ionicons
                      name={recipe.isFavorite ? 'heart' : 'heart-outline'}
                      size={22}
                      color={recipe.isFavorite ? COLORS.danger : COLORS.primaryDark}
                    />
                  </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => {
                    onClose();
                    onEdit(recipe);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil" size={19} color={COLORS.primaryDark} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={confirmDelete}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={19} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.detailsCard}>
            {/* Category & Rating */}
            <View style={styles.badgeRow}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{recipe.category || 'Recette'}</Text>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color={COLORS.star} />
                <Text style={styles.ratingBadgeText}>{Number(recipe.rating || 0).toFixed(1)} / 5</Text>
                <Text style={styles.ratingCountText}>({(recipe.reviews && recipe.reviews.length) || 0})</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{recipe.title}</Text>

            {/* Meta stats bar */}
            <View style={styles.statsCard}>
              <View style={styles.statCol}>
                <Ionicons name="hourglass-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statLabel}>Préparation</Text>
                <Text style={styles.statValue}>{recipe.prepTime || 0} min</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <Ionicons name="flame-outline" size={20} color={COLORS.accent} />
                <Text style={styles.statLabel}>Cuisson</Text>
                <Text style={styles.statValue}>{recipe.cookTime || 0} min</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statCol}>
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={20}
                  color={
                    recipe.difficulty === 'Difficile'
                      ? COLORS.danger
                      : recipe.difficulty === 'Moyen'
                      ? COLORS.warning
                      : COLORS.primaryMedium
                  }
                />
                <Text style={styles.statLabel}>Difficulté</Text>
                <Text
                  style={[
                    styles.statValue,
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

            {/* Quick Timer Launcher Button if cookTime > 0 */}
            {recipe.cookTime > 0 && (
              <TouchableOpacity
                style={styles.timerLauncherBtn}
                onPress={() => {
                  onClose();
                  onOpenTimerWithTime(recipe.cookTime);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="timer" size={20} color={COLORS.textLight} />
                <Text style={styles.timerLauncherText}>
                  Lancer le minuteur de cuisson ({recipe.cookTime} min)
                </Text>
              </TouchableOpacity>
            )}

            {/* Servings calculator with animated numbers */}
            <View style={styles.servingsRow}>
              <View>
                <Text style={styles.sectionHeading}>Ingrédients</Text>
                <Text style={styles.subHeading}>Quantités ajustées pour {servings} personne(s)</Text>
              </View>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={[styles.stepperBtn, servings <= 1 && styles.stepperDisabled]}
                  disabled={servings <= 1}
                  onPress={() => handleAdjustServings(-1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={18} color={COLORS.primaryDark} />
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: servingsScale }] }}>
                  <Text style={styles.stepperVal}>{servings}</Text>
                </Animated.View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => handleAdjustServings(1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={18} color={COLORS.primaryDark} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Add to Shopping List Button */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => {
                  const scaledIngredients = recipe.ingredients.map((ing) => ({
                    ...ing,
                    amount: formatScaledAmount(ing.amount),
                  }));
                  onAddAllToShoppingList(recipe.title, scaledIngredients);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="cart-outline" size={19} color={COLORS.primary} />
                <Text style={styles.addToCartText}>
                  Ajouter à ma liste de courses ({recipe.ingredients.length})
                </Text>
              </TouchableOpacity>
            )}

            {/* Ingredients Checklist */}
            <View style={styles.ingredientsList}>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const scaledAmount = formatScaledAmount(ing.amount);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.ingredientItem, isChecked && styles.ingredientChecked]}
                      onPress={() => toggleIngredientCheck(idx)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                        size={22}
                        color={isChecked ? COLORS.mint : COLORS.textMuted}
                      />
                      <Text
                        style={[
                          styles.ingredientName,
                          isChecked && styles.ingredientNameChecked,
                        ]}
                      >
                        {ing.name}
                      </Text>
                      {(scaledAmount || ing.unit) && (
                        <View style={styles.ingredientBadge}>
                          <Text style={styles.ingredientBadgeText}>
                            {scaledAmount} {ing.unit || ''}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyNotice}>Aucun ingrédient spécifié.</Text>
              )}
            </View>

            {/* Steps / Instructions */}
            <Text style={[styles.sectionHeading, { marginTop: 26 }]}>Étapes de Préparation</Text>
            <View style={styles.stepsList}>
              {recipe.steps && recipe.steps.length > 0 ? (
                recipe.steps.map((step, idx) => {
                  const isChecked = !!checkedSteps[idx];
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.stepItem, isChecked && styles.stepItemChecked]}
                      onPress={() => toggleStepCheck(idx)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.stepNumberCircle, isChecked && styles.stepNumberChecked]}>
                        {isChecked ? (
                          <Ionicons name="checkmark" size={15} color={COLORS.textLight} />
                        ) : (
                          <Text style={styles.stepNumberText}>{idx + 1}</Text>
                        )}
                      </View>
                      <Text style={[styles.stepText, isChecked && styles.stepTextChecked]}>
                        {step}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyNotice}>Aucune étape enregistrée.</Text>
              )}
            </View>

            {/* Chef Notes & Astuces */}
            {recipe.notes ? (
              <View style={styles.notesBox}>
                <View style={styles.notesHeader}>
                  <Ionicons name="leaf" size={18} color={COLORS.primary} />
                  <Text style={styles.notesTitle}>Le Secret du Chef</Text>
                </View>
                <Text style={styles.notesContent}>{recipe.notes}</Text>
              </View>
            ) : null}

            {/* RATING & REVIEWS SECTION */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionHeading}>Noter & Commenter ce plat</Text>
              <Text style={styles.subHeading}>
                Donnez votre note et vos impressions pour perfectionner la recette
              </Text>

              <View style={styles.ratingInputRow}>
                <StarRating
                  rating={newRating}
                  size={34}
                  interactive={true}
                  onRatingChange={(r) => setNewRating(r)}
                />
                <Text style={styles.ratingPreviewNumber}>{newRating} / 5</Text>
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Votre avis (ex: Délicieux, parfait avec 5 min de cuisson en moins...)"
                placeholderTextColor={COLORS.textMuted}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.submitRatingBtn}
                onPress={handleSaveReview}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={20} color={COLORS.textLight} />
                <Text style={styles.submitRatingBtnText}>Enregistrer ma note</Text>
              </TouchableOpacity>

              {/* Previous reviews list */}
              {recipe.reviews && recipe.reviews.length > 0 && (
                <View style={styles.previousReviewsContainer}>
                  <Text style={styles.previousReviewsTitle}>
                    Historique des dégustations ({recipe.reviews.length})
                  </Text>
                  {recipe.reviews.map((rev) => (
                    <View key={rev.id} style={styles.reviewItem}>
                      <View style={styles.reviewItemHeader}>
                        <StarRating rating={rev.rating} size={15} />
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                      </View>
                      {rev.comment ? (
                        <Text style={styles.reviewComment}>{rev.comment}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    height: 310,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.primaryDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 42,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailsCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingCountText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 32,
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statCol: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  statDivider: {
    width: 1,
    height: '75%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  timerLauncherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginBottom: 22,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  timerLauncherText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
  servingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  subHeading: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperDisabled: {
    opacity: 0.35,
  },
  stepperVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    paddingHorizontal: 16,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.mint,
    gap: 8,
    marginBottom: 14,
  },
  addToCartText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  ingredientsList: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  ingredientChecked: {
    backgroundColor: '#F9FCFA',
    opacity: 0.6,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  ingredientNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  ingredientBadge: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  ingredientBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryMedium,
  },
  stepsList: {
    marginTop: 12,
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 14,
    alignItems: 'flex-start',
  },
  stepItemChecked: {
    backgroundColor: '#F9FCFA',
    opacity: 0.6,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepNumberChecked: {
    backgroundColor: COLORS.mint,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  stepTextChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  notesBox: {
    backgroundColor: '#F3FAF5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C6E8D2',
    marginTop: 22,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  notesContent: {
    fontSize: 13,
    color: COLORS.primaryDark,
    lineHeight: 20,
  },
  ratingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: 24,
  },
  ratingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  ratingPreviewNumber: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.star,
  },
  commentInput: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 75,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitRatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  submitRatingBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
  previousReviewsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 16,
  },
  previousReviewsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  reviewItem: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  emptyNotice: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    padding: 12,
  },
});
