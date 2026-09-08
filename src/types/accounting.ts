export type CustomerType = 'retail' | 'wholesale';
export type SaleChannel = 'pos' | 'online' | 'wholesale' | 'showroom';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'credit' | 'split';
export type MovementType = 'pos_sale' | 'online_sale' | 'purchase' | 'sale_return' | 'purchase_return' | 'adjustment_in' | 'adjustment_out' | 'damaged' | 'sample';
export type ExpenseCategory = 'rent' | 'salaries' | 'workshop' | 'packaging' | 'delivery' | 'marketing' | 'utilities' | 'transport' | 'other';
export type ReturnType = 'sale_return' | 'purchase_return';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  type: CustomerType;
  trn?: string;
  creditLimit: number;
  openingBalance: number;
  currentBalance: number; // positive = customer owes us (receivable)
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  companyName?: string;
  category: 'fabric' | 'stitching' | 'embellishments' | 'packaging' | 'logistics' | 'other';
  trn?: string;
  openingBalance: number;
  currentBalance: number; // positive = we owe supplier (payable)
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku?: string;
  image?: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discount: number; // per item discount
  total: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerType: CustomerType;
  channel: SaleChannel;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number; // e.g. 5 for UAE VAT
  taxAmount: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  splitPayments?: { method: PaymentMethod; amount: number }[];
  notes?: string;
  cashierName: string;
  status: 'completed' | 'returned' | 'partial_return' | 'void';
  createdAt: string;
}

export interface PurchaseItem {
  productId?: string;
  productName: string;
  sku?: string;
  category?: string;
  size?: string;
  color?: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  receivedBy: string;
  status: 'received' | 'returned' | 'partial_return';
  createdAt: string;
}

export interface Expense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  paidTo: string;
  referenceNumber?: string;
  description?: string;
  recordedBy: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  type: 'customer_payment' | 'supplier_payment' | 'expense_payment' | 'cash_in' | 'cash_out';
  referenceType: 'sale' | 'purchase' | 'customer_khata' | 'supplier_khata' | 'expense' | 'manual';
  referenceId?: string;
  partyId?: string;
  partyName?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface CashRegisterSession {
  id: string;
  openedAt: string;
  closedAt?: string;
  cashierName: string;
  openingBalance: number;
  cashSales: number;
  cashIn: number;
  cashOut: number;
  cashExpenses: number;
  expectedClosingBalance: number;
  actualClosingBalance?: number;
  difference?: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  type: MovementType;
  quantityChange: number; // positive = added, negative = deducted
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string;
  costPrice?: number;
  retailPrice?: number;
  user: string;
  createdAt: string;
}

export interface ReturnItem {
  productId: string;
  productName: string;
  size: string;
  color?: string;
  quantity: number;
  refundUnitPrice: number;
  totalRefund: number;
  condition: 'good' | 'damaged' | 'defect';
  restock: boolean;
}

export interface ReturnRecord {
  id: string;
  returnNumber: string;
  type: ReturnType;
  originalInvoiceId: string;
  originalInvoiceNumber: string;
  partyId?: string;
  partyName: string;
  date: string;
  items: ReturnItem[];
  totalRefund: number;
  refundMethod: PaymentMethod | 'credit_note';
  reason: string;
  recordedBy: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  recordId: string;
  user: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

export interface BusinessSettings {
  businessName: string;
  legalName: string;
  trn: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  defaultVatRate: number;
  enableVat: boolean;
  receiptHeader: string;
  receiptFooter: string;
  showBarcodeOnReceipt: boolean;
  lowStockThreshold: number;
  termsAndConditions: string;
}

export interface ProductInventoryRecord {
  productId: string;
  productName: string;
  sku: string;
  barcode?: string;
  category: string;
  fabric: string;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  currentStock: number;
  minStockAlert: number;
  variantStocks: {
    size: string;
    color?: string;
    stock: number;
  }[];
  lastRestockedAt?: string;
}
