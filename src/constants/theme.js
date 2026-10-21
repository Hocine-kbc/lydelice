export const COLORS = {
  primary: '#E25822',       // Warm flame / terracotta
  primaryLight: '#FFEDE4',  // Light orange tint
  primaryDark: '#B83808',
  secondary: '#2A9D8F',     // Sage green / culinary teal
  secondaryLight: '#E8F6F4',
  accent: '#F4A261',        // Golden amber
  star: '#F59E0B',          // Star golden yellow
  starEmpty: '#D1D5DB',     // Empty star grey
  
  // Backgrounds
  background: '#FAF7F2',    // Warm cream background
  surface: '#FFFFFF',       // Card white
  surfaceVariant: '#F3EDE6',
  
  // Text
  text: '#1C1917',          // Rich charcoal
  textSecondary: '#6B7280', // Slate gray
  textMuted: '#9CA3AF',
  textLight: '#FFFFFF',
  
  // States
  border: '#E8E1D9',
  borderLight: '#F0EBE5',
  success: '#10B981',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  
  // Shadow
  shadow: '#000000',
};

export const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: 'silverware-fork-knife' },
  { id: 'Plat', label: 'Plats', icon: 'food-drumstick' },
  { id: 'Dessert', label: 'Desserts', icon: 'cake-variant' },
  { id: 'Entrée', label: 'Entrées', icon: 'leaf' },
  { id: 'Petit-déjeuner', label: 'Petit-déj', icon: 'coffee' },
  { id: 'Apéro', label: 'Apéro', icon: 'glass-cocktail' },
  { id: 'Boisson', label: 'Boissons', icon: 'cup-water' },
];

export const DIFFICULTIES = [
  { id: 'Facile', label: 'Facile', color: '#10B981' },
  { id: 'Moyen', label: 'Moyen', color: '#F59E0B' },
  { id: 'Difficile', label: 'Difficile', color: '#EF4444' },
];
