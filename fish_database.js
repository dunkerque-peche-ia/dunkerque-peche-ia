// Base de données des espèces de poissons pour le Dunkerquois
const FISH_DATABASE = [
  {
    id: "bar",
    name: "Bar Commun (Loup)",
    scientificName: "Dicentrarchus labrax",
    sizeLimit: "42 cm",
    season: "Juin à Novembre (Pic en Septembre/Octobre)",
    description: "Le roi de nos côtes. C'est un prédateur puissant qui aime le mouvement d'eau. Il se rapproche très près du bord pour chasser dans l'écume et les vagues.",
    idealConditions: {
      tides: ["Montante (dernières 2 heures)", "Pleine mer", "Descendante (première heure)"],
      coefficients: "Moyens à forts (60 à 95)",
      windDirections: ["Ouest", "Sud-Ouest", "Nord-Ouest"],
      windStrength: "Modéré à fort (crée des vagues et de l'écume)",
      weather: ["Nuageux", "Pluvieux", "Temps couvert", "Aube/Crépuscule"],
      tideStateText: "Actif dans l'écume à la montante, surtout par vent d'ouest établi."
    },
    rigs: [
      { name: "Poulie (Pulley Rig)", desc: "Pour lancer loin avec de gros appâts sans les abîmer." },
      { name: "Traînard long (Fluoro 35-40/100)", desc: "Présentation naturelle sur le fond pour les poissons méfiants." }
    ],
    baits: ["Ver d'arénicole (noir)", "Couteau frais", "Crabe vert (mou ou franc)", "Lançon/Equille"],
    tips: "Le bar chasse dans les vagues. Par vent d'ouest soutenu, inutile de jeter à 120m : le poisson est souvent dans les premiers 30 mètres, là où les vagues cassent et délogent la nourriture."
  },
  {
    id: "cabillaud",
    name: "Cabillaud (Morue)",
    scientificName: "Gadus morhua",
    sizeLimit: "35 cm",
    season: "Novembre à Février",
    description: "Le poisson emblématique des sorties hivernales glaciales. Il approche nos côtes lorsque la température de l'eau descend sous les 10°C.",
    idealConditions: {
      tides: ["Descendante", "Basse mer", "Montante"],
      coefficients: "Forts coefficients (plus de 80) préférés pour le courant",
      windDirections: ["Nord", "Nord-Est", "Est"],
      windStrength: "Modéré à fort (mer agitée et trouble)",
      weather: ["Froid intense", "Neigeux", "Brumeux", "Nuit complète"],
      tideStateText: "Recherche les eaux troubles et agitées de l'hiver, particulièrement la nuit."
    },
    rigs: [
      { name: "Pater Noster 2 empiles courtes", desc: "Empiles en 45/100 pour éviter les emmêlements dans le fort courant." },
      { name: "Pennel Rig (Double hameçon)", desc: "Pour présenter de grosses bouchées de vers arénicoles." }
    ],
    baits: ["Gros bouquet d'arénicoles noires", "Morceau de seiche", "Moule", "Couteau"],
    tips: "Pêchez de nuit lors des grandes marées d'hiver. Le vent de Nord-Est est glacial mais il lève une mer idéale pour rapprocher le cabillaud du bord sur la Digue du Braek."
  },
  {
    id: "merlan",
    name: "Merlan",
    scientificName: "Merlangius merlangus",
    sizeLimit: "27 cm",
    season: "Octobre à Mars",
    description: "Très abondant en hiver. C'est un poisson de banc très vorace. Les doublés ou triplés sont fréquents lorsque le banc est sur le spot.",
    idealConditions: {
      tides: ["Dernières heures de montante", "Pleine mer", "Premières heures de descendante"],
      coefficients: "Tous coefficients (marche bien par petits coefficients également)",
      windDirections: ["Sud-Ouest", "Ouest", "Est"],
      windStrength: "Faible à modéré",
      weather: ["Nuit complète", "Temps gris", "Brume de mer"],
      tideStateText: "Très actif dès la tombée de la nuit, sans préférence majeure de courant."
    },
    rigs: [
      { name: "Montage 3 empiles courtes (Paternoster)", desc: "Hameçons n°4 à n°1/0, empiles fines en 30/100." }
    ],
    baits: ["Ver d'arénicole", "Lanière de hareng ou de maquereau", "Ver de sable"],
    tips: "Le merlan adore les appâts gras. Ajoutez une petite lanière de hareng ou de maquereau sur la pointe de votre arénicole (cocktail) pour augmenter drastiquement les touches."
  },
  {
    id: "sole",
    name: "Sole Commune",
    scientificName: "Solea solea",
    sizeLimit: "24 cm",
    season: "Avril à Octobre",
    description: "Un poisson plat noble très recherché. Elle possède une activité principalement nocturne et s'alimente sur les fonds sablonneux et vaseux.",
    idealConditions: {
      tides: ["Basse mer (étale)", "Première heure de montante", "Fin de descendante"],
      coefficients: "Faibles coefficients (40 à 60) pour éviter que le plomb dérive trop",
      windDirections: ["Sud", "Est", "Sud-Est"],
      windStrength: "Calme à modéré (mer plate à peu agitée)",
      weather: ["Chaud et lourd", "Orageux", "Nuit noire"],
      tideStateText: "S'alimente au ras du sable dans le calme de la nuit."
    },
    rigs: [
      { name: "Montage portugais / Traînards bas", desc: "Empiles très longues traînant sur le sable avec perles phosphorescentes." }
    ],
    baits: ["Ver de côte (escabène)", "Ver de sable (blanc)", "Petite arénicole rouge"],
    tips: "La sole repère la nourriture grâce à son odorat et sa sensibilité. Utilisez des empiles fines posées au fond et des hameçons fins (type Aberdeen n°6 ou n°8). Les perles phosphorescentes chargées à la lampe UV sont redoutables."
  },
  {
    id: "flet",
    name: "Flet Commun / Plie",
    scientificName: "Platichthys flesus / Pleuronectes platessa",
    sizeLimit: "25 cm (flet) / 27 cm (plie)",
    season: "Septembre à Avril",
    description: "Poissons plats robustes et combatifs. Le flet supporte très bien les eaux saumâtres et se trouve souvent près des entrées de ports et canaux.",
    idealConditions: {
      tides: ["Montante", "Pleine Mer", "Descendante"],
      coefficients: "Moyens (50 à 80)",
      windDirections: ["Ouest", "Nord-Ouest", "Nord"],
      windStrength: "Modéré (mer ridée à agitée)",
      weather: ["Temps couvert", "Journée classique", "Aube"],
      tideStateText: "Actif de jour comme de nuit, suit la marée pour fouiller le sable."
    },
    rigs: [
      { name: "Montage 3 empiles courtes avec perles flottantes", desc: "Perles colorées (rouges, jaunes) pour attirer leur curiosité visuelle." }
    ],
    baits: ["Ver de sable", "Arénicole", "Néréide physique (demi-dure)"],
    tips: "Le flet est extrêmement curieux. Utilisez des perles colorées (jaunes, rouges, vertes) et même des petites cuillères ou hélices devant vos appâts. Secouer un peu le plomb sur le fond crée un nuage de sable qui attire le flet de loin."
  },
  {
    id: "maquereau",
    name: "Maquereau Commun",
    scientificName: "Scomber scombrus",
    sizeLimit: "20 cm",
    season: "Juin à Septembre",
    description: "Poisson pélagique rapide qui chasse en banc. Il se rapproche des digues du Nord pendant l'été à la poursuite des bancs d'alevins.",
    idealConditions: {
      tides: ["Pleine mer (1h avant à 1h après)"],
      coefficients: "Moyens à forts (plus de 65)",
      windDirections: ["Sud", "Est", "Sud-Est"],
      windStrength: "Calme (mer claire et transparente indispensable)",
      weather: ["Grand soleil", "Ciel bleu", "Plein après-midi"],
      tideStateText: "Chasse à vue en pleine eau à marée haute par temps ensoleillé."
    },
    rigs: [
      { name: "Plume / Mitraillette", desc: "Train de 4 à 6 plumes colorées ou brillantes (peau de maquereau) lesté d'un plomb ou d'une cuillère." }
    ],
    baits: ["Plumes synthétiques", "Leurre métallique (casting jig)", "Lanière de maquereau ou de hareng au bouchon"],
    tips: "Indispensable d'avoir une eau claire. Repérez les chasses d'oiseaux marins ou les bouillonnements à la surface. Ramenez votre mitraillette de façon saccadée en pleine eau depuis la digue de Malo ou le Braek."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FISH_DATABASE;
}
