import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { SaleInvoice, PaymentMethod } from '@/types/accounting';
import {
  Search,
  Filter,
  Eye,
  Printer,
  Ban,
  RotateCcw,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Share2
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
import { toast } from 'sonner';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

export function SalesModule() {
  const { sales, receiveCustomerPayment, voidSale, createSaleReturn } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Selected for modals
  const [viewingSale, setViewingSale] = useState<SaleInvoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Payment Collection Modal
  const [paymentSale, setPaymentSale] = useState<SaleInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Void Modal
  const [voidingSale, setVoidingSale] = useState<SaleInvoice | null>(null);
  const [voidReason, setVoidReason] = useState('');

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        (s.customerPhone && s.customerPhone.includes(q));

      const matchesChannel = selectedChannel === 'all' || s.channel === selectedChannel;
      const matchesStatus = selectedStatus === 'all' || s.paymentStatus === selectedStatus;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [sales, searchQuery, selectedChannel, selectedStatus]);

  // Metrics
  const summary = useMemo(() => {
    const valid = sales.filter((s) => s.status !== 'void');
    const totalRevenue = valid.reduce((a, b) => a + b.total, 0);
    const totalCollected = valid.reduce((a, b) => a + b.paidAmount, 0);
    const totalDue = valid.reduce((a, b) => a + b.dueAmount, 0);
    const invoiceCount = valid.length;

    return { totalRevenue, totalCollected, totalDue, invoiceCount };
  }, [sales]);

  const handleOpenPayment = (sale: SaleInvoice) => {
    setPaymentSale(sale);
    setPaymentAmount(sale.dueAmount);
    setPaymentNotes(`Payment for ${sale.invoiceNumber}`);
  };

  const handleConfirmPayment = () => {
    if (!paymentSale || paymentAmount <= 0) return;
    receiveCustomerPayment({
      customerId: paymentSale.customerId || '',
      amount: paymentAmount,
      paymentMethod,
      notes: paymentNotes,
      saleId: paymentSale.id,
    });
    setPaymentSale(null);
  };

  const handleConfirmVoid = () => {
    if (!voidingSale || !voidReason.trim()) {
      toast.error('Please specify a reason for voiding this invoice');
      return;
    }
    voidSale(voidingSale.id, voidReason);
    setVoidingSale(null);
    setVoidReason('');
  };

  const exportSalesCSV = () => {
    const headers = ['Invoice #', 'Date', 'Customer', 'Channel', 'Total (AED)', 'Paid (AED)', 'Due (AED)', 'Status', 'Payment Method'];
    const rows = filteredSales.map(s => [
      s.invoiceNumber,
      new Date(s.date).toLocaleDateString(),
      `"${s.customerName}"`,
      s.channel,
      s.total,
      s.paidAmount,
      s.dueAmount,
      s.paymentStatus,
      s.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ModestWay_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sales report exported to CSV');
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Invoiced</span>
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
              #
            </span>
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {summary.totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{summary.invoiceCount} invoices generated</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Amount Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            AED {summary.totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Received in bank/cash</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Outstanding Due</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {summary.totalDue.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Khata / Credit receivables</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Sales Channels</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-sm font-semibold text-foreground mt-1">
            POS • B2B • Web
          </p>
          <span className="text-[11px] text-muted-foreground">Unified ledger stream</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice # or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-32 h-9 text-xs">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="pos">POS Store</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="online">Online Web</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32 h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial Due</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={exportSalesCSV} className="h-9 text-xs gap-1.5 self-end md:self-auto">
            <Download className="w-3.5 h-3.5" />
            Export Excel/CSV
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Items</th>
                <th className="p-3 text-right">Total (AED)</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSales.map((sale) => {
                const isVoid = sale.status === 'void';
                return (
                  <tr key={sale.id} className={`hover:bg-muted/20 ${isVoid ? 'opacity-50 line-through bg-muted/10' : ''}`}>
                    <td className="p-3 font-mono font-semibold text-primary">
                      {sale.invoiceNumber}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{sale.customerName}</p>
                      {sale.customerPhone && <p className="text-[10px] text-muted-foreground">{sale.customerPhone}</p>}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {sale.channel}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {sale.items.length} item{sale.items.length > 1 ? 's' : ''} ({sale.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                    </td>
                    <td className="p-3 text-right font-serif font-bold text-foreground">
                      {sale.total.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {sale.paidAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                      {sale.dueAmount > 0 ? sale.dueAmount.toLocaleString() : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={sale.paymentStatus === 'paid' ? 'default' : sale.paymentStatus === 'partial' ? 'secondary' : 'destructive'}
                        className="text-[10px] capitalize"
                      >
                        {sale.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setViewingSale(sale);
                            setIsReceiptOpen(true);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Print / View Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>

                        {sale.dueAmount > 0 && !isVoid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPayment(sale)}
                            className="h-7 px-2 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                            title="Collect Due Payment"
                          >
                            <DollarSign className="w-3 h-3" />
                            Collect
                          </Button>
                        )}

                        {!isVoid && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setVoidingSale(sale)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Void Invoice"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No sales invoices found matching the selected filter.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL: COLLECT PAYMENT */}
      <Dialog open={!!paymentSale} onOpenChange={() => setPaymentSale(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Collect Payment against #{paymentSale?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          {paymentSale && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold">{paymentSale.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invoice:</span>
                  <span>AED {paymentSale.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span>AED {paymentSale.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400 pt-1 border-t">
                  <span>Balance Due:</span>
                  <span>AED {paymentSale.dueAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs">Amount Receiving Now (AED) *</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  max={paymentSale.dueAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-bold text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit / Debit Card</SelectItem>
                    <SelectItem value="cash">Cash In Hand</SelectItem>
                    <SelectItem value="bank_transfer">Bank Wire Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Payment Reference / Notes</Label>
                <Input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Card Authorization #88219"
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentSale(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>
              Confirm Received Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: VOID INVOICE */}
      <Dialog open={!!voidingSale} onOpenChange={() => setVoidingSale(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-destructive">
              Void Invoice #{voidingSale?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Voiding an invoice will immediately restock the {voidingSale?.items.length} items back to inventory, cancel any customer credit balance, and mark this invoice void in audit records.
            </p>
            <div>
              <Label className="text-xs">Reason for Voiding *</Label>
              <Input
                placeholder="e.g. Cashier mistake / duplicate billing / customer cancelled before dispatch"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidingSale(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmVoid}>
              Confirm Void & Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INVOICE / RECEIPT MODAL */}
      <InvoiceReceiptModal
        sale={viewingSale}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
