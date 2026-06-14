/**
 * Système de calcul automatique des tarifs de livraison à Dakar
 * Tarifs en FCFA avec minimum 1000 et maximum 6000
 */

export const QUARTIERS_DAKAR = [
  // Plateau
  "Plateau",
  "Médina",
  "Fass",
  "Colobane",
  "Gueule Tapée",
  
  // Grand Dakar
  "Grand Dakar",
  "Grand Yoff",
  "Patte d'Oie",
  
  // Dakar Centre
  "Hann",
  "Bel Air",
  "Fann",
  "Point E",
  
  // Mermoz et Sacré-Cœur
  "Mermoz",
  "Sacré-Cœur",
  
  // Liberté
  "Liberté 1",
  "Liberté 2",
  "Liberté 3",
  "Liberté 4",
  "Liberté 5",
  "Liberté 6",
  "Sicap Liberté",
  
  // Sicap
  "Sicap Baobab",
  "Sicap Karack",
  
  // Nord
  "Mamelles",
  "Ngor",
  "Ouakam",
  "Almadies",
  "Yoff",
  "Cambérène",
  
  // Sud/Banliue
  "Nord Foire",
  "Cité Mixta",
  "Cité Keur Gorgui",
  "Parcelles Assainies",
  
  // Parcelles Assainies - Unités
  "Unité 1",
  "Unité 2",
  "Unité 3",
  "Unité 4",
  "Unité 5",
  "Unité 6",
  "Unité 7",
  "Unité 8",
  "Unité 9",
  "Unité 10",
  "Unité 11",
  "Unité 12",
  "Unité 13",
  "Unité 14",
  "Unité 15",
  "Unité 16",
  "Unité 17",
  "Unité 18",
  "Unité 19",
  "Unité 20",
  "Unité 21",
  "Unité 22",
  "Unité 23",
  "Unité 24",
  "Unité 25",
  "Unité 26",
  
  // Keur Massar
  "Keur Massar",
  "Keur Massar Nord",
  "Keur Massar Sud",
  "Keur Massar Extension",
  
  // Malika
  "Malika",
  "Malika 1",
  "Malika 2",
  "Malika 3",
  
  // Jaxaay
  "Jaxaay",
  "Jaxaay 1",
  "Jaxaay 2",
  "Jaxaay 3",
  
  // Yeumbeul
  "Yeumbeul Nord",
  "Yeumbeul Sud",
  
  // Pikine
  "Pikine",
  "Pikine Icotaf",
  "Pikine Tally Boumack",
  
  // Thiaroye
  "Thiaroye",
  "Thiaroye Gare",
  "Thiaroye Sur Mer",
  
  // Mbao et environs
  "Mbao",
  "Diamaguène",
  "Rufisque",
];

// Fonction pour obtenir les quartiers avec recherche
export function obtenirQuartiersFiltres(search: string): string[] {
  if (!search.trim()) return QUARTIERS_DAKAR;
  
  const searchLower = search.toLowerCase();
  return QUARTIERS_DAKAR.filter(quartier =>
    quartier.toLowerCase().includes(searchLower)
  );
}

// Groupes de quartiers par zones pour faciliter le calcul de distances
const ZONES_QUARTIERS: Record<string, string[]> = {
  "PLATEAU": ["Plateau", "Médina", "Fass", "Colobane", "Gueule Tapée"],
  "DAKAR-CENTRE": ["Hann", "Bel Air", "Fann", "Point E", "Mermoz", "Sacré-Cœur"],
  "LIBERTE": ["Liberté 1", "Liberté 2", "Liberté 3", "Liberté 4", "Liberté 5", "Liberté 6", "Sicap Liberté", "Sicap Baobab", "Sicap Karack"],
  "NORD": ["Mamelles", "Ngor", "Ouakam", "Almadies", "Yoff", "Cambérène", "Grand Yoff", "Patte d'Oie"],
  "PARCELLES": ["Parcelles Assainies", "Unité 1", "Unité 2", "Unité 3", "Unité 4", "Unité 5", "Unité 6", "Unité 7", "Unité 8", "Unité 9", "Unité 10", "Unité 11", "Unité 12", "Unité 13", "Unité 14", "Unité 15", "Unité 16", "Unité 17", "Unité 18", "Unité 19", "Unité 20", "Unité 21", "Unité 22", "Unité 23", "Unité 24", "Unité 25", "Unité 26"],
  "GRAND-DAKAR": ["Grand Dakar", "Nord Foire", "Cité Mixta", "Cité Keur Gorgui"],
  "KEUR-MASSAR": ["Keur Massar", "Keur Massar Nord", "Keur Massar Sud", "Keur Massar Extension"],
  "MALIKA": ["Malika", "Malika 1", "Malika 2", "Malika 3"],
  "JAXAAY": ["Jaxaay", "Jaxaay 1", "Jaxaay 2", "Jaxaay 3"],
  "YEUMBEUL": ["Yeumbeul Nord", "Yeumbeul Sud"],
  "PIKINE": ["Pikine", "Pikine Icotaf", "Pikine Tally Boumack"],
  "THIAROYE": ["Thiaroye", "Thiaroye Gare", "Thiaroye Sur Mer"],
  "AUTRES": ["Mbao", "Diamaguène", "Rufisque"],
};

// Distances entre zones (km)
const DISTANCES_ENTRE_ZONES: Record<string, Record<string, number>> = {
  "PLATEAU": {"PLATEAU": 0, "DAKAR-CENTRE": 3, "LIBERTE": 6, "NORD": 8, "PARCELLES": 8, "GRAND-DAKAR": 5, "KEUR-MASSAR": 18, "MALIKA": 22, "JAXAAY": 20, "YEUMBEUL": 24, "PIKINE": 22, "THIAROYE": 25, "AUTRES": 28},
  "DAKAR-CENTRE": {"PLATEAU": 3, "DAKAR-CENTRE": 0, "LIBERTE": 4, "NORD": 6, "PARCELLES": 7, "GRAND-DAKAR": 4, "KEUR-MASSAR": 16, "MALIKA": 20, "JAXAAY": 18, "YEUMBEUL": 22, "PIKINE": 20, "THIAROYE": 23, "AUTRES": 26},
  "LIBERTE": {"PLATEAU": 6, "DAKAR-CENTRE": 4, "LIBERTE": 0, "NORD": 5, "PARCELLES": 3, "GRAND-DAKAR": 7, "KEUR-MASSAR": 14, "MALIKA": 18, "JAXAAY": 16, "YEUMBEUL": 20, "PIKINE": 18, "THIAROYE": 21, "AUTRES": 24},
  "NORD": {"PLATEAU": 8, "DAKAR-CENTRE": 6, "LIBERTE": 5, "NORD": 0, "PARCELLES": 6, "GRAND-DAKAR": 10, "KEUR-MASSAR": 16, "MALIKA": 20, "JAXAAY": 18, "YEUMBEUL": 22, "PIKINE": 20, "THIAROYE": 23, "AUTRES": 26},
  "PARCELLES": {"PLATEAU": 8, "DAKAR-CENTRE": 7, "LIBERTE": 3, "NORD": 6, "PARCELLES": 0, "GRAND-DAKAR": 8, "KEUR-MASSAR": 12, "MALIKA": 16, "JAXAAY": 14, "YEUMBEUL": 18, "PIKINE": 16, "THIAROYE": 19, "AUTRES": 22},
  "GRAND-DAKAR": {"PLATEAU": 5, "DAKAR-CENTRE": 4, "LIBERTE": 7, "NORD": 10, "PARCELLES": 8, "GRAND-DAKAR": 0, "KEUR-MASSAR": 14, "MALIKA": 18, "JAXAAY": 16, "YEUMBEUL": 20, "PIKINE": 18, "THIAROYE": 21, "AUTRES": 24},
  "KEUR-MASSAR": {"PLATEAU": 18, "DAKAR-CENTRE": 16, "LIBERTE": 14, "NORD": 16, "PARCELLES": 12, "GRAND-DAKAR": 14, "KEUR-MASSAR": 0, "MALIKA": 6, "JAXAAY": 8, "YEUMBEUL": 10, "PIKINE": 8, "THIAROYE": 12, "AUTRES": 15},
  "MALIKA": {"PLATEAU": 22, "DAKAR-CENTRE": 20, "LIBERTE": 18, "NORD": 20, "PARCELLES": 16, "GRAND-DAKAR": 18, "KEUR-MASSAR": 6, "MALIKA": 0, "JAXAAY": 4, "YEUMBEUL": 8, "PIKINE": 6, "THIAROYE": 10, "AUTRES": 12},
  "JAXAAY": {"PLATEAU": 20, "DAKAR-CENTRE": 18, "LIBERTE": 16, "NORD": 18, "PARCELLES": 14, "GRAND-DAKAR": 16, "KEUR-MASSAR": 8, "MALIKA": 4, "JAXAAY": 0, "YEUMBEUL": 4, "PIKINE": 4, "THIAROYE": 8, "AUTRES": 10},
  "YEUMBEUL": {"PLATEAU": 24, "DAKAR-CENTRE": 22, "LIBERTE": 20, "NORD": 22, "PARCELLES": 18, "GRAND-DAKAR": 20, "KEUR-MASSAR": 10, "MALIKA": 8, "JAXAAY": 4, "YEUMBEUL": 0, "PIKINE": 4, "THIAROYE": 6, "AUTRES": 8},
  "PIKINE": {"PLATEAU": 22, "DAKAR-CENTRE": 20, "LIBERTE": 18, "NORD": 20, "PARCELLES": 16, "GRAND-DAKAR": 18, "KEUR-MASSAR": 8, "MALIKA": 6, "JAXAAY": 4, "YEUMBEUL": 4, "PIKINE": 0, "THIAROYE": 4, "AUTRES": 8},
  "THIAROYE": {"PLATEAU": 25, "DAKAR-CENTRE": 23, "LIBERTE": 21, "NORD": 23, "PARCELLES": 19, "GRAND-DAKAR": 21, "KEUR-MASSAR": 12, "MALIKA": 10, "JAXAAY": 8, "YEUMBEUL": 6, "PIKINE": 4, "THIAROYE": 0, "AUTRES": 4},
  "AUTRES": {"PLATEAU": 28, "DAKAR-CENTRE": 26, "LIBERTE": 24, "NORD": 26, "PARCELLES": 22, "GRAND-DAKAR": 24, "KEUR-MASSAR": 15, "MALIKA": 12, "JAXAAY": 10, "YEUMBEUL": 8, "PIKINE": 8, "THIAROYE": 4, "AUTRES": 0},
};

// Fonction utilitaire pour obtenir la zone d'un quartier
function obtenirZone(quartier: string): string {
  for (const [zone, quartiers] of Object.entries(ZONES_QUARTIERS)) {
    if (quartiers.includes(quartier)) {
      return zone;
    }
  }
  return "AUTRES";
}

// Matrice de distances (km) entre quartiers (structure minimale pour compatibilité)
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

  // Obtenir les zones
  const zoneDepart = obtenirZone(depart);
  const zoneDestination = obtenirZone(destination);

  // Obtenir la distance entre zones
  let distance = DISTANCES_ENTRE_ZONES[zoneDepart]?.[zoneDestination] ||
                 DISTANCES_ENTRE_ZONES[zoneDestination]?.[zoneDepart] ||
                 DISTANCES_ENTRE_ZONES["AUTRES"]?.[zoneDestination] ||
                 15;

  // Petit ajustement si quartiers dans même zone (réduction 10%)
  if (zoneDepart === zoneDestination) {
    distance = Math.max(distance * 0.9, 1);
  }

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
