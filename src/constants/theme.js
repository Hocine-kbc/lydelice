export const COLORS = {
  // Vert Sapin (Pine / Forest Green) Palette principale
  primary: '#1B4332',          // Vert sapin noble et profond
  primaryLight: '#E8F5EE',     // Teinte vert doux pour fonds et badges
  primaryMedium: '#2D6A4F',    // Vert pin soutenu
  primaryDark: '#081C15',      // Vert forêt ultra profond
  primaryGlow: 'rgba(27, 67, 50, 0.18)',

  // Accents culinaires chauds & dorés (pour un contraste gastronomique)
  accent: '#E07A5F',           // Terracotta doux pour actions & minuterie
  accentLight: '#FBEBE8',
  gold: '#D4A373',             // Doré champagne
  star: '#F59E0B',             // Étoiles brillantes
  starEmpty: '#CBD5E1',

  // Verts complémentaires
  mint: '#52B788',             // Vert menthe fraîche
  leaf: '#74C69D',

  // Fonds & Surfaces
  background: '#F4F7F4',       // Fond écru teinté pin frais
  surface: '#FFFFFF',          // Blanc pur pour les cartes
  surfaceVariant: '#EBF2ED',   // Surface secondaire
  surfaceElevated: '#FFFFFF',

  // Typographie & Textes
  text: '#0D1F16',             // Texte noir-vert sapin ultra lisible
  textSecondary: '#4A6253',    // Gris vert raffiné
  textMuted: '#899E91',        // Muted
  textLight: '#FFFFFF',

  // Bordures & Ombres
  border: '#D8E5DC',
  borderLight: '#EAF0EB',
  shadow: '#0D1F16',

  // Alertes & Statuts
  success: '#2D6A4F',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
};

export const CATEGORIES = [
  { id: 'all', label: 'Tous les délices', icon: 'silverware-fork-knife' },
  { id: 'Plat', label: 'Plats gourmands', icon: 'food-drumstick' },
  { id: 'Dessert', label: 'Desserts & Sucré', icon: 'cake-variant' },
  { id: 'Entrée', label: 'Entrées fraîches', icon: 'leaf' },
  { id: 'Petit-déjeuner', label: 'Petit-déjeuner', icon: 'coffee' },
  { id: 'Apéro', label: 'Apéritifs & Tapas', icon: 'glass-cocktail' },
  { id: 'Boisson', label: 'Boissons & Jus', icon: 'cup-water' },
];

export const DIFFICULTIES = [
  { id: 'Facile', label: 'Facile', color: '#2D6A4F', bg: '#E8F5EE' },
  { id: 'Moyen', label: 'Moyen', color: '#D97706', bg: '#FEF3C7' },
  { id: 'Difficile', label: 'Expert', color: '#DC2626', bg: '#FEE2E2' },
];
