import { useState } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import {
  Banknote,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck
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
import { toast } from 'sonner';

export function CashRegisterModule() {
  const {
    cashRegister,
    openShift,
    closeShift,
    addCashTransaction,
    payments,
  } = useAccounting();

  // Modals
  const [isOpenShiftModal, setIsOpenShiftModal] = useState(false);
  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [cashierName, setCashierName] = useState('Fatima Al-Mansoor (POS 1)');

  const [isCloseShiftModal, setIsCloseShiftModal] = useState(false);
  const [countedCash, setCountedCash] = useState<number>(cashRegister.expectedClosingBalance);
  const [closeNotes, setCloseNotes] = useState('');

  const [isCashTransModal, setIsCashTransModal] = useState(false);
  const [transType, setTransType] = useState<'cash_in' | 'cash_out'>('cash_in');
  const [transAmount, setTransAmount] = useState<number>(0);
  const [transReason, setTransReason] = useState('');

  const isShiftOpen = cashRegister.status === 'open';

  // Filter cash payments for today
  const cashPayments = payments.filter(p => p.paymentMethod === 'cash');

  const handleConfirmOpenShift = () => {
    openShift(openingFloat, cashierName);
    setIsOpenShiftModal(false);
  };

  const handleConfirmCloseShift = () => {
    closeShift(countedCash, closeNotes);
    setIsCloseShiftModal(false);
  };

  const handleConfirmCashTrans = () => {
    if (transAmount <= 0 || !transReason.trim()) {
      toast.error('Please enter amount and reason');
      return;
    }
    addCashTransaction({
      type: transType,
      amount: transAmount,
      notes: transReason,
      user: cashRegister.cashierName,
    });
    setIsCashTransModal(false);
    setTransAmount(0);
    setTransReason('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Shift Status & Controls */}
      <Card className="p-4 bg-card border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isShiftOpen ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
          }`}>
            {isShiftOpen ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-foreground">
                POS Cash Register Drawer
              </h3>
              <Badge variant={isShiftOpen ? 'default' : 'secondary'} className="capitalize text-xs">
                {cashRegister.status} Shift
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cashier: <span className="font-semibold text-foreground">{cashRegister.cashierName}</span> • Opened at {new Date(cashRegister.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {isShiftOpen ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTransType('cash_in');
                  setIsCashTransModal(true);
                }}
                className="text-xs gap-1.5 flex-1 md:flex-initial"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                Deposit / Cash In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTransType('cash_out');
                  setIsCashTransModal(true);
                }}
                className="text-xs gap-1.5 flex-1 md:flex-initial"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />
                Withdraw / Cash Out
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setCountedCash(cashRegister.expectedClosingBalance);
                  setIsCloseShiftModal(true);
                }}
                className="text-xs gap-1.5 flex-1 md:flex-initial"
              >
                <Lock className="w-3.5 h-3.5" />
                Close Shift
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsOpenShiftModal(true)}
              className="text-xs gap-1.5 w-full md:w-auto"
            >
              <Unlock className="w-3.5 h-3.5" />
              Open New Shift Register
            </Button>
          )}
        </div>
      </Card>

      {/* 4 KPI Cards for Drawer Accounting */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Opening Float</span>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {cashRegister.openingBalance.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Start of shift float</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Cash Sales Inflow</span>
          <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            +AED {cashRegister.cashSales.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">From counter sales</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Cash Outflows / Petty OPEX</span>
          <p className="font-serif text-lg sm:text-xl font-bold text-destructive mt-1">
            -AED {(cashRegister.cashOut + cashRegister.cashExpenses).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Petty cash & vendor payouts</span>
        </Card>

        <Card className="p-3.5 bg-card border bg-primary/5 border-primary/20">
          <span className="text-xs text-primary uppercase font-bold">Expected In Drawer</span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-primary mt-1">
            AED {cashRegister.expectedClosingBalance.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Must match physical cash count</span>
        </Card>
      </div>

      {/* Cash Flow Activity Log */}
      <Card className="border bg-card">
        <div className="p-4 border-b">
          <h4 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Cash Flow Audit Timeline (Shift Activity)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Ref / Voucher #</th>
                <th className="p-3">Transaction Type</th>
                <th className="p-3">Party / Reason</th>
                <th className="p-3 text-right">Cash In (+)</th>
                <th className="p-3 text-right">Cash Out (-)</th>
                <th className="p-3">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cashPayments.map((p) => {
                const isIncoming = p.type === 'customer_payment' || p.type === 'cash_in';
                return (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3 text-muted-foreground">
                      {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 font-mono font-medium text-primary">
                      {p.paymentNumber}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {p.type.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      {p.notes || p.partyName || 'Cash transaction'}
                    </td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-serif font-bold">
                      {isIncoming ? `AED ${p.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-right text-destructive font-serif font-bold">
                      {!isIncoming ? `AED ${p.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {p.recordedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL 1: OPEN SHIFT */}
      <Dialog open={isOpenShiftModal} onOpenChange={setIsOpenShiftModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Open Daily Cash Register Shift
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Cashier Name *</Label>
              <Input
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Opening Cash Float (AED) *</Label>
              <Input
                type="number"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(parseFloat(e.target.value) || 0)}
                className="mt-1 h-9 font-bold text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Physical cash in drawer at start of day.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenShiftModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmOpenShift}>
              Open Shift Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CLOSE SHIFT */}
      <Dialog open={isCloseShiftModal} onOpenChange={setIsCloseShiftModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Close Register & Reconcile Shift
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Drawer Total:</span>
                <span className="font-bold text-foreground">AED {cashRegister.expectedClosingBalance.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <Label className="text-xs">Actual Counted Cash in Drawer (AED) *</Label>
              <Input
                type="number"
                value={countedCash}
                onChange={(e) => setCountedCash(parseFloat(e.target.value) || 0)}
                className="mt-1 h-9 font-bold text-sm"
              />
            </div>

            <div className="flex justify-between items-center p-2 rounded bg-muted/30 border text-xs">
              <span>Discrepancy (Over / Short):</span>
              <span className={`font-bold ${
                countedCash - cashRegister.expectedClosingBalance === 0
                  ? 'text-emerald-600'
                  : 'text-destructive'
              }`}>
                AED {(countedCash - cashRegister.expectedClosingBalance).toLocaleString()}
              </span>
            </div>

            <div>
              <Label className="text-xs">Closing Notes (Optional)</Label>
              <Input
                placeholder="e.g. Shift closed, float deposited into safe"
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseShiftModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmCloseShift}>
              Confirm Shift Closure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: CASH TRANSACTION (IN / OUT) */}
      <Dialog open={isCashTransModal} onOpenChange={setIsCashTransModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {transType === 'cash_in' ? 'Manual Cash Deposit (Cash In)' : 'Petty Cash Payout (Cash Out)'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Amount (AED) *</Label>
              <Input
                type="number"
                value={transAmount || ''}
                onChange={(e) => setTransAmount(parseFloat(e.target.value) || 0)}
                className="mt-1 h-9 font-bold text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Reason / Purpose *</Label>
              <Input
                placeholder={transType === 'cash_in' ? 'e.g. Additional float from bank' : 'e.g. Showroom tea/coffee supplies'}
                value={transReason}
                onChange={(e) => setTransReason(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCashTransModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCashTrans}>
              Record Cash Flow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
