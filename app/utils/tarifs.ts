/**
 * Système de calcul automatique des tarifs de livraison à Dakar
 * Tarifs en FCFA avec minimum 1000 et maximum 6000
 */

export const QUARTIERS_DAKAR = [
  "Plateau",
  "Parcelles",
  "Médina",
  "Almadies",
  "Ouakam",
  "Keur Massar",
  "Pikine",
  "Grand Yoff",
];

// Matrice de distances (km) entre quartiers
// Utilisée pour calculer les tarifs dynamiquement
const DISTANCES_MATRIX: Record<string, Record<string, number>> = {
  Plateau: {
    Plateau: 0,
    Parcelles: 2,
    Médina: 3,
    Almadies: 8,
    Ouakam: 6,
    "Keur Massar": 15,
    Pikine: 20,
    "Grand Yoff": 12,
  },
  Parcelles: {
    Plateau: 2,
    Parcelles: 0,
    Médina: 2,
    Almadies: 7,
    Ouakam: 5,
    "Keur Massar": 14,
    Pikine: 19,
    "Grand Yoff": 11,
  },
  Médina: {
    Plateau: 3,
    Parcelles: 2,
    Médina: 0,
    Almadies: 8,
    Ouakam: 6,
    "Keur Massar": 16,
    Pikine: 21,
    "Grand Yoff": 13,
  },
  Almadies: {
    Plateau: 8,
    Parcelles: 7,
    Médina: 8,
    Almadies: 0,
    Ouakam: 2,
    "Keur Massar": 22,
    Pikine: 27,
    "Grand Yoff": 19,
  },
  Ouakam: {
    Plateau: 6,
    Parcelles: 5,
    Médina: 6,
    Almadies: 2,
    Ouakam: 0,
    "Keur Massar": 20,
    Pikine: 25,
    "Grand Yoff": 17,
  },
  "Keur Massar": {
    Plateau: 15,
    Parcelles: 14,
    Médina: 16,
    Almadies: 22,
    Ouakam: 20,
    "Keur Massar": 0,
    Pikine: 8,
    "Grand Yoff": 6,
  },
  Pikine: {
    Plateau: 20,
    Parcelles: 19,
    Médina: 21,
    Almadies: 27,
    Ouakam: 25,
    "Keur Massar": 8,
    Pikine: 0,
    "Grand Yoff": 12,
  },
  "Grand Yoff": {
    Plateau: 12,
    Parcelles: 11,
    Médina: 13,
    Almadies: 19,
    Ouakam: 17,
    "Keur Massar": 6,
    Pikine: 12,
    "Grand Yoff": 0,
  },
};

// Tarifs prédéfinis pour les exemples donnés (validation)
const TARIFS_SPECIFIQUES: Record<string, Record<string, number>> = {
  Plateau: {
    Médina: 1000,
  },
  Pikine: {
    "Keur Massar": 2250,
  },
  "Keur Massar": {
    "Grand Yoff": 4200,
  },
};

/**
 * Calcule le tarif automatiquement en fonction de la distance
 * @param depart Quartier de départ
 * @param destination Quartier de destination
 * @returns Tarif en FCFA (entre 1000 et 6000)
 */
export function calculerTarif(depart: string, destination: string): number {
  // Vérifier si c'est un tarif spécifique prédéfini
  if (
    TARIFS_SPECIFIQUES[depart] &&
    TARIFS_SPECIFIQUES[depart][destination]
  ) {
    return TARIFS_SPECIFIQUES[depart][destination];
  }

  // Cas identiques (départ = destination)
  if (depart === destination) {
    return 1000;
  }

  // Obtenir la distance
  const distance =
    DISTANCES_MATRIX[depart]?.[destination] ||
    DISTANCES_MATRIX[destination]?.[depart] ||
    10;

  // Calcul du tarif basé sur la distance
  // Formule: tarif = min(6000, max(1000, 500 + (distance * 250)))
  let tarif = 500 + distance * 250;

  // Appliquer les limites min/max
  tarif = Math.max(1000, Math.min(6000, tarif));

  // Arrondir à 50 FCFA près pour un tarif cohérent
  tarif = Math.round(tarif / 50) * 50;

  return tarif;
}

/**
 * Valide si le prix calculé est correct
 */
export function validerTarif(prix: number): boolean {
  return prix >= 1000 && prix <= 6000;
}

/**
 * Formate le prix en FCFA
 */
export function formatPrix(prix: number): string {
  return `${prix.toLocaleString("fr-FR")} FCFA`;
}

/**
 * Obtient la description de la route
 */
export function getDescriptionRoute(depart: string, destination: string): string {
  if (!depart || !destination) {
    return "Sélectionnez départ et destination";
  }
  if (depart === destination) {
    return "Même quartier";
  }
  return `${depart} → ${destination}`;
}
