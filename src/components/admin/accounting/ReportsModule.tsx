import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Printer,
  Boxes,
  Users,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function ReportsModule() {
  const { sales, purchases, expenses, inventory, customers, suppliers, stats, settings } = useAccounting();
  const [reportType, setReportType] = useState<'pnl' | 'channel' | 'top_products' | 'valuation'>('pnl');

  // Top Selling Products Calculation
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; sku: string; units: number; revenue: number; cogs: number }> = {};

    sales.filter(s => s.status !== 'void').forEach(sale => {
      sale.items.forEach(item => {
        if (!map[item.productId]) {
          map[item.productId] = {
            name: item.productName,
            sku: item.sku,
            units: 0,
            revenue: 0,
            cogs: 0,
          };
        }
        map[item.productId].units += item.quantity;
        map[item.productId].revenue += item.total;
        map[item.productId].cogs += (item.costPrice * item.quantity);
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  // Expenses by Category
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let rows: string[][] = [];
    let filename = '';

    if (reportType === 'pnl') {
      filename = 'Profit_and_Loss_Statement';
      rows = [
        ['FINANCIAL LINE ITEM', 'AMOUNT (AED)'],
        ['Total Sales Revenue', stats.totalRevenue.toString()],
        ['  - POS Store Revenue', stats.posRevenue.toString()],
        ['  - B2B Wholesale Revenue', stats.wholesaleRevenue.toString()],
        ['  - Online Web Revenue', stats.onlineRevenue.toString()],
        ['Cost of Goods Sold (COGS)', stats.cogs.toString()],
        ['GROSS PROFIT', stats.grossProfit.toString()],
        ['Gross Margin %', `${stats.grossMarginPercent.toFixed(1)}%`],
        ['Operating Expenses (OPEX)', stats.totalExpenses.toString()],
        ...Object.entries(expenseByCategory).map(([cat, amt]) => [`  - ${cat.replace(/_/g, ' ')}`, amt.toString()]),
        ['NET OPERATING PROFIT', stats.netProfit.toString()],
        ['Net Margin %', `${stats.netMarginPercent.toFixed(1)}%`],
      ];
    } else {
      filename = 'Top_Selling_Products';
      rows = [
        ['Product Name', 'SKU', 'Units Sold', 'Revenue (AED)', 'COGS (AED)', 'Gross Profit (AED)'],
        ...topProducts.map(p => [
          `"${p.name}"`,
          p.sku,
          p.units.toString(),
          p.revenue.toString(),
          p.cogs.toString(),
          (p.revenue - p.cogs).toString(),
        ]),
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial report exported to CSV');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3.5 rounded-xl border">
        <Tabs value={reportType} onValueChange={(v) => setReportType(v as 'pnl' | 'channel' | 'top_products' | 'valuation')} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 h-9 text-xs">
            <TabsTrigger value="pnl" className="text-xs">Profit & Loss</TabsTrigger>
            <TabsTrigger value="channel" className="text-xs">Sales by Channel</TabsTrigger>
            <TabsTrigger value="top_products" className="text-xs">Top Selling Abayas</TabsTrigger>
            <TabsTrigger value="valuation" className="text-xs">Stock Valuation</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5">
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* REPORT 1: PROFIT & LOSS (P&L) STATEMENT */}
      {reportType === 'pnl' && (
        <Card className="p-6 bg-card border text-foreground space-y-6">
          <div className="border-b pb-4 flex justify-between items-start">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Statement of Profit & Loss (Income Statement)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {settings.businessName} • Fiscal Period: Year to Date (YTD)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Net Profit</span>
              <span className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                AED {stats.netProfit.toLocaleString()}
              </span>
              <p className="text-[11px] text-muted-foreground">{stats.netMarginPercent.toFixed(1)}% Net Margin</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm">
            {/* REVENUE SECTION */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-base border-b pb-1">
                <span>1. Operating Revenue</span>
                <span className="font-serif">AED {stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="pl-4 space-y-1 text-muted-foreground text-xs">
                <div className="flex justify-between">
                  <span>POS Showroom Sales</span>
                  <span>AED {stats.posRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>B2B Wholesale / Boutique Contracts</span>
                  <span>AED {stats.wholesaleRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online E-Commerce Website Orders</span>
                  <span>AED {stats.onlineRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* COGS & GROSS PROFIT */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-base border-b pb-1">
                <span>2. Cost of Goods Sold (COGS)</span>
                <span className="font-serif text-destructive">-AED {stats.cogs.toLocaleString()}</span>
              </div>
              <div className="pl-4 text-xs text-muted-foreground">
                Direct cost of fabrics, laces, tailoring & craftsmanship for sold items.
              </div>

              <div className="flex justify-between font-bold text-sm bg-muted/40 p-2.5 rounded-lg text-foreground mt-2">
                <span>GROSS PROFIT (Revenue - COGS)</span>
                <span className="font-serif text-base text-primary">
                  AED {stats.grossProfit.toLocaleString()} ({stats.grossMarginPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* OPEX SECTION */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-base border-b pb-1">
                <span>3. Operating Expenses (OPEX)</span>
                <span className="font-serif text-destructive">-AED {stats.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="pl-4 space-y-1.5 text-xs text-muted-foreground">
                {Object.entries(expenseByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between capitalize">
                    <span>{category.replace(/_/g, ' ')}</span>
                    <span>AED {amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL NET PROFIT SUMMARY */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-base text-emerald-950 dark:text-emerald-100">
                  NET BUSINESS PROFIT
                </p>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
                  Gross Profit minus All Operating Overhead Expenses
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  AED {stats.netProfit.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {stats.netMarginPercent.toFixed(1)}% Net Margin
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* REPORT 2: SALES BY CHANNEL */}
      {reportType === 'channel' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card border space-y-2">
            <span className="text-xs uppercase font-semibold text-muted-foreground">POS Store / Showroom</span>
            <p className="font-serif text-2xl font-bold text-primary">
              AED {stats.posRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.totalRevenue > 0 ? `${Math.round((stats.posRevenue / stats.totalRevenue) * 100)}% of total volume` : '0%'}
            </p>
          </Card>

          <Card className="p-4 bg-card border space-y-2">
            <span className="text-xs uppercase font-semibold text-muted-foreground">B2B Wholesale Channel</span>
            <p className="font-serif text-2xl font-bold text-amber-600 dark:text-amber-400">
              AED {stats.wholesaleRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.totalRevenue > 0 ? `${Math.round((stats.wholesaleRevenue / stats.totalRevenue) * 100)}% of total volume` : '0%'}
            </p>
          </Card>

          <Card className="p-4 bg-card border space-y-2">
            <span className="text-xs uppercase font-semibold text-muted-foreground">Online Website Orders</span>
            <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              AED {stats.onlineRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.totalRevenue > 0 ? `${Math.round((stats.onlineRevenue / stats.totalRevenue) * 100)}% of total volume` : '0%'}
            </p>
          </Card>
        </div>
      )}

      {/* REPORT 3: TOP SELLING PRODUCTS */}
      {reportType === 'top_products' && (
        <Card className="border bg-card">
          <div className="p-4 border-b">
            <h3 className="font-serif font-bold text-base text-foreground">
              Top Selling Abaya Designs (Revenue & Margin Contribution)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Abaya Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-center">Units Sold</th>
                  <th className="p-3 text-right">Revenue (AED)</th>
                  <th className="p-3 text-right">COGS (AED)</th>
                  <th className="p-3 text-right">Gross Profit</th>
                  <th className="p-3 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topProducts.map((p, idx) => {
                  const profit = p.revenue - p.cogs;
                  const marginPct = p.revenue > 0 ? (profit / p.revenue) * 100 : 0;
                  return (
                    <tr key={p.sku} className="hover:bg-muted/20">
                      <td className="p-3 text-muted-foreground font-semibold">{idx + 1}</td>
                      <td className="p-3 font-semibold text-foreground text-sm">{p.name}</td>
                      <td className="p-3 font-mono text-muted-foreground">{p.sku}</td>
                      <td className="p-3 text-center font-bold">{p.units}</td>
                      <td className="p-3 text-right font-serif font-bold text-foreground">
                        {p.revenue.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        {p.cogs.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-serif font-bold text-emerald-600 dark:text-emerald-400">
                        AED {profit.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {marginPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* REPORT 4: STOCK VALUATION */}
      {reportType === 'valuation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Stock at Cost</span>
              <p className="font-serif text-2xl font-bold text-foreground">
                AED {stats.totalInventoryValueCost.toLocaleString()}
              </p>
              <span className="text-xs text-muted-foreground">{stats.totalStockUnits} physical units in stock</span>
            </Card>

            <Card className="p-4 bg-card border space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Stock at Retail</span>
              <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                AED {stats.totalInventoryValueRetail.toLocaleString()}
              </p>
              <span className="text-xs text-muted-foreground">Realized upon counter checkout</span>
            </Card>

            <Card className="p-4 bg-card border space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Unrealized Inventory Profit</span>
              <p className="font-serif text-2xl font-bold text-primary">
                AED {(stats.totalInventoryValueRetail - stats.totalInventoryValueCost).toLocaleString()}
              </p>
              <span className="text-xs text-muted-foreground">Potential inventory upside</span>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
