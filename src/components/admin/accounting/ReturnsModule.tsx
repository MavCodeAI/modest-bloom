import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { ReturnRecord, ReturnItem, PaymentMethod } from '@/types/accounting';
import {
  RotateCcw,
  Search,
  Plus,
  ArrowDownLeft,
  CheckCircle2,
  DollarSign,
  PackageCheck,
  AlertCircle
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

export function ReturnsModule() {
  const { returns, sales, createSaleReturn } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // New Return Modal
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(sales[0]?.id || '');
  const [returnReason, setReturnReason] = useState('Customer requested size change / exchange');
  const [refundMethod, setRefundMethod] = useState<PaymentMethod | 'credit_note'>('cash');
  const [restockItem, setRestockItem] = useState(true);

  // Filtered Returns
  const filteredReturns = useMemo(() => {
    return returns.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        r.returnNumber.toLowerCase().includes(q) ||
        r.originalInvoiceNumber.toLowerCase().includes(q) ||
        r.partyName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
      );
    });
  }, [returns, searchQuery]);

  const selectedSale = useMemo(() => {
    return sales.find(s => s.id === selectedInvoiceId);
  }, [sales, selectedInvoiceId]);

  const handleProcessReturn = () => {
    if (!selectedSale || selectedSale.items.length === 0) {
      toast.error('Please select a valid invoice with items');
      return;
    }

    const returnItems: ReturnItem[] = selectedSale.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      size: item.size,
      quantity: 1, // return 1 pc
      refundUnitPrice: item.unitPrice,
      totalRefund: item.unitPrice,
      condition: 'good' as const,
      restock: restockItem,
    }));

    createSaleReturn({
      originalInvoiceId: selectedSale.id,
      items: returnItems,
      refundMethod,
      reason: returnReason,
      recordedBy: 'Store Manager',
    });

    setIsReturnModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Processed Returns</span>
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            {returns.length} Return Vouchers
          </p>
          <span className="text-[11px] text-muted-foreground">Exchanges and refunds</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Refunded Out</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {returns.reduce((a, b) => a + b.totalRefund, 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Via Cash, Card, or Credit Note</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Inventory Restock Flow</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Auto Restock to POS & Web
          </p>
          <span className="text-[11px] text-muted-foreground">Traceable in stock movement logs</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search return #, original invoice, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button size="sm" onClick={() => setIsReturnModalOpen(true)} className="h-9 text-xs gap-1.5 self-end md:self-auto">
            <Plus className="w-3.5 h-3.5" />
            Process New Return / Exchange
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Return #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Original Invoice</th>
                <th className="p-3">Customer / Party</th>
                <th className="p-3">Returned Items</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Refund Mode</th>
                <th className="p-3 text-right">Refund Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReturns.map((ret) => (
                <tr key={ret.id} className="hover:bg-muted/20">
                  <td className="p-3 font-mono font-semibold text-primary">
                    {ret.returnNumber}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(ret.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-mono font-medium">
                    {ret.originalInvoiceNumber}
                  </td>
                  <td className="p-3 font-semibold text-foreground">
                    {ret.partyName}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {ret.items.map(i => `${i.productName} (Size ${i.size})`).join(', ')}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {ret.reason}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {ret.refundMethod}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-serif font-bold text-foreground text-sm">
                    AED {ret.totalRefund.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReturns.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No return vouchers recorded.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL: PROCESS RETURN */}
      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Process Sale Return / Exchange
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Select Original Sale Invoice *</Label>
              <Select value={selectedInvoiceId} onValueChange={setSelectedInvoiceId}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sales.filter(s => s.status !== 'void').map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.invoiceNumber} - {s.customerName} (AED {s.total})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSale && (
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <p className="font-semibold text-foreground">Items in Invoice:</p>
                <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                  {selectedSale.items.map((i, idx) => (
                    <li key={idx}>
                      {i.productName} (Size: {i.size}) - AED {i.unitPrice}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Label className="text-xs">Refund Method *</Label>
              <Select value={refundMethod} onValueChange={(v) => setRefundMethod(v as PaymentMethod | 'credit_note')}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash Refund (Drawer)</SelectItem>
                  <SelectItem value="card">Card Reversal</SelectItem>
                  <SelectItem value="credit_note">Store Credit / Khata Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Reason for Return *</Label>
              <Input
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessReturn}>
              Process Return & Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
