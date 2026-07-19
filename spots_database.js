// Base de données des spots de pêche du Dunkerquois
const SPOTS_DATABASE = [
  {
    id: "braek",
    name: "La Digue du Braek",
    lat: 51.0417,
    lng: 2.2559,
    type: "Jetée / Digue industrielle",
    difficulty: "Difficile (Physique et technique)",
    bestTides: "Dernières 2h de montante, et descendante",
    bestWinds: ["Sud", "Sud-Ouest", "Nord-Est (pour le cabillaud)"],
    targetSpecies: ["bar", "cabillaud", "merlan"],
    description: "Une digue industrielle mythique qui s'avance sur plus de 7 kilomètres en mer. Elle sépare le port ouest de la pleine mer. Les courants y sont puissants et les fonds rocheux ou sableux selon la distance.",
    advice: "Pour le cabillaud en hiver, visez le large avec un montage Pennel chargé en arénicoles noires. En été, pêchez le bar au ras des enrochements à la marée montante.",
    safety: "ATTENTION : Longue marche d'accès. Par fort coefficient (>85) et vent de Nord/Nord-Ouest soutenu, les vagues peuvent passer par-dessus la digue. Pêche dangereuse par tempête. Chaussures antidérapantes obligatoires."
  },
  {
    id: "jetee-malo",
    name: "Digue de Malo-les-Bains (Jetée Est)",
    lat: 51.0516,
    lng: 2.3665,
    type: "Jetée en béton / Bois",
    difficulty: "Facile à Moyen",
    bestTides: "3 heures avant la pleine mer à 1 heure après",
    bestWinds: ["Est", "Sud-Est", "Sud-Ouest"],
    targetSpecies: ["sole", "flet", "merlan", "maquereau"],
    description: "La digue de promenade historique de Malo. Facile d'accès, elle permet de pêcher dans le chenal ou côté plage. Très fréquentée en saison.",
    advice: "La sole y est très active la nuit en été par mer calme. Utilisez des vers de sable sur des empiles longues de 1m50 posées à plat.",
    safety: "Attention aux promeneurs lors de vos lancers. La partie basse en bois est extrêmement glissante à marée basse à cause des algues."
  },
  {
    id: "plage-malo",
    name: "Plage de Malo-les-Bains",
    lat: 51.0496,
    lng: 2.3950,
    type: "Plage de sable (Surfcasting)",
    difficulty: "Facile",
    bestTides: "Montante de nuit (fin de soirée)",
    bestWinds: ["Sud", "Sud-Ouest", "Calme"],
    targetSpecies: ["sole", "flet", "bar"],
    description: "Grande plage de sable fin très douce. Parfaite pour s'initier au surfcasting. Les fonds sont très réguliers avec peu d'accroches.",
    advice: "Pêchez de nuit à la montante. Lancez à différentes distances (50m à 100m) pour localiser le passage des bancs de poissons plats.",
    safety: "En été, la pêche est interdite dans les zones de baignade surveillées en journée. Attendez la fin d'après-midi ou pêchez de nuit."
  },
  {
    id: "zuydcoote",
    name: "Plage de Zuydcoote",
    lat: 51.0712,
    lng: 2.4872,
    type: "Plage de sable sauvage (Surfcasting)",
    difficulty: "Moyen à Difficile (Marées piégeuses)",
    bestTides: "Premières heures de montante dans les bâches",
    bestWinds: ["Ouest", "Nord-Ouest", "Nord"],
    targetSpecies: ["bar", "flet"],
    description: "Une plage sauvage magnifique avec un profil très changeant. À marée basse, de grandes bâches (cuvettes de sable) se forment. À la montante, l'eau s'y engouffre, créant des courants parfaits pour le bar de belle taille.",
    advice: "Repérez les bâches à marée basse. Revenez à la montante et lancez dans la bâche ou sur les crêtes de sable où le bar vient chasser dans l'écume des vagues cassantes.",
    safety: "DANGER DE MORT : Les bâches se remplissent par l'arrière à la marée montante. Vous pouvez rapidement vous retrouver encerclé par l'eau et coupé de la plage. Ne restez jamais sur un banc de sable à la montante sans surveiller vos arrières."
  },
  {
    id: "bray-dunes",
    name: "Plage de Bray-Dunes",
    lat: 51.0805,
    lng: 2.5150,
    type: "Plage de sable (Surfcasting)",
    difficulty: "Moyen",
    bestTides: "2h avant la pleine mer à 2h après",
    bestWinds: ["Ouest", "Sud-Ouest", "Est"],
    targetSpecies: ["bar", "sole", "flet"],
    description: "La plage la plus au nord de la France, à la frontière belge. Profil de plage typique de la mer du Nord avec de belles passes sableuses.",
    advice: "Excellent spot pour le surfcasting d'automne. Les vers d'arénicole et de sable y donnent d'excellents résultats pour le flet et le bar de passage.",
    safety: "Comme à Zuydcoote, méfiez-vous de la vitesse de la marée montante dans les chenaux de sable."
  },
  {
    id: "petit-fort",
    name: "Jetée Ouest de Petit-Fort-Philippe (Gravelines)",
    lat: 51.0167,
    lng: 2.0950,
    type: "Jetée en béton / Embouchure",
    difficulty: "Moyen",
    bestTides: "Pleine mer et début de descendante",
    bestWinds: ["Sud", "Est", "Ouest modéré"],
    targetSpecies: ["bar", "maquereau", "flet"],
    description: "Située à l'embouchure du chenal de l'Aa à Gravelines. Ce spot profite des nutriments apportés par le fleuve et des forts courants de marée du chenal, attirant les prédateurs.",
    advice: "En été par eau claire, utilisez une mitraillette à plumes ou un leurre souple dans le courant pour piquer des maquereaux et des bars actifs.",
    safety: "Courants extrêmement violents dans le chenal. Pêche interdite dans le chenal même lors des entrées/sorties de bateaux. Attention aux lancers sur la digue opposée par vent fort."
  },
  {
    id: "oye-plage",
    name: "Plage des Hemmes d'Oye",
    lat: 51.0180,
    lng: 2.0250,
    type: "Plage de sable sauvage",
    difficulty: "Difficile (Marées très rapides)",
    bestTides: "Première heure de montante et fin de descendante",
    bestWinds: ["Ouest", "Nord-Ouest", "Nord"],
    targetSpecies: ["bar", "sole", "flet"],
    description: "Une plage immense et sauvage. À marée basse, la mer se retire à plus de 2 kilomètres, formant de vastes platiers sableux et des bâches. Très réputée pour le surfcasting lourd.",
    advice: "Les gros bars s'aventurent dans très peu d'eau à la montante. Privilégiez des vers de sable frais ou des arénicoles bien dégorgées. Pêchez léger si le vent le permet.",
    safety: "DANGER EXTRÊME : La vitesse de la marée montante est redoutable sur ce relief plat. Ne restez jamais sur un banc de sable sans surveiller vos arrières, l'eau remplit les chenaux (bâches) par derrière très rapidement."
  },
  {
    id: "jetee-calais",
    name: "Jetée Est de Calais",
    lat: 50.9702,
    lng: 1.8507,
    type: "Jetée en béton / Entrée de port",
    difficulty: "Moyen",
    bestTides: "2h avant la pleine mer à 2h après",
    bestWinds: ["Sud-Ouest", "Ouest", "Nord-Ouest"],
    targetSpecies: ["bar", "merlan", "cabillaud", "maquereau"],
    description: "Située à l'entrée du chenal du port de Calais. Elle offre un accès direct à des eaux profondes soumises aux forts courants du pas de Calais.",
    advice: "En été, idéale pour pêcher le maquereau à la mitraillette ou le bar au leurre souple le long des enrochements. En hiver, les doublés de merlans sont classiques de nuit.",
    safety: "Attention aux vagues de sillage des ferries. La digue est officiellement fermée au public en cas de fortes tempêtes ou de vents violents du Nord."
  },
  {
    id: "plage-calais",
    name: "Plage de Calais (Blériot-Plage)",
    lat: 50.9615,
    lng: 1.8150,
    type: "Plage de sable (Surfcasting)",
    difficulty: "Facile",
    bestTides: "Montante de nuit",
    bestWinds: ["Sud", "Sud-Ouest", "Est"],
    targetSpecies: ["sole", "flet", "bar"],
    description: "Grande plage de sable fin s'étendant à l'ouest du port de Calais, vers le Cap Blanc-Nez. Parfaite pour le surfcasting de nuit sur fonds propres.",
    advice: "La sole y est très active en été de nuit par mer calme. Utilisez di petits hameçons de type Aberdeen n°6 ou 8 garnis de vers de sable.",
    safety: "Zone touristique en été (respectez les zones de baignade en journée). Attention aux débris d'anciens blockhaus qui peuvent affleurer dans le sable à marée basse."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SPOTS_DATABASE;
}
