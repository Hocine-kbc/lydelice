import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from './src/constants/theme';
import { StorageService } from './src/services/storage';
import CategoryPills from './src/components/CategoryPills';
import RecipeCard from './src/components/RecipeCard';
import RecipeDetailModal from './src/components/RecipeDetailModal';
import RecipeFormModal from './src/components/RecipeFormModal';
import CookingTimer from './src/components/CookingTimer';
import ShoppingListTab from './src/components/ShoppingListTab';

function AnimatedTabButton({ active, label, iconFilled, iconOutline, badgeCount, badgeColor, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}>
        <View style={active ? styles.activeTabIconPill : null}>
          <Ionicons
            name={active ? iconFilled : iconOutline}
            size={22}
            color={active ? COLORS.primary : COLORS.textMuted}
          />
          {badgeCount > 0 && (
            <View
              style={[
                styles.tabBadge,
                badgeColor ? { backgroundColor: badgeColor } : null,
              ]}
            >
              <Text style={styles.tabBadgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState('recipes'); // 'recipes' | 'favorites' | 'timer' | 'shopping'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);

  // Timer preloading
  const [timerInitialMinutes, setTimerInitialMinutes] = useState(0);

  // Add Button Animation
  const addBtnScale = useRef(new Animated.Value(1)).current;

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const loadedRecipes = await StorageService.getRecipes();
    const loadedShopping = await StorageService.getShoppingList();
    setRecipes(loadedRecipes);
    setShoppingList(loadedShopping);
    setLoading(false);
  };

  // Recipe Operations
  const handleSaveRecipe = async (recipeData) => {
    if (recipeToEdit) {
      const res = await StorageService.updateRecipe(recipeData);
      if (res.success) {
        setRecipes(res.recipes);
        if (selectedRecipe && selectedRecipe.id === recipeData.id) {
          setSelectedRecipe(recipeData);
        }
      }
    } else {
      const res = await StorageService.addRecipe(recipeData);
      if (res.success) {
        setRecipes(res.recipes);
      }
    }
    setRecipeToEdit(null);
    setIsFormVisible(false);
  };

  const handleDeleteRecipe = async (id) => {
    const res = await StorageService.deleteRecipe(id);
    if (res.success) {
      setRecipes(res.recipes);
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe(null);
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    const res = await StorageService.toggleFavorite(id);
    if (res.success) {
      setRecipes(res.recipes);
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
      }
    }
  };

  const handleAddReview = async (id, reviewData) => {
    const res = await StorageService.addReview(id, reviewData);
    if (res.success) {
      setRecipes(res.recipes);
      const updated = res.recipes.find((r) => r.id === id);
      if (updated) setSelectedRecipe(updated);
    }
  };

  // Shopping List Operations
  const handleToggleShoppingItem = async (id) => {
    const updated = shoppingList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updated);
    await StorageService.saveShoppingList(updated);
  };

  const handleDeleteShoppingItem = async (id) => {
    const updated = shoppingList.filter((item) => item.id !== id);
    setShoppingList(updated);
    await StorageService.saveShoppingList(updated);
  };

  const handleAddShoppingItem = async (item) => {
    const newItem = {
      id: `shop_${Date.now()}`,
      name: item.name,
      amount: item.amount,
      checked: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...shoppingList];
    setShoppingList(updated);
    await StorageService.saveShoppingList(updated);
  };

  const handleAddAllToShoppingList = async (recipeTitle, ingredients) => {
    const res = await StorageService.addIngredientsToShoppingList(recipeTitle, ingredients);
    if (res.success) {
      setShoppingList(res.items);
      Alert.alert(
        '🛒 Ingrédients ajoutés',
        `${res.addedCount} ingrédient(s) ajoutés à votre panier !`,
        [
          { text: 'Continuer' },
          {
            text: 'Voir ma liste',
            onPress: () => {
              setSelectedRecipe(null);
              setCurrentTab('shopping');
            },
          },
        ]
      );
    }
  };

  const handleClearCheckedShoppingItems = async () => {
    const updated = shoppingList.filter((item) => !item.checked);
    setShoppingList(updated);
    await StorageService.saveShoppingList(updated);
  };

  const handleOpenAddForm = () => {
    Animated.sequence([
      Animated.timing(addBtnScale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(addBtnScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setRecipeToEdit(null);
    setIsFormVisible(true);
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (currentTab === 'favorites' && !r.isFavorite) {
        return false;
      }
      if (selectedCategory !== 'all' && r.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title && r.title.toLowerCase().includes(query);
        const matchesCategory = r.category && r.category.toLowerCase().includes(query);
        const matchesIngredient =
          r.ingredients &&
          r.ingredients.some(
            (ing) => ing.name && ing.name.toLowerCase().includes(query)
          );
        return matchesTitle || matchesCategory || matchesIngredient;
      }
      return true;
    });
  }, [recipes, currentTab, selectedCategory, searchQuery]);

  const favoritesCount = recipes.filter((r) => r.isFavorite).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* TOP BAR - Vert Sapin Gourmet */}
        <View style={styles.topHeader}>
          <View style={styles.brandingRow}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="leaf" size={20} color={COLORS.mint} />
            </View>
            <View>
              <Text style={styles.brandTitle}>LyDélice</Text>
              <Text style={styles.brandSubtitle}>Cuisine saine & gourmande</Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: addBtnScale }] }}>
            <TouchableOpacity
              style={styles.newRecipeBtn}
              onPress={handleOpenAddForm}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={20} color={COLORS.textLight} />
              <Text style={styles.newRecipeBtnText}>Recette</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* MAIN BODY PER TAB */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Préparation de vos recettes...</Text>
          </View>
        ) : currentTab === 'timer' ? (
          <View style={styles.flexOne}>
            <CookingTimer
              initialMinutes={timerInitialMinutes}
              onTimerDone={() => setTimerInitialMinutes(0)}
            />
          </View>
        ) : currentTab === 'shopping' ? (
          <View style={styles.flexOne}>
            <ShoppingListTab
              shoppingList={shoppingList}
              onToggleItem={handleToggleShoppingItem}
              onDeleteItem={handleDeleteShoppingItem}
              onAddItem={handleAddShoppingItem}
              onClearChecked={handleClearCheckedShoppingItems}
            />
          </View>
        ) : (
          <View style={styles.flexOne}>
            {/* Search Input */}
            <View style={styles.searchWrapper}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={19} color={COLORS.primaryMedium} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher une recette, un ingrédient..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Pills with animated touches */}
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Recipe List */}
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.recipeListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconBadge}>
                    <MaterialCommunityIcons
                      name={
                        currentTab === 'favorites'
                          ? 'heart-outline'
                          : 'book-open-variant'
                      }
                      size={54}
                      color={COLORS.primaryMedium}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {currentTab === 'favorites'
                      ? 'Aucun favori pour le moment'
                      : 'Aucune recette trouvée'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {currentTab === 'favorites'
                      ? 'Appuyez sur le petit cœur pour épingler vos recettes préférées !'
                      : 'Créez votre première recette en appuyant sur "+ Recette" en haut.'}
                  </Text>
                  {currentTab !== 'favorites' && (
                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={handleOpenAddForm}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="add-circle" size={20} color={COLORS.textLight} />
                      <Text style={styles.emptyAddBtnText}>Créer une recette</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => setSelectedRecipe(item)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            />
          </View>
        )}

        {/* ANIMATED BOTTOM TAB BAR */}
        <View style={styles.bottomTabBar}>
          <AnimatedTabButton
            active={currentTab === 'recipes'}
            label="Recettes"
            iconFilled="restaurant"
            iconOutline="restaurant-outline"
            onPress={() => setCurrentTab('recipes')}
          />

          <AnimatedTabButton
            active={currentTab === 'favorites'}
            label="Favoris"
            iconFilled="heart"
            iconOutline="heart-outline"
            badgeCount={favoritesCount}
            badgeColor={COLORS.danger}
            onPress={() => setCurrentTab('favorites')}
          />

          <AnimatedTabButton
            active={currentTab === 'timer'}
            label="Minuteur"
            iconFilled="timer"
            iconOutline="timer-outline"
            onPress={() => setCurrentTab('timer')}
          />

          <AnimatedTabButton
            active={currentTab === 'shopping'}
            label="Courses"
            iconFilled="cart"
            iconOutline="cart-outline"
            badgeCount={shoppingList.length}
            badgeColor={COLORS.mint}
            onPress={() => setCurrentTab('shopping')}
          />
        </View>

        {/* MODALS */}
        {selectedRecipe && (
          <RecipeDetailModal
            visible={!!selectedRecipe}
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={(rec) => {
              setRecipeToEdit(rec);
              setIsFormVisible(true);
            }}
            onDelete={handleDeleteRecipe}
            onToggleFavorite={handleToggleFavorite}
            onAddReview={handleAddReview}
            onAddAllToShoppingList={handleAddAllToShoppingList}
            onOpenTimerWithTime={(cookTime) => {
              setTimerInitialMinutes(cookTime);
              setCurrentTab('timer');
            }}
          />
        )}

        <RecipeFormModal
          visible={isFormVisible}
          recipeToEdit={recipeToEdit}
          onClose={() => {
            setIsFormVisible(false);
            setRecipeToEdit(null);
          }}
          onSave={handleSaveRecipe}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flexOne: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.primaryMedium,
    fontWeight: '600',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: -0.6,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.primaryMedium,
    fontWeight: '500',
  },
  newRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 16,
    gap: 4,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  newRecipeBtnText: {
    color: COLORS.textLight,
    fontWeight: '800',
    fontSize: 13,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  recipeListContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 32,
  },
  emptyIconBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
  },
  emptyAddBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIconPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '800',
  },
});
