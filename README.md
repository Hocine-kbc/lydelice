# 🍳 LyDélice - Carnet de Recettes Mobile

Une application mobile moderne, intuitive et gourmande conçue avec **React Native** et **Expo**.
Elle vous permet de répertorier toutes vos recettes, d'ajouter des photos avec votre appareil photo ou depuis votre galerie, de noter vos créations culinaires et de gérer votre cuisine au quotidien.

---

## ✨ Fonctionnalités Clés

1. 📸 **Photos de Recettes** :
   - Prenez vos plats directement en photo grâce à l'appareil photo intégré (`expo-image-picker`).
   - Importez vos plus belles photos depuis la galerie de votre smartphone.
   - Aperçu visuel immédiat avec possibilité de modifier ou supprimer la photo.

2. 📝 **Création & Gestion Complète de Recettes** :
   - Titre, catégorie (*Entrées, Plats, Desserts, Apéro, Petit-déjeuner, Boissons...*).
   - Temps de préparation et temps de cuisson.
   - Niveau de difficulté (*Facile, Moyen, Difficile*) avec indicateurs de couleur.
   - Nombre de portions / personnes.
   - Liste dynamique des ingrédients (quantité, unité, ingrédient) avec ajout/suppression en direct.
   - Étapes de préparation numérotées et modifiables.
   - Astuces du chef et notes personnelles (ex: accords mets & vins, conseils de cuisson).

3. ⭐ **Système de Notation & Avis Gustatifs** :
   - Note interactive avec étoiles (1 à 5 étoiles).
   - Historique des dégustations avec commentaires et impressions personnelles pour chaque plat.
   - Calcul et affichage automatique de la note moyenne.

4. ⚖️ **Calculateur Dynamique de Portions** :
   - Ajustez le nombre de convives d'un simple geste avec les boutons `+` et `-`.
   - Les quantités de tous les ingrédients sont automatiquement recalculées en temps réel !

5. ⏰ **Minuteur de Cuisson Intégré** :
   - Minuteur digital précis avec compte à rebours et barre de progression.
   - Préréglages rapides (*Œuf à la coque 3 min, Œuf mollet 5 min, Pâtes 10 min, 15 min, 30 min, 45 min*).
   - Ajustements manuels (+/- 15 secondes, +/- 1 minute).
   - Lancement automatique du minuteur pré-rempli depuis la fiche recette en 1 clic !
   - Alerte et vibration à la fin du temps de cuisson.

6. 🛒 **Générateur de Liste de Courses** :
   - Bouton « *Ajouter à ma liste de courses* » sur chaque recette pour transférer tous les ingrédients en 1 clic.
   - Ajout manuel d'articles avec quantités.
   - Éléments cochables au fur et à mesure de vos achats en magasin.

7. 💾 **Sauvegarde Locale & Mode Hors-ligne** :
   - Toutes vos recettes, favoris, photos et listes de courses sont enregistrés localement sur votre téléphone (`AsyncStorage`).
   - Fonctionne 100% hors-ligne, sans besoin de connexion internet.

---

## 🚀 Démarrer l'application

### 1. Sur votre smartphone (iOS ou Android)
1. Installez l'application gratuite **Expo Go** depuis l'App Store (iPhone) ou le Google Play Store (Android).
2. Lancez le serveur de développement :
   ```bash
   npx expo start
   ```
3. Scannez le **QR code** affiché dans votre terminal :
   - **Android** : Scannez avec l'application Expo Go.
   - **iOS** : Scannez avec l'appareil photo officiel de l'iPhone, puis touchez la notification pour ouvrir dans Expo Go.

### 2. Sur votre ordinateur (Navigateur Web)
Vous pouvez également tester l'application directement dans votre navigateur web sans téléphone :
```bash
npx expo start --web
```
Ou bien :
```bash
npm run web
```

---

## 📁 Architecture du Projet

```
lydelice/
├── assets/                  # Icônes et images de l'application
├── src/
│   ├── constants/
│   │   ├── theme.js         # Palette de couleurs chaleureuse, catégories & difficultés
│   │   └── initialRecipes.js# Recettes d'exemple préchargées
│   ├── services/
│   │   └── storage.js       # Gestion du stockage persistant (AsyncStorage)
│   └── components/
│       ├── StarRating.js        # Système d'étoiles interactif
│       ├── CategoryPills.js     # Filtres de catégories scrollables
│       ├── RecipeCard.js        # Carte visuelle de recette avec badge et note
│       ├── RecipeDetailModal.js # Fiche détaillée avec portions dynamiques & avis
│       ├── RecipeFormModal.js   # Formulaire complet avec photo (Caméra & Galerie)
│       ├── CookingTimer.js      # Minuteur de cuisine avec préréglages
│       └── ShoppingListTab.js   # Liste de courses interactive
├── App.js                   # Navigation principale, onglets et gestion d'état
├── app.json                 # Configuration Expo et permissions caméra/galerie
└── package.json             # Dépendances du projet
```
