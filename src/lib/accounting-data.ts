import {
  Customer,
  Supplier,
  SaleInvoice,
  PurchaseInvoice,
  Expense,
  PaymentRecord,
  CashRegisterSession,
  StockMovementRecord,
  ReturnRecord,
  AuditLogEntry,
  BusinessSettings,
  ProductInventoryRecord
} from '@/types/accounting';
import { initialProducts } from '@/lib/data';

export const initialBusinessSettings: BusinessSettings = {
  businessName: 'Modest Way Fashion L.L.C',
  legalName: 'Modest Way Garments & Haute Couture LLC',
  trn: '100489372800003',
  phone: '+971 50 123 4567',
  email: 'accounts@modestwayfashion.com',
  address: 'Showroom 4, Al Wasl Road, Jumeirah 1',
  city: 'Dubai',
  country: 'United Arab Emirates',
  currency: 'AED',
  defaultVatRate: 5,
  enableVat: true,
  receiptHeader: 'MODEST WAY FASHION • DUBAI\nLuxury Abayas & Haute Couture',
  receiptFooter: 'Thank you for choosing Modest Way Fashion.\nGoods once sold can be exchanged within 14 days with original tag and receipt.\nInstagram: @modestwayfashion | WhatsApp: +971 50 123 4567',
  showBarcodeOnReceipt: true,
  lowStockThreshold: 5,
  termsAndConditions: '1. Wholesale orders require 50% deposit before production.\n2. In-store returns are credited as Store Credit or Item Exchange.\n3. Custom tailored abayas are non-refundable.',
};

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Walk-in Retail Customer',
    phone: '+971 50 000 0000',
    type: 'retail',
    creditLimit: 0,
    openingBalance: 0,
    currentBalance: 0,
    city: 'Dubai',
    createdAt: '2024-01-01',
  },
  {
    id: 'c2',
    name: 'Sheikha Reem Al-Nuaimi',
    phone: '+971 50 442 8819',
    email: 'reem.alnuaimi@gmail.com',
    type: 'retail',
    creditLimit: 5000,
    openingBalance: 0,
    currentBalance: 1350, // owes for 1 abaya
    address: 'Villa 14, Al Bateen',
    city: 'Abu Dhabi',
    notes: 'VIP Retail Client - Prefers Size 56 and Bisht cuts with extra length',
    createdAt: '2024-01-10',
  },
  {
    id: 'c3',
    name: 'Al Noor Modest Boutique (KSA)',
    companyName: 'Al Noor Fashion Trading Est.',
    contactPerson: 'Fahad Al-Otaibi',
    phone: '+966 54 112 9900',
    email: 'procurement@alnoorboutique.sa',
    type: 'wholesale',
    trn: '300982716200003',
    creditLimit: 35000,
    openingBalance: 0,
    currentBalance: 8200, // outstanding B2B balance
    address: 'Olaya Street, Tahlia Commercial Center',
    city: 'Riyadh',
    notes: 'Wholesale B2B Partner - Monthly 40-50 pcs shipment',
    createdAt: '2024-01-05',
  },
  {
    id: 'c4',
    name: 'Mariam Khalid Al-Falasi',
    phone: '+971 55 981 2234',
    email: 'mariam.khalid@outlook.com',
    type: 'retail',
    creditLimit: 2000,
    openingBalance: 0,
    currentBalance: 0,
    address: 'Apartment 1402, Downtown Heights',
    city: 'Dubai',
    createdAt: '2024-01-15',
  },
  {
    id: 'c5',
    name: 'Doha Silk & Abaya House',
    companyName: 'Al Rayyan Luxury Apparel W.L.L',
    contactPerson: 'Jassim Al-Kuwari',
    phone: '+974 33 881 294',
    email: 'jassim@dohasilk.qa',
    type: 'wholesale',
    creditLimit: 50000,
    openingBalance: 0,
    currentBalance: 14500, // pending invoice payment
    address: 'Souq Waqif Premium Lane',
    city: 'Doha',
    notes: 'Wholesale client - high volume orders during Ramadan & Eid',
    createdAt: '2024-01-18',
  },
  {
    id: 'c6',
    name: 'Hessa Al-Mazrouei',
    phone: '+971 52 773 4410',
    email: 'hessa.mazrouei@gmail.com',
    type: 'retail',
    creditLimit: 1500,
    openingBalance: 0,
    currentBalance: 0,
    city: 'Sharjah',
    createdAt: '2024-01-20',
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 's1',
    name: 'Dubai Korean Nida & Silk Mills',
    contactPerson: 'Tariq Mehmood',
    companyName: 'Nida Premium Textiles Trading LLC',
    phone: '+971 4 226 8910',
    email: 'sales@nida-textiles.ae',
    category: 'fabric',
    trn: '100223948100003',
    openingBalance: 0,
    currentBalance: 6500, // we owe for fabric rolls
    address: 'Warehouse 18, Al Quoz Industrial 3',
    city: 'Dubai',
    notes: 'Primary supplier for Grade-A Korean Nida 180GSM and Japanese Lexus Crepe',
    createdAt: '2024-01-01',
  },
  {
    id: 's2',
    name: 'Al Wasl Master Tailoring Workshop',
    contactPerson: 'Master Ustad Rafiq',
    companyName: 'Al Wasl Stitching & Embroidery LLC',
    phone: '+971 6 543 2190',
    email: 'orders@alwasltailoring.ae',
    category: 'stitching',
    trn: '100449102800003',
    openingBalance: 0,
    currentBalance: 4200, // we owe for tailoring batch
    address: 'Industrial Area 11, Stitching Hub',
    city: 'Sharjah',
    notes: 'Haute couture tailoring, hand embroidery and French seam assembly',
    createdAt: '2024-01-02',
  },
  {
    id: 's3',
    name: 'Golden Sfifa & Trims Importers',
    contactPerson: 'Hassan Belhadj',
    companyName: 'Maghreb & Gulf Trims Trading',
    phone: '+971 4 338 9012',
    category: 'embellishments',
    openingBalance: 0,
    currentBalance: 1200,
    address: 'Deira Gold Souq Textile Lane',
    city: 'Dubai',
    notes: 'Pure metallic Zari, Moroccan Sfifa braiding and Austrian crystal trims',
    createdAt: '2024-01-08',
  },
  {
    id: 's4',
    name: 'Gulf Luxury Packaging Co.',
    contactPerson: 'Salim Merchant',
    companyName: 'Gulf Premium Print & Boxes FZCO',
    phone: '+971 4 881 5560',
    email: 'orders@gulfpackaging.ae',
    category: 'packaging',
    openingBalance: 0,
    currentBalance: 0,
    address: 'JAFZA South',
    city: 'Dubai',
    notes: 'Custom magnetic rigid abaya gift boxes, embossed dust bags & garment tags',
    createdAt: '2024-01-12',
  }
];

// Map inventory records for all 31 products with realistic cost price, retail price, wholesale price, and size breakdown
export const initialInventory: ProductInventoryRecord[] = initialProducts.map((p, index) => {
  const costPrice = Math.round(p.price * 0.42); // 42% cost of goods
  const wholesalePrice = p.isWholesale ? Math.round(p.price * 0.70) : Math.round(p.price * 0.75);
  const baseStock = 12 + (index % 7) * 3; // between 12 and 30 units

  return {
    productId: p.id,
    productName: p.name,
    sku: `MWF-${(p.category || 'ABY').toUpperCase().slice(0, 3)}-${100 + index}`,
    barcode: `6291100${1000 + index}`,
    category: p.category || 'abayas',
    fabric: p.material || 'Korean Nida',
    costPrice,
    retailPrice: p.price,
    wholesalePrice,
    currentStock: baseStock,
    minStockAlert: 5,
    variantStocks: (p.sizes || ['50', '52', '54', '56', '58', '60']).map(size => ({
      size,
      color: p.colors?.[0] || 'Black',
      stock: Math.max(1, Math.floor(baseStock / 6))
    })),
    lastRestockedAt: '2024-02-15'
  };
});

export const initialSales: SaleInvoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2024-1001',
    customerId: 'c4',
    customerName: 'Mariam Khalid Al-Falasi',
    customerPhone: '+971 55 981 2234',
    customerType: 'retail',
    channel: 'pos',
    date: '2024-02-28T14:30:00Z',
    items: [
      {
        productId: 'p1',
        productName: 'Classic Korean Nida Everyday Bisht',
        sku: 'MWF-ABA-100',
        size: '56',
        color: 'Black',
        quantity: 1,
        unitPrice: 680,
        costPrice: 286,
        discount: 0,
        total: 680,
      },
      {
        productId: 'p5',
        productName: 'Lexus Crepe Tailored Straight Abaya',
        sku: 'MWF-ABA-104',
        size: '56',
        color: 'Black',
        quantity: 1,
        unitPrice: 650,
        costPrice: 273,
        discount: 50,
        total: 600,
      }
    ],
    subtotal: 1330,
    discountType: 'fixed',
    discountValue: 50,
    discountAmount: 50,
    taxRate: 5,
    taxAmount: 64,
    total: 1344,
    paidAmount: 1344,
    dueAmount: 0,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    cashierName: 'Fatima (POS Terminal 1)',
    status: 'completed',
    createdAt: '2024-02-28T14:30:00Z'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2024-1002',
    customerId: 'c3',
    customerName: 'Al Noor Modest Boutique (KSA)',
    customerPhone: '+966 54 112 9900',
    customerType: 'wholesale',
    channel: 'wholesale',
    date: '2024-02-27T11:15:00Z',
    items: [
      {
        productId: 'p1',
        productName: 'Classic Korean Nida Everyday Bisht',
        sku: 'MWF-ABA-100',
        size: '54',
        color: 'Black',
        quantity: 10,
        unitPrice: 476,
        costPrice: 286,
        discount: 0,
        total: 4760,
      },
      {
        productId: 'p3',
        productName: 'Black Crepe 3-Piece Set with Inner & Sheila',
        sku: 'MWF-SET-102',
        size: '56',
        color: 'Black',
        quantity: 10,
        unitPrice: 875,
        costPrice: 525,
        discount: 0,
        total: 8750,
      },
      {
        productId: 'p8',
        productName: 'Emerald Japanese Crepe 3-Piece Set',
        sku: 'MWF-SET-107',
        size: '56',
        color: 'Emerald Green',
        quantity: 5,
        unitPrice: 1155,
        costPrice: 693,
        discount: 0,
        total: 5775,
      }
    ],
    subtotal: 19285,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0, // Zero-rated export to KSA with customs declaration
    taxAmount: 0,
    total: 19285,
    paidAmount: 11085,
    dueAmount: 8200, // remaining receivable
    paymentStatus: 'partial',
    paymentMethod: 'bank_transfer',
    notes: 'Wholesale order with Aramex Cargo tracking. Balance due on delivery.',
    cashierName: 'Admin / Wholesale Desk',
    status: 'completed',
    createdAt: '2024-02-27T11:15:00Z'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2024-1003',
    customerId: 'c2',
    customerName: 'Sheikha Reem Al-Nuaimi',
    customerPhone: '+971 50 442 8819',
    customerType: 'retail',
    channel: 'showroom',
    date: '2024-02-26T18:00:00Z',
    items: [
      {
        productId: 'p13',
        productName: 'Midnight Blue Crystal-Detailed Occasion Abaya',
        sku: 'MWF-ABA-112',
        size: '58',
        color: 'Midnight Blue',
        quantity: 1,
        unitPrice: 1350,
        costPrice: 567,
        discount: 0,
        total: 1350,
      }
    ],
    subtotal: 1350,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 5,
    taxAmount: 0, // VIP tax absorbed
    total: 1350,
    paidAmount: 0,
    dueAmount: 1350, // Credit Sale (Khata Ledger)
    paymentStatus: 'unpaid',
    paymentMethod: 'credit',
    notes: 'Dispatched via private driver to Abu Dhabi. Charged to customer VIP Khata.',
    cashierName: 'Sara (Showroom Manager)',
    status: 'completed',
    createdAt: '2024-02-26T18:00:00Z'
  },
  {
    id: 'inv-1004',
    invoiceNumber: 'INV-2024-1004',
    customerId: 'c1',
    customerName: 'Walk-in Retail Customer',
    customerType: 'retail',
    channel: 'pos',
    date: '2024-02-25T16:45:00Z',
    items: [
      {
        productId: 'p2',
        productName: 'Champagne Raw Silk Embroidered Kaftan',
        sku: 'MWF-KAF-101',
        size: '54',
        color: 'Champagne Gold',
        quantity: 1,
        unitPrice: 1450,
        costPrice: 609,
        discount: 0,
        total: 1450,
      }
    ],
    subtotal: 1450,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 5,
    taxAmount: 72.5,
    total: 1522.5,
    paidAmount: 1522.5,
    dueAmount: 0,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    cashierName: 'Fatima (POS Terminal 1)',
    status: 'completed',
    createdAt: '2024-02-25T16:45:00Z'
  },
  {
    id: 'inv-1005',
    invoiceNumber: 'INV-2024-1005',
    customerId: 'c5',
    customerName: 'Doha Silk & Abaya House',
    customerPhone: '+974 33 881 294',
    customerType: 'wholesale',
    channel: 'wholesale',
    date: '2024-02-24T10:00:00Z',
    items: [
      {
        productId: 'p22',
        productName: 'Gold Zari Metallic Threadwork Abaya Set',
        sku: 'MWF-SET-121',
        size: '56',
        color: 'Antique Gold on Black',
        quantity: 6,
        unitPrice: 2065,
        costPrice: 1239,
        discount: 0,
        total: 12390,
      },
      {
        productId: 'p23',
        productName: 'Crystal Hand-Beaded Bridal Kaftan',
        sku: 'MWF-KAF-122',
        size: '54',
        color: 'Silver Platinum',
        quantity: 4,
        unitPrice: 1995,
        costPrice: 1197,
        discount: 0,
        total: 7980,
      }
    ],
    subtotal: 20370,
    discountType: 'fixed',
    discountValue: 870,
    discountAmount: 870,
    taxRate: 0,
    taxAmount: 0,
    total: 19500,
    paidAmount: 5000,
    dueAmount: 14500,
    paymentStatus: 'partial',
    paymentMethod: 'bank_transfer',
    notes: 'Qatari B2B consignment. Paid 5,000 AED initial advance.',
    cashierName: 'Admin / Wholesale Desk',
    status: 'completed',
    createdAt: '2024-02-24T10:00:00Z'
  }
];

export const initialPurchases: PurchaseInvoice[] = [
  {
    id: 'pur-201',
    purchaseNumber: 'PO-2024-0201',
    supplierId: 's1',
    supplierName: 'Dubai Korean Nida & Silk Mills',
    date: '2024-02-20T09:30:00Z',
    items: [
      {
        productName: 'Grade-A Korean Nida Fabric (Black - 1000 Yards)',
        sku: 'FAB-NIDA-BLK',
        quantity: 20, // 20 bolts / rolls
        costPrice: 450,
        total: 9000,
      },
      {
        productName: 'Textured Japanese Pebble Crepe (Navy - 400 Yards)',
        sku: 'FAB-CREP-NVY',
        quantity: 8,
        costPrice: 520,
        total: 4160,
      }
    ],
    subtotal: 13160,
    taxAmount: 658,
    shippingCost: 250,
    discountAmount: 568,
    total: 13500,
    paidAmount: 7000,
    dueAmount: 6500, // remaining payable
    paymentStatus: 'partial',
    paymentMethod: 'bank_transfer',
    notes: 'Fabric rolls received in good condition at Al Wasl cutting facility.',
    receivedBy: 'Ustad Rafiq (Workshop Lead)',
    status: 'received',
    createdAt: '2024-02-20T09:30:00Z'
  },
  {
    id: 'pur-202',
    purchaseNumber: 'PO-2024-0202',
    supplierId: 's2',
    supplierName: 'Al Wasl Master Tailoring Workshop',
    date: '2024-02-22T15:00:00Z',
    items: [
      {
        productName: 'Stitching & Finishing Batch: 50 pcs Korean Nida Bishts',
        sku: 'STITCH-BISHT-50',
        quantity: 50,
        costPrice: 95,
        total: 4750,
      },
      {
        productName: 'Hand Embroidery & Sheila Edging: 30 pcs Occasion Sets',
        sku: 'EMB-OCCASION-30',
        quantity: 30,
        costPrice: 115,
        total: 3450,
      }
    ],
    subtotal: 8200,
    taxAmount: 0,
    shippingCost: 0,
    discountAmount: 0,
    total: 8200,
    paidAmount: 4000,
    dueAmount: 4200,
    paymentStatus: 'partial',
    paymentMethod: 'cash',
    notes: 'Batch 14 inspected for thread quality and seam finish.',
    receivedBy: 'Quality Inspection Officer',
    status: 'received',
    createdAt: '2024-02-22T15:00:00Z'
  },
  {
    id: 'pur-203',
    purchaseNumber: 'PO-2024-0203',
    supplierId: 's4',
    supplierName: 'Gulf Luxury Packaging Co.',
    date: '2024-02-10T11:00:00Z',
    items: [
      {
        productName: 'Gold Foil Embossed Rigid Abaya Gift Boxes (500 pcs)',
        sku: 'PKG-BOX-500',
        quantity: 500,
        costPrice: 7.5,
        total: 3750,
      },
      {
        productName: 'Satin Ribbon & Tissue Wrapping Paper Reams',
        sku: 'PKG-RIBBON-50',
        quantity: 50,
        costPrice: 15,
        total: 750,
      }
    ],
    subtotal: 4500,
    taxAmount: 225,
    shippingCost: 150,
    discountAmount: 375,
    total: 4500,
    paidAmount: 4500,
    dueAmount: 0,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    notes: 'Full packaging replenishment paid via corporate card.',
    receivedBy: 'Showroom Stock Keeper',
    status: 'received',
    createdAt: '2024-02-10T11:00:00Z'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-301',
    voucherNumber: 'EXP-2024-0301',
    category: 'rent',
    title: 'Showroom Monthly Rent (Jumeirah 1)',
    amount: 14500,
    date: '2024-02-01',
    paymentMethod: 'bank_transfer',
    paidTo: 'Al Wasl Properties Management',
    referenceNumber: 'CHQ-889102',
    description: 'Monthly lease installment for Jumeirah 1 retail boutique & showroom.',
    recordedBy: 'Managing Director',
    createdAt: '2024-02-01T08:00:00Z'
  },
  {
    id: 'exp-302',
    voucherNumber: 'EXP-2024-0302',
    category: 'salaries',
    title: 'Showroom & Tailoring Staff Salaries',
    amount: 18200,
    date: '2024-02-28',
    paymentMethod: 'bank_transfer',
    paidTo: 'WPS Payroll System',
    referenceNumber: 'WPS-FEB-2024',
    description: 'February payroll for showroom sales consultants, cashier, and 2 master tailors.',
    recordedBy: 'Finance Officer',
    createdAt: '2024-02-28T09:00:00Z'
  },
  {
    id: 'exp-303',
    voucherNumber: 'EXP-2024-0303',
    category: 'delivery',
    title: 'Aramex UAE & GCC Courier Invoice',
    amount: 1850,
    date: '2024-02-25',
    paymentMethod: 'card',
    paidTo: 'Aramex Emirates LLC',
    referenceNumber: 'ARM-INV-77319',
    description: 'Express next-day delivery charges for e-commerce and wholesale shipments.',
    recordedBy: 'Logistics Coordinator',
    createdAt: '2024-02-25T14:00:00Z'
  },
  {
    id: 'exp-304',
    voucherNumber: 'EXP-2024-0304',
    category: 'marketing',
    title: 'Instagram & TikTok Ramadan Campaign',
    amount: 3200,
    date: '2024-02-20',
    paymentMethod: 'card',
    paidTo: 'Meta Ads & Influencer Media',
    referenceNumber: 'META-99120',
    description: 'Targeted GCC advertising for 2024 Occasion Abaya Collection drops.',
    recordedBy: 'Marketing Lead',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'exp-305',
    voucherNumber: 'EXP-2024-0305',
    category: 'utilities',
    title: 'DEWA Showroom Electricity & Water',
    amount: 1420,
    date: '2024-02-15',
    paymentMethod: 'card',
    paidTo: 'Dubai Electricity & Water Authority',
    referenceNumber: 'DEWA-2024-02',
    description: 'Showroom cooling, interior track lighting, and boutique steam irons.',
    recordedBy: 'Finance Officer',
    createdAt: '2024-02-15T11:00:00Z'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-401',
    paymentNumber: 'PAY-2024-0401',
    type: 'customer_payment',
    referenceType: 'sale',
    referenceId: 'inv-1001',
    partyId: 'c4',
    partyName: 'Mariam Khalid Al-Falasi',
    amount: 1344,
    paymentMethod: 'card',
    date: '2024-02-28T14:30:00Z',
    notes: 'POS checkout card swipe payment',
    recordedBy: 'Fatima (POS 1)',
    createdAt: '2024-02-28T14:30:00Z'
  },
  {
    id: 'pay-402',
    paymentNumber: 'PAY-2024-0402',
    type: 'customer_payment',
    referenceType: 'sale',
    referenceId: 'inv-1002',
    partyId: 'c3',
    partyName: 'Al Noor Modest Boutique (KSA)',
    amount: 11085,
    paymentMethod: 'bank_transfer',
    date: '2024-02-27T11:15:00Z',
    notes: 'Telegraphic wire transfer deposit for B2B wholesale order',
    recordedBy: 'Admin',
    createdAt: '2024-02-27T11:15:00Z'
  },
  {
    id: 'pay-403',
    paymentNumber: 'PAY-2024-0403',
    type: 'supplier_payment',
    referenceType: 'purchase',
    referenceId: 'pur-201',
    partyId: 's1',
    partyName: 'Dubai Korean Nida & Silk Mills',
    amount: 7000,
    paymentMethod: 'bank_transfer',
    date: '2024-02-20T10:00:00Z',
    notes: 'Initial 50% deposit for fabric rolls consignment',
    recordedBy: 'Finance Officer',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'pay-404',
    paymentNumber: 'PAY-2024-0404',
    type: 'supplier_payment',
    referenceType: 'purchase',
    referenceId: 'pur-202',
    partyId: 's2',
    partyName: 'Al Wasl Master Tailoring Workshop',
    amount: 4000,
    paymentMethod: 'cash',
    date: '2024-02-22T16:00:00Z',
    notes: 'Advance cash payment for tailor workshop batch',
    recordedBy: 'Showroom Cashier',
    createdAt: '2024-02-22T16:00:00Z'
  }
];

export const initialCashRegister: CashRegisterSession = {
  id: 'reg-session-today',
  openedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  cashierName: 'Fatima Al-Hassani (Main Register)',
  openingBalance: 1500, // 1,500 AED float
  cashSales: 1522.5,
  cashIn: 0,
  cashOut: 4000, // supplier cash payout
  cashExpenses: 0,
  expectedClosingBalance: 1500 + 1522.5 - 4000 + 4000, // float + cash sales
  status: 'open',
  notes: 'Morning shift float verified: 10x 100 AED, 8x 50 AED, 10x 10 AED'
};

export const initialStockMovements: StockMovementRecord[] = [
  {
    id: 'mov-1',
    productId: 'p1',
    productName: 'Classic Korean Nida Everyday Bisht',
    sku: 'MWF-ABA-100',
    type: 'purchase',
    quantityChange: 30,
    previousStock: 5,
    newStock: 35,
    reason: 'Received production batch from Al Wasl Workshop',
    costPrice: 286,
    retailPrice: 680,
    user: 'Ustad Rafiq',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'mov-2',
    productId: 'p1',
    productName: 'Classic Korean Nida Everyday Bisht',
    sku: 'MWF-ABA-100',
    type: 'pos_sale',
    quantityChange: -1,
    previousStock: 35,
    newStock: 34,
    reason: 'POS Sale Invoice #INV-2024-1001',
    referenceId: 'inv-1001',
    retailPrice: 680,
    user: 'Fatima (POS 1)',
    createdAt: '2024-02-28T14:30:00Z'
  },
  {
    id: 'mov-3',
    productId: 'p1',
    productName: 'Classic Korean Nida Everyday Bisht',
    sku: 'MWF-ABA-100',
    type: 'pos_sale',
    quantityChange: -10,
    previousStock: 34,
    newStock: 24,
    reason: 'Wholesale B2B Order #INV-2024-1002 (Al Noor Boutique)',
    referenceId: 'inv-1002',
    retailPrice: 476,
    user: 'Admin Desk',
    createdAt: '2024-02-27T11:15:00Z'
  },
  {
    id: 'mov-4',
    productId: 'p2',
    productName: 'Champagne Raw Silk Embroidered Kaftan',
    sku: 'MWF-KAF-101',
    type: 'pos_sale',
    quantityChange: -1,
    previousStock: 18,
    newStock: 17,
    reason: 'POS Sale Invoice #INV-2024-1004',
    referenceId: 'inv-1004',
    retailPrice: 1450,
    user: 'Fatima (POS 1)',
    createdAt: '2024-02-25T16:45:00Z'
  }
];

export const initialReturns: ReturnRecord[] = [
  {
    id: 'ret-501',
    returnNumber: 'RET-2024-0501',
    type: 'sale_return',
    originalInvoiceId: 'inv-0992',
    originalInvoiceNumber: 'INV-2024-0992',
    partyId: 'c6',
    partyName: 'Hessa Al-Mazrouei',
    date: '2024-02-24T12:00:00Z',
    items: [
      {
        productId: 'p4',
        productName: 'Dusty Rose Linen-Crepe Open Abaya',
        size: '54',
        color: 'Dusty Rose',
        quantity: 1,
        refundUnitPrice: 780,
        totalRefund: 780,
        condition: 'good',
        restock: true
      }
    ],
    totalRefund: 780,
    refundMethod: 'credit_note',
    reason: 'Customer requested size exchange from 54 to 56.',
    recordedBy: 'Sara (Showroom Manager)',
    createdAt: '2024-02-24T12:00:00Z'
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2024-02-28T14:30:10Z',
    action: 'CREATE_SALE',
    module: 'POS / Sales',
    recordId: 'inv-1001',
    user: 'Fatima Al-Hassani',
    details: 'Completed retail POS sale INV-2024-1001 for AED 1,344 via Card.'
  },
  {
    id: 'log-2',
    timestamp: '2024-02-27T11:15:30Z',
    action: 'CREATE_WHOLESALE_SALE',
    module: 'Sales',
    recordId: 'inv-1002',
    user: 'Admin',
    details: 'Created B2B Wholesale Invoice INV-2024-1002 for Al Noor Modest Boutique (Total: AED 19,285, Paid: AED 11,085, Due: AED 8,200).'
  },
  {
    id: 'log-3',
    timestamp: '2024-02-26T18:00:20Z',
    action: 'RECORD_CREDIT_SALE',
    module: 'Khata / Customers',
    recordId: 'inv-1003',
    user: 'Sara (Showroom)',
    details: 'Dispatched VIP credit sale INV-2024-1003 to Sheikha Reem Al-Nuaimi. Customer balance updated to +1,350 AED.'
  },
  {
    id: 'log-4',
    timestamp: '2024-02-22T15:00:45Z',
    action: 'CREATE_PURCHASE',
    module: 'Purchases / Inventory',
    recordId: 'pur-202',
    user: 'Admin',
    details: 'Logged production batch PO-2024-0202 from Al Wasl Tailoring. Stock increased by 80 units.'
  }
];
