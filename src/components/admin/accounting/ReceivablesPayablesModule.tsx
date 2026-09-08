import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { Customer, Supplier, PaymentMethod } from '@/types/accounting';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Share2,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

export function ReceivablesPayablesModule() {
  const {
    customers,
    suppliers,
    receiveCustomerPayment,
    paySupplier,
    settings,
    stats
  } = useAccounting();

  const [activeTab, setActiveTab] = useState<'receivables' | 'payables'>('receivables');

  // Payment Modals
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [receiveAmt, setReceiveAmt] = useState(0);
  const [receiveMethod, setReceiveMethod] = useState<PaymentMethod>('card');

  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [payAmt, setPayAmt] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank_transfer');

  // Debtors (Customers with balance > 0)
  const debtors = useMemo(() => {
    return customers.filter(c => c.currentBalance > 0);
  }, [customers]);

  // Creditors (Suppliers with balance > 0)
  const creditors = useMemo(() => {
    return suppliers.filter(s => s.currentBalance > 0);
  }, [suppliers]);

  // Net Position
  const netWorkingCapitalPosition = stats.totalReceivables - stats.totalPayables;

  const handleOpenReceive = (c: Customer) => {
    setActiveCustomer(c);
    setReceiveAmt(c.currentBalance);
  };

  const handleConfirmReceive = () => {
    if (!activeCustomer || receiveAmt <= 0) return;
    receiveCustomerPayment({
      customerId: activeCustomer.id,
      amount: receiveAmt,
      paymentMethod: receiveMethod,
      notes: `Balance clearance from ${activeCustomer.name}`,
    });
    setActiveCustomer(null);
  };

  const handleOpenPay = (s: Supplier) => {
    setActiveSupplier(s);
    setPayAmt(s.currentBalance);
  };

  const handleConfirmPay = () => {
    if (!activeSupplier || payAmt <= 0) return;
    paySupplier({
      supplierId: activeSupplier.id,
      amount: payAmt,
      paymentMethod: payMethod,
      notes: `Payable settlement to ${activeSupplier.name}`,
    });
    setActiveSupplier(null);
  };

  const handleSendReminder = (c: Customer) => {
    const text = encodeURIComponent(
      `*${settings.businessName.toUpperCase()} - PAYMENT REMINDER*\n\n` +
      `Dear ${c.name},\n` +
      `Your current outstanding balance is: *AED ${c.currentBalance.toLocaleString()}*.\n` +
      `Kindly arrange settlement at your earliest convenience.\n\n` +
      `Thank you!`
    );
    const phone = c.phone?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Receivables (Debtors)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            AED {stats.totalReceivables.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{debtors.length} customer accounts to collect</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Payables (Creditors)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {stats.totalPayables.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{creditors.length} suppliers to settle</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Net Balance Position</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className={`font-serif text-lg sm:text-xl font-bold mt-1 ${
            netWorkingCapitalPosition >= 0 ? 'text-primary' : 'text-destructive'
          }`}>
            AED {netWorkingCapitalPosition.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">
            {netWorkingCapitalPosition >= 0 ? 'Net positive liquidity' : 'Net payable deficit'}
          </span>
        </Card>
      </div>

      {/* Main Tabbed View */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'receivables' | 'payables')} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-2 h-9 text-xs">
              <TabsTrigger value="receivables" className="text-xs">
                Accounts Receivable ({debtors.length})
              </TabsTrigger>
              <TabsTrigger value="payables" className="text-xs">
                Accounts Payable ({creditors.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-muted-foreground">
            Real-time Party Khata & Vendor Ledger Reconciliation
          </span>
        </div>

        {/* TAB 1: RECEIVABLES */}
        {activeTab === 'receivables' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                <tr>
                  <th className="p-3">Customer Party</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">City</th>
                  <th className="p-3 text-right">Credit Limit</th>
                  <th className="p-3 text-right">Outstanding Due</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {debtors.map((cust) => (
                  <tr key={cust.id} className="hover:bg-muted/20">
                    <td className="p-3 font-semibold text-foreground text-sm">
                      {cust.name}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {cust.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {cust.phone || '-'}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {cust.city || 'Dubai'}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      AED {cust.creditLimit?.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-serif font-bold text-amber-600 dark:text-amber-400 text-sm">
                      AED {cust.currentBalance.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReceive(cust)}
                          className="h-7 px-2 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                        >
                          <DollarSign className="w-3 h-3" />
                          Collect
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendReminder(cust)}
                          className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          Remind
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {debtors.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                All customer accounts are fully paid! Zero outstanding receivables.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYABLES */}
        {activeTab === 'payables' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                <tr>
                  <th className="p-3">Vendor / Supplier</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-right">Payable Balance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {creditors.map((supp) => (
                  <tr key={supp.id} className="hover:bg-muted/20">
                    <td className="p-3 font-semibold text-foreground text-sm">
                      {supp.name}
                    </td>
                    <td className="p-3 capitalize text-muted-foreground">
                      {supp.category}
                    </td>
                    <td className="p-3 text-foreground">
                      {supp.contactPerson || '-'}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {supp.phone || '-'}
                    </td>
                    <td className="p-3 text-right font-serif font-bold text-amber-600 dark:text-amber-400 text-sm">
                      AED {supp.currentBalance.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPay(supp)}
                        className="h-7 px-2 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                      >
                        <DollarSign className="w-3 h-3" />
                        Pay Vendor
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {creditors.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                All vendor bills are fully settled! Zero supplier payables.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* MODAL 1: RECEIVE PAYMENT */}
      <Dialog open={!!activeCustomer} onOpenChange={() => setActiveCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Collect Khata from {activeCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          {activeCustomer && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg flex justify-between items-center">
                <span className="text-muted-foreground">Outstanding Due:</span>
                <span className="font-serif font-bold text-amber-600 text-base">
                  AED {activeCustomer.currentBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <Label className="text-xs">Amount Received (AED) *</Label>
                <Input
                  type="number"
                  value={receiveAmt}
                  max={activeCustomer.currentBalance}
                  onChange={(e) => setReceiveAmt(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-bold text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={receiveMethod} onValueChange={(v) => setReceiveMethod(v as PaymentMethod)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card / POS</SelectItem>
                    <SelectItem value="cash">Cash In Hand</SelectItem>
                    <SelectItem value="bank_transfer">Bank Wire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveCustomer(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReceive}>
              Confirm Payment Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: PAY SUPPLIER */}
      <Dialog open={!!activeSupplier} onOpenChange={() => setActiveSupplier(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Settle Balance to {activeSupplier?.name}
            </DialogTitle>
          </DialogHeader>
          {activeSupplier && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg flex justify-between items-center">
                <span className="text-muted-foreground">Payable Due:</span>
                <span className="font-serif font-bold text-amber-600 text-base">
                  AED {activeSupplier.currentBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <Label className="text-xs">Amount to Settle (AED) *</Label>
                <Input
                  type="number"
                  value={payAmt}
                  max={activeSupplier.currentBalance}
                  onChange={(e) => setPayAmt(parseFloat(e.target.value) || 0)}
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveSupplier(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPay}>
              Confirm Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
