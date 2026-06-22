/**
 * Système de calcul automatique des tarifs de livraison à Dakar
 * Tarifs en FCFA avec calcul par distance
 */

// 🗺️ BASE COMPLÈTE DES QUARTIERS DE DAKAR
export const QUARTIERS_DAKAR = [
  // Plateau et Centre
  "Plateau",
  "Médina",
  "Fass",
  "Colobane",
  "Gueule Tapée",
  "Grand Dakar",
  "Grand Yoff",
  "Patte d'Oie",
  
  // Dakar Centre
  "Hann",
  "Hann Maristes",
  "Bel Air",
  "Fann",
  "Point E",
  
  // Mermoz et Sacré-Cœur
  "Mermoz",
  "Sacré-Cœur",
  
  // Liberté 1-6 et Sicap
  "Liberté 1",
  "Liberté 2",
  "Liberté 3",
  "Liberté 4",
  "Liberté 5",
  "Liberté 6",
  "Sicap Liberté",
  "Sicap Baobab",
  "Sicap Karack",
  "Sicap Mbao",
  
  // Nord
  "Mamelles",
  "Ngor",
  "Ouakam",
  "Almadies",
  "Yoff",
  "Cambérène",
  
  // Parcelles Assainies - Unités
  "Parcelles Assainies",
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
  "Keur Mbaye Fall",
  
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
  "Tivaouane Peulh",
  
  // Pikine
  "Pikine",
  "Pikine Icotaf",
  "Pikine Tally Boumack",
  
  // Thiaroye
  "Thiaroye",
  "Thiaroye Gare",
  "Thiaroye Sur Mer",
  
  // Guédiawaye et environs
  "Guédiawaye",
  "Golf Sud",
  "Golf Nord",
  "Dalifort",
  "Diamaguène",
  "Khar Yalla",
  "Niary Tally",
  "Biscuiterie",
  
  // Rufisque et environs
  "Rufisque",
  "Mbao",
  "Bargny",
  "Sébikotane",
  
  // Autres quartiers
  "Dieuppeul",
  "HLM",
  "Nord Foire",
  "Cité Mixta",
  "Cité Keur Gorgui",
  "Bourguiba",
  "Derklé",
  "Castors",
  "Amitié",
  "Bopp",
];

// 🗺️ Coordonnées GPS des quartiers (latitude, longitude)
export const QUARTIERS_COORDS: Record<string, [number, number]> = {
  "Plateau": [14.6708, -17.4381],
  "Médina": [14.6833, -17.4500],
  "Fass": [14.6700, -17.4450],
  "Colobane": [14.6750, -17.4550],
  "Gueule Tapée": [14.6650, -17.4350],
  "Grand Dakar": [14.6550, -17.4400],
  "Grand Yoff": [14.7392, -17.4576],
  "Patte d'Oie": [14.7200, -17.4450],
  "Hann": [14.7217, -17.4294],
  "Hann Maristes": [14.7250, -17.4250],
  "Bel Air": [14.7180, -17.4350],
  "Fann": [14.6937, -17.4677],
  "Point E": [14.7050, -17.4750],
  "Mermoz": [14.7062, -17.4758],
  "Sacré-Cœur": [14.7285, -17.4638],
  "Liberté 1": [14.7310, -17.4650],
  "Liberté 2": [14.7330, -17.4700],
  "Liberté 3": [14.7350, -17.4650],
  "Liberté 4": [14.7370, -17.4700],
  "Liberté 5": [14.7390, -17.4650],
  "Liberté 6": [14.7410, -17.4700],
  "Sicap Liberté": [14.7430, -17.4750],
  "Sicap Baobab": [14.7450, -17.4800],
  "Sicap Karack": [14.7470, -17.4750],
  "Sicap Mbao": [14.7200, -17.3800],
  "Mamelles": [14.7150, -17.5050],
  "Ngor": [14.7449, -17.5150],
  "Ouakam": [14.7247, -17.4906],
  "Almadies": [14.7368, -17.5110],
  "Yoff": [14.7470, -17.4900],
  "Cambérène": [14.7640, -17.4480],
  "Parcelles Assainies": [14.7560, -17.4480],
  "Unité 1": [14.7500, -17.4550],
  "Unité 2": [14.7520, -17.4500],
  "Unité 3": [14.7540, -17.4550],
  "Unité 4": [14.7560, -17.4500],
  "Unité 5": [14.7580, -17.4550],
  "Unité 6": [14.7600, -17.4500],
  "Unité 7": [14.7500, -17.4400],
  "Unité 8": [14.7520, -17.4350],
  "Unité 9": [14.7540, -17.4400],
  "Unité 10": [14.7560, -17.4350],
  "Unité 11": [14.7580, -17.4400],
  "Unité 12": [14.7600, -17.4350],
  "Unité 13": [14.7500, -17.4250],
  "Unité 14": [14.7520, -17.4200],
  "Unité 15": [14.7540, -17.4250],
  "Unité 16": [14.7560, -17.4200],
  "Unité 17": [14.7580, -17.4250],
  "Unité 18": [14.7600, -17.4200],
  "Unité 19": [14.7500, -17.4150],
  "Unité 20": [14.7520, -17.4100],
  "Unité 21": [14.7540, -17.4150],
  "Unité 22": [14.7560, -17.4100],
  "Unité 23": [14.7580, -17.4150],
  "Unité 24": [14.7600, -17.4100],
  "Unité 25": [14.7620, -17.4200],
  "Unité 26": [14.7640, -17.4150],
  "Keur Massar": [14.7860, -17.3113],
  "Keur Massar Nord": [14.7900, -17.3150],
  "Keur Massar Sud": [14.7800, -17.3050],
  "Keur Massar Extension": [14.7850, -17.3000],
  "Keur Mbaye Fall": [14.7880, -17.3200],
  "Malika": [14.7750, -17.3500],
  "Malika 1": [14.7780, -17.3530],
  "Malika 2": [14.7750, -17.3480],
  "Malika 3": [14.7720, -17.3550],
  "Jaxaay": [14.7650, -17.3700],
  "Jaxaay 1": [14.7680, -17.3730],
  "Jaxaay 2": [14.7650, -17.3700],
  "Jaxaay 3": [14.7620, -17.3670],
  "Yeumbeul Nord": [14.7500, -17.3450],
  "Yeumbeul Sud": [14.7400, -17.3350],
  "Tivaouane Peulh": [14.7550, -17.3400],
  "Pikine": [14.7645, -17.3900],
  "Pikine Icotaf": [14.7680, -17.3950],
  "Pikine Tally Boumack": [14.7600, -17.3850],
  "Thiaroye": [14.7800, -17.3200],
  "Thiaroye Gare": [14.7830, -17.3230],
  "Thiaroye Sur Mer": [14.7870, -17.3400],
  "Guédiawaye": [14.7761, -17.3956],
  "Golf Sud": [14.7700, -17.4100],
  "Golf Nord": [14.7750, -17.4200],
  "Dalifort": [14.7620, -17.3850],
  "Diamaguène": [14.7680, -17.3550],
  "Khar Yalla": [14.7520, -17.3650],
  "Niary Tally": [14.7450, -17.3700],
  "Biscuiterie": [14.7350, -17.3800],
  "Rufisque": [14.7158, -17.2733],
  "Mbao": [14.7400, -17.3100],
  "Bargny": [14.7250, -17.2850],
  "Sébikotane": [14.7050, -17.2650],
  "Dieuppeul": [14.7100, -17.4300],
  "HLM": [14.6951, -17.4467],
  "Nord Foire": [14.7300, -17.4600],
  "Cité Mixta": [14.7250, -17.4550],
  "Cité Keur Gorgui": [14.7200, -17.4500],
  "Bourguiba": [14.6800, -17.4350],
  "Derklé": [14.6750, -17.4300],
  "Castors": [14.6850, -17.4400],
  "Amitié": [14.6900, -17.4450],
  "Bopp": [14.6950, -17.4400],
};

// Fonction pour calculer la distance réelle entre deux quartiers (km)
export function calculerDistance(depart: string, destination: string): number {
  const coordDepart = QUARTIERS_COORDS[depart];
  const coordDestination = QUARTIERS_COORDS[destination];
  
  if (!coordDepart || !coordDestination) {
    return 0;
  }

  // Formule de Haversine pour distance GPS précise
  const R = 6371; // Rayon de la Terre en km
  const dLat = (coordDestination[0] - coordDepart[0]) * (Math.PI / 180);
  const dLon = (coordDestination[1] - coordDepart[1]) * (Math.PI / 180);
  const lat1 = coordDepart[0] * (Math.PI / 180);
  const lat2 = coordDestination[0] * (Math.PI / 180);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
}

// Calcul du tarif selon la distance
export function calculerTarifParDistance(distance: number): number {
  if (distance <= 0) return 1000; // Minimum
  if (distance <= 3) return 1000;      // 0-3 km: 1000 FCFA
  if (distance <= 5) return 1500;      // 3-5 km: 1500 FCFA
  if (distance <= 10) return 2500;     // 5-10 km: 2500 FCFA
  if (distance <= 15) return 3500;     // 10-15 km: 3500 FCFA
  return 4500;                         // 15+ km: 4500 FCFA
}

// Fonction principale de calcul de tarif
export function calculerTarif(depart: string, destination: string): number {
  if (depart === destination) return 1000; // Même quartier
  const distance = calculerDistance(depart, destination);
  return calculerTarifParDistance(distance);
}

// Format du prix
export function formatPrix(prix: number): string {
  return prix.toLocaleString("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Fonction vide pour compatibilité avec les imports existants
export function getDescriptionRoute(depart: string, destination: string): string {
  if (!depart || !destination) return "";
  if (depart === destination) return "Même quartier";
  return `${depart} → ${destination}`;
}

// Fonction pour filtrer les quartiers (compatibilité)
export function obtenirQuartiersFiltres(search: string): string[] {
  if (!search) return QUARTIERS_DAKAR;
  const lower = search.toLowerCase();
  return QUARTIERS_DAKAR.filter((q) => q.toLowerCase().includes(lower));
}
