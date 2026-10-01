import type { Category, Localized, Product, ProductColor, ProductImage } from "@/lib/types";

/*
 * Mock catalogue for the demo store.
 * Everything here is read through `lib/catalog.ts`, so replacing this file
 * with an API or PostgreSQL query only touches that one module.
 */

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

type Crop = { x: number; y: number; zoom: number };

/**
 * Builds an Unsplash (imgix) URL cropped to `aspect` (pass null to keep the
 * original ratio), optionally zoomed into a focal point.
 */
export function unsplash(id: string, crop?: Crop, aspect: string | null = "4:5", width = 1400): string {
  const params = new URLSearchParams({ w: String(width), fit: "crop", auto: "format", q: "80" });
  if (aspect) params.set("ar", aspect);
  if (crop) {
    params.set("crop", "focalpoint");
    params.set("fp-x", String(crop.x));
    params.set("fp-y", String(crop.y));
    params.set("fp-z", String(crop.zoom));
  }
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

const VIEW = {
  look: { en: "full look", de: "Gesamtlook" },
  detail: { en: "detail", de: "Detailansicht" },
  texture: { en: "fabric close-up", de: "Material im Detail" },
} satisfies Record<string, Localized>;

/** Main shot plus two zoomed detail crops of the same photo. */
function gallery(id: string, detail: Crop, texture: Crop, main?: Crop): ProductImage[] {
  return [
    { src: unsplash(id, main), view: VIEW.look },
    { src: unsplash(id, detail), view: VIEW.detail },
    { src: unsplash(id, texture), view: VIEW.texture },
  ];
}

// ---------------------------------------------------------------------------
// Colours & sizes
// ---------------------------------------------------------------------------

export const COLORS = {
  ivory: { id: "ivory", name: { en: "Ivory", de: "Elfenbein" }, hex: "#f1eadc" },
  sand: { id: "sand", name: { en: "Sand", de: "Sand" }, hex: "#d8c6aa" },
  camel: { id: "camel", name: { en: "Camel", de: "Camel" }, hex: "#b88a5c" },
  cognac: { id: "cognac", name: { en: "Cognac", de: "Cognac" }, hex: "#8b4f2b" },
  blush: { id: "blush", name: { en: "Blush", de: "Rosé" }, hex: "#e3bcb2" },
  poppy: { id: "poppy", name: { en: "Poppy", de: "Mohnrot" }, hex: "#b3322d" },
  bordeaux: { id: "bordeaux", name: { en: "Bordeaux", de: "Bordeaux" }, hex: "#6b1f2a" },
  plum: { id: "plum", name: { en: "Plum", de: "Pflaume" }, hex: "#5c2347" },
  saffron: { id: "saffron", name: { en: "Saffron", de: "Safran" }, hex: "#e0962c" },
  sky: { id: "sky", name: { en: "Sky", de: "Himmelblau" }, hex: "#a8c0d8" },
  forest: { id: "forest", name: { en: "Forest", de: "Tannengrün" }, hex: "#2f4a3a" },
  charcoal: { id: "charcoal", name: { en: "Charcoal", de: "Anthrazit" }, hex: "#3a3734" },
  black: { id: "black", name: { en: "Black", de: "Schwarz" }, hex: "#151413" },
  gold: { id: "gold", name: { en: "Gold", de: "Gold" }, hex: "#c9a45c" },
} satisfies Record<string, ProductColor>;

const APPAREL = ["XS", "S", "M", "L", "XL"];
const SHOES = ["36", "37", "38", "39", "40", "41"];
const ONE_SIZE = ["One size"];

/** Display order for the size filter. */
export const SIZE_ORDER = [...APPAREL, ...SHOES, ...ONE_SIZE];

// ---------------------------------------------------------------------------
// Shared copy
// ---------------------------------------------------------------------------

const CARE = {
  delicate: {
    en: ["Hand wash cold or dry clean", "Do not tumble dry", "Cool iron on the reverse"],
    de: ["Kalte Handwäsche oder chemische Reinigung", "Nicht im Trockner trocknen", "Auf links bei niedriger Temperatur bügeln"],
  },
  cotton: {
    en: ["Machine wash at 30°C", "Wash with similar colours", "Dry flat, iron on medium heat"],
    de: ["Maschinenwäsche bei 30 °C", "Mit ähnlichen Farben waschen", "Liegend trocknen, bei mittlerer Temperatur bügeln"],
  },
  wool: {
    en: ["Dry clean only", "Brush gently after wearing", "Store on a wide hanger"],
    de: ["Nur chemische Reinigung", "Nach dem Tragen sanft ausbürsten", "Auf einem breiten Bügel aufbewahren"],
  },
  knit: {
    en: ["Hand wash cold with wool detergent", "Dry flat in shape", "Fold, do not hang"],
    de: ["Kalte Handwäsche mit Wollwaschmittel", "In Form liegend trocknen", "Gefaltet lagern, nicht aufhängen"],
  },
  leather: {
    en: ["Wipe with a soft, dry cloth", "Condition the leather twice a year", "Store in the dust bag provided"],
    de: ["Mit einem weichen, trockenen Tuch abwischen", "Leder zweimal im Jahr pflegen", "Im mitgelieferten Staubbeutel aufbewahren"],
  },
  jewellery: {
    en: ["Avoid contact with water and perfume", "Polish with a soft cloth", "Store separately in the pouch provided"],
    de: ["Kontakt mit Wasser und Parfum vermeiden", "Mit einem weichen Tuch polieren", "Separat im mitgelieferten Beutel aufbewahren"],
  },
} satisfies Record<string, Localized<string[]>>;

/** Editorial imagery used outside product pages. */
export const editorialImages = {
  hero: unsplash("1558769132-cb1aea458c5e", undefined, null, 2400),
  featured: unsplash("1485462537746-965f33f7f6a7", undefined, "4:5", 1600),
  heroDetail: unsplash("1434389677669-e08b4cac3105", { x: 0.5, y: 0.55, zoom: 1.4 }, "3:4", 900),
  menuLatest: unsplash("1566174053879-31528523f8ae", undefined, "4:5", 900),
  story: unsplash("1490481651871-ab68de25d43d", undefined, "4:5", 1600),
  storyDetail: unsplash("1617038220319-276d3cfab638", { x: 0.5, y: 0.6, zoom: 1.5 }, "3:4", 800),
  aboutHero: unsplash("1434389677669-e08b4cac3105", { x: 0.5, y: 0.55, zoom: 1.6 }, "16:9", 2400),
  aboutStudio: unsplash("1551232864-3f0890e580d9", undefined, "4:5", 1600),
  contact: unsplash("1558769132-cb1aea458c5e", { x: 0.7, y: 0.5, zoom: 1.5 }, "4:5", 1600),
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  { slug: "dresses", name: { en: "Dresses", de: "Kleider" }, image: unsplash("1515372039744-b8f02a3ae446", undefined, "3:4") },
  { slug: "knitwear", name: { en: "Knitwear & Tops", de: "Strick & Oberteile" }, image: unsplash("1578587018452-892bacefd3f2", undefined, "3:4") },
  { slug: "outerwear", name: { en: "Outerwear", de: "Mäntel & Jacken" }, image: unsplash("1539109136881-3be0616acf4b", undefined, "3:4") },
  { slug: "accessories", name: { en: "Accessories", de: "Accessoires" }, image: unsplash("1535043934128-cf0b28d52f95", undefined, "3:4") },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // Dresses -------------------------------------------------------------
  {
    id: "p-001",
    slug: "mira-wrap-maxi-dress",
    name: "Mira Wrap Maxi Dress",
    category: "dresses",
    price: 18900,
    description: {
      en: "A fluid wrap dress cut from washed viscose crepe that moves with every step. The deep V-neckline, self-tie waist and high front slit make it as right for a summer wedding as for a long lunch by the sea.",
      de: "Ein fließendes Wickelkleid aus gewaschenem Viskose-Crêpe, das jede Bewegung mitgeht. Tiefer V-Ausschnitt, Bindegürtel und hoher Schlitz – passend für eine Sommerhochzeit ebenso wie für ein langes Mittagessen am Meer.",
    },
    material: { en: "100% viscose crepe", de: "100 % Viskose-Crêpe" },
    details: {
      en: ["Wrap front with internal button", "Self-tie waist belt", "Floor-length with front slit", "Model is 176 cm and wears size S"],
      de: ["Wickeloptik mit innenliegendem Knopf", "Bindegürtel aus gleichem Stoff", "Bodenlang mit Schlitz vorne", "Das Model ist 176 cm groß und trägt Größe S"],
    },
    care: CARE.delicate,
    colors: [COLORS.sky, COLORS.ivory],
    sizes: APPAREL,
    images: gallery("1539008835657-9e8e9680c956", { x: 0.5, y: 0.4, zoom: 2 }, { x: 0.45, y: 0.75, zoom: 2.6 }),
    createdAt: "2026-09-18",
  },
  {
    id: "p-002",
    slug: "elodie-broderie-dress",
    name: "Elodie Broderie Dress",
    category: "dresses",
    price: 14900,
    description: {
      en: "Crisp cotton broderie anglaise shaped into an off-the-shoulder mini dress. Gentle smocking at the bodice keeps it in place, while a tiered skirt adds lightness.",
      de: "Knackige Baumwoll-Lochstickerei, geformt zu einem schulterfreien Minikleid. Ein sanfter Smokbund hält das Oberteil an Ort und Stelle, der Stufenrock sorgt für Leichtigkeit.",
    },
    material: { en: "100% organic cotton, cotton lining", de: "100 % Bio-Baumwolle, Baumwollfutter" },
    details: {
      en: ["Elasticated off-shoulder neckline", "Tiered skirt", "Fully lined", "Mid-thigh length"],
      de: ["Elastischer Carmen-Ausschnitt", "Stufenrock", "Vollständig gefüttert", "Länge bis Mitte Oberschenkel"],
    },
    care: CARE.cotton,
    colors: [COLORS.ivory],
    sizes: APPAREL,
    images: gallery("1515372039744-b8f02a3ae446", { x: 0.5, y: 0.35, zoom: 2.4 }, { x: 0.5, y: 0.5, zoom: 3 }),
    createdAt: "2026-09-02",
  },
  {
    id: "p-003",
    slug: "rosalie-floral-midi-dress",
    name: "Rosalie Floral Midi Dress",
    category: "dresses",
    price: 15900,
    description: {
      en: "A softly gathered midi dress in a painterly rose print, inspired by vintage wallpaper found in a Leipzig flat. Light enough for late summer, easy to layer with knitwear when the evenings cool.",
      de: "Ein weich gerafftes Midikleid mit malerischem Rosenprint, inspiriert von einer alten Tapete aus einer Leipziger Altbauwohnung. Leicht genug für den Spätsommer, mit Strick kombiniert auch für kühlere Abende.",
    },
    material: { en: "100% certified low-impact viscose", de: "100 % zertifizierte, ressourcenschonende Viskose" },
    details: {
      en: ["Gathered waist with hidden side zip", "Short flutter sleeves", "Midi length", "Print exclusive to Maison Lume"],
      de: ["Gerafte Taille mit verdecktem Seitenreißverschluss", "Kurze Flatterärmel", "Midilänge", "Exklusiver Maison-Lume-Print"],
    },
    care: CARE.delicate,
    colors: [COLORS.ivory, COLORS.blush],
    sizes: APPAREL,
    images: gallery("1496747611176-843222e1e57c", { x: 0.45, y: 0.45, zoom: 2 }, { x: 0.55, y: 0.65, zoom: 2.8 }),
    createdAt: "2026-08-21",
  },
  {
    id: "p-004",
    slug: "clara-pleated-maxi-dress",
    name: "Clara Pleated Maxi Dress",
    category: "dresses",
    price: 22900,
    compareAtPrice: 26900,
    description: {
      en: "Our statement dress for the season: a halter-neck maxi with a full sunray-pleated skirt that catches the light as it moves. Wear it with flat sandals by day, heels after dark.",
      de: "Unser Statement-Kleid der Saison: ein Neckholder-Maxikleid mit weitem Sonnenplissee, das bei jeder Bewegung das Licht einfängt. Tagsüber mit flachen Sandalen, abends mit Absatz.",
    },
    material: { en: "Recycled polyester georgette", de: "Georgette aus recyceltem Polyester" },
    details: {
      en: ["Halter neck with button fastening", "Sunray-pleated skirt", "Partially lined", "Floor-length"],
      de: ["Neckholder mit Knopfverschluss", "Sonnenplissee-Rock", "Teilweise gefüttert", "Bodenlang"],
    },
    care: CARE.delicate,
    colors: [COLORS.poppy, COLORS.black],
    sizes: APPAREL,
    images: gallery("1595777457583-95e059d581b8", { x: 0.5, y: 0.4, zoom: 2 }, { x: 0.5, y: 0.75, zoom: 2.4 }),
    createdAt: "2026-07-30",
  },
  {
    id: "p-005",
    slug: "noemi-off-shoulder-gown",
    name: "Noemi Off-Shoulder Gown",
    category: "dresses",
    price: 24900,
    description: {
      en: "Sculpted from a heavy stretch crepe, Noemi has a folded off-shoulder neckline and a column silhouette that skims the body. Considered evening wear with nothing superfluous.",
      de: "Noemi ist aus schwerem Stretch-Crêpe gearbeitet, mit gefaltetem Carmen-Ausschnitt und einer schmalen Säulensilhouette. Durchdachte Abendmode ohne Überflüssiges.",
    },
    material: { en: "92% viscose, 8% elastane", de: "92 % Viskose, 8 % Elasthan" },
    details: {
      en: ["Folded off-shoulder neckline", "Concealed back zip", "Back vent for ease of movement", "Floor-length"],
      de: ["Gefalteter Carmen-Ausschnitt", "Verdeckter Rückenreißverschluss", "Gehschlitz hinten", "Bodenlang"],
    },
    care: CARE.delicate,
    colors: [COLORS.plum, COLORS.black],
    sizes: APPAREL,
    images: gallery("1566174053879-31528523f8ae", { x: 0.55, y: 0.45, zoom: 1.8 }, { x: 0.55, y: 0.7, zoom: 2.6 }),
    createdAt: "2026-09-25",
  },

  // Knitwear & Tops ---------------------------------------------------------
  {
    id: "p-006",
    slug: "ilse-fringed-knit-poncho",
    name: "Ilse Fringed Knit Poncho",
    category: "knitwear",
    price: 12900,
    description: {
      en: "An airy open-stitch poncho in undyed cotton, finished with a hand-knotted fringe. Throw it over a slip dress or a simple tee — it is the piece you will reach for all autumn.",
      de: "Ein luftiger Poncho im Lochstrickmuster aus ungefärbter Baumwolle, mit handgeknoteten Fransen. Über ein Slipdress oder ein schlichtes T-Shirt geworfen – das Teil, zu dem Sie den ganzen Herbst greifen werden.",
    },
    material: { en: "100% organic cotton, undyed", de: "100 % Bio-Baumwolle, ungefärbt" },
    details: {
      en: ["Open-stitch knit", "Hand-knotted fringe", "V-neckline", "Knitted in a family workshop in Portugal"],
      de: ["Lochstrick", "Handgeknotete Fransen", "V-Ausschnitt", "Gestrickt in einer Familienmanufaktur in Portugal"],
    },
    care: CARE.knit,
    colors: [COLORS.ivory, COLORS.sand],
    sizes: ONE_SIZE,
    images: gallery("1434389677669-e08b4cac3105", { x: 0.5, y: 0.35, zoom: 1.8 }, { x: 0.5, y: 0.6, zoom: 2.2 }),
    createdAt: "2026-09-22",
    featured: true,
  },
  {
    id: "p-007",
    slug: "ronja-chevron-jumper",
    name: "Ronja Chevron Jumper",
    category: "knitwear",
    price: 13900,
    description: {
      en: "A relaxed jumper with a bold intarsia chevron, knitted from a soft merino and alpaca blend. Slightly cropped, with dropped shoulders and ribbed edges.",
      de: "Ein lässiger Pullover mit markantem Intarsien-Zickzack, gestrickt aus einer weichen Merino-Alpaka-Mischung. Leicht verkürzt, mit überschnittenen Schultern und Rippbündchen.",
    },
    material: { en: "60% merino wool, 40% baby alpaca", de: "60 % Merinowolle, 40 % Baby-Alpaka" },
    details: {
      en: ["Intarsia chevron pattern", "Dropped shoulders", "Ribbed neck, cuffs and hem", "Relaxed, slightly cropped fit"],
      de: ["Intarsien-Zickzackmuster", "Überschnittene Schultern", "Rippbündchen an Kragen, Ärmeln und Saum", "Lässige, leicht verkürzte Passform"],
    },
    care: CARE.knit,
    colors: [COLORS.camel, COLORS.charcoal],
    sizes: APPAREL,
    images: gallery("1475180098004-ca77a66827be", { x: 0.5, y: 0.35, zoom: 2 }, { x: 0.45, y: 0.4, zoom: 3 }),
    createdAt: "2026-09-10",
    featured: true,
  },
  {
    id: "p-008",
    slug: "juna-cotton-crewneck",
    name: "Juna Cotton Crewneck",
    category: "knitwear",
    price: 8900,
    description: {
      en: "The everyday crewneck, done properly. Dense loopback cotton gives it structure, and the colour comes from a low-impact dye house in Italy.",
      de: "Der Alltags-Pullover, richtig gemacht. Dichter Loopback-Baumwollstoff gibt ihm Struktur, die Farbe stammt aus einer ressourcenschonenden Färberei in Italien.",
    },
    material: { en: "100% organic cotton loopback", de: "100 % Bio-Baumwolle, Loopback" },
    details: {
      en: ["Ribbed crew neck", "Raglan sleeves", "Regular fit", "Pre-washed to prevent shrinking"],
      de: ["Gerippter Rundhalsausschnitt", "Raglanärmel", "Normale Passform", "Vorgewaschen gegen Einlaufen"],
    },
    care: CARE.cotton,
    colors: [COLORS.saffron, COLORS.ivory, COLORS.charcoal],
    sizes: APPAREL,
    images: gallery("1578587018452-892bacefd3f2", { x: 0.5, y: 0.45, zoom: 1.8 }, { x: 0.6, y: 0.55, zoom: 2.8 }),
    createdAt: "2026-08-14",
  },
  {
    id: "p-009",
    slug: "ottilie-bow-blouse",
    name: "Ottilie Bow Blouse",
    category: "knitwear",
    price: 9900,
    description: {
      en: "A refined take on the pussy-bow blouse in fluid satin crepe, with a slim contrast tie at the collar. Tuck it into tailored trousers for the office, or wear it loose with denim.",
      de: "Eine elegante Interpretation der Schluppenbluse aus fließendem Satin-Crêpe, mit schmaler Kontrastschleife am Kragen. In die Anzughose gesteckt fürs Büro oder locker zur Jeans.",
    },
    material: { en: "100% recycled polyester satin crepe", de: "100 % Satin-Crêpe aus recyceltem Polyester" },
    details: {
      en: ["Contrast tie at collar", "Concealed button placket", "Buttoned cuffs", "Regular fit"],
      de: ["Kontrastschleife am Kragen", "Verdeckte Knopfleiste", "Manschetten mit Knöpfen", "Normale Passform"],
    },
    care: CARE.delicate,
    colors: [COLORS.ivory, COLORS.black],
    sizes: APPAREL,
    images: gallery("1608234807905-4466023792f5", { x: 0.5, y: 0.35, zoom: 2 }, { x: 0.5, y: 0.3, zoom: 3 }),
    createdAt: "2026-09-05",
  },
  {
    id: "p-010",
    slug: "liesel-ruffle-blouse",
    name: "Liesel Ruffle Blouse",
    category: "knitwear",
    price: 11900,
    description: {
      en: "Romantic but not saccharine: a voluminous blouse in soft flocked-dot tulle, with a ruffled off-shoulder neckline and generous balloon sleeves.",
      de: "Romantisch, aber nicht verkitscht: eine voluminöse Bluse aus weichem Tüll mit Samtpunkten, Rüschen-Carmen-Ausschnitt und großzügigen Ballonärmeln.",
    },
    material: { en: "Recycled polyester tulle, cotton jersey lining", de: "Tüll aus recyceltem Polyester, Futter aus Baumwolljersey" },
    details: {
      en: ["Ruffled off-shoulder neckline", "Balloon sleeves with elasticated cuffs", "Relaxed fit", "Lined bodice, sheer sleeves"],
      de: ["Rüschen-Carmen-Ausschnitt", "Ballonärmel mit elastischen Bündchen", "Lockere Passform", "Gefüttertes Oberteil, transparente Ärmel"],
    },
    care: CARE.delicate,
    colors: [COLORS.blush],
    sizes: APPAREL,
    images: gallery("1581044777550-4cfa60707c03", { x: 0.5, y: 0.5, zoom: 1.7 }, { x: 0.45, y: 0.65, zoom: 2.6 }),
    createdAt: "2026-07-12",
  },

  // Outerwear ------------------------------------------------------------
  {
    id: "p-011",
    slug: "vera-double-faced-wool-coat",
    name: "Vera Double-Faced Wool Coat",
    category: "outerwear",
    price: 34900,
    description: {
      en: "Hand-finished double-faced wool, unlined so it stays light while still keeping out the November wind. A wide notch lapel and clean lines make it the coat you will wear for a decade.",
      de: "Handveredelte Doubleface-Wolle, ungefüttert und dadurch leicht, aber dennoch winddicht im November. Breites Reverskragen und klare Linien – ein Mantel, den Sie ein Jahrzehnt tragen werden.",
    },
    material: { en: "90% virgin wool, 10% cashmere", de: "90 % Schurwolle, 10 % Kaschmir" },
    details: {
      en: ["Double-faced, hand-finished seams", "Notch lapel", "Two welt pockets", "Falls just below the knee"],
      de: ["Doubleface-Verarbeitung mit handgenähten Nähten", "Reverskragen", "Zwei Paspeltaschen", "Länge knapp unter dem Knie"],
    },
    care: CARE.wool,
    colors: [COLORS.bordeaux, COLORS.camel],
    sizes: APPAREL,
    images: gallery("1483985988355-763728e1935b", { x: 0.5, y: 0.45, zoom: 1.8 }, { x: 0.45, y: 0.6, zoom: 2.6 }),
    createdAt: "2026-09-28",
    featured: true,
  },
  {
    id: "p-012",
    slug: "fenja-wool-blend-coat",
    name: "Fenja Wool-Blend Coat",
    category: "outerwear",
    price: 29900,
    description: {
      en: "A softly tailored single-breasted coat in a muted blush, the colour of old roses. Wear it over knitwear and denim to make an ordinary day feel considered.",
      de: "Ein weich geschnittener, einreihiger Mantel in gedämpftem Rosé – die Farbe alter Rosen. Über Strick und Denim getragen, wirkt jeder gewöhnliche Tag durchdacht.",
    },
    material: { en: "70% wool, 30% recycled polyamide", de: "70 % Wolle, 30 % recyceltes Polyamid" },
    details: {
      en: ["Single-breasted with horn-effect buttons", "Patch pockets", "Fully lined in cupro", "Mid-calf length"],
      de: ["Einreihig mit Knöpfen in Hornoptik", "Aufgesetzte Taschen", "Komplett mit Cupro gefüttert", "Wadenlang"],
    },
    care: CARE.wool,
    colors: [COLORS.blush, COLORS.sand],
    sizes: APPAREL,
    images: gallery("1485462537746-965f33f7f6a7", { x: 0.5, y: 0.45, zoom: 2.2 }, { x: 0.5, y: 0.55, zoom: 3 }),
    createdAt: "2026-09-14",
  },
  {
    id: "p-013",
    slug: "hedda-check-coat",
    name: "Hedda Check Coat",
    category: "outerwear",
    price: 31900,
    description: {
      en: "A deep forest check woven in a family-run mill in the Scottish Borders. Generously cut to fit over a chunky knit, with a collar you can turn up against the rain.",
      de: "Ein tiefgrünes Karo, gewebt in einer Familienweberei in den Scottish Borders. Großzügig geschnitten, damit auch dicker Strick darunter passt, mit einem Kragen, den man gegen den Regen aufstellen kann.",
    },
    material: { en: "100% British wool", de: "100 % britische Wolle" },
    details: {
      en: ["Oversized fit", "Convertible collar", "Side seam pockets", "Woven in Scotland, made in Poland"],
      de: ["Oversized-Passform", "Variabler Kragen", "Eingesetzte Seitentaschen", "Gewebt in Schottland, genäht in Polen"],
    },
    care: CARE.wool,
    colors: [COLORS.forest, COLORS.charcoal],
    sizes: APPAREL,
    images: gallery("1485968579580-b6d095142e6e", { x: 0.5, y: 0.45, zoom: 2 }, { x: 0.45, y: 0.55, zoom: 3 }),
    createdAt: "2026-08-30",
  },
  {
    id: "p-014",
    slug: "aline-oversized-coat",
    name: "Aline Oversized Coat",
    category: "outerwear",
    price: 27900,
    compareAtPrice: 32900,
    description: {
      en: "An oversized coat in a pale sky blue, with deep cuffs and a belted waist you can wear tied or loose. A brighter way into the colder months.",
      de: "Ein Oversized-Mantel in hellem Himmelblau, mit breiten Ärmelaufschlägen und einem Gürtel, der gebunden oder offen getragen werden kann. Ein hellerer Start in die kalten Monate.",
    },
    material: { en: "80% wool, 20% polyamide", de: "80 % Wolle, 20 % Polyamid" },
    details: {
      en: ["Dropped shoulders", "Removable tie belt", "Deep turn-back cuffs", "Ankle length"],
      de: ["Überschnittene Schultern", "Abnehmbarer Bindegürtel", "Breite Ärmelaufschläge", "Knöchellang"],
    },
    care: CARE.wool,
    colors: [COLORS.sky],
    sizes: APPAREL,
    images: gallery("1539109136881-3be0616acf4b", { x: 0.5, y: 0.5, zoom: 1.8 }, { x: 0.5, y: 0.45, zoom: 2.6 }),
    createdAt: "2026-08-08",
  },

  // Accessories -------------------------------------------------------------
  {
    id: "p-015",
    slug: "lou-woven-leather-bag",
    name: "Lou Woven Leather Bag",
    category: "accessories",
    price: 16900,
    description: {
      en: "A structured top-handle bag that pairs hand-woven rattan with vegetable-tanned leather. Roomy enough for the essentials, with a detachable strap for wearing across the body.",
      de: "Eine strukturierte Henkeltasche, die handgeflochtenes Rattan mit pflanzlich gegerbtem Leder verbindet. Geräumig genug für das Nötigste, mit abnehmbarem Riemen zum Umhängen.",
    },
    material: { en: "Rattan, vegetable-tanned leather", de: "Rattan, pflanzlich gegerbtes Leder" },
    details: {
      en: ["Turn-lock closure", "Detachable crossbody strap", "Cotton-lined interior with slip pocket", "W 26 × H 20 × D 12 cm"],
      de: ["Drehverschluss", "Abnehmbarer Umhängeriemen", "Baumwollfutter mit Einstecktasche", "B 26 × H 20 × T 12 cm"],
    },
    care: CARE.leather,
    colors: [COLORS.cognac],
    sizes: ONE_SIZE,
    images: gallery("1590874103328-eac38a683ce7", { x: 0.5, y: 0.5, zoom: 1.6 }, { x: 0.5, y: 0.65, zoom: 2.6 }),
    createdAt: "2026-09-20",
    featured: true,
  },
  {
    id: "p-016",
    slug: "odile-top-handle-bag",
    name: "Odile Top-Handle Bag",
    category: "accessories",
    price: 19900,
    description: {
      en: "Our signature bag in smooth calf leather, with a polished clasp and a single rolled handle. Compact, architectural and endlessly useful.",
      de: "Unsere Signature-Tasche aus glattem Kalbsleder, mit poliertem Verschluss und einem gerollten Henkel. Kompakt, architektonisch und unendlich praktisch.",
    },
    material: { en: "Calf leather, brass hardware", de: "Kalbsleder, Messingbeschläge" },
    details: {
      en: ["Push-lock clasp", "Rolled top handle", "Two internal compartments", "W 24 × H 18 × D 10 cm"],
      de: ["Steckschloss", "Gerollter Henkel", "Zwei Innenfächer", "B 24 × H 18 × T 10 cm"],
    },
    care: CARE.leather,
    colors: [COLORS.poppy, COLORS.black],
    sizes: ONE_SIZE,
    images: gallery("1584917865442-de89df76afd3", { x: 0.5, y: 0.5, zoom: 1.6 }, { x: 0.5, y: 0.45, zoom: 2.8 }),
    createdAt: "2026-07-24",
  },
  {
    id: "p-017",
    slug: "nora-pointed-pumps",
    name: "Nora Pointed Pumps",
    category: "accessories",
    price: 13900,
    description: {
      en: "Classic pointed pumps on a slim 8 cm heel, in soft nappa leather. A padded insole makes them comfortable well past midnight.",
      de: "Klassische spitze Pumps mit schmalem 8-cm-Absatz aus weichem Nappaleder. Eine gepolsterte Innensohle macht sie bis weit nach Mitternacht bequem.",
    },
    material: { en: "Nappa leather, leather sole", de: "Nappaleder, Ledersohle" },
    details: {
      en: ["8 cm stiletto heel", "Padded leather insole", "Pointed toe", "Made in Italy"],
      de: ["8 cm Stilettoabsatz", "Gepolsterte Lederinnensohle", "Spitze Kappe", "Hergestellt in Italien"],
    },
    care: CARE.leather,
    colors: [COLORS.ivory, COLORS.black],
    sizes: SHOES,
    images: gallery("1535043934128-cf0b28d52f95", { x: 0.4, y: 0.55, zoom: 1.8 }, { x: 0.65, y: 0.5, zoom: 2.4 }),
    createdAt: "2026-08-02",
  },
  {
    id: "p-018",
    slug: "luna-crescent-necklace",
    name: "Luna Crescent Necklace",
    category: "accessories",
    price: 7900,
    description: {
      en: "A delicate crescent moon pendant set with tiny stones, on a fine trace chain. Made in Pforzheim from recycled sterling silver with a thick gold vermeil.",
      de: "Ein zarter Halbmond-Anhänger mit kleinen Steinen an einer feinen Ankerkette. Gefertigt in Pforzheim aus recyceltem Sterlingsilber mit starker Goldvermeil-Auflage.",
    },
    material: { en: "18k gold vermeil on recycled sterling silver", de: "18 Karat Goldvermeil auf recyceltem Sterlingsilber" },
    details: {
      en: ["Adjustable chain, 42–47 cm", "Pendant 2 cm", "Lobster clasp", "Handmade in Pforzheim, Germany"],
      de: ["Verstellbare Kette, 42–47 cm", "Anhänger 2 cm", "Karabinerverschluss", "Handgefertigt in Pforzheim"],
    },
    care: CARE.jewellery,
    colors: [COLORS.gold],
    sizes: ONE_SIZE,
    // Main shot is cropped onto the crescent so the other pendant in the photo isn't the focus.
    images: gallery("1599643478518-a784e5dc4c8f", { x: 0.5, y: 0.8, zoom: 2.4 }, { x: 0.35, y: 0.6, zoom: 2.6 }, { x: 0.48, y: 0.72, zoom: 1.6 }),
    createdAt: "2026-09-26",
  },
  {
    id: "p-019",
    slug: "coquille-sculpted-earrings",
    name: "Coquille Sculpted Earrings",
    category: "accessories",
    price: 5900,
    description: {
      en: "Organic, shell-like forms cast in recycled brass and finished in gold. Light enough to wear all day, distinct enough to be the only jewellery you need.",
      de: "Organische, muschelähnliche Formen, gegossen aus recyceltem Messing und vergoldet. Leicht genug für den ganzen Tag, markant genug, um das einzige Schmuckstück zu sein.",
    },
    material: { en: "Recycled brass, 24k gold plating", de: "Recyceltes Messing, 24 Karat vergoldet" },
    details: {
      en: ["Sterling silver posts", "Approx. 2.2 cm", "Sold as a pair", "Handmade in Pforzheim, Germany"],
      de: ["Stecker aus Sterlingsilber", "Ca. 2,2 cm", "Als Paar erhältlich", "Handgefertigt in Pforzheim"],
    },
    care: CARE.jewellery,
    colors: [COLORS.gold],
    sizes: ONE_SIZE,
    images: gallery("1617038220319-276d3cfab638", { x: 0.5, y: 0.6, zoom: 1.8 }, { x: 0.55, y: 0.65, zoom: 2.6 }),
    createdAt: "2026-09-12",
  },
];
