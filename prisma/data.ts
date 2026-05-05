/** Seed catalog — descriptions are original marketing copy (no Lorem). Images use fixed Unsplash photo IDs for stable CDN caching. */

export type SeedVariant = { label: string; stock: number };

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  images: string[];
  stock: number;
  archived: boolean;
  featured: boolean;
  hasVariants: boolean;
  variants?: SeedVariant[];
};

const POOL = [
  "photo-1523275335684-37898b6baf30",
  "photo-1542291026-7eec264c27ff",
  "photo-1505740420928-5e560c06d30e",
  "photo-1572635196237-14b3f281503f",
  "photo-1546868871-7041f2a55e12",
  "photo-1491553895911-0055eca6402d",
  "photo-1517336714731-489689fd1ca8",
  "photo-1498049860656-af28884c997d",
  "photo-1487017159836-4e23ece2e4cf",
  "photo-1585386957984-41504257e937",
  "photo-1620770678148-a90668089beb",
  "photo-1615876234888-f6059dfa25f6",
  "photo-1513506003901-1e6a229e2d15",
  "photo-1616594039964-ae9021a400a0",
  "photo-1586023492125-27b2c045efd7",
  "photo-1560472354-b33dcc195fc3",
  "photo-1594736797933-d050223ba8b5",
  "photo-1595475884562-073c30d45670",
  "photo-1549187774-b4e9b919d6e8",
  "photo-1466692476869-aef1eaf66c08",
  "photo-1594633313593-af844440978c",
  "photo-1578662996442-48f60103fc96",
  "photo-1560769629-975ec94e953a",
  "photo-1479066825566-688b873f7049",
  "photo-1519710164239-da123dc03ef4",
  "photo-1556228720-195a672e8a03",
];

export function trioImages(index: number): string[] {
  const u = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
  return [
    u(POOL[index % POOL.length]),
    u(POOL[(index + 5) % POOL.length]),
    u(POOL[(index + 11) % POOL.length]),
  ];
}

export const SEED_PRODUCTS: Omit<SeedProduct, "images">[] = [
  {
    slug: "meridian-desk-lamp",
    name: "Meridian Desk Lamp",
    description:
      "Dim-to-warm LED column lamp with a matte ceramic base and feather-soft diffuser—ideal for evening focus sessions without harsh glare.",
    priceCents: 8900,
    category: "Desk & Tech",
    stock: 14,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "slate-qi-charging-pad",
    name: "Slate Qi Charging Pad",
    description:
      "Low-profile aluminum charging pad with silicone traction rings and intelligent thermal pacing for overnight bedside charging.",
    priceCents: 4200,
    category: "Desk & Tech",
    stock: 2,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "summit-weekly-planner",
    name: "Summit Weekly Planner",
    description:
      "Lay-flat planner printed on chlorine-free stock with generous margins for sketches—built for planners who still love ink.",
    priceCents: 1800,
    category: "Desk & Tech",
    stock: 0,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "summit-laptop-stand",
    name: "Summit Aluminum Laptop Stand",
    description:
      "Precision tilt stand that lifts your display to eye level while preserving airflow—rubber-lined cradle prevents slips.",
    priceCents: 7600,
    category: "Desk & Tech",
    stock: 22,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "echo-noise-canceling-headphones",
    name: "Echo Studio Headphones",
    description:
      "Balanced studio tuning with adaptive noise cancellation and memory-foam cushions tuned for long listening sessions.",
    priceCents: 24900,
    category: "Desk & Tech",
    stock: 0,
    archived: false,
    featured: true,
    hasVariants: true,
    variants: [
      { label: "Midnight", stock: 3 },
      { label: "Silver", stock: 2 },
      { label: "Frost", stock: 8 },
    ],
  },
  {
    slug: "compass-leather-tote",
    name: "Compass Leather Tote",
    description:
      "Vegetable-tanned tote with reinforced stitching and an interior laptop divider—carry-all elegance without bulk.",
    priceCents: 13200,
    category: "Carry & Travel",
    stock: 5,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "ridge-rolltop-backpack",
    name: "Ridge Rolltop Backpack",
    description:
      "Weather-ready backpack with taped seams and quick-access side pockets—built for commuters who bike through drizzle.",
    priceCents: 16800,
    category: "Carry & Travel",
    stock: 0,
    archived: false,
    featured: false,
    hasVariants: true,
    variants: [
      { label: "Olive", stock: 4 },
      { label: "Noir", stock: 1 },
      { label: "Slate", stock: 12 },
    ],
  },
  {
    slug: "horizon-packing-cubes",
    name: "Horizon Packing Cube Trio",
    description:
      "Ultralight ripstop cubes with grab handles that disappear flush—compress sweaters without creasing tailoring.",
    priceCents: 5400,
    category: "Carry & Travel",
    stock: 18,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "passport-folio",
    name: "Passport Folio",
    description:
      "RFID-lined leather folio that hugs two passports plus boarding passes—slide closure keeps documents crisp.",
    priceCents: 2900,
    category: "Carry & Travel",
    stock: 0,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "atlas-glass-carry-bottle",
    name: "Atlas Glass Carry Bottle",
    description:
      "Borosilicate bottle with silicone bumper base—wide mouth fits ice spheres without wrestling.",
    priceCents: 3200,
    category: "Carry & Travel",
    stock: 3,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "ember-stoneware-bowl-set",
    name: "Ember Stoneware Bowl Set",
    description:
      "Four handcrafted bowls with subtle speckling—microwave-safe glaze designed for chilled starters and warm grains alike.",
    priceCents: 7200,
    category: "Kitchen & Dining",
    stock: 0,
    archived: false,
    featured: true,
    hasVariants: true,
    variants: [
      { label: "Fog", stock: 2 },
      { label: "Terracotta", stock: 2 },
    ],
  },
  {
    slug: "brass-pour-over-kettle",
    name: "Brass Pour-Over Kettle",
    description:
      "Featherlight gooseneck kettle with ergonomic cork grip—steady spiral pours for blooming delicate coffees.",
    priceCents: 6800,
    category: "Kitchen & Dining",
    stock: 9,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "walnut-serving-board",
    name: "Walnut Serving Board",
    description:
      "End-grain walnut board mineral-oiled by hand—juice groove keeps countertops pristine during tastings.",
    priceCents: 7900,
    category: "Kitchen & Dining",
    stock: 11,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "matte-serving-spoon-duo",
    name: "Matte Serving Spoon Duo",
    description:
      "Stainless spoons with satin matte finish—balanced handles rest gently on rimmed bowls.",
    priceCents: 2400,
    category: "Kitchen & Dining",
    stock: 25,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "studio-pour-mug",
    name: "Studio Pour Mug",
    description:
      "Tapered porcelain mug designed for latte art pours—thermal retention keeps cocoa silky.",
    priceCents: 2100,
    category: "Kitchen & Dining",
    stock: 0,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "halo-pendant-glow",
    name: "Halo Pendant Glow",
    description:
      "Blown-glass orb pendant with brass canopy—casts painterly gradients across textured plaster.",
    priceCents: 15600,
    category: "Lighting",
    stock: 4,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "portable-lantern-lamp",
    name: "Portable Lantern Lamp",
    description:
      "Rechargeable lantern with candlelight simulation mode—carry warmth between balcony dinners.",
    priceCents: 9800,
    category: "Lighting",
    stock: 13,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "ember-desk-glow",
    name: "Ember Desk Glow",
    description:
      "Compact Edison-style bulb nestled in smoked glass—perfect cozy accent without dominating your desk.",
    priceCents: 4500,
    category: "Lighting",
    stock: 20,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "loft-linen-throw",
    name: "Loft Linen Throw",
    description:
      "Pre-washed Belgian linen throw with contrast whipstitch—breathable layering through shoulder seasons.",
    priceCents: 8900,
    category: "Home Textiles",
    stock: 0,
    archived: false,
    featured: true,
    hasVariants: true,
    variants: [
      { label: "Pearl", stock: 5 },
      { label: "Moss", stock: 2 },
    ],
  },
  {
    slug: "alpaca-rib-socks-set",
    name: "Alpaca Rib Sock Duo",
    description:
      "Two-pack ribbed socks spun from responsibly sourced alpaca—mid crew height stays put inside boots.",
    priceCents: 3600,
    category: "Home Textiles",
    stock: 30,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "horizon-turkish-towel",
    name: "Horizon Turkish Towel",
    description:
      "Loomed Turkish cotton towel that dries quickly—doubles as a travel wrap or picnic layer.",
    priceCents: 4200,
    category: "Home Textiles",
    stock: 8,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "ritual-facial-roller-duo",
    name: "Ritual Facial Roller Duo",
    description:
      "Cooling quartz roller pairing—morning depuff ritual paired with evening serum glide.",
    priceCents: 2800,
    category: "Wellness",
    stock: 16,
    archived: false,
    featured: true,
    hasVariants: false,
  },
  {
    slug: "redwood-essential-oil-blend",
    name: "Redwood Essential Oil Blend",
    description:
      "Small-batch cedar and vetiver blend for diffusers—bottled in UV-glass to protect terpenes.",
    priceCents: 2400,
    category: "Wellness",
    stock: 1,
    archived: false,
    featured: false,
    hasVariants: false,
  },
  {
    slug: "recovery-foam-roller",
    name: "Recovery Foam Roller",
    description:
      "High-density roller with textured traction lanes—firm enough for fascia release without chatter.",
    priceCents: 5900,
    category: "Wellness",
    stock: 19,
    archived: false,
    featured: false,
    hasVariants: false,
  },
];

export function hydrateSeedProducts(): SeedProduct[] {
  return SEED_PRODUCTS.map((p, idx) => ({
    ...p,
    images: trioImages(idx),
  }));
}
