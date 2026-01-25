// Modest Way Fashion - Product Data Types & Initial Data

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  images?: string[];
  sizes: string[];
  colors?: string[];
  tags: string[];
  isWholesale: boolean;
  inStock: boolean;
  sku?: string;
  weight?: number;
  material?: string;
  careInstructions?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface QuoteRequest {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  volume: string;
  message: string;
  products: { productId: string; quantity: number }[];
  status: 'pending' | 'processed' | 'completed';
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  subtotal: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

// Initial product data with luxury abaya imagery
export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Velvet Noir Abaya",
    price: 1250,
    originalPrice: 1500,
    category: "abayas",
    description: "A stunning black velvet abaya with intricate gold embroidery along the sleeves and hem. This masterpiece combines traditional elegance with modern luxury, featuring a flowing silhouette that drapes beautifully.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Navy"],
    tags: ["new_drop", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-15"
  },
  {
    id: "p2",
    name: "Champagne Dreams Kaftan",
    price: 1800,
    category: "kaftans",
    description: "An ethereal champagne kaftan adorned with delicate pearl beading and silk trim. Perfect for special occasions, this piece embodies effortless glamour.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Champagne", "Ivory"],
    tags: ["new_drop"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-14"
  },
  {
    id: "p3",
    name: "Midnight Bloom Set",
    price: 2200,
    category: "sets",
    description: "A luxurious two-piece ensemble featuring a flowing abaya paired with a matching inner dress. Adorned with hand-embroidered floral motifs in rose gold thread.",
    image: "/images/product-showcase-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black"],
    tags: ["best_seller", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-13"
  },
  {
    id: "p4",
    name: "Desert Rose Printed Abaya",
    price: 980,
    category: "printed",
    description: "A contemporary printed abaya featuring an exclusive desert rose pattern. Light and breathable fabric perfect for everyday elegance.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Rose", "Dusty Pink"],
    tags: ["new_drop"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-12"
  },
  {
    id: "p5",
    name: "Classic Black Elegance",
    price: 850,
    originalPrice: 1100,
    category: "abayas",
    description: "The quintessential black abaya reimagined with modern tailoring. Features subtle pleating and a contemporary neckline.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    tags: ["sale", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-11"
  },
  {
    id: "p6",
    name: "Pearl Cascade Kaftan",
    price: 2500,
    category: "kaftans",
    description: "An opulent kaftan featuring cascading pearl embellishments. This statement piece is designed for the most discerning fashion connoisseur.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Ivory", "Soft Gold"],
    tags: ["abaya_of_week"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-10"
  },
  {
    id: "p7",
    name: "Geometric Luxe Printed",
    price: 1100,
    category: "printed",
    description: "A modern geometric print abaya that makes a bold statement. The contemporary pattern is inspired by traditional Islamic art.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Navy/Gold", "Black/Silver"],
    tags: ["weekly_drop"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-09"
  },
  {
    id: "p8",
    name: "Royal Emerald Set",
    price: 2800,
    category: "sets",
    description: "A regal three-piece ensemble in deep emerald. Includes an embroidered outer abaya, silk inner dress, and matching hijab.",
    image: "/images/product-showcase-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Emerald"],
    tags: ["new_drop", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-08"
  },
  {
    id: "p9",
    name: "Minimalist Silk Abaya",
    price: 1400,
    category: "abayas",
    description: "Pure silk abaya with clean lines and minimal embellishment. The epitome of understated luxury.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Charcoal", "Navy"],
    tags: ["best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-07"
  },
  {
    id: "p10",
    name: "Floral Fantasy Kaftan",
    price: 1650,
    originalPrice: 1900,
    category: "kaftans",
    description: "A dreamy kaftan featuring hand-painted floral motifs. Each piece is unique, making it a true collector's item.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Blush", "Sage"],
    tags: ["sale", "weekly_drop"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-06"
  },
  {
    id: "p11",
    name: "Lace Overlay Abaya",
    price: 1350,
    category: "abayas",
    description: "An elegant abaya featuring French lace overlay on the sleeves and back panel. Romantic and sophisticated.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Nude"],
    tags: ["new_drop", "abaya_of_week"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-05"
  },
  {
    id: "p12",
    name: "Dubai Sunset Printed",
    price: 920,
    category: "printed",
    description: "Inspired by Dubai's iconic sunsets, this printed abaya features warm gradient tones. Perfect for making a statement.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Sunset Ombre"],
    tags: ["weekly_drop"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-04"
  },
  {
    id: "p13",
    name: "Sapphire Elegance Abaya",
    price: 1550,
    originalPrice: 1850,
    category: "abayas",
    description: "A breathtaking deep blue abaya with crystal embellishments along the neckline. Features flowing sleeves with delicate silver threadwork.",
    image: "/images/product-feature-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Sapphire Blue", "Midnight Blue"],
    tags: ["new_drop", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-03"
  },
  {
    id: "p14",
    name: "Rose Gold Luxe Kaftan",
    price: 2100,
    category: "kaftans",
    description: "An exquisite kaftan featuring rose gold embroidery and silk panels. Perfect for evening events and special celebrations.",
    image: "/images/product-feature-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Rose Gold", "Champagne"],
    tags: ["abaya_of_week", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-02"
  },
  {
    id: "p15",
    name: "Arabian Nights Set",
    price: 3200,
    category: "sets",
    description: "A magnificent three-piece ensemble inspired by Arabian tales. Includes embroidered abaya, silk inner dress, and matching hijab with gold accents.",
    image: "/images/product-gallery-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Royal Purple", "Black"],
    tags: ["new_drop", "best_seller", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-01"
  },
  {
    id: "p16",
    name: "Royal Sapphire Luxury",
    price: 2850,
    category: "abayas",
    description: "An exquisite sapphire blue abaya with crystal embellishments and silver threadwork. Features flowing sleeves and a modern silhouette.",
    image: "/images/product-luxury-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Sapphire Blue", "Midnight Blue"],
    tags: ["new_drop", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-16"
  },
  {
    id: "p17",
    name: "Emerald Palace Kaftan",
    price: 2450,
    category: "kaftans",
    description: "A stunning emerald green kaftan with gold embroidery and pearl accents. Perfect for formal events and special occasions.",
    image: "/images/product-luxury-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Emerald Green", "Forest Green"],
    tags: ["new_drop", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-17"
  },
  {
    id: "p18",
    name: "Rose Garden Ensemble",
    price: 3100,
    category: "sets",
    description: "A romantic three-piece set featuring delicate rose embroidery. Includes abaya, inner dress, and matching hijab with soft pink accents.",
    image: "/images/product-luxury-3.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Soft Pink", "Ivory"],
    tags: ["new_drop", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-18"
  },
  {
    id: "p19",
    name: "Midnight Velvet Abaya",
    price: 1950,
    category: "abayas",
    description: "Luxurious midnight blue velvet abaya with subtle gold piping. Features a contemporary cut with traditional elegance.",
    image: "/images/product-luxury-4.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Midnight Blue", "Black"],
    tags: ["new_drop", "weekly_drop"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-19"
  },
  {
    id: "p20",
    name: "Desert Bloom Printed",
    price: 1250,
    category: "printed",
    description: "Contemporary printed abaya featuring desert-inspired floral patterns. Lightweight fabric perfect for all-day comfort.",
    image: "/images/product-elegant-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Terracotta", "Sand"],
    tags: ["new_drop", "weekly_drop"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-20"
  },
  {
    id: "p21",
    name: "Pearl White Classic",
    price: 1650,
    category: "abayas",
    description: "Timeless white abaya with pearl embellishments along the neckline and sleeves. Elegant and sophisticated for any occasion.",
    image: "/images/product-elegant-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Pearl White", "Ivory"],
    tags: ["best_seller", "classic"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-21"
  },
  {
    id: "p22",
    name: "Premium Gold Collection",
    price: 4500,
    category: "sets",
    description: "Our most luxurious three-piece ensemble with 24k gold thread embroidery. Includes abaya, inner dress, and exclusive hijab.",
    image: "/images/product-premium-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Gold", "Cream"],
    tags: ["exclusive", "premium", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-22"
  },
  {
    id: "p23",
    name: "Diamond Luxury Kaftan",
    price: 3800,
    category: "kaftans",
    description: "Opulent kaftan featuring crystal and diamond-like embellishments. A true statement piece for the most special occasions.",
    image: "/images/product-premium-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Silver", "Platinum"],
    tags: ["exclusive", "premium"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-23"
  },
  {
    id: "p24",
    name: "Modern Minimalist Abaya",
    price: 1350,
    category: "abayas",
    description: "Clean lines and contemporary design define this modern abaya. Minimal embellishments for a sophisticated, understated look.",
    image: "/images/product-modern-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Charcoal", "Navy"],
    tags: ["new_drop", "modern"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-24"
  },
  {
    id: "p25",
    name: "Urban Chic Printed",
    price: 1100,
    category: "printed",
    description: "Modern geometric print inspired by urban architecture. Bold patterns for the fashion-forward modest woman.",
    image: "/images/product-modern-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Monochrome", "Navy"],
    tags: ["new_drop", "modern"],
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-25"
  },
  {
    id: "p26",
    name: "Classic Black Signature",
    price: 1450,
    category: "abayas",
    description: "The essential black abaya every wardrobe needs. Premium fabric with subtle detailing for timeless elegance.",
    image: "/images/product-classic-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Classic Black"],
    tags: ["best_seller", "classic", "essential"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-26"
  },
  {
    id: "p27",
    name: "Navy Elegance Formal",
    price: 1750,
    category: "abayas",
    description: "Sophisticated navy blue abaya perfect for formal occasions. Features elegant draping and premium fabric.",
    image: "/images/product-classic-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Navy Blue", "Midnight Blue"],
    tags: ["formal", "classic", "best_seller"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-27"
  },
  {
    id: "p28",
    name: "Traditional Heritage Set",
    price: 2600,
    category: "sets",
    description: "Inspired by traditional Middle Eastern design. Features intricate embroidery and authentic styling with modern comfort.",
    image: "/images/product-traditional-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Burgundy", "Gold"],
    tags: ["traditional", "heritage", "cultural"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-28"
  },
  {
    id: "p29",
    name: "Oriental Dreams Kaftan",
    price: 2200,
    category: "kaftans",
    description: "Exotic kaftan with oriental-inspired patterns and rich colors. Perfect for cultural events and special gatherings.",
    image: "/images/product-traditional-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Burgundy", "Gold", "Cream"],
    tags: ["traditional", "oriental", "cultural"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-29"
  },
  {
    id: "p30",
    name: "Exclusive Designer Collection",
    price: 5200,
    category: "sets",
    description: "Limited edition designer ensemble with hand-crafted details. Exclusive design with premium materials and unique embellishments.",
    image: "/images/product-exclusive-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Platinum", "Silver"],
    tags: ["exclusive", "designer", "limited_edition"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-30"
  },
  {
    id: "p31",
    name: "Couture Evening Ensemble",
    price: 4800,
    category: "sets",
    description: "Haute couture evening set with intricate beadwork and silk fabric. Red carpet worthy modest fashion.",
    image: "/images/product-exclusive-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Gold", "Red"],
    tags: ["exclusive", "couture", "evening"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-31"
  }
];

export const categories = [
  { id: "abayas", name: "Abayas", count: 11 },
  { id: "kaftans", name: "Kaftans", count: 7 },
  { id: "sets", name: "Sets", count: 8 },
  { id: "printed", name: "Printed", count: 5 },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Al Maktoum",
    location: "Dubai, UAE",
    rating: 5,
    text: "Modest Way Fashion has redefined luxury modest wear for me. The quality is unmatched, and the designs are absolutely stunning.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
  },
  {
    id: 2,
    name: "Fatima Hassan",
    location: "Riyadh, KSA",
    rating: 5,
    text: "Every abaya I've purchased feels like wearing art. The attention to detail and craftsmanship is exceptional.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
  },
  {
    id: 3,
    name: "Aisha Rahman",
    location: "Doha, Qatar",
    rating: 5,
    text: "From packaging to product, everything speaks luxury. Modest Way is now my go-to for all special occasions.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80"
  }
];
