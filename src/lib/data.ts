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
  cut?: string;
  includesSheila?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color?: string;
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

// Initial product data with grounded modest fashion nomenclature & specifications
export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Classic Korean Nida Everyday Bisht",
    price: 680,
    originalPrice: 850,
    category: "abayas",
    description: "Crafted from Grade-A breathable Korean Nida, this classic open bisht abaya features tailored kimono sleeves, discreet snap button closures, and reinforced French seams. Includes a matching 70x200cm chiffon sheila scarf with folded edge finish.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black", "Midnight Navy"],
    tags: ["new_drop", "best_seller"],
    material: "100% Premium Korean Nida (180 GSM)",
    careInstructions: "Machine wash delicate cold (30°C) or dry clean. Low steam iron on reverse.",
    cut: "Loose Bisht Silhouette with Flared Kimono Sleeves",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-15"
  },
  {
    id: "p2",
    name: "Champagne Raw Silk Embroidered Kaftan",
    price: 1450,
    category: "kaftans",
    description: "An elegant formal kaftan tailored in textured champagne raw silk blend with tone-on-tone zari and pearl embroidery along the neckline and cuffs. Features an inner adjustable tie belt for a tailored modest waistline.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Champagne Gold", "Ivory Cream"],
    tags: ["new_drop"],
    material: "Textured Raw Silk & Viscose Blend with Rayon Lining",
    careInstructions: "Dry clean only to protect pearl handwork and zari threadwork.",
    cut: "Relaxed Kaftan Cut with Concealed Waist Tie",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-14"
  },
  {
    id: "p3",
    name: "Black Crepe 3-Piece Set with Inner & Sheila",
    price: 1250,
    category: "sets",
    description: "A versatile three-piece ensemble including an open-front textured crepe abaya, a matching sleeveless ankle-length slip dress with back invisible zip, and a coordinating lightweight chiffon sheila scarf.",
    image: "/images/product-showcase-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black"],
    tags: ["best_seller", "editor_pick"],
    material: "Japanese Pebble Crepe (Abaya) & Soft Rayon (Slip Dress)",
    careInstructions: "Hand wash cold or gentle cycle. Hang dry in shade.",
    cut: "3-Piece Modular Set (Outer Abaya + Inner Slip + Sheila)",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-13"
  },
  {
    id: "p4",
    name: "Dusty Rose Linen-Crepe Open Abaya",
    price: 780,
    category: "printed",
    description: "Designed for effortless warm-weather wear, this breezy abaya blends washed linen with light crepe for a soft, structured drape that resists severe creasing. Finished with minimalist contrast stitch details on the cuff turn-backs.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Dusty Rose", "Desert Sand"],
    tags: ["new_drop"],
    material: "Washed Linen-Crepe Blend (Breathable & Opaque)",
    careInstructions: "Machine wash cold delicate. Warm iron or steam while slightly damp.",
    cut: "Contemporary Straight Cut with Side Slits",
    includesSheila: true,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-12"
  },
  {
    id: "p5",
    name: "Lexus Crepe Tailored Straight Abaya",
    price: 650,
    originalPrice: 820,
    category: "abayas",
    description: "An everyday wardrobe foundation cut from durable, matte Lexus Crepe. Features clean straight lines, discreet side seam pockets, and snap button closures down the front.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    tags: ["sale", "best_seller"],
    material: "Medium-Weight Matte Lexus Crepe",
    careInstructions: "Machine wash 30°C. Anti-wrinkle, requires minimal ironing.",
    cut: "Classic Straight Cut with Pockets",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-11"
  },
  {
    id: "p6",
    name: "Ivory Pearl-Embellished Formal Kaftan",
    price: 1850,
    category: "kaftans",
    description: "Designed for Eid and evening celebrations, this ivory kaftan features delicate hand-sewn pearl clusters down the center front placket and sleeve cuffs. Fully lined with soft breathable batiste.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Ivory Cream", "Soft Pearl"],
    tags: ["abaya_of_week"],
    material: "High-Drape Chiffon with Microfiber Lining",
    careInstructions: "Specialist dry clean recommended.",
    cut: "Flared Occasion Kaftan with Inner Bust Band",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-10"
  },
  {
    id: "p7",
    name: "Navy Gold Geometric Jacquard Abaya",
    price: 890,
    category: "printed",
    description: "Woven with subtle gold metallic jacquard threads in an understated Arabesque geometric motif. Features deep navy base fabric with turned French cuffs and matching sheila scarf.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Navy/Gold", "Black/Silver"],
    tags: ["weekly_drop"],
    material: "Jacquard Woven Crepe with Lurex Thread",
    careInstructions: "Hand wash cold or dry clean.",
    cut: "Subtle A-Line Cut",
    includesSheila: true,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-09"
  },
  {
    id: "p8",
    name: "Emerald Japanese Crepe 3-Piece Set",
    price: 1650,
    category: "sets",
    description: "A rich emerald three-piece set crafted from heavy Japanese crepe. Features a fluid open abaya, matching sleeveless round-neck slip dress, and a color-matched 75x200cm premium chiffon sheila.",
    image: "/images/product-showcase-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Emerald Green", "Forest Pine"],
    tags: ["new_drop", "editor_pick"],
    material: "Heavy Japanese Crepe (Zero Sheer, Fluid Fall)",
    careInstructions: "Machine wash cold on wool/silk cycle or dry clean.",
    cut: "3-Piece Matching Set with Belt Option",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-08"
  },
  {
    id: "p9",
    name: "Matte Silk Straight Cut Minimalist Abaya",
    price: 920,
    category: "abayas",
    description: "Minimalist modest luxury at its purest. Made from double-twisted matte silk blend that creates a natural, flattering drape without sheen. Features clean bound neckline and concealed front snaps.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Jet Black", "Charcoal Grey", "Navy"],
    tags: ["best_seller"],
    material: "Matte Silk & Viscose Double-Crepe",
    careInstructions: "Hand wash cold with gentle shampoo or dry clean.",
    cut: "Modern Minimalist Straight Cut",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-07"
  },
  {
    id: "p10",
    name: "Blush Embroidered Chiffon Occasion Kaftan",
    price: 1150,
    originalPrice: 1350,
    category: "kaftans",
    description: "Double-layered blush chiffon kaftan featuring tonal botanical thread embroidery on the raglan sleeves and hem. Includes full-length opaque inner slip for complete coverage.",
    image: "/images/product-hero-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Blush Pink", "Sage Grey"],
    tags: ["sale", "weekly_drop"],
    material: "Fine Georgette Chiffon with Cotton-Viscose Inner Lining",
    careInstructions: "Dry clean or delicate hand wash cold.",
    cut: "Relaxed Flowing Kaftan",
    includesSheila: false,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-06"
  },
  {
    id: "p11",
    name: "French Lace Trimmed Luxury Black Abaya",
    price: 1050,
    category: "abayas",
    description: "Featuring scalloped French eyelash lace along the wide cuffs and vertical front panels. Tailored in dark jet-black Korean Nida with deep rich hue and elegant movement.",
    image: "/images/product-hero-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Jet Black", "Black over Nude"],
    tags: ["new_drop", "abaya_of_week"],
    material: "Premium Korean Nida & French Corded Eyelash Lace",
    careInstructions: "Dry clean or hand wash inside a mesh laundry bag.",
    cut: "A-Line Flare with Lace Sleeve Cuffs",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-05"
  },
  {
    id: "p12",
    name: "Terracotta Desert Ombre Summer Abaya",
    price: 720,
    category: "printed",
    description: "Inspired by the warm tones of the Liwa desert dunes, this custom ombre dyed abaya is crafted in featherlight textured crinkle crepe that stays cool in high humidity.",
    image: "/images/product-showcase-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Terracotta Dune", "Warm Ochre"],
    tags: ["weekly_drop"],
    material: "Textured Crinkle Crepe (No Iron Required)",
    careInstructions: "Machine wash cold, air dry.",
    cut: "Casual Kimono Drop-Shoulder",
    includesSheila: true,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-04"
  },
  {
    id: "p13",
    name: "Midnight Blue Crystal-Detailed Occasion Abaya",
    price: 1350,
    originalPrice: 1550,
    category: "abayas",
    description: "Deep midnight blue abaya embellished with heat-pressed Austrian crystal lines along the back yoke and cuffs. Cut from premium Japanese Nida with graceful fluid movement.",
    image: "/images/product-feature-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Midnight Blue", "Deep Navy"],
    tags: ["new_drop", "best_seller"],
    material: "Japanese Nida with Austrian Crystal Detailing",
    careInstructions: "Hand wash cold inside out or dry clean.",
    cut: "Flared Bisht Cut",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-03"
  },
  {
    id: "p14",
    name: "Rose Gold Zari Embroidered Kaftan",
    price: 1750,
    category: "kaftans",
    description: "Opulent formal kaftan with rose gold metallic threadwork along the neckline and sleeves. Crafted from heavy double georgette with an interior drawstring to customize the silhouette.",
    image: "/images/product-feature-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Rose Gold", "Champagne"],
    tags: ["abaya_of_week", "editor_pick"],
    material: "Double Georgette with Metallic Zari Thread",
    careInstructions: "Dry clean only.",
    cut: "Adjustable Silhouette Kaftan",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-02"
  },
  {
    id: "p15",
    name: "Royal Black & Gold Brocade 3-Piece Ensemble",
    price: 2400,
    category: "sets",
    description: "A statement bridal and Eid ensemble comprising a rich gold jacquard brocade outer abaya, a solid black modal silk slip dress, and a matching hand-finished organza-trimmed sheila.",
    image: "/images/product-gallery-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Black & Gold Brocade", "Black & Silver"],
    tags: ["new_drop", "best_seller", "editor_pick"],
    material: "Silk Jacquard Brocade (Outer) & Modal Silk (Slip)",
    careInstructions: "Specialist dry clean only.",
    cut: "3-Piece Luxury Ensemble",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-01"
  },
  {
    id: "p16",
    name: "Sapphire Japanese Crepe Flared Abaya",
    price: 1950,
    category: "abayas",
    description: "Deep sapphire blue abaya with subtle crystal embellishments along the sleeves. Tailored with a wide circular hem drape for dignified formal occasions.",
    image: "/images/product-luxury-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Sapphire Blue", "Midnight Blue"],
    tags: ["new_drop", "best_seller"],
    material: "Japanese Pebble Crepe",
    careInstructions: "Gentle wash cold or dry clean.",
    cut: "Full Umbrella Flare Silhouette",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-16"
  },
  {
    id: "p17",
    name: "Forest Green Moroccan Velvet Kaftan",
    price: 1850,
    category: "kaftans",
    description: "Rich forest green micro-velvet kaftan adorned with traditional golden sfifa braiding and handmade aakad buttons down the center placket. Luxurious winter and evening weight.",
    image: "/images/product-luxury-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Forest Green", "Emerald"],
    tags: ["new_drop", "editor_pick"],
    material: "Heavy Micro-Velvet with Gold Sfifa Braiding",
    careInstructions: "Dry clean only. Steam on reverse.",
    cut: "Traditional Moroccan Royal Cut",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-17"
  },
  {
    id: "p18",
    name: "Blush Silk Blend Abaya Set with Sheila",
    price: 1850,
    category: "sets",
    description: "Delicate blush pink three-piece set featuring subtle tonal threadwork along the kimono cuffs. Made from matte silk-blend crepe that remains opaque and breathable.",
    image: "/images/product-luxury-3.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Blush Pink", "Ivory Cream"],
    tags: ["new_drop", "best_seller"],
    material: "Silk-Blend Crepe & Rayon Slip",
    careInstructions: "Delicate cold wash or dry clean.",
    cut: "3-Piece Modular Set",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-18"
  },
  {
    id: "p19",
    name: "Midnight Blue Velvet Trimmed Winter Abaya",
    price: 1450,
    category: "abayas",
    description: "Deep midnight blue Japanese crepe with plush velvet cuffs and collar piping. Combines lightweight core breathability with warm velvet accents.",
    image: "/images/product-luxury-4.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Midnight Blue", "Jet Black"],
    tags: ["new_drop", "weekly_drop"],
    material: "Japanese Crepe with Silk-Velvet Trims",
    careInstructions: "Dry clean recommended.",
    cut: "Tailored Straight Cut with Slit Cuffs",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-19"
  },
  {
    id: "p20",
    name: "Sand Dune Printed Georgette Summer Abaya",
    price: 850,
    category: "printed",
    description: "Featherlight printed georgette abaya featuring an abstract desert-toned pattern. Lined along the back and sleeves with ultra-soft modal cotton.",
    image: "/images/product-elegant-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Sand Dune", "Earthy Taupe"],
    tags: ["new_drop", "weekly_drop"],
    material: "Double Georgette (Cool Touch)",
    careInstructions: "Machine wash cold delicate.",
    cut: "Casual Kimono Cut",
    includesSheila: true,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-20"
  },
  {
    id: "p21",
    name: "Pearl White Pure Nidha Wedding Abaya",
    price: 1250,
    category: "abayas",
    description: "Crisp pearl white abaya crafted from double-density opaque Korean Nidha. Features delicate crystal beading around the neckline and wrist cuffs.",
    image: "/images/product-elegant-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Pearl White", "Ivory"],
    tags: ["best_seller", "classic"],
    material: "100% Opaque Korean Nidha",
    careInstructions: "Dry clean or hand wash cold separately.",
    cut: "Classic A-Line Cut",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-21"
  },
  {
    id: "p22",
    name: "Gold Zari Metallic Threadwork Abaya Set",
    price: 2950,
    category: "sets",
    description: "Premium Eid & wedding ensemble with hand-guided metallic Zari embroidery on high-density Japanese silk crepe. Includes matching sleeveless slip and matching gold-bordered sheila.",
    image: "/images/product-premium-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Antique Gold on Black", "Gold on Cream"],
    tags: ["exclusive", "premium", "best_seller"],
    material: "Japanese Silk Crepe & Pure Zari Metallic Thread",
    careInstructions: "Specialist dry clean only.",
    cut: "3-Piece Luxury Ensemble",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-22"
  },
  {
    id: "p23",
    name: "Crystal Hand-Beaded Bridal Kaftan",
    price: 2850,
    category: "kaftans",
    description: "Hand-beaded formal bridal kaftan featuring Swarovski-grade glass crystals and silver bugle beads down the bodice and cuff edges. Fully lined with breathable silk habotai.",
    image: "/images/product-premium-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Silver Platinum", "Pure White"],
    tags: ["exclusive", "premium"],
    material: "Silk Chiffon with Silk Habotai Lining",
    careInstructions: "Specialist dry clean only.",
    cut: "Empire Waist Occasion Kaftan",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-23"
  },
  {
    id: "p24",
    name: "Charcoal Grey Clean Cut Bisht Abaya",
    price: 880,
    category: "abayas",
    description: "Modern minimalist bisht in a refined charcoal tone. Tailored from anti-wrinkle Japanese Lexus fabric with wide draped arms and front invisible snaps.",
    image: "/images/product-modern-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Charcoal Grey", "Jet Black", "Navy"],
    tags: ["new_drop", "modern"],
    material: "Japanese Lexus Crepe (Wrinkle-Free)",
    careInstructions: "Machine wash 30°C delicate.",
    cut: "Oversized Minimalist Bisht Cut",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-24"
  },
  {
    id: "p25",
    name: "Monochrome Structured Print Modern Abaya",
    price: 790,
    category: "printed",
    description: "Clean monochrome geometric print on light matte crepe. Engineered with structured shoulders and French-seamed interior finishes.",
    image: "/images/product-modern-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Monochrome Black/White", "Navy/White"],
    tags: ["new_drop", "modern"],
    material: "Matte Pebble Crepe",
    careInstructions: "Machine wash cold.",
    cut: "Straight Contemporary Cut",
    includesSheila: true,
    isWholesale: false,
    inStock: true,
    createdAt: "2024-01-25"
  },
  {
    id: "p26",
    name: "Signature Double-Layered Korean Nida Black Abaya",
    price: 980,
    category: "abayas",
    description: "Double-layered front panels in jet black Korean Nida provide deep opacity and a clean silhouette without bulk. Fitted with concealed side pockets and magnetic neck clasp.",
    image: "/images/product-classic-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Jet Black"],
    tags: ["best_seller", "classic", "essential"],
    material: "Double-Density Korean Nida (Zero Static)",
    careInstructions: "Machine wash 30°C. Steam iron on reverse.",
    cut: "Tailored A-Line Cut with Pockets",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-26"
  },
  {
    id: "p27",
    name: "Navy Blue Tailored A-Line Formal Abaya",
    price: 1150,
    category: "abayas",
    description: "Deep navy formal abaya with subtle navy satin trim along the collar and cuffs. Tailored in heavy crepe with clean structural drape.",
    image: "/images/product-classic-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Navy Blue", "Midnight Blue"],
    tags: ["formal", "classic", "best_seller"],
    material: "Heavy Japanese Crepe with Satin Piping",
    careInstructions: "Hand wash cold or dry clean.",
    cut: "Structured A-Line Cut",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-27"
  },
  {
    id: "p28",
    name: "Burgundy & Gold Heritage Cut Abaya Set",
    price: 1850,
    category: "sets",
    description: "Rich burgundy three-piece ensemble featuring gold embroidery along the kimono cuffs. Crafted with matching slip and chiffon sheila.",
    image: "/images/product-traditional-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Burgundy", "Deep Crimson"],
    tags: ["traditional", "heritage", "cultural"],
    material: "Korean Nida with Rayon Slip",
    careInstructions: "Hand wash cold or dry clean.",
    cut: "3-Piece Modular Set",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-28"
  },
  {
    id: "p29",
    name: "Crimson Velvet Gold Tassel Trimmed Kaftan",
    price: 1650,
    category: "kaftans",
    description: "Crimson micro-velvet formal kaftan with handmade golden cord tassels and gold metallic sfifa embroidery along the V-neckline.",
    image: "/images/product-traditional-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Crimson Red", "Burgundy"],
    tags: ["traditional", "oriental", "cultural"],
    material: "Plush Micro-Velvet",
    careInstructions: "Dry clean only.",
    cut: "Traditional Formal Kaftan",
    includesSheila: false,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-29"
  },
  {
    id: "p30",
    name: "Hand-Tailored Platinum Silk Organza Abaya Set",
    price: 3450,
    category: "sets",
    description: "Limited atelier collection: an Italian silk organza outer coat paired with an opaque silver-grey crepe slip dress and pure silk sheila. Hand-cut and sewn in our Dubai studio.",
    image: "/images/product-exclusive-1.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Platinum Grey", "Silver Pearl"],
    tags: ["exclusive", "designer", "limited_edition"],
    material: "100% Italian Silk Organza & Silk-Crepe Slip",
    careInstructions: "Specialist dry clean only.",
    cut: "Atelier Couture 3-Piece Set",
    includesSheila: true,
    isWholesale: true,
    inStock: true,
    createdAt: "2024-01-30"
  },
  {
    id: "p31",
    name: "Black & Gold Crystal Couture Evening Abaya",
    price: 3200,
    category: "sets",
    description: "High-glamour evening abaya with hand-applied crystal clusters and gold bullion thread embroidery on the shoulders and back panel. Includes custom matching sheila scarf.",
    image: "/images/product-exclusive-2.jpeg",
    sizes: ["50", "52", "54", "56", "58", "60"],
    colors: ["Jet Black & Gold"],
    tags: ["exclusive", "couture", "evening"],
    material: "Japanese Heavy Nida with Hand-Embroidered Bullion Work",
    careInstructions: "Specialist dry clean only.",
    cut: "Couture Evening Silhouette",
    includesSheila: true,
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

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  productPurchased: string;
  sizeBought: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Reem Al-Nuaimi",
    location: "Abu Dhabi, UAE",
    rating: 5,
    verified: true,
    productPurchased: "Classic Korean Nida Everyday Bisht",
    sizeBought: "Size 56",
    date: "2 weeks ago",
    text: "The fabric quality of the Korean Nida is noticeably superior—it has the perfect heavy drape without feeling hot in summer. Length 56 was exact to the centimeter and the matching sheila stays in place without slipping."
  },
  {
    id: 2,
    name: "Mariam K.",
    location: "Downtown Dubai, UAE",
    rating: 5,
    verified: true,
    productPurchased: "Black Crepe 3-Piece Set",
    sizeBought: "Size 54",
    date: "1 month ago",
    text: "Received delivery in Dubai the very next day. The inner slip dress is silky smooth with great coverage and the snap buttons on the abaya are concealed neatly. Excellent seam finishing throughout."
  },
  {
    id: 3,
    name: "Noura Al-Husseini",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    verified: true,
    productPurchased: "Emerald Japanese Crepe 3-Piece Set",
    sizeBought: "Size 58",
    date: "3 weeks ago",
    text: "Aramex express shipping to Riyadh took just 3 days. The emerald shade in person is even richer than the website photos, and the stitch quality inside has clean French seams."
  },
  {
    id: 4,
    name: "Layla S.",
    location: "London, United Kingdom",
    rating: 5,
    verified: true,
    productPurchased: "French Lace Trimmed Luxury Abaya",
    sizeBought: "Size 56",
    date: "2 months ago",
    text: "Ordered for Eid celebrations. Finding authentic Dubai abayas with genuine premium textiles in the UK is difficult—this exceeded expectations in weight, fit, and presentation packaging."
  }
];

