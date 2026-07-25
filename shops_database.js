// Base de données des magasins de pêche (matériel & appâts) du secteur
const SHOPS_DATABASE = [
  {
    id: "littoral-peche",
    name: "Littoral Pêche",
    lat: 51.0425,
    lng: 2.3835,
    address: "93 Boulevard de la République François Mitterrand, 59240 Dunkerque",
    phone: "03 28 63 43 00",
    description: "Le magasin de référence à Dunkerque. Grand choix pour le surfcasting, la pêche des carnassiers et de la carpe. Grand choix d'appâts frais et vivants.",
    baits: ["Demi-dures", "Dures rouges", "Dures vertes", "Arénicoles fraîches", "Vers de sable"],
    brands: ["Shimano", "Daiwa", "Sunset", "VMC", "Decoy", "Mitchell"],
    hours: "Mardi au Samedi : 9h00 - 12h00, 14h00 - 19h00"
  },
  {
    id: "acket-peche",
    name: "Acket Pêches",
    lat: 51.0540,
    lng: 2.3580,
    address: "Terre-plein Guillain, Route de l'Écluse Trystram, 59140 Dunkerque",
    phone: "03 28 66 84 84",
    description: "Spécialiste de la pêche en mer à Dunkerque. Matériel surfcasting haut de gamme, appâts marins frais de grande qualité et conseils de spécialistes locaux.",
    baits: ["Arénicoles noires", "Dures", "Demi-dures", "Couteaux congelés"],
    brands: ["Daiwa", "Penn", "Sunset", "Sakuma", "Mustad"],
    hours: "Lundi au Samedi : 8h30 - 12h00, 14h00 - 18h30"
  },
  {
    id: "gravelines-fishing",
    name: "Gravelines Fishing Shop",
    lat: 50.9870,
    lng: 2.1255,
    address: "7 Rue Léon Blum, 59820 Gravelines",
    phone: "03 28 23 04 59",
    description: "Boutique de proximité indispensable pour les pêcheurs de Gravelines. Idéal pour s'équiper avant de pêcher à l'embouchure de l'Aa.",
    baits: ["Dures de pays", "Demi-dures", "Arénicoles", "Crabes mous (selon saison)"],
    brands: ["Shimano", "Sunset", "Ragot", "VMC", "Rapala"],
    hours: "Mardi au Samedi : 9h00 - 12h00, 14h00 - 19h00"
  },
  {
    id: "louguet-peche",
    name: "Louguet Pêche",
    lat: 50.9485,
    lng: 1.8485,
    address: "54 Boulevard Curie, 62100 Calais",
    phone: "03 21 34 72 26",
    description: "Établissement historique à Calais. Une mine de conseils pour la pêche en mer du Nord, de la jetée ou de la plage. Appâts vivants arrivant régulièrement.",
    baits: ["Arénicoles fraîches", "Dures rouges", "Demi-dures", "Vers de sable", "Asticots"],
    brands: ["Shimano", "Daiwa", "Penn", "Sunset", "Sakuma", "Tronixpro"],
    hours: "Mardi au Samedi : 9h00 - 12h00, 14h00 - 19h00"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHOPS_DATABASE;
}
