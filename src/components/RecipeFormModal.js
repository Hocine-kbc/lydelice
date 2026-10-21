import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, CATEGORIES, DIFFICULTIES } from '../constants/theme';
import StarRating from './StarRating';

export default function RecipeFormModal({
  visible,
  recipeToEdit,
  onClose,
  onSave,
}) {
  const isEditing = !!recipeToEdit;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plat');
  const [photo, setPhoto] = useState(null);
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('20');
  const [servings, setServings] = useState('4');
  const [difficulty, setDifficulty] = useState('Facile');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
  ]);
  const [steps, setSteps] = useState(['']);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title || '');
      setCategory(recipeToEdit.category || 'Plat');
      setPhoto(recipeToEdit.photo || null);
      setPrepTime(String(recipeToEdit.prepTime || '0'));
      setCookTime(String(recipeToEdit.cookTime || '0'));
      setServings(String(recipeToEdit.servings || '4'));
      setDifficulty(recipeToEdit.difficulty || 'Facile');
      setRating(recipeToEdit.rating || 5);
      setNotes(recipeToEdit.notes || '');
      setIngredients(
        recipeToEdit.ingredients && recipeToEdit.ingredients.length > 0
          ? recipeToEdit.ingredients.map((ing) => ({
              name: ing.name || '',
              amount: ing.amount !== undefined ? String(ing.amount) : '',
              unit: ing.unit || '',
            }))
          : [{ name: '', amount: '', unit: '' }]
      );
      setSteps(
        recipeToEdit.steps && recipeToEdit.steps.length > 0
          ? [...recipeToEdit.steps]
          : ['']
      );
    } else {
      // Reset defaults for new recipe
      setTitle('');
      setCategory('Plat');
      setPhoto(null);
      setPrepTime('15');
      setCookTime('20');
      setServings('4');
      setDifficulty('Facile');
      setRating(5);
      setNotes('');
      setIngredients([
        { name: 'Farine', amount: '200', unit: 'g' },
        { name: 'Beurre', amount: '50', unit: 'g' },
      ]);
      setSteps(['Préparer les ingrédients', '']);
    }
  }, [recipeToEdit, visible]);

  // Image Picking - Camera
  const handleTakePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission requise',
            "LyDélice a besoin de l'accès à l'appareil photo pour immortaliser votre plat !"
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error:', e);
      Alert.alert('Erreur', "Impossible d'accéder à l'appareil photo sur cet appareil.");
    }
  };

  // Image Picking - Library
  const handlePickFromGallery = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission requise',
            "LyDélice a besoin de l'accès à votre galerie pour choisir une photo."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Gallery error:', e);
      Alert.alert('Erreur', "Impossible d'accéder à la galerie.");
    }
  };

  // Ingredient Handlers
  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    const next = [...ingredients];
    next[index][field] = value;
    setIngredients(next);
  };

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) {
      setIngredients([{ name: '', amount: '', unit: '' }]);
      return;
    }
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Steps Handlers
  const addStepRow = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index, value) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) {
      setSteps(['']);
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir un titre pour votre recette.');
      return;
    }

    const cleanIngredients = ingredients
      .filter((ing) => ing.name && ing.name.trim().length > 0)
      .map((ing, i) => ({
        id: `ing_${Date.now()}_${i}`,
        name: ing.name.trim(),
        amount: ing.amount ? parseFloat(ing.amount) || ing.amount : '',
        unit: (ing.unit || '').trim(),
      }));

    const cleanSteps = steps
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const recipeData = {
      ...(recipeToEdit || {}),
      title: title.trim(),
      category,
      photo: photo || (recipeToEdit && recipeToEdit.photo) || null,
      prepTime: parseInt(prepTime, 10) || 0,
      cookTime: parseInt(cookTime, 10) || 0,
      servings: parseInt(servings, 10) || 4,
      difficulty,
      rating: Number(rating) || 5,
      notes: notes.trim(),
      ingredients: cleanIngredients,
      steps: cleanSteps,
    };

    onSave(recipeData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Modifier la recette' : 'Nouvelle Recette'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
            <Text style={styles.saveHeaderBtnText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* PHOTO SECTION */}
          <View style={styles.section}>
            <Text style={styles.label}>Photo de la recette</Text>
            {photo ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
                <View style={styles.photoOverlayActions}>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera" size={16} color={COLORS.textLight} />
                    <Text style={styles.photoActionText}>Appareil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={handlePickFromGallery}
                  >
                    <Ionicons name="images" size={16} color={COLORS.textLight} />
                    <Text style={styles.photoActionText}>Galerie</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.photoActionButton, styles.photoActionDelete]}
                    onPress={() => setPhoto(null)}
                  >
                    <Ionicons name="trash" size={16} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.photoPickerBox}>
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={42}
                  color={COLORS.primary}
                />
                <Text style={styles.photoPickerTitle}>Ajoutez une photo gourmande</Text>
                <Text style={styles.photoPickerSub}>
                  Prenez votre plat en photo ou choisissez-la dans votre galerie
                </Text>
                <View style={styles.photoBtnRow}>
                  <TouchableOpacity
                    style={styles.pickButtonPrimary}
                    onPress={handleTakePhoto}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera" size={18} color={COLORS.textLight} />
                    <Text style={styles.pickButtonPrimaryText}>Prendre une photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.pickButtonSecondary}
                    onPress={handlePickFromGallery}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="images" size={18} color={COLORS.primary} />
                    <Text style={styles.pickButtonSecondaryText}>Galerie</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* TITLE */}
          <View style={styles.section}>
            <Text style={styles.label}>Titre du plat *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Tarte Tatin aux Pommes Caramélisées"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* CATEGORY SELECTOR */}
          <View style={styles.section}>
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.chipsRow}>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={16}
                      color={isSelected ? COLORS.textLight : COLORS.primary}
                    />
                    <Text
                      style={[styles.chipText, isSelected && styles.chipTextSelected]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* META: PREP, COOK, SERVINGS */}
          <View style={styles.section}>
            <Text style={styles.label}>Temps & Portions</Text>
            <View style={styles.gridThree}>
              <View style={styles.gridItem}>
                <Text style={styles.subLabel}>Prépa (min)</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="15"
                />
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.subLabel}>Cuisson (min)</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="20"
                />
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.subLabel}>Portions (pers.)</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="numeric"
                  value={servings}
                  onChangeText={setServings}
                  placeholder="4"
                />
              </View>
            </View>
          </View>

          {/* DIFFICULTY */}
          <View style={styles.section}>
            <Text style={styles.label}>Difficulté</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <TouchableOpacity
                    key={diff.id}
                    style={[
                      styles.diffBtn,
                      isSelected && {
                        backgroundColor: diff.color,
                        borderColor: diff.color,
                      },
                    ]}
                    onPress={() => setDifficulty(diff.id)}
                  >
                    <Text
                      style={[
                        styles.diffBtnText,
                        isSelected && styles.diffBtnTextSelected,
                      ]}
                    >
                      {diff.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* RATING */}
          <View style={styles.section}>
            <Text style={styles.label}>Note de la recette</Text>
            <View style={styles.ratingBox}>
              <StarRating
                rating={rating}
                size={32}
                interactive={true}
                onRatingChange={(r) => setRating(r)}
              />
              <Text style={styles.ratingNumberDisplay}>{rating} / 5 étoiles</Text>
            </View>
          </View>

          {/* INGREDIENTS */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>Ingrédients</Text>
              <TouchableOpacity onPress={addIngredientRow} style={styles.addRowBtn}>
                <Ionicons name="add-circle" size={18} color={COLORS.primary} />
                <Text style={styles.addRowBtnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            {ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <TextInput
                  style={[styles.input, { flex: 2 }]}
                  placeholder="Nom (ex: Farine)"
                  placeholderTextColor={COLORS.textMuted}
                  value={ing.name}
                  onChangeText={(v) => updateIngredient(idx, 'name', v)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Qté"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={ing.amount}
                  onChangeText={(v) => updateIngredient(idx, 'amount', v)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Unité (g, ml)"
                  placeholderTextColor={COLORS.textMuted}
                  value={ing.unit}
                  onChangeText={(v) => updateIngredient(idx, 'unit', v)}
                />
                <TouchableOpacity
                  style={styles.deleteRowBtn}
                  onPress={() => removeIngredient(idx)}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* STEPS */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>Étapes de préparation</Text>
              <TouchableOpacity onPress={addStepRow} style={styles.addRowBtn}>
                <Ionicons name="add-circle" size={18} color={COLORS.primary} />
                <Text style={styles.addRowBtnText}>Ajouter une étape</Text>
              </TouchableOpacity>
            </View>

            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.stepInput]}
                  placeholder={`Étape ${idx + 1} : décrire l'action...`}
                  placeholderTextColor={COLORS.textMuted}
                  value={step}
                  onChangeText={(v) => updateStep(idx, v)}
                  multiline
                />
                <TouchableOpacity
                  style={styles.deleteRowBtn}
                  onPress={() => removeStep(idx)}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* CHEF NOTES / TIPS */}
          <View style={styles.section}>
            <Text style={styles.label}>Astuces du Chef & Notes personnelles</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Conseils de cuisson, variantes, accord mets & vins..."
              placeholderTextColor={COLORS.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={styles.saveBottomBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done" size={22} color={COLORS.textLight} />
            <Text style={styles.saveBottomBtnText}>
              {isEditing ? 'Enregistrer les modifications' : 'Créer ma recette'}
            </Text>
          </TouchableOpacity>
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
  header: {
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  saveHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  saveHeaderBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  photoPreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoOverlayActions: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  photoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(28, 25, 23, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  photoActionDelete: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
  },
  photoActionText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  photoPickerBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  photoPickerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  photoPickerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  photoBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pickButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
  },
  pickButtonPrimaryText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 13,
  },
  pickButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pickButtonSecondaryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.textLight,
  },
  gridThree: {
    flexDirection: 'row',
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
  numberInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  diffBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  diffBtnTextSelected: {
    color: COLORS.textLight,
  },
  ratingBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingNumberDisplay: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.star,
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addRowBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepInput: {
    flex: 1,
    minHeight: 46,
  },
  deleteRowBtn: {
    padding: 8,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBottomBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveBottomBtnText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
