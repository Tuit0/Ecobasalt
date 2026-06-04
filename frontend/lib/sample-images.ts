// Default rasmlar — Unsplash (commercial use bepul)
// Admin paneldan real rasmlar yuklasa, ular ustun keladi
// URL format: photo-{id}?w={width}&q=80&auto=format&fit=crop

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const PRODUCT_IMAGES: Record<string, string> = {
  // Sandwich panels
  "roof-sandwich-panel": U("1565008576549-57569a49371d"),       // Industrial aerial
  "wall-sandwich-panel": U("1487958449943-2429e8be8625"),       // Modern industrial building
  "fridge-sandwich-panel": U("1601584115197-04ecc0da31d7"),     // Cold storage
  // Rockwool insulation
  "pipe-insulation-cylinder": U("1581094794329-c8112a89af12"),  // Construction pipes
  "rockwool-slab": U("1504917595217-d4dc5ebe6122"),             // Insulation material
  // Basalt fiber
  "basalt-roving": U("1582719188393-bb71ca45dbb9"),             // Industrial fiber
  "basalt-chopped": U("1581092335397-9583eb92d232"),            // Composite material
  // Accessories
  "fasteners-set": U("1567361808960-dec9cb578182"),             // Tools/hardware
};

export const PROJECT_IMAGES: Record<string, string> = {
  "magnit-warehouse": U("1553413077-190dd305871c"),             // Large warehouse
  "artel-factory": U("1581091226825-a6a2a5aee158"),             // Production plant
  "agro-cold-storage": U("1601584115197-04ecc0da31d7"),         // Cold storage
  "kia-service-center": U("1486006920555-c77dcf18193c"),        // Auto service
  "biofarm-plant": U("1581093458791-9d42cc05b53b"),             // Pharma facility
  "ferghana-mall": U("1567521464027-f127ff144326"),             // Shopping mall facade
};

export const BLOG_IMAGES: Record<string, string> = {
  "fire-resistance-ei-240": U("1574953256832-69dbf24eb1b6"),     // Fire safety
  "basalt-vs-pir-pur-eps": U("1504917595217-d4dc5ebe6122"),      // Materials
  "2026-uzbekistan-standards": U("1554188248-986adbb73be4"),     // Standards/blueprints
  "cold-storage-250mm": U("1601584115197-04ecc0da31d7"),         // Cold storage
  "basalt-eco-insulation": U("1518604666860-9ed391f76460"),      // Eco/nature
  "installation-mistakes": U("1503387762-592deb58ef4e"),         // Construction worker
};

// Fallback by category/type
export const HERO_BACKGROUND = U("1565008576549-57569a49371d", 1920);
export const PRODUCT_FALLBACK = U("1504917595217-d4dc5ebe6122");
export const PROJECT_FALLBACK = U("1565008576549-57569a49371d");

export function productImage(slug: string, cover?: string | null): string {
  return cover || PRODUCT_IMAGES[slug] || PRODUCT_FALLBACK;
}

export function projectImage(slug: string | undefined | null, cover?: string | null): string {
  if (cover) return cover;
  if (slug && PROJECT_IMAGES[slug]) return PROJECT_IMAGES[slug];
  return PROJECT_FALLBACK;
}

export function blogImage(slug: string): string {
  return BLOG_IMAGES[slug] || PRODUCT_FALLBACK;
}
