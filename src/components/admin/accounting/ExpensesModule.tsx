import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { Expense, PaymentMethod } from '@/types/accounting';
import {
  Search,
  Plus,
  Receipt,
  DollarSign,
  PieChart,
  Trash2,
  Calendar,
  Building2,
  CreditCard,
  Banknote
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

export function ExpensesModule() {
  const { expenses, addExpense, deleteExpense } = useAccounting();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Add Expense Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('rent_utilities');
  const [amount, setAmount] = useState<number>(0);
  const [paidTo, setPaidTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.voucherNumber.toLowerCase().includes(q) ||
        e.paidTo.toLowerCase().includes(q);

      const matchesCat = selectedCategoryFilter === 'all' || e.category === selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedCategoryFilter]);

  // Total Expenses & Category Breakdown
  const summary = useMemo(() => {
    const total = expenses.reduce((acc, e) => acc + e.amount, 0);

    const categoriesMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
    });

    return { total, count: expenses.length, categoriesMap };
  }, [expenses]);

  const handleSaveExpense = () => {
    if (!title.trim() || amount <= 0 || !paidTo.trim()) {
      toast.error('Please enter expense title, amount, and recipient');
      return;
    }

    addExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      paidTo: paidTo.trim(),
      date,
      paymentMethod,
      referenceNumber: referenceNumber.trim() || undefined,
      description: description.trim() || undefined,
    });

    setIsAddOpen(false);
    // Reset
    setTitle('');
    setAmount(0);
    setPaidTo('');
    setReferenceNumber('');
    setDescription('');
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total OPEX Logged</span>
            <Receipt className="w-4 h-4 text-destructive" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {summary.total.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{summary.count} expense vouchers</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Rent & Utilities</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {(summary.categoriesMap['rent_utilities'] || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Showroom & warehouse</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Staff & Payroll</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {(summary.categoriesMap['salaries'] || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Tailoring & showroom staff</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Marketing & Logistics</span>
            <PieChart className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {((summary.categoriesMap['marketing'] || 0) + (summary.categoriesMap['shipping_delivery'] || 0)).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Influencers, Ads & Couriers</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search voucher #, title, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-44 h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rent_utilities">Rent & Utilities</SelectItem>
                <SelectItem value="salaries">Salaries & Payroll</SelectItem>
                <SelectItem value="tailoring_production">Tailoring & Production</SelectItem>
                <SelectItem value="marketing">Marketing & Ads</SelectItem>
                <SelectItem value="packaging">Packaging & Bags</SelectItem>
                <SelectItem value="shipping_delivery">Shipping & Delivery</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other OPEX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={() => setIsAddOpen(true)} className="h-9 text-xs gap-1.5 self-end md:self-auto">
            <Plus className="w-3.5 h-3.5" />
            Add Expense Voucher
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Voucher #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Expense Title & Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Paid To</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3 text-right">Amount (AED)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-muted/20">
                  <td className="p-3 font-mono font-semibold text-primary">
                    {exp.voucherNumber}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    {exp.description && <p className="text-[11px] text-muted-foreground">{exp.description}</p>}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {exp.category.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="p-3 text-foreground font-medium">
                    {exp.paidTo}
                  </td>
                  <td className="p-3 capitalize text-muted-foreground">
                    {exp.paymentMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3 text-right font-serif font-bold text-foreground text-sm">
                    AED {exp.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExpense(exp.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredExpenses.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No expense records found.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL: ADD EXPENSE VOUCHER */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Record Business Expense
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Expense Title / Item *</Label>
              <Input
                placeholder="e.g. March Showroom DEWA Electricity Bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Expense['category'])}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent_utilities">Rent & Utilities</SelectItem>
                    <SelectItem value="salaries">Salaries & Payroll</SelectItem>
                    <SelectItem value="tailoring_production">Tailoring & Production</SelectItem>
                    <SelectItem value="marketing">Marketing & Ads</SelectItem>
                    <SelectItem value="packaging">Packaging & Bags</SelectItem>
                    <SelectItem value="shipping_delivery">Shipping & Delivery</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other OPEX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Amount (AED) *</Label>
                <Input
                  type="number"
                  min="1"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Paid To (Vendor / Entity) *</Label>
                <Input
                  placeholder="e.g. DEWA Dubai"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Wire Transfer</SelectItem>
                    <SelectItem value="card">Company Card</SelectItem>
                    <SelectItem value="cash">Petty Cash In Hand</SelectItem>
                    <SelectItem value="cheque">Company Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Expense Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Receipt / Bill # (Optional)</Label>
                <Input
                  placeholder="e.g. DEWA-992144"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Additional Description</Label>
              <Input
                placeholder="Optional notes or details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExpense}>
              Save Expense Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
