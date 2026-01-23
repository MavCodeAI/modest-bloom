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
    image: "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&q=80",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Nude"],
    tags: ["new_drop"],
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
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Royal Purple", "Black"],
    tags: ["new_drop", "best_seller", "editor_pick"],
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-01"
  }
];

export const categories = [
  { id: "abayas", name: "Abayas", count: 5 },
  { id: "kaftans", name: "Kaftans", count: 4 },
  { id: "sets", name: "Sets", count: 3 },
  { id: "printed", name: "Printed", count: 3 },
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
