import type { Product } from "../types.js";

export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Books",
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Neural Buds Pro",
    description:
      "AI-adaptive noise cancellation with real-time audio personalization. 32-hour battery with wireless charging case.",
    price: 199.99,
    rating: 4.8,
    reviewCount: 1240,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf1215a3df0?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf1215a3df0?w=800&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fa2b09?w=800&q=80",
    ],
    inStock: true,
    tags: ["audio", "wireless", "trending"],
  },
  {
    id: "p2",
    name: "Lumen Smartwatch X",
    description:
      "Health insights powered by on-device AI. ECG, sleep staging, and workout recommendations that learn your habits.",
    price: 349,
    rating: 4.6,
    reviewCount: 892,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    ],
    inStock: true,
    tags: ["wearable", "health"],
  },
  {
    id: "p3",
    name: "Atlas Merino Coat",
    description:
      "Tailored outerwear with temperature-responsive lining. Minimal silhouette, maximum comfort for city winters.",
    price: 289,
    rating: 4.7,
    reviewCount: 356,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    inStock: true,
    tags: ["winter", "premium"],
  },
  {
    id: "p4",
    name: "Studio Knit Set",
    description:
      "Soft organic cotton loungewear. AI-curated colorways matched to your style profile (demo: static palette).",
    price: 98,
    rating: 4.5,
    reviewCount: 512,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    inStock: true,
    tags: ["lounge", "organic"],
  },
  {
    id: "p5",
    name: "Aero Home Hub",
    description:
      "Central smart home controller with voice and scene automation. Ready to plug into recommendation pipelines.",
    price: 179,
    rating: 4.4,
    reviewCount: 2103,
    category: "Home",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    inStock: true,
    tags: ["smart-home", "iot"],
  },
  {
    id: "p6",
    name: "Ceramic Pour-Over Set",
    description:
      "Hand-glazed drip set for slow mornings. Dishwasher safe, stackable for small kitchens.",
    price: 64,
    rating: 4.9,
    reviewCount: 428,
    category: "Home",
    image: "https://images.unsplash.com/photo-1517256064527-240c0d4eaf42?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1517256064527-240c0d4eaf42?w=800&q=80",
    ],
    inStock: true,
    tags: ["kitchen", "gift"],
  },
  {
    id: "p7",
    name: "Lumière Serum Duo",
    description:
      "Brightening duo with peptide complex. Patch-test friendly; pairs with your skin profile in a full deployment.",
    price: 72,
    rating: 4.3,
    reviewCount: 967,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    ],
    inStock: true,
    tags: ["skincare", "vegan"],
  },
  {
    id: "p8",
    name: "Pulse Trainer Shoes",
    description:
      "Responsive foam midsole with gait-friendly geometry. Built for daily miles and gym hybrids.",
    price: 139,
    rating: 4.6,
    reviewCount: 1544,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    ],
    inStock: true,
    tags: ["running", "training"],
  },
  {
    id: "p9",
    name: "Systems Thinking (Hardcover)",
    description:
      "A practical primer on feedback loops and product strategy. Staff pick for operator-founders.",
    price: 32,
    rating: 4.8,
    reviewCount: 221,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    ],
    inStock: true,
    tags: ["business", "strategy"],
  },
  {
    id: "p10",
    name: "Compact4K Webcam",
    description:
      "HDR capture with AI framing for calls. USB-C, privacy shutter, tripod mount included.",
    price: 129,
    rating: 4.2,
    reviewCount: 678,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587826080692-89f2cdadad3d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587826080692-89f2cdadad3d?w=800&q=80",
    ],
    inStock: false,
    tags: ["remote-work", "video"],
  },
];

export const SAMPLE_REVIEWS: Record<string, { author: string; rating: number; text: string; date: string }[]> = {
  p1: [
    { author: "Alex M.", rating: 5, text: "ANC is unreal. Comfort all day.", date: "2026-03-12" },
    { author: "Jordan K.", rating: 4, text: "Great sound, app could be faster.", date: "2026-02-28" },
  ],
  p2: [
    { author: "Sam R.", rating: 5, text: "Sleep scores actually helped me fix my schedule.", date: "2026-04-01" },
  ],
  default: [
    { author: "Verified buyer", rating: 5, text: "Solid quality and fast shipping.", date: "2026-03-20" },
    { author: "Verified buyer", rating: 4, text: "Would buy again.", date: "2026-03-15" },
  ],
};
