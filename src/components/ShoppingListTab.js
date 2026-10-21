import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
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
            placeholder="Ajouter un article (ex: Lait, Pain...)"
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
          >
            <Ionicons name="add" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Header with stats and clear button */}
      {shoppingList.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {shoppingList.length} article(s) • {checkedCount} acheté(s)
          </Text>
          {checkedCount > 0 && (
            <TouchableOpacity onPress={onClearChecked}>
              <Text style={styles.clearText}>Supprimer cochés</Text>
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
            <MaterialCommunityIcons
              name="cart-outline"
              size={64}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyTitle}>Votre liste de courses est vide</Text>
            <Text style={styles.emptySub}>
              Ajoutez des ingrédients directement depuis n’importe quelle recette en un clic, ou saisissez vos articles ci-dessus !
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemCard, item.checked && styles.itemCardChecked]}>
            <TouchableOpacity
              style={styles.checkboxTouch}
              onPress={() => onToggleItem(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.checked ? 'checkbox' : 'square-outline'}
                size={22}
                color={item.checked ? COLORS.success : COLORS.textSecondary}
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
                    Recette : {item.recipeTitle}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteTouch}
              onPress={() => onDeleteItem(item.id)}
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
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceVariant,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
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
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  itemCardChecked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
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
    fontWeight: '600',
    color: COLORS.text,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  itemAmount: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '500',
    marginTop: 2,
  },
  itemRecipe: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  deleteTouch: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
