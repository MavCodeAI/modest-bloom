import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  ProductInventoryRecord,
  SaleItem,
  PurchaseItem,
  ReturnItem,
  PaymentMethod,
  CustomerType,
  SaleChannel
} from '@/types/accounting';
import {
  initialBusinessSettings,
  initialCustomers,
  initialSuppliers,
  initialInventory,
  initialSales,
  initialPurchases,
  initialExpenses,
  initialPayments,
  initialCashRegister,
  initialStockMovements,
  initialReturns,
  initialAuditLogs
} from '@/lib/accounting-data';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEYS = {
  SETTINGS: 'mw_acc_settings_v1',
  CUSTOMERS: 'mw_acc_customers_v1',
  SUPPLIERS: 'mw_acc_suppliers_v1',
  INVENTORY: 'mw_acc_inventory_v1',
  SALES: 'mw_acc_sales_v1',
  PURCHASES: 'mw_acc_purchases_v1',
  EXPENSES: 'mw_acc_expenses_v1',
  PAYMENTS: 'mw_acc_payments_v1',
  CASH_REGISTER: 'mw_acc_cash_reg_v1',
  MOVEMENTS: 'mw_acc_movements_v1',
  RETURNS: 'mw_acc_returns_v1',
  AUDIT_LOGS: 'mw_acc_audit_v1',
};

interface AccountingContextType {
  // State
  settings: BusinessSettings;
  customers: Customer[];
  suppliers: Supplier[];
  inventory: ProductInventoryRecord[];
  sales: SaleInvoice[];
  purchases: PurchaseInvoice[];
  expenses: Expense[];
  payments: PaymentRecord[];
  cashRegister: CashRegisterSession;
  movements: StockMovementRecord[];
  returns: ReturnRecord[];
  auditLogs: AuditLogEntry[];

  // Mutators & Workflows
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  // Customers (Parties / Khata)
  addCustomer: (customer: Omit<Customer, 'id' | 'currentBalance' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  receiveCustomerPayment: (params: {
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    saleId?: string;
    user?: string;
  }) => void;

  // Suppliers (Vendors)
  addSupplier: (supplier: Omit<Supplier, 'id' | 'currentBalance' | 'createdAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  paySupplier: (params: {
    supplierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    purchaseId?: string;
    user?: string;
  }) => void;

  // POS & Sales
  createSale: (saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    customerType: CustomerType;
    channel: SaleChannel;
    items: SaleItem[];
    subtotal: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    splitPayments?: { method: PaymentMethod; amount: number }[];
    notes?: string;
    cashierName?: string;
  }) => SaleInvoice;

  voidSale: (saleId: string, reason: string, user?: string) => void;

  // Purchases (Vendor bills & stock intake)
  createPurchase: (purchaseData: {
    supplierId: string;
    supplierName: string;
    items: PurchaseItem[];
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    receivedBy?: string;
  }) => PurchaseInvoice;

  // Expenses
  addExpense: (expenseData: {
    category: Expense['category'];
    title: string;
    amount: number;
    date: string;
    paymentMethod: PaymentMethod;
    paidTo: string;
    referenceNumber?: string;
    description?: string;
    recordedBy?: string;
  }) => Expense;
  deleteExpense: (id: string) => void;

  // Inventory & Stock
  adjustStock: (params: {
    productId: string;
    size?: string;
    color?: string;
    newStock: number;
    reason: string;
    user?: string;
  }) => void;

  updateProductPrices: (params: {
    productId: string;
    costPrice?: number;
    retailPrice?: number;
    wholesalePrice?: number;
    user?: string;
  }) => void;

  // Returns
  createSaleReturn: (params: {
    originalInvoiceId: string;
    items: ReturnItem[];
    refundMethod: PaymentMethod | 'credit_note';
    reason: string;
    recordedBy?: string;
  }) => ReturnRecord;

  // Cash Register
  openShift: (openingBalance: number, cashierName: string, notes?: string) => void;
  closeShift: (actualClosingBalance: number, notes?: string) => void;
  addCashTransaction: (params: {
    type: 'cash_in' | 'cash_out';
    amount: number;
    notes: string;
    user?: string;
  }) => void;

  // Financial Metrics & Calculations
  stats: {
    totalRevenue: number;
    posRevenue: number;
    wholesaleRevenue: number;
    onlineRevenue: number;
    totalPurchases: number;
    cogs: number;
    grossProfit: number;
    grossMarginPercent: number;
    totalExpenses: number;
    netProfit: number;
    netMarginPercent: number;
    totalReceivables: number;
    totalPayables: number;
    totalInventoryValueCost: number;
    totalInventoryValueRetail: number;
    totalStockUnits: number;
    lowStockCount: number;
    cashInHand: number;
    todaySales: number;
    thisMonthSales: number;
  };
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialBusinessSettings;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [inventory, setInventory] = useState<ProductInventoryRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [sales, setSales] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [cashRegister, setCashRegister] = useState<CashRegisterSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASH_REGISTER);
    return saved ? JSON.parse(saved) : initialCashRegister;
  });

  const [movements, setMovements] = useState<StockMovementRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  const [returns, setReturns] = useState<ReturnRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RETURNS);
    return saved ? JSON.parse(saved) : initialReturns;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASH_REGISTER, JSON.stringify(cashRegister));
  }, [cashRegister]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper: log audit
  const logAudit = (action: string, module: string, recordId: string, details: string, user = 'Admin', oldValue?: unknown, newValue?: unknown) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      module,
      recordId,
      user,
      details,
      oldValue: oldValue ? JSON.stringify(oldValue) : undefined,
      newValue: newValue ? JSON.stringify(newValue) : undefined,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Mutator: update settings
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      logAudit('UPDATE_SETTINGS', 'Settings', 'global', 'Updated business profile and receipt settings');
      return updated;
    });
    toast({ title: 'Settings saved', description: 'Business & receipt settings updated successfully.' });
  };

  // Mutator: add customer
  const addCustomer = (customerData: Omit<Customer, 'id' | 'currentBalance' | 'createdAt'>): Customer => {
    const id = `c-${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id,
      currentBalance: customerData.openingBalance || 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
    logAudit('CREATE_CUSTOMER', 'Customers', id, `Added new ${newCustomer.type} customer: ${newCustomer.name}`);
    toast({ title: 'Customer added', description: `${newCustomer.name} has been created.` });
    return newCustomer;
  };

  // Mutator: update customer
  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          logAudit('UPDATE_CUSTOMER', 'Customers', id, `Updated details for ${c.name}`);
          return updated;
        }
        return c;
      })
    );
    toast({ title: 'Customer updated' });
  };

  // Mutator: delete customer
  const deleteCustomer = (id: string) => {
    const target = customers.find(c => c.id === id);
    if (target) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      logAudit('DELETE_CUSTOMER', 'Customers', id, `Deleted customer: ${target.name}`);
      toast({ title: 'Customer removed' });
    }
  };

  // Mutator: receive customer payment
  const receiveCustomerPayment = ({
    customerId,
    amount,
    paymentMethod,
    notes,
    saleId,
    user = 'Cashier'
  }: {
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    saleId?: string;
    user?: string;
  }) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    // 1. Create Payment Record
    const paymentNumber = `PAY-${Date.now().toString().slice(-6)}`;
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentNumber,
      type: 'customer_payment',
      referenceType: saleId ? 'sale' : 'customer_khata',
      referenceId: saleId,
      partyId: customerId,
      partyName: customer.name,
      amount,
      paymentMethod,
      date: new Date().toISOString(),
      notes: notes || `Payment received from ${customer.name}`,
      recordedBy: user,
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newPayment, ...prev]);

    // 2. Reduce Customer Outstanding Balance
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          return { ...c, currentBalance: Math.max(0, c.currentBalance - amount) };
        }
        return c;
      })
    );

    // 3. If linked to a specific Sale Invoice, update paidAmount & dueAmount
    if (saleId) {
      setSales(prev =>
        prev.map(s => {
          if (s.id === saleId) {
            const newPaid = s.paidAmount + amount;
            const newDue = Math.max(0, s.total - newPaid);
            const newStatus = newDue <= 0 ? 'paid' : 'partial';
            return { ...s, paidAmount: newPaid, dueAmount: newDue, paymentStatus: newStatus };
          }
          return s;
        })
      );
    }

    // 4. Update Cash Register if paid in cash
    if (paymentMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashIn: prev.cashIn + amount,
        expectedClosingBalance: prev.expectedClosingBalance + amount,
      }));
    }

    logAudit('RECEIVE_PAYMENT', 'Khata / Payments', newPayment.id, `Received AED ${amount} from ${customer.name} via ${paymentMethod}`, user);
    toast({ title: 'Payment recorded', description: `AED ${amount} received and credited to ${customer.name}'s account.` });
  };

  // Mutator: add supplier
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'currentBalance' | 'createdAt'>): Supplier => {
    const id = `s-${Date.now()}`;
    const newSupplier: Supplier = {
      ...supplierData,
      id,
      currentBalance: supplierData.openingBalance || 0,
      createdAt: new Date().toISOString(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
    logAudit('CREATE_SUPPLIER', 'Suppliers', id, `Added new supplier: ${newSupplier.name}`);
    toast({ title: 'Supplier added', description: `${newSupplier.name} registered.` });
    return newSupplier;
  };

  // Mutator: update supplier
  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, ...updates };
        }
        return s;
      })
    );
    toast({ title: 'Supplier updated' });
  };

  // Mutator: delete supplier
  const deleteSupplier = (id: string) => {
    const target = suppliers.find(s => s.id === id);
    if (target) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      logAudit('DELETE_SUPPLIER', 'Suppliers', id, `Deleted supplier: ${target.name}`);
      toast({ title: 'Supplier removed' });
    }
  };

  // Mutator: pay supplier
  const paySupplier = ({
    supplierId,
    amount,
    paymentMethod,
    notes,
    purchaseId,
    user = 'Admin'
  }: {
    supplierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    purchaseId?: string;
    user?: string;
  }) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    // 1. Create Payment Record
    const paymentNumber = `PAY-${Date.now().toString().slice(-6)}`;
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentNumber,
      type: 'supplier_payment',
      referenceType: purchaseId ? 'purchase' : 'supplier_khata',
      referenceId: purchaseId,
      partyId: supplierId,
      partyName: supplier.name,
      amount,
      paymentMethod,
      date: new Date().toISOString(),
      notes: notes || `Payment to ${supplier.name}`,
      recordedBy: user,
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newPayment, ...prev]);

    // 2. Reduce Supplier Payable Balance
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === supplierId) {
          return { ...s, currentBalance: Math.max(0, s.currentBalance - amount) };
        }
        return s;
      })
    );

    // 3. Update Purchase invoice if specified
    if (purchaseId) {
      setPurchases(prev =>
        prev.map(p => {
          if (p.id === purchaseId) {
            const newPaid = p.paidAmount + amount;
            const newDue = Math.max(0, p.total - newPaid);
            const newStatus = newDue <= 0 ? 'paid' : 'partial';
            return { ...p, paidAmount: newPaid, dueAmount: newDue, paymentStatus: newStatus };
          }
          return p;
        })
      );
    }

    // 4. Update Cash Register if paid in cash
    if (paymentMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashOut: prev.cashOut + amount,
        expectedClosingBalance: prev.expectedClosingBalance - amount,
      }));
    }

    logAudit('PAY_SUPPLIER', 'Purchases / Payments', newPayment.id, `Paid AED ${amount} to ${supplier.name} via ${paymentMethod}`, user);
    toast({ title: 'Payment sent', description: `AED ${amount} payment recorded for ${supplier.name}.` });
  };

  // Mutator: Create Sale (POS or Wholesale or Showroom)
  const createSale = (saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    customerType: CustomerType;
    channel: SaleChannel;
    items: SaleItem[];
    subtotal: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    splitPayments?: { method: PaymentMethod; amount: number }[];
    notes?: string;
    cashierName?: string;
  }): SaleInvoice => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(sales.length + 1001).toString()}`;
    const dueAmount = Math.max(0, saleData.total - saleData.paidAmount);
    const paymentStatus: PaymentStatus = dueAmount === 0 ? 'paid' : saleData.paidAmount > 0 ? 'partial' : 'unpaid';

    const newSale: SaleInvoice = {
      ...saleData,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      dueAmount,
      paymentStatus,
      cashierName: saleData.cashierName || 'Cashier',
      status: 'completed',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save Sale
    setSales(prev => [newSale, ...prev]);

    // 2. Deduct Inventory & Record Stock Movements
    setInventory(prev =>
      prev.map(invItem => {
        const soldItems = saleData.items.filter(item => item.productId === invItem.productId);
        if (soldItems.length === 0) return invItem;

        const totalQtySold = soldItems.reduce((acc, i) => acc + i.quantity, 0);
        const newStock = Math.max(0, invItem.currentStock - totalQtySold);

        // Update variant stocks
        const updatedVariants = invItem.variantStocks.map(variant => {
          const matchedSold = soldItems.find(i => i.size === variant.size);
          if (matchedSold) {
            return { ...variant, stock: Math.max(0, variant.stock - matchedSold.quantity) };
          }
          return variant;
        });

        // Record stock movement
        const newMovement: StockMovementRecord = {
          id: `mov-${Date.now()}-${invItem.productId}`,
          productId: invItem.productId,
          productName: invItem.productName,
          sku: invItem.sku,
          type: saleData.channel === 'pos' ? 'pos_sale' : saleData.channel === 'online' ? 'online_sale' : 'pos_sale',
          quantityChange: -totalQtySold,
          previousStock: invItem.currentStock,
          newStock,
          reason: `Sale ${invoiceNumber} (${saleData.customerName})`,
          referenceId: newSale.id,
          retailPrice: invItem.retailPrice,
          user: saleData.cashierName || 'Cashier',
          createdAt: new Date().toISOString(),
        };
        setMovements(m => [newMovement, ...m]);

        return {
          ...invItem,
          currentStock: newStock,
          variantStocks: updatedVariants,
        };
      })
    );

    // 3. Update Customer Outstanding Balance if there is Due
    if (dueAmount > 0 && saleData.customerId) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === saleData.customerId) {
            return { ...c, currentBalance: c.currentBalance + dueAmount };
          }
          return c;
        })
      );
    }

    // 4. Record Payment if paid > 0
    if (saleData.paidAmount > 0) {
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
        type: 'customer_payment',
        referenceType: 'sale',
        referenceId: newSale.id,
        partyId: saleData.customerId,
        partyName: saleData.customerName,
        amount: saleData.paidAmount,
        paymentMethod: saleData.paymentMethod,
        date: new Date().toISOString(),
        notes: `Payment for ${invoiceNumber}`,
        recordedBy: saleData.cashierName || 'Cashier',
        createdAt: new Date().toISOString(),
      };
      setPayments(prev => [newPayment, ...prev]);

      // 5. Update Cash Register if Cash
      if (saleData.paymentMethod === 'cash') {
        setCashRegister(prev => ({
          ...prev,
          cashSales: prev.cashSales + saleData.paidAmount,
          expectedClosingBalance: prev.expectedClosingBalance + saleData.paidAmount,
        }));
      }
    }

    logAudit('CREATE_SALE', 'POS / Sales', newSale.id, `Generated invoice ${invoiceNumber} for AED ${saleData.total} (${saleData.paymentStatus})`, saleData.cashierName);
    toast({
      title: 'Sale Completed',
      description: `Invoice ${invoiceNumber} created for AED ${saleData.total.toLocaleString()}.`,
    });

    return newSale;
  };

  // Mutator: Void Sale
  const voidSale = (saleId: string, reason: string, user = 'Admin') => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    // 1. Mark Sale as Void
    setSales(prev =>
      prev.map(s => {
        if (s.id === saleId) {
          return { ...s, status: 'void', notes: `${s.notes ? s.notes + ' | ' : ''}VOIDED: ${reason}` };
        }
        return s;
      })
    );

    // 2. Restock Inventory
    setInventory(prev =>
      prev.map(invItem => {
        const soldItems = sale.items.filter(item => item.productId === invItem.productId);
        if (soldItems.length === 0) return invItem;

        const totalQtyRestocked = soldItems.reduce((acc, i) => acc + i.quantity, 0);
        const newStock = invItem.currentStock + totalQtyRestocked;

        const updatedVariants = invItem.variantStocks.map(variant => {
          const matched = soldItems.find(i => i.size === variant.size);
          if (matched) {
            return { ...variant, stock: variant.stock + matched.quantity };
          }
          return variant;
        });

        // Log movement
        const newMovement: StockMovementRecord = {
          id: `mov-${Date.now()}-${invItem.productId}`,
          productId: invItem.productId,
          productName: invItem.productName,
          sku: invItem.sku,
          type: 'adjustment_in',
          quantityChange: totalQtyRestocked,
          previousStock: invItem.currentStock,
          newStock,
          reason: `Restocked from voided sale ${sale.invoiceNumber} (${reason})`,
          referenceId: sale.id,
          user,
          createdAt: new Date().toISOString(),
        };
        setMovements(m => [newMovement, ...m]);

        return {
          ...invItem,
          currentStock: newStock,
          variantStocks: updatedVariants,
        };
      })
    );

    // 3. Revert Customer Balance if credit sale
    if (sale.dueAmount > 0 && sale.customerId) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === sale.customerId) {
            return { ...c, currentBalance: Math.max(0, c.currentBalance - sale.dueAmount) };
          }
          return c;
        })
      );
    }

    logAudit('VOID_SALE', 'Sales', saleId, `Voided invoice ${sale.invoiceNumber}. Reason: ${reason}`, user);
    toast({ title: 'Sale Voided', description: `Invoice ${sale.invoiceNumber} has been voided and stock restored.` });
  };

  // Mutator: Create Purchase (Vendor Bill / Intake)
  const createPurchase = (purchaseData: {
    supplierId: string;
    supplierName: string;
    items: PurchaseItem[];
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    receivedBy?: string;
  }): PurchaseInvoice => {
    const purchaseNumber = `PO-${new Date().getFullYear()}-${(purchases.length + 201).toString()}`;
    const dueAmount = Math.max(0, purchaseData.total - purchaseData.paidAmount);
    const paymentStatus: PaymentStatus = dueAmount === 0 ? 'paid' : purchaseData.paidAmount > 0 ? 'partial' : 'unpaid';

    const newPurchase: PurchaseInvoice = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
      purchaseNumber,
      dueAmount,
      paymentStatus,
      receivedBy: purchaseData.receivedBy || 'Store Manager',
      status: 'received',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // 1. Save Purchase
    setPurchases(prev => [newPurchase, ...prev]);

    // 2. Increase Inventory & Record Movements for matched products
    setInventory(prev =>
      prev.map(invItem => {
        const receivedItems = purchaseData.items.filter(
          item => item.productId === invItem.productId || item.productName === invItem.productName
        );
        if (receivedItems.length === 0) return invItem;

        const totalQtyAdded = receivedItems.reduce((acc, i) => acc + i.quantity, 0);
        const newStock = invItem.currentStock + totalQtyAdded;

        // Record movement
        const newMovement: StockMovementRecord = {
          id: `mov-${Date.now()}-${invItem.productId}`,
          productId: invItem.productId,
          productName: invItem.productName,
          sku: invItem.sku,
          type: 'purchase',
          quantityChange: totalQtyAdded,
          previousStock: invItem.currentStock,
          newStock,
          reason: `Purchase PO ${purchaseNumber} from ${purchaseData.supplierName}`,
          referenceId: newPurchase.id,
          costPrice: receivedItems[0]?.costPrice || invItem.costPrice,
          user: purchaseData.receivedBy || 'Store Manager',
          createdAt: new Date().toISOString(),
        };
        setMovements(m => [newMovement, ...m]);

        return {
          ...invItem,
          currentStock: newStock,
          costPrice: receivedItems[0]?.costPrice || invItem.costPrice,
          lastRestockedAt: new Date().toISOString().split('T')[0],
        };
      })
    );

    // 3. Update Supplier Payable Balance if there is Due
    if (dueAmount > 0 && purchaseData.supplierId) {
      setSuppliers(prev =>
        prev.map(s => {
          if (s.id === purchaseData.supplierId) {
            return { ...s, currentBalance: s.currentBalance + dueAmount };
          }
          return s;
        })
      );
    }

    // 4. Record Payment if paid > 0
    if (purchaseData.paidAmount > 0) {
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
        type: 'supplier_payment',
        referenceType: 'purchase',
        referenceId: newPurchase.id,
        partyId: purchaseData.supplierId,
        partyName: purchaseData.supplierName,
        amount: purchaseData.paidAmount,
        paymentMethod: purchaseData.paymentMethod,
        date: new Date().toISOString(),
        notes: `Payment for ${purchaseNumber}`,
        recordedBy: purchaseData.receivedBy || 'Store Manager',
        createdAt: new Date().toISOString(),
      };
      setPayments(prev => [newPayment, ...prev]);

      if (purchaseData.paymentMethod === 'cash') {
        setCashRegister(prev => ({
          ...prev,
          cashOut: prev.cashOut + purchaseData.paidAmount,
          expectedClosingBalance: prev.expectedClosingBalance - purchaseData.paidAmount,
        }));
      }
    }

    logAudit('CREATE_PURCHASE', 'Purchases', newPurchase.id, `Created purchase bill ${purchaseNumber} for AED ${purchaseData.total} from ${purchaseData.supplierName}`, purchaseData.receivedBy);
    toast({
      title: 'Purchase recorded',
      description: `Bill ${purchaseNumber} saved and stock updated.`,
    });

    return newPurchase;
  };

  // Mutator: Add Expense
  const addExpense = (expenseData: {
    category: Expense['category'];
    title: string;
    amount: number;
    date: string;
    paymentMethod: PaymentMethod;
    paidTo: string;
    referenceNumber?: string;
    description?: string;
    recordedBy?: string;
  }): Expense => {
    const voucherNumber = `EXP-${new Date().getFullYear()}-${(expenses.length + 301).toString()}`;
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNumber,
      recordedBy: expenseData.recordedBy || 'Finance Officer',
      createdAt: new Date().toISOString(),
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Record Payment log
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
      type: 'expense_payment',
      referenceType: 'expense',
      referenceId: newExpense.id,
      partyName: expenseData.paidTo,
      amount: expenseData.amount,
      paymentMethod: expenseData.paymentMethod,
      date: expenseData.date,
      notes: `${expenseData.title} (${expenseData.category})`,
      recordedBy: expenseData.recordedBy || 'Finance Officer',
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newPayment, ...prev]);

    // If paid via cash, adjust cash register
    if (expenseData.paymentMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashExpenses: prev.cashExpenses + expenseData.amount,
        expectedClosingBalance: prev.expectedClosingBalance - expenseData.amount,
      }));
    }

    logAudit('CREATE_EXPENSE', 'Expenses', newExpense.id, `Logged expense ${voucherNumber}: ${expenseData.title} for AED ${expenseData.amount}`, expenseData.recordedBy);
    toast({ title: 'Expense recorded', description: `Voucher ${voucherNumber} logged for AED ${expenseData.amount.toLocaleString()}.` });
    return newExpense;
  };

  // Mutator: Delete Expense
  const deleteExpense = (id: string) => {
    const target = expenses.find(e => e.id === id);
    if (target) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      logAudit('DELETE_EXPENSE', 'Expenses', id, `Deleted expense voucher ${target.voucherNumber}`);
      toast({ title: 'Expense deleted' });
    }
  };

  // Mutator: Adjust Stock (Audit / Manual Correction)
  const adjustStock = ({
    productId,
    size,
    color,
    newStock,
    reason,
    user = 'Store Manager'
  }: {
    productId: string;
    size?: string;
    color?: string;
    newStock: number;
    reason: string;
    user?: string;
  }) => {
    setInventory(prev =>
      prev.map(invItem => {
        if (invItem.productId === productId) {
          const prevStock = invItem.currentStock;
          const diff = newStock - prevStock;

          let updatedVariants = [...invItem.variantStocks];
          if (size) {
            updatedVariants = updatedVariants.map(v => (v.size === size ? { ...v, stock: newStock } : v));
          }

          const newMovement: StockMovementRecord = {
            id: `mov-${Date.now()}-${productId}`,
            productId,
            productName: invItem.productName,
            sku: invItem.sku,
            type: diff >= 0 ? 'adjustment_in' : 'adjustment_out',
            quantityChange: diff,
            previousStock: prevStock,
            newStock,
            reason,
            user,
            createdAt: new Date().toISOString(),
          };
          setMovements(m => [newMovement, ...m]);

          return {
            ...invItem,
            currentStock: newStock,
            variantStocks: updatedVariants,
          };
        }
        return invItem;
      })
    );

    logAudit('STOCK_ADJUSTMENT', 'Inventory', productId, `Manual stock adjustment to ${newStock} units. Reason: ${reason}`, user);
    toast({ title: 'Stock adjusted', description: `Inventory count updated successfully.` });
  };

  // Mutator: Update Product Prices
  const updateProductPrices = ({
    productId,
    costPrice,
    retailPrice,
    wholesalePrice,
    user = 'Admin'
  }: {
    productId: string;
    costPrice?: number;
    retailPrice?: number;
    wholesalePrice?: number;
    user?: string;
  }) => {
    setInventory(prev =>
      prev.map(invItem => {
        if (invItem.productId === productId) {
          return {
            ...invItem,
            costPrice: costPrice !== undefined ? costPrice : invItem.costPrice,
            retailPrice: retailPrice !== undefined ? retailPrice : invItem.retailPrice,
            wholesalePrice: wholesalePrice !== undefined ? wholesalePrice : invItem.wholesalePrice,
          };
        }
        return invItem;
      })
    );
    logAudit('UPDATE_PRICES', 'Inventory / Products', productId, `Updated prices for product ID ${productId}`, user);
    toast({ title: 'Prices updated' });
  };

  // Mutator: Create Sale Return
  const createSaleReturn = ({
    originalInvoiceId,
    items,
    refundMethod,
    reason,
    recordedBy = 'Store Manager'
  }: {
    originalInvoiceId: string;
    items: ReturnItem[];
    refundMethod: PaymentMethod | 'credit_note';
    reason: string;
    recordedBy?: string;
  }): ReturnRecord => {
    const sale = sales.find(s => s.id === originalInvoiceId);
    const returnNumber = `RET-${new Date().getFullYear()}-${(returns.length + 501).toString()}`;
    const totalRefund = items.reduce((acc, i) => acc + i.totalRefund, 0);

    const newReturn: ReturnRecord = {
      id: `ret-${Date.now()}`,
      returnNumber,
      type: 'sale_return',
      originalInvoiceId,
      originalInvoiceNumber: sale?.invoiceNumber || 'INV-UNKNOWN',
      partyId: sale?.customerId,
      partyName: sale?.customerName || 'Walk-in Customer',
      date: new Date().toISOString(),
      items,
      totalRefund,
      refundMethod,
      reason,
      recordedBy,
      createdAt: new Date().toISOString(),
    };

    setReturns(prev => [newReturn, ...prev]);

    // Update Sale status to partial_return or returned
    if (sale) {
      setSales(prev =>
        prev.map(s => (s.id === originalInvoiceId ? { ...s, status: 'returned' } : s))
      );
    }

    // Restock items if flagged
    items.forEach(item => {
      if (item.restock) {
        setInventory(prev =>
          prev.map(invItem => {
            if (invItem.productId === item.productId) {
              const newStock = invItem.currentStock + item.quantity;

              const newMovement: StockMovementRecord = {
                id: `mov-${Date.now()}-${item.productId}`,
                productId: item.productId,
                productName: item.productName,
                sku: invItem.sku,
                type: 'sale_return',
                quantityChange: item.quantity,
                previousStock: invItem.currentStock,
                newStock,
                reason: `Customer Return ${returnNumber} (${reason})`,
                referenceId: newReturn.id,
                user: recordedBy,
                createdAt: new Date().toISOString(),
              };
              setMovements(m => [newMovement, ...m]);

              return { ...invItem, currentStock: newStock };
            }
            return invItem;
          })
        );
      }
    });

    // If refunded via Cash, deduct from Cash Register
    if (refundMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashOut: prev.cashOut + totalRefund,
        expectedClosingBalance: prev.expectedClosingBalance - totalRefund,
      }));
    }

    // If Credit Note and customer exists, credit customer account
    if (refundMethod === 'credit_note' && sale?.customerId) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === sale.customerId) {
            return { ...c, currentBalance: Math.max(0, c.currentBalance - totalRefund) };
          }
          return c;
        })
      );
    }

    logAudit('CREATE_RETURN', 'Returns / Sales', newReturn.id, `Processed return ${returnNumber} for AED ${totalRefund}. Reason: ${reason}`, recordedBy);
    toast({ title: 'Return Processed', description: `Return ${returnNumber} logged for AED ${totalRefund.toLocaleString()}.` });
    return newReturn;
  };

  // Mutator: Cash Register Shift Controls
  const openShift = (openingBalance: number, cashierName: string, notes?: string) => {
    const newSession: CashRegisterSession = {
      id: `reg-${Date.now()}`,
      openedAt: new Date().toISOString(),
      cashierName,
      openingBalance,
      cashSales: 0,
      cashIn: 0,
      cashOut: 0,
      cashExpenses: 0,
      expectedClosingBalance: openingBalance,
      status: 'open',
      notes,
    };
    setCashRegister(newSession);
    logAudit('OPEN_SHIFT', 'Cash Register', newSession.id, `Opened new shift with float AED ${openingBalance}`, cashierName);
    toast({ title: 'Shift Opened', description: `Register ready with AED ${openingBalance.toLocaleString()} float.` });
  };

  const closeShift = (actualClosingBalance: number, notes?: string) => {
    const diff = actualClosingBalance - cashRegister.expectedClosingBalance;
    const closedSession: CashRegisterSession = {
      ...cashRegister,
      closedAt: new Date().toISOString(),
      actualClosingBalance,
      difference: diff,
      status: 'closed',
      notes: notes || cashRegister.notes,
    };
    setCashRegister(closedSession);
    logAudit('CLOSE_SHIFT', 'Cash Register', cashRegister.id, `Closed shift. Expected: AED ${cashRegister.expectedClosingBalance}, Counted: AED ${actualClosingBalance}, Diff: AED ${diff}`, cashRegister.cashierName);
    toast({
      title: 'Shift Closed',
      description: `Register shift closed. Discrepancy: AED ${diff >= 0 ? '+' : ''}${diff.toLocaleString()}.`,
    });
  };

  const addCashTransaction = ({
    type,
    amount,
    notes,
    user = 'Cashier'
  }: {
    type: 'cash_in' | 'cash_out';
    amount: number;
    notes: string;
    user?: string;
  }) => {
    if (type === 'cash_in') {
      setCashRegister(prev => ({
        ...prev,
        cashIn: prev.cashIn + amount,
        expectedClosingBalance: prev.expectedClosingBalance + amount,
      }));
    } else {
      setCashRegister(prev => ({
        ...prev,
        cashOut: prev.cashOut + amount,
        expectedClosingBalance: prev.expectedClosingBalance - amount,
      }));
    }

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
      type,
      referenceType: 'manual',
      amount,
      paymentMethod: 'cash',
      date: new Date().toISOString(),
      notes,
      recordedBy: user,
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [newPayment, ...prev]);

    logAudit('CASH_ADJUSTMENT', 'Cash Register', newPayment.id, `${type === 'cash_in' ? 'Cash In (Deposit)' : 'Cash Out (Withdrawal)'} of AED ${amount}. Reason: ${notes}`, user);
    toast({ title: type === 'cash_in' ? 'Cash Added' : 'Cash Payout Recorded' });
  };

  // Financial Metrics & Aggregated Statistics
  const stats = useMemo(() => {
    const validSales = sales.filter(s => s.status !== 'void');

    const totalRevenue = validSales.reduce((acc, s) => acc + s.total, 0);
    const posRevenue = validSales.filter(s => s.channel === 'pos').reduce((acc, s) => acc + s.total, 0);
    const wholesaleRevenue = validSales.filter(s => s.channel === 'wholesale').reduce((acc, s) => acc + s.total, 0);
    const onlineRevenue = validSales.filter(s => s.channel === 'online').reduce((acc, s) => acc + s.total, 0);

    const totalPurchases = purchases.reduce((acc, p) => acc + p.total, 0);

    // Calculate COGS from sold items
    const cogs = validSales.reduce((acc, sale) => {
      const saleCogs = sale.items.reduce((itemAcc, item) => itemAcc + (item.costPrice * item.quantity), 0);
      return acc + saleCogs;
    }, 0);

    const grossProfit = totalRevenue - cogs;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;
    const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const totalReceivables = customers.reduce((acc, c) => acc + (c.currentBalance || 0), 0);
    const totalPayables = suppliers.reduce((acc, s) => acc + (s.currentBalance || 0), 0);

    const totalInventoryValueCost = inventory.reduce((acc, item) => acc + (item.costPrice * item.currentStock), 0);
    const totalInventoryValueRetail = inventory.reduce((acc, item) => acc + (item.retailPrice * item.currentStock), 0);
    const totalStockUnits = inventory.reduce((acc, item) => acc + item.currentStock, 0);
    const lowStockCount = inventory.filter(item => item.currentStock <= item.minStockAlert).length;

    const cashInHand = cashRegister.expectedClosingBalance;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = validSales
      .filter(s => s.date.startsWith(todayStr))
      .reduce((acc, s) => acc + s.total, 0);

    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    const thisMonthSales = validSales
      .filter(s => s.date.startsWith(currentMonthPrefix))
      .reduce((acc, s) => acc + s.total, 0);

    return {
      totalRevenue,
      posRevenue,
      wholesaleRevenue,
      onlineRevenue,
      totalPurchases,
      cogs,
      grossProfit,
      grossMarginPercent,
      totalExpenses,
      netProfit,
      netMarginPercent,
      totalReceivables,
      totalPayables,
      totalInventoryValueCost,
      totalInventoryValueRetail,
      totalStockUnits,
      lowStockCount,
      cashInHand,
      todaySales,
      thisMonthSales,
    };
  }, [sales, purchases, expenses, customers, suppliers, inventory, cashRegister]);

  const value: AccountingContextType = {
    settings,
    customers,
    suppliers,
    inventory,
    sales,
    purchases,
    expenses,
    payments,
    cashRegister,
    movements,
    returns,
    auditLogs,
    updateSettings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    receiveCustomerPayment,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    paySupplier,
    createSale,
    voidSale,
    createPurchase,
    addExpense,
    deleteExpense,
    adjustStock,
    updateProductPrices,
    createSaleReturn,
    openShift,
    closeShift,
    addCashTransaction,
    stats,
  };

  return <AccountingContext.Provider value={value}>{children}</AccountingContext.Provider>;
}

export function useAccounting() {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
}
