import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { Supplier, PaymentMethod } from '@/types/accounting';
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  History,
  Edit2,
  CheckCircle2,
  Truck
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

export function SuppliersModule() {
  const {
    suppliers,
    purchases,
    payments,
    addSupplier,
    updateSupplier,
    paySupplier,
  } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Add / Edit Modal
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formName, setFormName] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCategory, setFormCategory] = useState<Supplier['category']>('fabric');
  const [formCity, setFormCity] = useState('Dubai');
  const [formTrn, setFormTrn] = useState('');
  const [formOpeningBalance, setFormOpeningBalance] = useState(0);

  // Statement / Ledger Modal
  const [statementSupplier, setStatementSupplier] = useState<Supplier | null>(null);

  // Pay Supplier Modal
  const [payingSupplier, setPayingSupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank_transfer');
  const [payNotes, setPayNotes] = useState('');

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q));

      const matchesCat = selectedCategoryFilter === 'all' || s.category === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [suppliers, searchQuery, selectedCategoryFilter]);

  // Overall Payables Stats
  const stats = useMemo(() => {
    const totalPayables = suppliers.reduce((acc, s) => acc + (s.currentBalance || 0), 0);
    const totalSuppliers = suppliers.length;
    return { totalPayables, totalSuppliers };
  }, [suppliers]);

  // Supplier Ledger Data
  const supplierLedger = useMemo(() => {
    if (!statementSupplier) return [];

    const suppPurchases = purchases
      .filter(p => p.supplierId === statementSupplier.id || p.supplierName === statementSupplier.name)
      .map(p => ({
        id: p.id,
        date: p.date,
        type: 'Purchase Bill' as const,
        refNumber: p.purchaseNumber,
        description: `Goods received (${p.items.length} lines)`,
        debit: p.total, // increase what we owe them
        credit: p.paidAmount, // immediate payment made during purchase
      }));

    const suppPayments = payments
      .filter(p => p.partyId === statementSupplier.id || p.partyName === statementSupplier.name)
      .filter(p => p.referenceType !== 'purchase')
      .map(p => ({
        id: p.id,
        date: p.date,
        type: 'Payment Payout' as const,
        refNumber: p.paymentNumber,
        description: p.notes || `Vendor settlement (${p.paymentMethod})`,
        debit: 0,
        credit: p.amount,
      }));

    const combined = [...suppPurchases, ...suppPayments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let current = statementSupplier.openingBalance || 0;
    return combined.map(entry => {
      current = current + entry.debit - entry.credit;
      return { ...entry, runningBalance: current };
    });
  }, [statementSupplier, purchases, payments]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormName('');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormCategory('fabric');
    setFormCity('Dubai');
    setFormTrn('');
    setFormOpeningBalance(0);
    setIsSupplierModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormName(supplier.name);
    setFormContactPerson(supplier.contactPerson || '');
    setFormPhone(supplier.phone || '');
    setFormEmail(supplier.email || '');
    setFormCategory(supplier.category);
    setFormCity(supplier.city || 'Dubai');
    setFormTrn(supplier.trn || '');
    setFormOpeningBalance(supplier.openingBalance || 0);
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!formName.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        name: formName.trim(),
        contactPerson: formContactPerson.trim() || undefined,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        category: formCategory,
        city: formCity,
        trn: formTrn.trim() || undefined,
      });
    } else {
      addSupplier({
        name: formName.trim(),
        contactPerson: formContactPerson.trim() || undefined,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        category: formCategory,
        city: formCity,
        trn: formTrn.trim() || undefined,
        openingBalance: formOpeningBalance,
      });
    }

    setIsSupplierModalOpen(false);
  };

  const handleOpenPay = (supplier: Supplier) => {
    setPayingSupplier(supplier);
    setPayAmount(supplier.currentBalance);
    setPayNotes(`Payment to ${supplier.name}`);
  };

  const handleConfirmPay = () => {
    if (!payingSupplier || payAmount <= 0) return;
    paySupplier({
      supplierId: payingSupplier.id,
      amount: payAmount,
      paymentMethod: payMethod,
      notes: payNotes,
    });
    setPayingSupplier(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Accounts Payable</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {stats.totalPayables.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Outstanding supplier balances</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Vendor Network</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            {stats.totalSuppliers} Registered Vendors
          </p>
          <span className="text-[11px] text-muted-foreground">Fabric, trims & manufacturing</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Procurement Flow</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Direct Inventory Sync
          </p>
          <span className="text-[11px] text-muted-foreground">Stock increases instantly on PO</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendor name, contact person, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-40 h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fabric">Fabric Suppliers</SelectItem>
                <SelectItem value="tailoring">Tailoring Workshops</SelectItem>
                <SelectItem value="trims">Trims & Embroidery</SelectItem>
                <SelectItem value="packaging">Packaging & Boxes</SelectItem>
                <SelectItem value="logistics">Courier & Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs gap-1.5 self-end md:self-auto">
            <Plus className="w-3.5 h-3.5" />
            Add Supplier / Vendor
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Contact Person & Phone</th>
                <th className="p-3">City / TRN</th>
                <th className="p-3 text-right">Payable Balance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSuppliers.map((supp) => {
                const hasDue = supp.currentBalance > 0;
                return (
                  <tr key={supp.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <p className="font-semibold text-foreground text-sm">{supp.name}</p>
                      {supp.email && <p className="text-[11px] text-muted-foreground">{supp.email}</p>}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {supp.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <p className="text-foreground font-medium">{supp.contactPerson || '-'}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{supp.phone || '-'}</p>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <p>{supp.city || 'UAE'}</p>
                      {supp.trn && <p className="text-[10px] font-mono">TRN: {supp.trn}</p>}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-serif font-bold text-sm ${
                          hasDue ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        AED {supp.currentBalance?.toLocaleString() || '0'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStatementSupplier(supp)}
                          className="h-7 px-2 text-[11px] gap-1 text-primary hover:bg-primary/10"
                        >
                          <History className="w-3.5 h-3.5" />
                          Ledger
                        </Button>

                        {hasDue && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPay(supp)}
                            className="h-7 px-2 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Pay
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(supp)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSuppliers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No suppliers found.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL 1: ADD / EDIT SUPPLIER */}
      <Dialog open={isSupplierModalOpen} onOpenChange={setIsSupplierModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Supplier / Mill Name *</Label>
              <Input
                placeholder="e.g. Al-Nafis Japanese Silk Mills"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={formCategory} onValueChange={(v) => setFormCategory(v as Supplier['category'])}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabric">Fabric Supplier</SelectItem>
                    <SelectItem value="tailoring">Tailoring Workshop</SelectItem>
                    <SelectItem value="trims">Trims & Laces</SelectItem>
                    <SelectItem value="packaging">Packaging & Boxes</SelectItem>
                    <SelectItem value="logistics">Courier / Logistics</SelectItem>
                    <SelectItem value="other">Other Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Contact Person</Label>
                <Input
                  placeholder="e.g. Tariq Mehmood"
                  value={formContactPerson}
                  onChange={(e) => setFormContactPerson(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input
                  placeholder="+971 55 123 4567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">City</Label>
                <Input
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Supplier TRN (Tax #)</Label>
                <Input
                  placeholder="100XXXXXXXXX"
                  value={formTrn}
                  onChange={(e) => setFormTrn(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  placeholder="sales@mill.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {!editingSupplier && (
              <div>
                <Label className="text-xs">Opening Payable Balance (AED)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formOpeningBalance}
                  onChange={(e) => setFormOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupplierModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplier}>
              {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: SUPPLIER LEDGER */}
      <Dialog open={!!statementSupplier} onOpenChange={() => setStatementSupplier(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="flex justify-between items-center pr-6">
              <div>
                <DialogTitle className="font-serif text-lg">
                  Vendor Ledger: {statementSupplier?.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Category: {statementSupplier?.category} • Phone: {statementSupplier?.phone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Payable Balance</span>
                <span className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">
                  AED {statementSupplier?.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="py-2 space-y-3 text-xs">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Type & Ref</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Debit (+)</th>
                    <th className="p-2.5 text-right">Credit (-)</th>
                    <th className="p-2.5 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {supplierLedger.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2.5 text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="p-2.5 font-mono font-medium text-primary">{row.refNumber}</td>
                      <td className="p-2.5 text-foreground">{row.description}</td>
                      <td className="p-2.5 text-right text-amber-600 dark:text-amber-400 font-medium">
                        {row.debit > 0 ? `AED ${row.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {row.credit > 0 ? `AED ${row.credit.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-2.5 text-right font-serif font-bold text-foreground">
                        AED {row.runningBalance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {supplierLedger.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No past transactions recorded for this supplier.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatementSupplier(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: PAY SUPPLIER */}
      <Dialog open={!!payingSupplier} onOpenChange={() => setPayingSupplier(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Settle Payment to {payingSupplier?.name}
            </DialogTitle>
          </DialogHeader>
          {payingSupplier && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg flex justify-between items-center">
                <span className="text-muted-foreground">Total Payable Due:</span>
                <span className="font-serif font-bold text-amber-600 dark:text-amber-400 text-base">
                  AED {payingSupplier.currentBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <Label className="text-xs">Payment Amount (AED) *</Label>
                <Input
                  type="number"
                  value={payAmount}
                  max={payingSupplier.currentBalance}
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
                <Label className="text-xs">Notes / Reference</Label>
                <Input
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Bank wire reference #TRX-1029"
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayingSupplier(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPay}>
              Confirm Payment Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
