import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { Customer, CustomerType, PaymentMethod } from '@/types/accounting';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  Share2,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  UserCheck,
  CreditCard,
  History
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

export function CustomersModule() {
  const {
    customers,
    sales,
    payments,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    receiveCustomerPayment,
    settings
  } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Add / Edit Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState<CustomerType>('retail');
  const [formCity, setFormCity] = useState('Dubai');
  const [formAddress, setFormAddress] = useState('');
  const [formCreditLimit, setFormCreditLimit] = useState(5000);
  const [formOpeningBalance, setFormOpeningBalance] = useState(0);

  // Statement / Ledger Modal
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);

  // Receive Payment Modal
  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q));

      const matchesType = selectedTypeFilter === 'all' || c.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [customers, searchQuery, selectedTypeFilter]);

  // Overall Receivables Stats
  const stats = useMemo(() => {
    const totalReceivables = customers.reduce((acc, c) => acc + (c.currentBalance || 0), 0);
    const totalCustomers = customers.length;
    const wholesaleCount = customers.filter(c => c.type === 'wholesale').length;
    const debtorsCount = customers.filter(c => (c.currentBalance || 0) > 0).length;

    return { totalReceivables, totalCustomers, wholesaleCount, debtorsCount };
  }, [customers]);

  // Customer Ledger Data
  const customerLedger = useMemo(() => {
    if (!statementCustomer) return [];

    const custSales = sales
      .filter(s => s.customerId === statementCustomer.id || s.customerName === statementCustomer.name)
      .map(s => ({
        id: s.id,
        date: s.date,
        type: 'Invoice' as const,
        refNumber: s.invoiceNumber,
        description: `Sale invoice (${s.items.length} items)`,
        debit: s.total, // increase what they owe
        credit: s.paidAmount, // immediate payment made during sale
        balanceImpact: s.dueAmount,
      }));

    const custPayments = payments
      .filter(p => p.partyId === statementCustomer.id || p.partyName === statementCustomer.name)
      .filter(p => p.referenceType !== 'sale') // avoid duplicate counting of immediate POS payment
      .map(p => ({
        id: p.id,
        date: p.date,
        type: 'Payment' as const,
        refNumber: p.paymentNumber,
        description: p.notes || `Payment received (${p.paymentMethod})`,
        debit: 0,
        credit: p.amount,
        balanceImpact: -p.amount,
      }));

    const combined = [...custSales, ...custPayments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let current = statementCustomer.openingBalance || 0;
    return combined.map(entry => {
      current = current + entry.debit - entry.credit;
      return { ...entry, runningBalance: current };
    });
  }, [statementCustomer, sales, payments]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormType('retail');
    setFormCity('Dubai');
    setFormAddress('');
    setFormCreditLimit(5000);
    setFormOpeningBalance(0);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormName(customer.name);
    setFormPhone(customer.phone || '');
    setFormEmail(customer.email || '');
    setFormType(customer.type);
    setFormCity(customer.city || 'Dubai');
    setFormAddress(customer.address || '');
    setFormCreditLimit(customer.creditLimit || 5000);
    setFormOpeningBalance(customer.openingBalance || 0);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error('Customer name and phone number are required');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || undefined,
        type: formType,
        city: formCity,
        address: formAddress.trim() || undefined,
        creditLimit: formCreditLimit,
      });
    } else {
      addCustomer({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || undefined,
        type: formType,
        city: formCity,
        address: formAddress.trim() || undefined,
        creditLimit: formCreditLimit,
        openingBalance: formOpeningBalance,
      });
    }

    setIsCustomerModalOpen(false);
  };

  const handleOpenReceivePayment = (customer: Customer) => {
    setPayingCustomer(customer);
    setPaymentAmount(customer.currentBalance);
    setPaymentNotes(`Payment from ${customer.name}`);
  };

  const handleConfirmReceivePayment = () => {
    if (!payingCustomer || paymentAmount <= 0) return;
    receiveCustomerPayment({
      customerId: payingCustomer.id,
      amount: paymentAmount,
      paymentMethod,
      notes: paymentNotes,
    });
    setPayingCustomer(null);
  };

  const handleSendWhatsAppReminder = (customer: Customer) => {
    const text = encodeURIComponent(
      `*${settings.businessName.toUpperCase()} - ACCOUNT STATEMENT*\n\n` +
      `Dear ${customer.name},\n` +
      `We hope this message finds you well.\n\n` +
      `This is a friendly reminder regarding your outstanding balance with Modest Way Fashion:\n` +
      `*Current Balance Due: AED ${customer.currentBalance.toLocaleString()}*\n\n` +
      `For queries or bank transfer details, please reply to this chat.\n` +
      `Thank you for your valued business!`
    );

    const phone = customer.phone?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Receivables</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            AED {stats.totalReceivables.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{stats.debtorsCount} customer khatas due</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Registered Parties</span>
            <UserCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            {stats.totalCustomers} Accounts
          </p>
          <span className="text-[11px] text-muted-foreground">Retail & Wholesale clients</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Wholesale B2B</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            {stats.wholesaleCount} Boutiques
          </p>
          <span className="text-[11px] text-muted-foreground">Commercial accounts</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Credit Recovery</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            Instant WhatsApp Reminders
          </p>
          <span className="text-[11px] text-muted-foreground">One-click statement share</span>
        </Card>
      </div>

      {/* Main Customers List */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, phone, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
              <SelectTrigger className="w-36 h-9 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="retail">Retail Clients</SelectItem>
                <SelectItem value="wholesale">Wholesale B2B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs gap-1.5 self-end md:self-auto">
            <UserPlus className="w-3.5 h-3.5" />
            Add Customer Party
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Contact (Phone / WhatsApp)</th>
                <th className="p-3">Account Type</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-right">Credit Limit</th>
                <th className="p-3 text-right">Balance Due (Khata)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((cust) => {
                const hasDue = cust.currentBalance > 0;
                return (
                  <tr key={cust.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <p className="font-semibold text-foreground text-sm">{cust.name}</p>
                      {cust.email && <p className="text-[11px] text-muted-foreground">{cust.email}</p>}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {cust.phone || '-'}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={cust.type === 'wholesale' ? 'default' : 'outline'}
                        className={`text-[10px] uppercase font-semibold ${
                          cust.type === 'wholesale' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''
                        }`}
                      >
                        {cust.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {cust.city || 'Dubai, UAE'}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      AED {cust.creditLimit?.toLocaleString() || '5,000'}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-serif font-bold text-sm ${
                          hasDue ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        AED {cust.currentBalance?.toLocaleString() || '0'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStatementCustomer(cust)}
                          className="h-7 px-2 text-[11px] gap-1 text-primary hover:bg-primary/10"
                          title="View Ledger Statement"
                        >
                          <History className="w-3.5 h-3.5" />
                          Ledger
                        </Button>

                        {hasDue && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReceivePayment(cust)}
                              className="h-7 px-2 text-[11px] text-emerald-600 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1"
                              title="Receive Payment"
                            >
                              <DollarSign className="w-3 h-3" />
                              Receive
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendWhatsAppReminder(cust)}
                              className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              title="Send WhatsApp Reminder"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(cust)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit Customer"
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

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No customers found.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL 1: ADD / EDIT CUSTOMER */}
      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {editingCustomer ? 'Edit Customer Party' : 'Add New Customer Party'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Full Name / Business Name *</Label>
              <Input
                placeholder="e.g. Al-Bustan Fashion Boutique"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Phone (WhatsApp) *</Label>
                <Input
                  placeholder="+971 50 123 4567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Account Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as CustomerType)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Client</SelectItem>
                    <SelectItem value="wholesale">Wholesale B2B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Email Address (Optional)</Label>
              <Input
                placeholder="client@domain.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">City / Emirate</Label>
                <Input
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Credit Limit (AED)</Label>
                <Input
                  type="number"
                  value={formCreditLimit}
                  onChange={(e) => setFormCreditLimit(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {!editingCustomer && (
              <div>
                <Label className="text-xs">Opening Balance (AED)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formOpeningBalance}
                  onChange={(e) => setFormOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 text-xs"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Enter existing unpaid balance if transferring account from previous ledger.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CUSTOMER LEDGER STATEMENT */}
      <Dialog open={!!statementCustomer} onOpenChange={() => setStatementCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="flex justify-between items-center pr-6">
              <div>
                <DialogTitle className="font-serif text-lg flex items-center gap-2">
                  Customer Ledger Statement
                  <Badge variant="outline" className="capitalize text-xs font-mono">
                    {statementCustomer?.type}
                  </Badge>
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Party: <span className="font-semibold text-foreground">{statementCustomer?.name}</span> • Phone: {statementCustomer?.phone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Net Balance Due</span>
                <span className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">
                  AED {statementCustomer?.currentBalance.toLocaleString()}
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
                  {statementCustomer?.openingBalance ? (
                    <tr className="bg-muted/20">
                      <td className="p-2.5 text-muted-foreground">-</td>
                      <td className="p-2.5 font-medium">Opening</td>
                      <td className="p-2.5 text-muted-foreground">Opening Account Balance</td>
                      <td className="p-2.5 text-right text-muted-foreground">{statementCustomer.openingBalance}</td>
                      <td className="p-2.5 text-right text-muted-foreground">-</td>
                      <td className="p-2.5 text-right font-semibold">AED {statementCustomer.openingBalance.toLocaleString()}</td>
                    </tr>
                  ) : null}

                  {customerLedger.map((row) => (
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

            {customerLedger.length === 0 && !statementCustomer?.openingBalance && (
              <div className="p-6 text-center text-muted-foreground">
                No financial transactions recorded yet for this customer.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setStatementCustomer(null)}>
              Close
            </Button>
            {statementCustomer && (
              <Button
                onClick={() => handleSendWhatsAppReminder(statementCustomer)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Share2 className="w-4 h-4" />
                Share Statement via WhatsApp
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: RECEIVE PAYMENT */}
      <Dialog open={!!payingCustomer} onOpenChange={() => setPayingCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Receive Khata Payment from {payingCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          {payingCustomer && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg flex justify-between items-center">
                <span className="text-muted-foreground">Current Outstanding:</span>
                <span className="font-serif font-bold text-amber-600 dark:text-amber-400 text-base">
                  AED {payingCustomer.currentBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <Label className="text-xs">Amount Received (AED) *</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  max={payingCustomer.currentBalance}
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
                <Label className="text-xs">Notes / Reference</Label>
                <Input
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Cleared via Bank Transfer"
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayingCustomer(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReceivePayment}>
              Record & Update Khata
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
