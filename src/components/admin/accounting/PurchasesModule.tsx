import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { PurchaseInvoice, PurchaseItem, PaymentMethod } from '@/types/accounting';
import {
  Search,
  Plus,
  Truck,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  ArrowDownLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function PurchasesModule() {
  const {
    purchases,
    suppliers,
    inventory,
    createPurchase,
    paySupplier,
    settings
  } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('all');

  // New Purchase Modal
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    {
      productId: inventory[0]?.productId || 'p1',
      productName: inventory[0]?.productName || 'Royal Bisht Abaya',
      sku: inventory[0]?.sku || 'MW-BSH-001',
      quantity: 10,
      costPrice: 420,
      total: 4200,
    }
  ]);
  const [shippingCost, setShippingCost] = useState(0);
  const [purchaseDiscount, setPurchaseDiscount] = useState(0);
  const [paidNowAmount, setPaidNowAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Payment Modal
  const [payingPurchase, setPayingPurchase] = useState<PurchaseInvoice | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank_transfer');
  const [payNotes, setPayNotes] = useState('');

  // Filtered purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.purchaseNumber.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q);
      const matchesSupplier = selectedSupplierFilter === 'all' || p.supplierId === selectedSupplierFilter;
      return matchesSearch && matchesSupplier;
    });
  }, [purchases, searchQuery, selectedSupplierFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    const totalPurchased = purchases.reduce((a, b) => a + b.total, 0);
    const totalPaid = purchases.reduce((a, b) => a + b.paidAmount, 0);
    const totalDue = purchases.reduce((a, b) => a + b.dueAmount, 0);
    return { totalPurchased, totalPaid, totalDue, count: purchases.length };
  }, [purchases]);

  // Calculations for new purchase modal
  const modalSubtotal = purchaseItems.reduce((acc, i) => acc + i.total, 0);
  const modalTax = settings.enableVat ? Math.round((modalSubtotal * 5) / 100) : 0;
  const modalGrandTotal = modalSubtotal + modalTax + Number(shippingCost) - Number(purchaseDiscount);

  const handleAddItemRow = () => {
    const defaultProduct = inventory[0];
    setPurchaseItems([
      ...purchaseItems,
      {
        productId: defaultProduct?.productId || `p-${Date.now()}`,
        productName: defaultProduct?.productName || 'Abaya Fabric Roll',
        sku: defaultProduct?.sku || 'SKU-NEW',
        quantity: 5,
        costPrice: 200,
        total: 1000,
      }
    ]);
  };

  const handleUpdateItemRow = (index: number, field: keyof PurchaseItem, value: string | number | undefined) => {
    const updated = [...purchaseItems];
    const row = { ...updated[index], [field]: value } as PurchaseItem;
    if (field === 'productId') {
      const found = inventory.find(i => i.productId === value);
      if (found) {
        row.productName = found.productName;
        row.sku = found.sku;
        row.costPrice = found.costPrice;
      }
    }
    if (field === 'quantity' || field === 'costPrice' || field === 'productId') {
      row.total = Number(row.quantity) * Number(row.costPrice);
    }
    updated[index] = row;
    setPurchaseItems(updated);
  };

  const handleRemoveItemRow = (index: number) => {
    if (purchaseItems.length === 1) return;
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handleCreatePurchaseBill = () => {
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) {
      toast.error('Please select a supplier');
      return;
    }

    createPurchase({
      supplierId: supplier.id,
      supplierName: supplier.name,
      items: purchaseItems,
      subtotal: modalSubtotal,
      taxAmount: modalTax,
      shippingCost: Number(shippingCost),
      discountAmount: Number(purchaseDiscount),
      total: modalGrandTotal,
      paidAmount: Number(paidNowAmount),
      paymentMethod,
      notes: purchaseNotes,
      receivedBy: 'Store Manager',
    });

    setIsNewPurchaseOpen(false);
    // Reset
    setPurchaseItems([
      {
        productId: inventory[0]?.productId || 'p1',
        productName: inventory[0]?.productName || 'Royal Bisht Abaya',
        sku: inventory[0]?.sku || 'MW-BSH-001',
        quantity: 10,
        costPrice: 420,
        total: 4200,
      }
    ]);
    setPaidNowAmount(0);
    setShippingCost(0);
    setPurchaseDiscount(0);
  };

  const handleOpenPay = (purchase: PurchaseInvoice) => {
    setPayingPurchase(purchase);
    setPayAmount(purchase.dueAmount);
    setPayNotes(`Payment for PO ${purchase.purchaseNumber}`);
  };

  const handleConfirmPay = () => {
    if (!payingPurchase || payAmount <= 0) return;
    paySupplier({
      supplierId: payingPurchase.supplierId,
      amount: payAmount,
      paymentMethod: payMethod,
      notes: payNotes,
      purchaseId: payingPurchase.id,
    });
    setPayingPurchase(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Purchases</span>
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {summary.totalPurchased.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{summary.count} procurement bills</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Paid to Vendors</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            AED {summary.totalPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Settled bills</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Supplier Payables</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {summary.totalDue.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Accounts payable due</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Active Vendors</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            {suppliers.length} Suppliers
          </p>
          <span className="text-[11px] text-muted-foreground">Fabric, trims & workshops</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO # or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedSupplierFilter} onValueChange={setSelectedSupplierFilter}>
              <SelectTrigger className="w-44 h-9 text-xs">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setPaidNowAmount(0);
              setIsNewPurchaseOpen(true);
            }}
            className="h-9 text-xs gap-1.5 self-end md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            New Purchase Bill / Intake
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">PO #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Supplier / Vendor</th>
                <th className="p-3">Items / Goods</th>
                <th className="p-3 text-right">Bill Total (AED)</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-muted/20">
                  <td className="p-3 font-mono font-semibold text-primary">
                    {purchase.purchaseNumber}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-foreground">{purchase.supplierName}</p>
                    <p className="text-[10px] text-muted-foreground">Received by {purchase.receivedBy}</p>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {purchase.items.length} product line{purchase.items.length > 1 ? 's' : ''} ({purchase.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                  </td>
                  <td className="p-3 text-right font-serif font-bold text-foreground">
                    {purchase.total.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                    {purchase.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                    {purchase.dueAmount > 0 ? purchase.dueAmount.toLocaleString() : '-'}
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant={purchase.paymentStatus === 'paid' ? 'default' : purchase.paymentStatus === 'partial' ? 'secondary' : 'destructive'}
                      className="text-[10px] capitalize"
                    >
                      {purchase.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {purchase.dueAmount > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPay(purchase)}
                        className="h-7 px-2.5 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                      >
                        <DollarSign className="w-3 h-3" />
                        Pay Vendor
                      </Button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPurchases.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No purchase bills found.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL 1: NEW PURCHASE INTAKE BILL */}
      <Dialog open={isNewPurchaseOpen} onOpenChange={setIsNewPurchaseOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              New Purchase Bill / Stock Intake
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Supplier & Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border">
              <div>
                <Label className="text-xs">Select Supplier *</Label>
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger className="mt-1 h-9 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.name} ({s.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger className="mt-1 h-9 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Wire Transfer</SelectItem>
                    <SelectItem value="cash">Cash In Hand</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit">On Account (Pay Later)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Paid Immediately (AED)</Label>
                <Input
                  type="number"
                  min="0"
                  value={paidNowAmount}
                  onChange={(e) => setPaidNowAmount(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 text-xs bg-background font-semibold"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Purchased Items / Stock Units:
                </Label>
                <Button variant="outline" size="sm" onClick={handleAddItemRow} className="h-7 text-xs gap-1">
                  <Plus className="w-3 h-3" />
                  Add Row
                </Button>
              </div>

              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted/60 text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="p-2 w-5/12">Product / Raw Material</th>
                      <th className="p-2 w-2/12 text-center">Qty (Units)</th>
                      <th className="p-2 w-2/12 text-right">Cost Price (AED)</th>
                      <th className="p-2 w-2/12 text-right">Total (AED)</th>
                      <th className="p-2 w-1/12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {purchaseItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2">
                          <Select
                            value={item.productId}
                            onValueChange={(val) => handleUpdateItemRow(idx, 'productId', val)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {inventory.map((inv) => (
                                <SelectItem key={inv.productId} value={inv.productId} className="text-xs">
                                  {inv.productName} ({inv.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 text-center">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemRow(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="h-8 text-center text-xs"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <Input
                            type="number"
                            min="0"
                            value={item.costPrice}
                            onChange={(e) => handleUpdateItemRow(idx, 'costPrice', parseFloat(e.target.value) || 0)}
                            className="h-8 text-right text-xs"
                          />
                        </td>
                        <td className="p-2 text-right font-serif font-bold text-foreground">
                          AED {item.total.toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveItemRow(idx)}
                            disabled={purchaseItems.length === 1}
                            className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freight & Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Shipping / Logistics Freight (AED)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Supplier Discount (AED)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={purchaseDiscount}
                    onChange={(e) => setPurchaseDiscount(parseFloat(e.target.value) || 0)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">PO Notes / Invoice Reference</Label>
                  <Input
                    placeholder="e.g. Supplier Invoice #INV-7889"
                    value={purchaseNotes}
                    onChange={(e) => setPurchaseNotes(e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
              </div>

              <div className="bg-muted/30 p-3.5 rounded-lg border space-y-1.5 text-right">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>AED {modalSubtotal.toLocaleString()}</span>
                </div>
                {settings.enableVat && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Input VAT (5%):</span>
                    <span>AED {modalTax.toLocaleString()}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Freight Cost:</span>
                    <span>AED {Number(shippingCost).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t pt-1 text-foreground">
                  <span>Grand Total:</span>
                  <span className="font-serif text-primary text-base">AED {modalGrandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Paid Now:</span>
                  <span>AED {Number(paidNowAmount).toLocaleString()}</span>
                </div>
                {modalGrandTotal - paidNowAmount > 0 && (
                  <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                    <span>Payable Balance Due:</span>
                    <span>AED {(modalGrandTotal - paidNowAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPurchaseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePurchaseBill} className="gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Save Bill & Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: PAY SUPPLIER */}
      <Dialog open={!!payingPurchase} onOpenChange={() => setPayingPurchase(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Settle Payment for {payingPurchase?.purchaseNumber}
            </DialogTitle>
          </DialogHeader>
          {payingPurchase && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-semibold">{payingPurchase.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Bill:</span>
                  <span>AED {payingPurchase.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400 pt-1 border-t">
                  <span>Outstanding Due:</span>
                  <span>AED {payingPurchase.dueAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs">Payment Amount (AED) *</Label>
                <Input
                  type="number"
                  value={payAmount}
                  max={payingPurchase.dueAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-bold text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PaymentMethod)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Wire Transfer</SelectItem>
                    <SelectItem value="cash">Cash In Hand</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Transaction Reference</Label>
                <Input
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Transfer Ref #TRX-9941"
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayingPurchase(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPay}>
              Confirm Supplier Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
