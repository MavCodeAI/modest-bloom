import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { Customer, SaleItem, PaymentMethod, CustomerType, ProductInventoryRecord, SaleInvoice } from '@/types/accounting';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  CreditCard,
  Banknote,
  Percent,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Receipt,
  ScanBarcode,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

interface ParkedCart {
  id: string;
  customerName: string;
  items: SaleItem[];
  pricingMode: 'retail' | 'wholesale';
  discountAmount: number;
  notes: string;
  parkedAt: string;
}

export function POSModule() {
  const {
    inventory,
    customers,
    settings,
    createSale,
    addCustomer,
    cashRegister
  } = useAccounting();

  // POS State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pricingMode, setPricingMode] = useState<'retail' | 'wholesale'>('retail');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c1'); // default walk-in
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [applyVat, setApplyVat] = useState(settings.enableVat);

  // Modals
  const [variantModalProduct, setVariantModalProduct] = useState<ProductInventoryRecord | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('56');
  const [selectedColor, setSelectedColor] = useState<string>('Black');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustType, setNewCustType] = useState<CustomerType>('retail');
  const [newCustCity, setNewCustCity] = useState('Dubai');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tenderedAmount, setTenderedAmount] = useState<string>('');
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);

  // Parked Carts
  const [parkedCarts, setParkedCarts] = useState<ParkedCart[]>([]);
  const [isParkedModalOpen, setIsParkedModalOpen] = useState(false);

  // Last completed sale for invoice modal
  const [completedSale, setCompletedSale] = useState<SaleInvoice | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Customer selected object
  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return ['all', ...Array.from(set)];
  }, [inventory]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.barcode && item.barcode.includes(q)) ||
        (item.fabric && item.fabric.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [inventory, selectedCategory, searchQuery]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.total, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountValue <= 0) return 0;
    if (discountType === 'percentage') {
      return Math.round((subtotal * discountValue) / 100);
    }
    return Math.min(subtotal, discountValue);
  }, [subtotal, discountType, discountValue]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = applyVat ? settings.defaultVatRate : 0;
  const taxAmount = applyVat ? Math.round((taxableAmount * taxRate) / 100) : 0;
  const grandTotal = taxableAmount + taxAmount;

  // Change Due calculation
  const numericTendered = parseFloat(tenderedAmount) || grandTotal;
  const changeDue = Math.max(0, numericTendered - grandTotal);

  // Add product to cart (trigger variant modal or direct add)
  const handleProductClick = (item: ProductInventoryRecord) => {
    if (item.currentStock <= 0) {
      toast.error('Item is currently out of stock');
      return;
    }
    setVariantModalProduct(item);
    setSelectedSize(item.variantStocks?.[0]?.size || '56');
    setSelectedColor(item.variantStocks?.[0]?.color || 'Black');
  };

  const confirmAddToCart = () => {
    if (!variantModalProduct) return;

    const unitPrice = pricingMode === 'wholesale' ? variantModalProduct.wholesalePrice : variantModalProduct.retailPrice;

    const existingIndex = cart.findIndex(
      i => i.productId === variantModalProduct.productId && i.size === selectedSize && i.color === selectedColor
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setCart(updated);
    } else {
      const newItem: SaleItem = {
        productId: variantModalProduct.productId,
        productName: variantModalProduct.productName,
        sku: variantModalProduct.sku,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
        unitPrice,
        costPrice: variantModalProduct.costPrice,
        discount: 0,
        total: unitPrice,
      };
      setCart([...cart, newItem]);
    }

    setVariantModalProduct(null);
    toast.success(`Added ${variantModalProduct.productName} (Size ${selectedSize}) to cart`);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
      updated[index].total = newQty * updated[index].unitPrice;
    }
    setCart(updated);
  };

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountValue(0);
    setOrderNotes('');
    toast.info('POS Cart cleared');
  };

  // Park Cart
  const handleParkCart = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    const newParked: ParkedCart = {
      id: `parked-${Date.now()}`,
      customerName: activeCustomer.name,
      items: cart,
      pricingMode,
      discountAmount,
      notes: orderNotes,
      parkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setParkedCarts([...parkedCarts, newParked]);
    clearCart();
    toast.success(`Cart parked for ${activeCustomer.name}`);
  };

  const handleResumeCart = (parked: ParkedCart) => {
    setCart(parked.items);
    setPricingMode(parked.pricingMode);
    setDiscountValue(parked.discountAmount);
    setOrderNotes(parked.notes);
    setParkedCarts(parkedCarts.filter(p => p.id !== parked.id));
    setIsParkedModalOpen(false);
    toast.success('Parked cart restored to terminal');
  };

  // Quick Customer Creation
  const handleCreateCustomer = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      toast.error('Customer name and phone number required');
      return;
    }
    const created = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: newCustEmail.trim() || undefined,
      type: newCustType,
      city: newCustCity,
      creditLimit: newCustType === 'wholesale' ? 20000 : 2000,
      openingBalance: 0,
    });
    setSelectedCustomerId(created.id);
    if (newCustType === 'wholesale') {
      setPricingMode('wholesale');
    }
    setIsCustomerModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
  };

  // Start Checkout
  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart first');
      return;
    }
    setTenderedAmount(grandTotal.toString());
    setSplitCash(Math.round(grandTotal / 2));
    setSplitCard(grandTotal - Math.round(grandTotal / 2));
    setIsCheckoutOpen(true);
  };

  // Complete Sale
  const handleCompleteSale = () => {
    let paidAmount = 0;
    let splitDetails = undefined;

    if (paymentMethod === 'credit') {
      paidAmount = 0; // on account / Khata
    } else if (paymentMethod === 'split') {
      paidAmount = splitCash + splitCard;
      splitDetails = [
        { method: 'cash' as PaymentMethod, amount: splitCash },
        { method: 'card' as PaymentMethod, amount: splitCard },
      ];
    } else {
      paidAmount = grandTotal;
    }

    const sale = createSale({
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      customerType: activeCustomer.type,
      channel: pricingMode === 'wholesale' ? 'wholesale' : 'pos',
      items: cart,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxRate,
      taxAmount,
      total: grandTotal,
      paidAmount,
      paymentMethod,
      splitPayments: splitDetails,
      notes: orderNotes,
      cashierName: cashRegister.cashierName || 'Fatima (POS 1)',
    });

    setIsCheckoutOpen(false);
    clearCart();
    setCompletedSale(sale);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[780px]">
      {/* LEFT COLUMN: CATALOG & SEARCH (60-65% width on desktop) */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border p-4 shadow-sm">
        {/* Top Controls: Search + Barcode + Category Pills + Retail/Wholesale Toggle */}
        <div className="space-y-3 pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Scan Barcode or Search abaya name, SKU, fabric (e.g. Nida, Bisht)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-10 bg-background text-sm"
              />
            </div>

            {/* Wholesale Switch */}
            <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border/80 self-stretch sm:self-auto justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pricing:</span>
              <button
                onClick={() => setPricingMode('retail')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  pricingMode === 'retail'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setPricingMode('wholesale')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  pricingMode === 'wholesale'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                B2B Wholesale
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All Collections' : cat.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto py-3 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const displayPrice = pricingMode === 'wholesale' ? product.wholesalePrice : product.retailPrice;
              const isLowStock = product.currentStock <= product.minStockAlert;
              const isOutOfStock = product.currentStock <= 0;

              return (
                <Card
                  key={product.productId}
                  onClick={() => handleProductClick(product)}
                  className={`cursor-pointer overflow-hidden border transition-all hover:shadow-md hover:border-primary/60 group relative flex flex-col justify-between ${
                    isOutOfStock ? 'opacity-50 grayscale pointer-events-none' : 'active:scale-[0.98]'
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                        {product.sku}
                      </span>
                      <Badge
                        variant={isOutOfStock ? 'destructive' : isLowStock ? 'secondary' : 'outline'}
                        className={`text-[10px] px-1.5 py-0 h-4 ${
                          isLowStock && !isOutOfStock ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30' : ''
                        }`}
                      >
                        {isOutOfStock ? 'Sold Out' : `${product.currentStock} in stock`}
                      </Badge>
                    </div>

                    <h4 className="font-serif text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {product.productName}
                    </h4>

                    <p className="text-[11px] text-muted-foreground mt-1 truncate">
                      {product.fabric || 'Korean Nida'}
                    </p>
                  </div>

                  <div className="p-3 pt-0 flex items-center justify-between border-t border-border/40 mt-2 bg-muted/20">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                        {pricingMode === 'wholesale' ? 'B2B Price' : 'Retail'}
                      </span>
                      <span className="font-serif font-bold text-sm sm:text-base text-primary">
                        AED {displayPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 opacity-40" />
              <p className="text-sm font-medium">No abayas found matching criteria</p>
              <Button variant="link" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: POS REGISTER & CART (35-40% width on desktop) */}
      <div className="w-full lg:w-96 xl:w-[420px] flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-shrink-0">
        {/* Customer Selector Bar */}
        <div className="p-3.5 bg-muted/40 border-b space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              Customer / Party Khata
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCustomerModalOpen(true)}
              className="h-6 px-2 text-xs text-primary gap-1 hover:bg-primary/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add New
            </Button>
          </div>

          <Select value={selectedCustomerId} onValueChange={(val) => {
            setSelectedCustomerId(val);
            const found = customers.find(c => c.id === val);
            if (found?.type === 'wholesale') {
              setPricingMode('wholesale');
            }
          }}>
            <SelectTrigger className="h-9 bg-background text-xs">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      ({c.type.toUpperCase()}{c.currentBalance > 0 ? ` • Due: AED ${c.currentBalance}` : ''})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeCustomer.currentBalance > 0 && (
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[11px] text-amber-800 dark:text-amber-300">
              <span>Outstanding Balance (Khata):</span>
              <span className="font-bold">AED {activeCustomer.currentBalance.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Cart Item Header / Parked Actions */}
        <div className="px-3.5 py-2 bg-background/50 border-b flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Current Order ({cart.reduce((a, b) => a + b.quantity, 0)} pcs)
          </span>
          <div className="flex items-center gap-2">
            {parkedCarts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsParkedModalOpen(true)}
                className="h-6 px-2 text-[11px] text-amber-600 gap-1"
              >
                <PlayCircle className="w-3 h-3" />
                Parked ({parkedCarts.length})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleParkCart}
              disabled={cart.length === 0}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
            >
              <PauseCircle className="w-3 h-3" />
              Hold
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="h-6 px-2 text-[11px] text-destructive hover:bg-destructive/10 gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </Button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[220px]">
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{item.productName}</p>
                <p className="text-[10px] text-muted-foreground">
                  Size: <span className="font-semibold text-foreground">{item.size}</span>
                  {item.color ? ` • ${item.color}` : ''} • AED {item.unitPrice} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-muted/60 px-1.5 py-0.5 rounded border border-border/80">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-background text-muted-foreground hover:text-foreground"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-background text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Total & Remove */}
              <div className="text-right min-w-[65px]">
                <p className="font-serif font-bold text-foreground">AED {item.total.toLocaleString()}</p>
                <button
                  onClick={() => removeItem(index)}
                  className="text-[10px] text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-muted-foreground text-center p-4">
              <ShoppingBag className="w-10 h-10 stroke-[1.2] mb-2 opacity-30" />
              <p className="text-xs font-medium">No items in register</p>
              <p className="text-[11px] text-muted-foreground">Click any abaya from the left catalog to add to sale.</p>
            </div>
          )}
        </div>

        {/* Order Summary & Calculations */}
        <div className="p-3.5 bg-muted/30 border-t space-y-2 text-xs">
          {/* Discount and VAT toggles */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Discount:</span>
              <Input
                type="number"
                min="0"
                value={discountValue || ''}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-16 h-7 text-xs px-2"
              />
              <button
                onClick={() => setDiscountType(discountType === 'fixed' ? 'percentage' : 'fixed')}
                className="h-7 px-2 bg-muted rounded border text-[10px] font-bold"
              >
                {discountType === 'fixed' ? 'AED' : '%'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">UAE VAT (5%):</span>
              <Switch checked={applyVat} onCheckedChange={setApplyVat} />
            </div>
          </div>

          {/* Breakdown Numbers */}
          <div className="space-y-1 pt-1 border-t border-border/60 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>AED {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount Applied:</span>
                <span>-AED {discountAmount.toLocaleString()}</span>
              </div>
            )}
            {applyVat && (
              <div className="flex justify-between">
                <span>VAT (5%):</span>
                <span>AED {taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border/60">
              <span>Total Payable:</span>
              <span className="text-primary font-serif text-lg">AED {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Big Button */}
          <Button
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            className="w-full h-12 text-sm font-semibold gap-2 shadow-md"
          >
            <Banknote className="w-5 h-5" />
            Charge AED {grandTotal.toLocaleString()}
          </Button>
        </div>
      </div>

      {/* MODAL 1: VARIANT SELECTOR (Size 50-60 & Color) */}
      <Dialog open={!!variantModalProduct} onOpenChange={() => setVariantModalProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Select Size & Color
            </DialogTitle>
          </DialogHeader>

          {variantModalProduct && (
            <div className="space-y-4 py-2 text-sm">
              <div>
                <p className="font-semibold text-foreground">{variantModalProduct.productName}</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">SKU: {variantModalProduct.sku}</p>
                <p className="text-primary font-serif font-bold text-base mt-1">
                  AED {(pricingMode === 'wholesale' ? variantModalProduct.wholesalePrice : variantModalProduct.retailPrice).toLocaleString()}
                </p>
              </div>

              {/* Sizes */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Select Abaya Length / Size:
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {(variantModalProduct.variantStocks || [
                    { size: '50' }, { size: '52' }, { size: '54' }, { size: '56' }, { size: '58' }, { size: '60' }
                  ]).map((v: { size: string }) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedSize(v.size)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        selectedSize === v.size
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card text-foreground hover:bg-muted border-border'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Color / Fabric Shade:
                </Label>
                <div className="flex gap-2">
                  {['Black', 'Navy', 'Champagne Gold', 'Dusty Rose', 'Olive Green'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                        selectedColor === col
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-card text-muted-foreground hover:text-foreground border-border'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setVariantModalProduct(null)}>
              Cancel
            </Button>
            <Button onClick={confirmAddToCart} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add to Register Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: QUICK ADD CUSTOMER */}
      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Add Customer / Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input
                placeholder="e.g. Sheikha Mariam Al-Qasimi"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Phone (WhatsApp) *</Label>
              <Input
                placeholder="+971 50 123 4567"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Email Address (Optional)</Label>
              <Input
                placeholder="client@domain.com"
                value={newCustEmail}
                onChange={(e) => setNewCustEmail(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Account Type</Label>
                <Select value={newCustType} onValueChange={(v) => setNewCustType(v as CustomerType)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Client</SelectItem>
                    <SelectItem value="wholesale">Wholesale B2B Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">City / Emirate</Label>
                <Input
                  value={newCustCity}
                  onChange={(e) => setNewCustCity(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer}>
              Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: CHECKOUT & PAYMENT MODAL */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg flex items-center justify-between">
              <span>Checkout & Payment</span>
              <span className="text-primary font-serif font-bold text-xl">
                AED {grandTotal.toLocaleString()}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Payment Method Selector */}
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Select Payment Mode:
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Card / POS', icon: CreditCard },
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'bank_transfer', label: 'Bank Wire', icon: Building2 },
                  { id: 'credit', label: 'On Account', icon: User },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMethod(mode.id as PaymentMethod)}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-center ${
                        paymentMethod === mode.id
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm font-semibold'
                          : 'bg-card text-muted-foreground hover:bg-muted border-border'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If Cash: Fast Cash Tender Buttons & Change Due */}
            {paymentMethod === 'cash' && (
              <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Cash Received (AED):</Label>
                  <Input
                    type="number"
                    value={tenderedAmount}
                    onChange={(e) => setTenderedAmount(e.target.value)}
                    className="w-28 h-8 text-right font-bold text-xs bg-background"
                  />
                </div>

                {/* Quick denomination pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[grandTotal, 500, 1000, 1500, 2000, 3000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTenderedAmount(amt.toString())}
                      className="px-2.5 py-1 text-[11px] bg-background border rounded font-medium hover:bg-muted"
                    >
                      AED {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">Change to return:</span>
                  <span className="font-serif font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    AED {changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* If On Account / Credit Sale */}
            {paymentMethod === 'credit' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs space-y-1 text-amber-900 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600" />
                  Charging to Customer Khata: {activeCustomer.name}
                </p>
                <p className="text-[11px]">
                  Current Due: AED {activeCustomer.currentBalance.toLocaleString()} • Credit Limit: AED {activeCustomer.creditLimit.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  This transaction will be recorded as an Accounts Receivable (Credit Sale).
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label className="text-xs">Order / Delivery Notes (Optional)</Label>
              <Input
                placeholder="e.g. Alteration requested: +1 inch sleeve, Gift wrap"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSale} className="gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: PARKED CARTS MODAL */}
      <Dialog open={isParkedModalOpen} onOpenChange={setIsParkedModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Parked / Held Carts</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            {parkedCarts.map((p) => (
              <div key={p.id} className="p-3 bg-muted/40 rounded-lg border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{p.customerName}</p>
                  <p className="text-muted-foreground">{p.items.length} items • Held at {p.parkedAt}</p>
                </div>
                <Button size="sm" onClick={() => handleResumeCart(p)} className="h-7 text-xs gap-1">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Resume
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: RECEIPT & INVOICE PRINT/SHARE MODAL */}
      <InvoiceReceiptModal
        sale={completedSale}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
