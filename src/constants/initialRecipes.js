export const INITIAL_RECIPES = [
  {
    id: 'recipe-1',
    title: 'Fondant au Chocolat Cœur Coulant',
    category: 'Dessert',
    photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop',
    prepTime: 15,
    cookTime: 12,
    difficulty: 'Facile',
    servings: 4,
    rating: 5,
    isFavorite: true,
    createdAt: '2026-10-18T14:30:00Z',
    notes: 'Le secret réside dans le temps de cuisson : à la sortie du four, le centre doit être encore légèrement tremblotant.',
    ingredients: [
      { id: 'ing-1', name: 'Chocolat noir pâtissier (70%)', amount: 200, unit: 'g' },
      { id: 'ing-2', name: 'Beurre doux', amount: 100, unit: 'g' },
      { id: 'ing-3', name: 'Œufs frais', amount: 3, unit: 'pièce(s)' },
      { id: 'ing-4', name: 'Sucre en poudre', amount: 80, unit: 'g' },
      { id: 'ing-5', name: 'Farine de blé', amount: 50, unit: 'g' },
      { id: 'ing-6', name: 'Pincée de fleur de sel', amount: 1, unit: 'pincée' }
    ],
    steps: [
      'Préchauffer le four à 200°C (thermostat 6-7). Beurrer et fariner 4 ramequins individuels.',
      'Faire fondre le chocolat noir coupé en morceaux avec le beurre au bain-marie ou au micro-ondes à faible puissance.',
      'Dans un saladier, fouetter énergiquement les œufs entiers avec le sucre jusqu’à ce que le mélange blanchisse.',
      'Incorporer la farine tamisée et la fleur de sel, puis verser le chocolat fondu tout en remuant doucement.',
      'Répartir la pâte dans les ramequins et enfourner exactement 10 à 12 minutes.',
      'Laisser tiédir 2 minutes avant de démouler ou déguster directement à la cuillère avec une boule de glace vanille !'
    ],
    reviews: [
      {
        id: 'rev-1',
        date: '2026-10-19',
        rating: 5,
        comment: 'Cœur coulant parfait à 11 minutes de cuisson ! Les invités ont adoré.'
      }
    ]
  },
  {
    id: 'recipe-2',
    title: 'Poulet Rôti au Romarin & Pommes Grenailles',
    category: 'Plat',
    photo: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=1000&auto=format&fit=crop',
    prepTime: 20,
    cookTime: 60,
    difficulty: 'Moyen',
    servings: 4,
    rating: 5,
    isFavorite: true,
    createdAt: '2026-10-17T11:00:00Z',
    notes: 'Arroser le poulet avec son jus toutes les 20 minutes pour une peau ultra croustillante et une chair juteuse.',
    ingredients: [
      { id: 'ing-7', name: 'Poulet fermier entier', amount: 1.4, unit: 'kg' },
      { id: 'ing-8', name: 'Pommes de terre grenailles', amount: 800, unit: 'g' },
      { id: 'ing-9', name: 'Gousses d’ail', amount: 6, unit: 'gousse(s)' },
      { id: 'ing-10', name: 'Branches de romarin frais', amount: 4, unit: 'branche(s)' },
      { id: 'ing-11', name: 'Huile d’olive vierge extra', amount: 3, unit: 'c. à soupe' },
      { id: 'ing-12', name: 'Beurre ramolli', amount: 30, unit: 'g' },
      { id: 'ing-13', name: 'Sel et poivre du moulin', amount: 1, unit: 'selon goût' }
    ],
    steps: [
      'Préchauffer le four à 190°C. Laver et sécher les pommes grenailles en les coupant en deux.',
      'Masser le poulet avec le beurre pommade, sel, poivre et la moitié du romarin haché.',
      'Placer les gousses d’ail écrites et une branche de romarin à l’intérieur du poulet.',
      'Disposer les pommes de terre autour dans le plat, arroser d’un filet d’huile d’olive, saler et poivrer.',
      'Enfourner pour 60 minutes en arrosant régulièrement avec le jus de cuisson.',
      'Laisser reposer le poulet 10 minutes sous une feuille d’aluminium avant de le découper.'
    ],
    reviews: [
      {
        id: 'rev-2',
        date: '2026-10-20',
        rating: 5,
        comment: 'La peau était extra croustillante et les pommes grenailles fondantes à souhait.'
      }
    ]
  },
  {
    id: 'recipe-3',
    title: 'Salade César Gourmande au Poulet Croustillant',
    category: 'Entrée',
    photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    prepTime: 20,
    cookTime: 10,
    difficulty: 'Facile',
    servings: 2,
    rating: 4,
    isFavorite: false,
    createdAt: '2026-10-15T18:15:00Z',
    notes: 'La sauce maison change absolument tout par rapport aux sauces industrielles !',
    ingredients: [
      { id: 'ing-14', name: 'Salade romaine fraîche', amount: 1, unit: 'pièce(s)' },
      { id: 'ing-15', name: 'Blancs de poulet', amount: 250, unit: 'g' },
      { id: 'ing-16', name: 'Parmesan en copeaux', amount: 50, unit: 'g' },
      { id: 'ing-17', name: 'Pain de campagne pour croûtons', amount: 80, unit: 'g' },
      { id: 'ing-18', name: 'Mayonnaise maison ou de qualité', amount: 3, unit: 'c. à soupe' },
      { id: 'ing-19', name: 'Filets d’anchois (optionnel)', amount: 2, unit: 'filet(s)' },
      { id: 'ing-20', name: 'Jus de citron frais', amount: 1, unit: 'c. à café' },
      { id: 'ing-21', name: 'Moutarde de Dijon', amount: 1, unit: 'c. à café' }
    ],
    steps: [
      'Couper le pain en petits cubes et les faire dorer dans une poêle avec un filet d’huile d’olive et un peu d’ail.',
      'Faire griller les blancs de poulet assaisonnés à la poêle jusqu’à ce qu’ils soient bien dorés, puis les émincer.',
      'Préparer la sauce en mélangeant la mayonnaise, la moutarde, le jus de citron, les anchois écrasés et un peu de parmesan râpé.',
      'Laver et essorer la salade romaine, la couper en morceaux généreux.',
      'Dresser la salade dans de grands bols, ajouter le poulet tiède, les croûtons croustillants et les copeaux de parmesan.',
      'Napper généreusement de sauce César et servir immédiatement.'
    ],
    reviews: []
  },
  {
    id: 'recipe-4',
    title: 'Pancakes Moelleux aux Myrtilles & Sirop d’Érable',
    category: 'Petit-déjeuner',
    photo: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=1000&auto=format&fit=crop',
    prepTime: 10,
    cookTime: 15,
    difficulty: 'Facile',
    servings: 3,
    rating: 5,
    isFavorite: false,
    createdAt: '2026-10-12T09:00:00Z',
    notes: 'Ne pas trop travailler la pâte pour garder des bulles d’air qui donneront des pancakes ultra épais et moelleux.',
    ingredients: [
      { id: 'ing-22', name: 'Farine de blé', amount: 200, unit: 'g' },
      { id: 'ing-23', name: 'Lait entier ou demi-écrémé', amount: 250, unit: 'ml' },
      { id: 'ing-24', name: 'Œuf', amount: 1, unit: 'pièce(s)' },
      { id: 'ing-25', name: 'Beurre fondu', amount: 30, unit: 'g' },
      { id: 'ing-26', name: 'Sucre en poudre', amount: 2, unit: 'c. à soupe' },
      { id: 'ing-27', name: 'Levure chimique', amount: 1, unit: 'sachet' },
      { id: 'ing-28', name: 'Myrtilles fraîches', amount: 120, unit: 'g' },
      { id: 'ing-29', name: 'Sirop d’érable pur', amount: 4, unit: 'c. à soupe' }
    ],
    steps: [
      'Mélanger la farine, la levure chimique, le sucre et une pincée de sel dans un grand récipient.',
      'Faire un puits au centre et verser l’œuf battu, le beurre fondu et le lait tiède.',
      'Mélanger délicatement au fouet sans trop insister (les petits grumeaux disparaîtront à la cuisson).',
      'Chauffer une poêle antiadhésive à feu moyen avec une noisette de beurre.',
      'Verser une petite louche de pâte, disposer quelques myrtilles fraîches sur la surface.',
      'Lorsque des bulles éclatent à la surface (environ 2 min), retourner le pancake et cuire 1 à 2 min de l’autre côté.',
      'Empiler et servir bien chaud arrosé de sirop d’érable !'
    ],
    reviews: []
  }
];
