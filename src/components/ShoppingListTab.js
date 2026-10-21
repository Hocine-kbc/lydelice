import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function ShoppingListTab({
  shoppingList = [],
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearChecked,
}) {
  const [newItemText, setNewItemText] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const handleAdd = () => {
    if (!newItemText.trim()) return;
    onAddItem({
      name: newItemText.trim(),
      amount: newItemAmount.trim(),
    });
    setNewItemText('');
    setNewItemAmount('');
  };

  const checkedCount = shoppingList.filter((item) => item.checked).length;

  return (
    <View style={styles.container}>
      {/* Input row */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Ajouter un article (ex: Lait d'avoine, Poireaux...)"
            placeholderTextColor={COLORS.textMuted}
            value={newItemText}
            onChangeText={setNewItemText}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Quantité"
            placeholderTextColor={COLORS.textMuted}
            value={newItemAmount}
            onChangeText={setNewItemAmount}
          />
          <TouchableOpacity
            style={[styles.addBtn, !newItemText.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!newItemText.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Header with stats and clear button */}
      {shoppingList.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statsRow}>
            <Ionicons name="cart" size={16} color={COLORS.primary} />
            <Text style={styles.statsText}>
              {shoppingList.length} ingrédient(s) • {checkedCount} acheté(s)
            </Text>
          </View>
          {checkedCount > 0 && (
            <TouchableOpacity onPress={onClearChecked} activeOpacity={0.7}>
              <Text style={styles.clearText}>Vider cochés</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* List */}
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBadge}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={54}
                color={COLORS.primaryMedium}
              />
            </View>
            <Text style={styles.emptyTitle}>Votre liste de courses est vide</Text>
            <Text style={styles.emptySub}>
              Ajoutez les ingrédients de n’importe quelle recette en un clic grâce au bouton « Ajouter à ma liste » !
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemCard, item.checked && styles.itemCardChecked]}>
            <TouchableOpacity
              style={styles.checkboxTouch}
              onPress={() => onToggleItem(item.id)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.checked ? COLORS.mint : COLORS.textMuted}
              />
              <View style={styles.itemTextContainer}>
                <Text
                  style={[
                    styles.itemName,
                    item.checked && styles.itemNameChecked,
                  ]}
                >
                  {item.name}
                </Text>
                {item.amount ? (
                  <Text style={styles.itemAmount}>{item.amount}</Text>
                ) : null}
                {item.recipeTitle && (
                  <Text style={styles.itemRecipe}>
                    Pour : {item.recipeTitle}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteTouch}
              onPress={() => onDeleteItem(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    fontSize: 14,
    color: COLORS.text,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.danger,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  itemCardChecked: {
    backgroundColor: '#F9FCFA',
    opacity: 0.65,
  },
  checkboxTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  itemAmount: {
    fontSize: 12,
    color: COLORS.primaryMedium,
    fontWeight: '700',
    marginTop: 2,
  },
  itemRecipe: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  deleteTouch: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 28,
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
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
