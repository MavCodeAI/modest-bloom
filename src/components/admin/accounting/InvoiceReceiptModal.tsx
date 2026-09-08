import { useState } from 'react';
import { SaleInvoice } from '@/types/accounting';
import { useAccounting } from '@/contexts/AccountingContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Printer, Share2, Download, Check, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceReceiptModalProps {
  sale: SaleInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceReceiptModal({ sale, isOpen, onClose }: InvoiceReceiptModalProps) {
  const { settings } = useAccounting();
  const [viewType, setViewType] = useState<'thermal' | 'a4'>('thermal');

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const lines = [
      `*${settings.businessName.toUpperCase()}*`,
      `*TAX INVOICE / RECEIPT*`,
      `Invoice #: ${sale.invoiceNumber}`,
      `Date: ${new Date(sale.date).toLocaleDateString()} ${new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      `Customer: ${sale.customerName} (${sale.customerType.toUpperCase()})`,
      `--------------------------------`,
      `*ITEMS PURCHASED:*`,
      ...sale.items.map(
        (i, idx) =>
          `${idx + 1}. ${i.productName} (Size: ${i.size}${i.color ? `, ${i.color}` : ''}) x${i.quantity} = AED ${(i.total).toLocaleString()}`
      ),
      `--------------------------------`,
      `Subtotal: AED ${sale.subtotal.toLocaleString()}`,
      sale.discountAmount > 0 ? `Discount: -AED ${sale.discountAmount.toLocaleString()}` : null,
      settings.enableVat ? `VAT (${sale.taxRate}%): AED ${sale.taxAmount.toLocaleString()}` : null,
      `*TOTAL: AED ${sale.total.toLocaleString()}*`,
      `Paid: AED ${sale.paidAmount.toLocaleString()} (${sale.paymentMethod.toUpperCase()})`,
      sale.dueAmount > 0 ? `*BALANCE DUE: AED ${sale.dueAmount.toLocaleString()}*` : `Status: FULLY PAID`,
      `--------------------------------`,
      `${settings.receiptFooter.replace(/\n/g, ' ')}`,
      `TRN: ${settings.trn}`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const phone = sale.customerPhone?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    toast.success('WhatsApp sharing opened');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-background">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div>
            <DialogTitle className="font-serif text-lg sm:text-xl flex items-center gap-2">
              Invoice #{sale.invoiceNumber}
              <Badge variant={sale.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize text-xs">
                {sale.paymentStatus}
              </Badge>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Issued on {new Date(sale.date).toLocaleString()} • Cashier: {sale.cashierName}
            </p>
          </div>
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'thermal' | 'a4')} className="hidden sm:block">
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="thermal" className="text-xs">Thermal (80mm)</TabsTrigger>
              <TabsTrigger value="a4" className="text-xs">Tax Invoice (A4)</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        {/* RECEIPT PREVIEW BODY */}
        <div className="py-2">
          {viewType === 'thermal' ? (
            /* THERMAL POS RECEIPT STYLE */
            <div
              id="printable-receipt"
              className="max-w-xs mx-auto bg-card p-5 rounded-lg border border-dashed border-border shadow-sm font-mono text-xs leading-relaxed text-foreground"
            >
              {/* Header */}
              <div className="text-center pb-3 border-b border-dashed border-border/80">
                <h3 className="font-serif font-bold text-sm tracking-wide">{settings.businessName}</h3>
                <p className="text-[10px] text-muted-foreground whitespace-pre-line mt-0.5">{settings.receiptHeader}</p>
                <p className="text-[10px] text-muted-foreground mt-1">TRN: {settings.trn}</p>
                <p className="text-[10px] text-muted-foreground">{settings.phone}</p>
              </div>

              {/* Invoice Meta */}
              <div className="py-2 border-b border-dashed border-border/80 text-[11px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice #:</span>
                  <span className="font-semibold">{sale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium truncate max-w-[140px]">{sale.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel:</span>
                  <span className="uppercase">{sale.channel}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-2 border-b border-dashed border-border/80">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="text-left py-1">Item</th>
                      <th className="text-center py-1">Qty</th>
                      <th className="text-right py-1">Price</th>
                      <th className="text-right py-1">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, i) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="py-1 pr-1">
                          <p className="font-medium leading-tight">{item.productName}</p>
                          <p className="text-[10px] text-muted-foreground">Size: {item.size}{item.color ? ` • ${item.color}` : ''}</p>
                        </td>
                        <td className="text-center py-1 align-top">{item.quantity}</td>
                        <td className="text-right py-1 align-top">{item.unitPrice}</td>
                        <td className="text-right py-1 font-semibold align-top">{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="py-2 border-b border-dashed border-border/80 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>AED {sale.subtotal.toLocaleString()}</span>
                </div>
                {sale.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount:</span>
                    <span>-AED {sale.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {settings.enableVat && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT ({sale.taxRate}%):</span>
                    <span>AED {sale.taxAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-border/40">
                  <span>Grand Total:</span>
                  <span>AED {sale.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-muted-foreground">Paid ({sale.paymentMethod}):</span>
                  <span className="font-medium">AED {sale.paidAmount.toLocaleString()}</span>
                </div>
                {sale.dueAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    <span>Balance Due:</span>
                    <span>AED {sale.dueAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Barcode & Footer */}
              <div className="pt-3 text-center text-[10px] text-muted-foreground space-y-1">
                <div className="py-1 px-4 bg-muted/60 rounded font-mono text-[11px] tracking-widest inline-block">
                  *{sale.invoiceNumber}*
                </div>
                <p className="whitespace-pre-line text-[9px] pt-1 leading-relaxed">
                  {settings.receiptFooter}
                </p>
              </div>
            </div>
          ) : (
            /* STANDARD A4 TAX INVOICE */
            <div id="printable-a4" className="bg-card p-6 rounded-lg border border-border text-xs text-foreground space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-primary">{settings.businessName}</h2>
                  <p className="text-muted-foreground text-xs">{settings.legalName}</p>
                  <p className="text-muted-foreground">{settings.address}, {settings.city}, {settings.country}</p>
                  <p className="text-muted-foreground">Phone: {settings.phone} • Email: {settings.email}</p>
                  <p className="font-semibold text-foreground mt-1">TRN (Tax Registration #): {settings.trn}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded text-sm uppercase">
                    Tax Invoice
                  </span>
                  <p className="font-mono text-xs font-semibold mt-2">Invoice #: {sale.invoiceNumber}</p>
                  <p className="text-muted-foreground">Date: {new Date(sale.date).toLocaleDateString()}</p>
                  <p className="text-muted-foreground">Payment: <span className="capitalize font-medium text-foreground">{sale.paymentMethod}</span></p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md border border-border/50">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Bill To Customer:</p>
                  <p className="font-medium text-sm text-foreground mt-0.5">{sale.customerName}</p>
                  {sale.customerPhone && <p className="text-muted-foreground">Phone: {sale.customerPhone}</p>}
                  <p className="text-muted-foreground capitalize">Account Type: {sale.customerType}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Transaction Details:</p>
                  <p className="text-muted-foreground mt-0.5">Sales Channel: <span className="uppercase font-medium text-foreground">{sale.channel}</span></p>
                  <p className="text-muted-foreground">Cashier / Staff: {sale.cashierName}</p>
                  {sale.notes && <p className="text-muted-foreground italic">Notes: {sale.notes}</p>}
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted/60 text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Size / Specs</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price (AED)</th>
                      <th className="p-2.5 text-right">Discount</th>
                      <th className="p-2.5 text-right">Total (AED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sale.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-muted-foreground">{idx + 1}</td>
                        <td className="p-2.5 font-medium">{item.productName}</td>
                        <td className="p-2.5 text-muted-foreground">Size {item.size} {item.color ? `• ${item.color}` : ''}</td>
                        <td className="p-2.5 text-center">{item.quantity}</td>
                        <td className="p-2.5 text-right">{item.unitPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-right text-muted-foreground">{item.discount > 0 ? `-${item.discount}` : '-'}</td>
                        <td className="p-2.5 text-right font-semibold">{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-right">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>AED {sale.subtotal.toLocaleString()}</span>
                  </div>
                  {sale.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount:</span>
                      <span>-AED {sale.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {settings.enableVat && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>VAT ({sale.taxRate}%):</span>
                      <span>AED {sale.taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm border-t pt-1.5 text-foreground">
                    <span>Grand Total:</span>
                    <span className="text-primary font-serif text-base">AED {sale.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground pt-1">
                    <span>Paid Amount:</span>
                    <span className="font-semibold text-foreground">AED {sale.paidAmount.toLocaleString()}</span>
                  </div>
                  {sale.dueAmount > 0 && (
                    <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                      <span>Outstanding Due:</span>
                      <span>AED {sale.dueAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Footer */}
              <div className="pt-4 border-t text-[10px] text-muted-foreground flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">Terms & Conditions:</p>
                  <p>{settings.termsAndConditions}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif italic text-muted-foreground">Authorized Signature</p>
                  <div className="w-32 border-b border-muted-foreground/50 mt-6 ml-auto"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 border-t pt-3">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareWhatsApp} className="w-full sm:w-auto gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
            <Share2 className="w-4 h-4" />
            Share via WhatsApp
          </Button>
          <Button size="sm" onClick={handlePrint} className="w-full sm:w-auto gap-1.5">
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
