import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_RECIPES } from '../constants/initialRecipes';

const RECIPES_STORAGE_KEY = '@lydelice_recipes_v1';
const SHOPPING_STORAGE_KEY = '@lydelice_shopping_v1';

export const StorageService = {
  // --- RECIPES ---
  async getRecipes() {
    try {
      const data = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Initialize with default recipes if first time or empty
      await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(INITIAL_RECIPES));
      return INITIAL_RECIPES;
    } catch (e) {
      console.error('Error reading recipes from storage:', e);
      return INITIAL_RECIPES;
    }
  },

  async saveRecipes(recipes) {
    try {
      await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
      return true;
    } catch (e) {
      console.error('Error saving recipes:', e);
      return false;
    }
  },

  async addRecipe(recipe) {
    try {
      const recipes = await this.getRecipes();
      const newRecipe = {
        ...recipe,
        id: recipe.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        createdAt: recipe.createdAt || new Date().toISOString(),
        isFavorite: recipe.isFavorite || false,
        reviews: recipe.reviews || [],
      };
      const updated = [newRecipe, ...recipes];
      await this.saveRecipes(updated);
      return { success: true, recipe: newRecipe, recipes: updated };
    } catch (e) {
      console.error('Error adding recipe:', e);
      return { success: false, error: e };
    }
  },

  async updateRecipe(updatedRecipe) {
    try {
      const recipes = await this.getRecipes();
      const updated = recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
      await this.saveRecipes(updated);
      return { success: true, recipes: updated };
    } catch (e) {
      console.error('Error updating recipe:', e);
      return { success: false, error: e };
    }
  },

  async deleteRecipe(id) {
    try {
      const recipes = await this.getRecipes();
      const updated = recipes.filter((r) => r.id !== id);
      await this.saveRecipes(updated);
      return { success: true, recipes: updated };
    } catch (e) {
      console.error('Error deleting recipe:', e);
      return { success: false, error: e };
    }
  },

  async toggleFavorite(id) {
    try {
      const recipes = await this.getRecipes();
      const updated = recipes.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      );
      await this.saveRecipes(updated);
      return { success: true, recipes: updated };
    } catch (e) {
      console.error('Error toggling favorite:', e);
      return { success: false, error: e };
    }
  },

  async addReview(recipeId, { rating, comment }) {
    try {
      const recipes = await this.getRecipes();
      const updated = recipes.map((r) => {
        if (r.id !== recipeId) return r;
        const newReview = {
          id: `rev_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          rating: Number(rating),
          comment: (comment || '').trim(),
        };
        const allReviews = [newReview, ...(r.reviews || [])];
        // Calculate average rating
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = Math.round((sum / allReviews.length) * 10) / 10;
        return {
          ...r,
          rating: avgRating,
          reviews: allReviews,
        };
      });
      await this.saveRecipes(updated);
      return { success: true, recipes: updated };
    } catch (e) {
      console.error('Error adding review:', e);
      return { success: false, error: e };
    }
  },

  // --- SHOPPING LIST ---
  async getShoppingList() {
    try {
      const data = await AsyncStorage.getItem(SHOPPING_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading shopping list:', e);
      return [];
    }
  },

  async saveShoppingList(items) {
    try {
      await AsyncStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (e) {
      console.error('Error saving shopping list:', e);
      return false;
    }
  },

  async addIngredientsToShoppingList(recipeTitle, ingredients) {
    try {
      const current = await this.getShoppingList();
      const newItems = ingredients.map((ing) => ({
        id: `shop_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: ing.name,
        amount: ing.amount ? `${ing.amount} ${ing.unit || ''}`.trim() : ing.unit || '',
        recipeTitle: recipeTitle,
        checked: false,
        createdAt: new Date().toISOString(),
      }));
      const updated = [...newItems, ...current];
      await this.saveShoppingList(updated);
      return { success: true, items: updated, addedCount: newItems.length };
    } catch (e) {
      console.error('Error adding to shopping list:', e);
      return { success: false, error: e };
    }
  },
};
