import { useState } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { POSModule } from './POSModule';
import { SalesModule } from './SalesModule';
import { PurchasesModule } from './PurchasesModule';
import { CustomersModule } from './CustomersModule';
import { SuppliersModule } from './SuppliersModule';
import { InventoryModule } from './InventoryModule';
import { ExpensesModule } from './ExpensesModule';
import { CashRegisterModule } from './CashRegisterModule';
import { ReceivablesPayablesModule } from './ReceivablesPayablesModule';
import { ReturnsModule } from './ReturnsModule';
import { ReportsModule } from './ReportsModule';
import { BusinessSettingsModule } from './BusinessSettingsModule';
import {
  Store,
  ShoppingCart,
  Receipt,
  Boxes,
  Users,
  Building2,
  DollarSign,
  Banknote,
  RotateCcw,
  BarChart3,
  ShieldCheck,
  Settings,
  Scale,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type AccountingTab =
  | 'pos'
  | 'sales'
  | 'purchases'
  | 'inventory'
  | 'customers'
  | 'suppliers'
  | 'expenses'
  | 'cash_register'
  | 'receivables_payables'
  | 'returns'
  | 'reports'
  | 'settings';

interface AccountingDashboardProps {
  initialSubTab?: AccountingTab;
}

export function AccountingDashboard({ initialSubTab = 'pos' }: AccountingDashboardProps) {
  const [activeTab, setActiveTab] = useState<AccountingTab>(initialSubTab);
  const { stats, cashRegister, sales, customers } = useAccounting();

  const navItems = [
    { id: 'pos', label: 'POS Terminal', icon: Store, badge: 'Live Counter' },
    { id: 'sales', label: 'Sales Registry', icon: ShoppingCart, count: sales.length },
    { id: 'purchases', label: 'Purchases & Bills', icon: Receipt },
    { id: 'inventory', label: 'Inventory & Valuation', icon: Boxes, alert: stats.lowStockCount > 0 ? `${stats.lowStockCount} Low` : undefined },
    { id: 'customers', label: 'Customer Khata', icon: Users, count: customers.length },
    { id: 'suppliers', label: 'Suppliers & Vendors', icon: Building2 },
    { id: 'expenses', label: 'Expenses (OPEX)', icon: DollarSign },
    { id: 'cash_register', label: 'Cash Register', icon: Banknote, badge: cashRegister.status === 'open' ? 'Shift Open' : 'Closed' },
    { id: 'receivables_payables', label: 'Aging Receivables & Payables', icon: Scale },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'reports', label: 'Reports & P&L', icon: BarChart3 },
    { id: 'settings', label: 'VAT & Business Profile', icon: Settings },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-Navigation Bar */}
      <div className="bg-card border rounded-xl p-1.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AccountingTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.count !== undefined && !isActive && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.alert && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono">
                    {item.alert}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'pos' && <POSModule />}
        {activeTab === 'sales' && <SalesModule />}
        {activeTab === 'purchases' && <PurchasesModule />}
        {activeTab === 'inventory' && <InventoryModule />}
        {activeTab === 'customers' && <CustomersModule />}
        {activeTab === 'suppliers' && <SuppliersModule />}
        {activeTab === 'expenses' && <ExpensesModule />}
        {activeTab === 'cash_register' && <CashRegisterModule />}
        {activeTab === 'receivables_payables' && <ReceivablesPayablesModule />}
        {activeTab === 'returns' && <ReturnsModule />}
        {activeTab === 'reports' && <ReportsModule />}
        {activeTab === 'settings' && <BusinessSettingsModule />}
      </div>
    </div>
  );
}
