/**
 * @typedef {Object} Format
 * @property {string}  title
 * @property {string}  description
 * @property {string=} duration
 * @property {string=} price
 * @property {string=} capacity
 *
 * @typedef {Object} Prestation
 * @property {string}   slug
 * @property {string}   title
 * @property {string}   tagline
 * @property {string}   summary
 * @property {string}   videoSrc
 * @property {string}   poster
 * @property {Format[]} formats
 */

export const prestations = [
  {
    slug: 'stage-prive',
    title: 'Stage privé',
    tagline: 'Coaching premium personnalisé sur une journée.',
    summary: "Une journée complète de coaching technique individualisé à Grenoble. Matinée sur un spot technique (posture, virages, marches, noses, bunny-up), après-midi sur les meilleurs singles de Grenoble pour mettre en application. 1 à 3 personnes.",
    videoSrc: '/videos/stage-prive.mp4',
    poster: '/posters/stage-prive.webp',
    formats: [
      { title: 'Enduro & technique de pilotage', description: "Posture de base aux gestes spécifiques, puis application sur singles bijoux." },
      { title: 'Enduro & sauts',                 description: "Technique le matin, découverte progressive des sauts l'après-midi." },
      { title: 'Enduro & pilotage trial',        description: "Singles ultra techniques, racines, rochers, épingles serrées." },
      { title: 'Pilotage all-mountain',          description: "Maîtrise des descentes sinueuses pour randonneurs et longues distances." },
      { title: 'Enduro Ebike',                   description: "Spécificités du Ebike : montées techniques et franchissements." },
    ],
  },
  {
    slug: 'lecons-privees',
    title: 'Leçons privées',
    tagline: 'Progression technique régulière, par abonnement.',
    summary: "Service réservé aux Grenoblois, du XC à l'enduro, tous niveaux. Approche trial. Séances de 1h30 à 2h sur spots naturels proches de Grenoble (matin / pause déj / afterwork). Tarif dégressif de 1 à 3 personnes.",
    videoSrc: '/videos/lecons-privees.mp4',
    poster: '/posters/lecons-privees.webp',
    formats: [
      { title: '1ère séance',           description: "1er contact : 2h sur le spot principal pour échanger besoins et démarrer le travail technique.", duration: '2h' },
      { title: 'Abonnement mensuel',    description: "1 séance par mois, planification et fiche de suivi de progression.", duration: '1h30 à 2h', capacity: '1 à 3 pers.' },
      { title: 'Abonnement bi-mensuel', description: "2 séances par mois, rythme soutenu de progression.",               duration: '1h30 à 2h', capacity: '1 à 3 pers.' },
      { title: 'Coaching à la carte',   description: "Perfectionnement all-mountain, VTTAE, enduro, XC, trial.",         duration: '3h / ½ journée / journée', capacity: '1 à 4 pers.' },
    ],
  },
  {
    slug: 'creations-originales',
    title: 'Créations originales',
    tagline: 'Formats collectifs, dates planifiées.',
    summary: "Plusieurs fois par an, en complément des stages privés, des formats collectifs. Places limitées, règlement en début de session.",
    videoSrc: '/videos/creations-originales.mp4',
    poster: '/posters/creations-originales.webp',
    formats: [
      { title: 'Stage enduro collectif',   description: "Matinée technique, après-midi sur singles bijoux d'un spot enduro.", duration: 'journée', price: '70 €', capacity: '8 pers max' },
      { title: 'Trial training camp',      description: "Pure VTT Trial sur 2 jours, sur les spots du RTF38 (Fontaine et St-Nizier).", duration: '2 jours', price: '90 €', capacity: '8 pers max' },
      { title: 'Collectif trial adulte',   description: "Apprentissage et perfectionnement trial sur terrain de VTT Trial.", duration: '1h30', price: '25 €' },
      { title: 'Journées shuttles',        description: "Journées shuttle, 2 fois par an.", duration: 'journée' },
    ],
  },
];
