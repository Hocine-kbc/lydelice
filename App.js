import React, { useState, useEffect, useMemo } from 'react';
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
        `${res.addedCount} ingrédient(s) ont été ajoutés à votre liste de courses !`,
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

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      // Tab check for favorites
      if (currentTab === 'favorites' && !r.isFavorite) {
        return false;
      }

      // Category check
      if (selectedCategory !== 'all' && r.category !== selectedCategory) {
        return false;
      }

      // Search query check
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

        {/* TOP BAR */}
        <View style={styles.topHeader}>
          <View style={styles.brandingRow}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="chef-hat" size={24} color={COLORS.textLight} />
            </View>
            <View>
              <Text style={styles.brandTitle}>LyDélice</Text>
              <Text style={styles.brandSubtitle}>Mon carnet de recettes gourmandes</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.newRecipeBtn}
            onPress={() => {
              setRecipeToEdit(null);
              setIsFormVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={COLORS.textLight} />
            <Text style={styles.newRecipeBtnText}>Recette</Text>
          </TouchableOpacity>
        </View>

        {/* MAIN BODY PER TAB */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement de vos délices...</Text>
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
                <Ionicons name="search" size={18} color={COLORS.textSecondary} />
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
                    <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Pills */}
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
                  <MaterialCommunityIcons
                    name={
                      currentTab === 'favorites'
                        ? 'heart-broken-outline'
                        : 'book-open-page-variant'
                    }
                    size={64}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.emptyTitle}>
                    {currentTab === 'favorites'
                      ? 'Aucun favori pour le moment'
                      : 'Aucune recette trouvée'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {currentTab === 'favorites'
                      ? 'Touchez le petit cœur sur vos recettes préférées pour les retrouver facilement ici !'
                      : 'Créez votre première recette en touchant le bouton "+ Recette" en haut.'}
                  </Text>
                  {currentTab !== 'favorites' && (
                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={() => {
                        setRecipeToEdit(null);
                        setIsFormVisible(true);
                      }}
                    >
                      <Ionicons name="add-circle-outline" size={20} color={COLORS.textLight} />
                      <Text style={styles.emptyAddBtnText}>Ajouter ma première recette</Text>
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

        {/* BOTTOM TAB BAR */}
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'recipes' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('recipes')}
          >
            <Ionicons
              name={currentTab === 'recipes' ? 'restaurant' : 'restaurant-outline'}
              size={22}
              color={currentTab === 'recipes' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                currentTab === 'recipes' && styles.tabLabelActive,
              ]}
            >
              Recettes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'favorites' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('favorites')}
          >
            <View>
              <Ionicons
                name={currentTab === 'favorites' ? 'heart' : 'heart-outline'}
                size={22}
                color={currentTab === 'favorites' ? COLORS.danger : COLORS.textSecondary}
              />
              {favoritesCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{favoritesCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                currentTab === 'favorites' && styles.tabLabelActive,
              ]}
            >
              Favoris
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'timer' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('timer')}
          >
            <Ionicons
              name={currentTab === 'timer' ? 'timer' : 'timer-outline'}
              size={22}
              color={currentTab === 'timer' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                currentTab === 'timer' && styles.tabLabelActive,
              ]}
            >
              Minuteur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, currentTab === 'shopping' && styles.tabButtonActive]}
            onPress={() => setCurrentTab('shopping')}
          >
            <View>
              <Ionicons
                name={currentTab === 'shopping' ? 'cart' : 'cart-outline'}
                size={22}
                color={currentTab === 'shopping' ? COLORS.primary : COLORS.textSecondary}
              />
              {shoppingList.length > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: COLORS.secondary }]}>
                  <Text style={styles.tabBadgeText}>{shoppingList.length}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                currentTab === 'shopping' && styles.tabLabelActive,
              ]}
            >
              Courses
            </Text>
          </TouchableOpacity>
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
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  newRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 4,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  newRecipeBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
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
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
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
    paddingHorizontal: 18,
    borderRadius: 14,
    gap: 8,
  },
  emptyAddBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    position: 'relative',
  },
  tabButtonActive: {},
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
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
    fontWeight: '700',
  },
});
