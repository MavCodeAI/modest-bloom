import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { ProductInventoryRecord, StockMovementRecord } from '@/types/accounting';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  History,
  AlertTriangle,
  Boxes,
  DollarSign,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Tag,
  ArrowDown,
  ArrowUp
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function InventoryModule() {
  const {
    inventory,
    movements,
    adjustStock,
    updateProductPrices,
    stats,
  } = useAccounting();

  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Adjust Stock Modal
  const [adjustingProduct, setAdjustingProduct] = useState<ProductInventoryRecord | null>(null);
  const [newStockCount, setNewStockCount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Physical Stock Audit Count');
  const [selectedVariantSize, setSelectedVariantSize] = useState('');

  // Price Edit Modal
  const [editingPriceProduct, setEditingPriceProduct] = useState<ProductInventoryRecord | null>(null);
  const [formCostPrice, setFormCostPrice] = useState(0);
  const [formRetailPrice, setFormRetailPrice] = useState(0);
  const [formWholesalePrice, setFormWholesalePrice] = useState(0);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        (item.fabric && item.fabric.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      if (stockFilter === 'low') {
        return matchesSearch && item.currentStock <= item.minStockAlert && item.currentStock > 0;
      }
      if (stockFilter === 'out') {
        return matchesSearch && item.currentStock <= 0;
      }
      return matchesSearch;
    });
  }, [inventory, searchQuery, stockFilter]);

  // Movement logs search
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        m.productName.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
      );
    });
  }, [movements, searchQuery]);

  const handleOpenAdjust = (product: ProductInventoryRecord) => {
    setAdjustingProduct(product);
    setNewStockCount(product.currentStock);
    setAdjustReason('Physical Stock Audit Count');
    setSelectedVariantSize(product.variantStocks?.[0]?.size || '');
  };

  const handleConfirmAdjust = () => {
    if (!adjustingProduct) return;
    adjustStock({
      productId: adjustingProduct.productId,
      size: selectedVariantSize || undefined,
      newStock: Number(newStockCount),
      reason: adjustReason,
      user: 'Store Manager',
    });
    setAdjustingProduct(null);
  };

  const handleOpenPriceEdit = (product: ProductInventoryRecord) => {
    setEditingPriceProduct(product);
    setFormCostPrice(product.costPrice);
    setFormRetailPrice(product.retailPrice);
    setFormWholesalePrice(product.wholesalePrice);
  };

  const handleConfirmPriceEdit = () => {
    if (!editingPriceProduct) return;
    updateProductPrices({
      productId: editingPriceProduct.productId,
      costPrice: Number(formCostPrice),
      retailPrice: Number(formRetailPrice),
      wholesalePrice: Number(formWholesalePrice),
    });
    setEditingPriceProduct(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Valuation & Stock Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Stock Valuation (Cost)</span>
            <Boxes className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {stats.totalInventoryValueCost.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">{stats.totalStockUnits} total abaya units</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Stock Value (Retail)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            AED {stats.totalInventoryValueRetail.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Potential retail realization</span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Gross Unrealized Margin</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-foreground mt-1">
            AED {(stats.totalInventoryValueRetail - stats.totalInventoryValueCost).toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">
            {stats.totalInventoryValueRetail > 0
              ? `${Math.round(((stats.totalInventoryValueRetail - stats.totalInventoryValueCost) / stats.totalInventoryValueRetail) * 100)}% markup`
              : '0%'}
          </span>
        </Card>

        <Card className="p-3.5 bg-card border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {stats.lowStockCount} Abayas Low
          </p>
          <span className="text-[11px] text-muted-foreground">Needs purchase reorder</span>
        </Card>
      </div>

      {/* Main View Container */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stock' | 'movements')} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 h-9 text-xs">
              <TabsTrigger value="stock" className="text-xs">Live Stock & Pricing</TabsTrigger>
              <TabsTrigger value="movements" className="text-xs">Stock Movement Logs ({movements.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-1 items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SKU, name, fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {activeTab === 'stock' && (
              <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as 'all' | 'low' | 'out')}>
                <SelectTrigger className="w-36 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Status</SelectItem>
                  <SelectItem value="low">Low Stock Only</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* TAB 1: LIVE INVENTORY TABLE */}
        {activeTab === 'stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                <tr>
                  <th className="p-3">SKU & Barcode</th>
                  <th className="p-3">Product Name & Fabric</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Cost Price</th>
                  <th className="p-3 text-right">Wholesale (B2B)</th>
                  <th className="p-3 text-right">Retail Price</th>
                  <th className="p-3 text-center">Available Stock</th>
                  <th className="p-3 text-right">Stock Valuation</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minStockAlert;
                  const isOut = item.currentStock <= 0;
                  return (
                    <tr key={item.productId} className="hover:bg-muted/20">
                      <td className="p-3 font-mono">
                        <span className="font-semibold text-primary">{item.sku}</span>
                        {item.barcode && <p className="text-[10px] text-muted-foreground">{item.barcode}</p>}
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-foreground text-sm">{item.productName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.fabric || 'Korean Nida'}</p>
                      </td>
                      <td className="p-3 capitalize text-muted-foreground">
                        {item.category?.replace(/-/g, ' ')}
                      </td>
                      <td className="p-3 text-right font-medium text-muted-foreground">
                        AED {item.costPrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                        AED {item.wholesalePrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-serif font-bold text-foreground">
                        AED {item.retailPrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={isOut ? 'destructive' : isLow ? 'secondary' : 'outline'}
                          className={`text-xs px-2 py-0.5 ${
                            isLow && !isOut ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30' : ''
                          }`}
                        >
                          {item.currentStock} Units
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-serif font-semibold text-foreground">
                        AED {(item.costPrice * item.currentStock).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAdjust(item)}
                            className="h-7 px-2 text-[11px] gap-1"
                            title="Adjust Physical Count"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            Adjust
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenPriceEdit(item)}
                            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                            title="Edit Prices"
                          >
                            <Tag className="w-3 h-3" />
                            Prices
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredInventory.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No inventory records match the selected query.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STOCK MOVEMENT HISTORY */}
        {activeTab === 'movements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Product & SKU</th>
                  <th className="p-3">Movement Type</th>
                  <th className="p-3 text-center">Change</th>
                  <th className="p-3 text-center">Previous → New</th>
                  <th className="p-3">Reason / Reference</th>
                  <th className="p-3">Handled By</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMovements.map((mov) => {
                  const isPositive = mov.quantityChange > 0;
                  return (
                    <tr key={mov.id} className="hover:bg-muted/20">
                      <td className="p-3 text-muted-foreground">
                        {new Date(mov.createdAt).toLocaleDateString()} {new Date(mov.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{mov.productName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{mov.sku}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {mov.type.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono font-bold text-xs inline-flex items-center gap-0.5 ${
                            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                          }`}
                        >
                          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {isPositive ? `+${mov.quantityChange}` : mov.quantityChange}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-muted-foreground">
                        {mov.previousStock} → <span className="font-bold text-foreground">{mov.newStock}</span>
                      </td>
                      <td className="p-3 text-foreground font-medium">
                        {mov.reason}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {mov.user || 'Store Manager'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL 1: STOCK ADJUSTMENT */}
      <Dialog open={!!adjustingProduct} onOpenChange={() => setAdjustingProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Stock Count Adjustment
            </DialogTitle>
          </DialogHeader>
          {adjustingProduct && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <p className="font-semibold text-foreground text-sm">{adjustingProduct.productName}</p>
                <p className="text-muted-foreground font-mono">SKU: {adjustingProduct.sku}</p>
                <p className="text-xs">
                  Current System Stock: <span className="font-bold text-foreground">{adjustingProduct.currentStock} Units</span>
                </p>
              </div>

              <div>
                <Label className="text-xs">Actual Physical Count Counted *</Label>
                <Input
                  type="number"
                  min="0"
                  value={newStockCount}
                  onChange={(e) => setNewStockCount(parseInt(e.target.value) || 0)}
                  className="mt-1 h-9 font-bold text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">Adjustment Reason *</Label>
                <Select value={adjustReason} onValueChange={setAdjustReason}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical Stock Audit Count">Physical Stock Audit Count</SelectItem>
                    <SelectItem value="Damaged in Showroom Handling">Damaged in Showroom Handling</SelectItem>
                    <SelectItem value="Sent to Workshop for Tailoring / Alteration">Sent to Workshop for Tailoring / Alteration</SelectItem>
                    <SelectItem value="Showroom Display Sample">Showroom Display Sample</SelectItem>
                    <SelectItem value="VIP Promotional Giveaway">VIP Promotional Giveaway</SelectItem>
                    <SelectItem value="Inventory Discrepancy Correction">Inventory Discrepancy Correction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAdjust}>
              Update Stock & Log Movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: PRICE UPDATE */}
      <Dialog open={!!editingPriceProduct} onOpenChange={() => setEditingPriceProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              Update Product Pricing
            </DialogTitle>
          </DialogHeader>
          {editingPriceProduct && (
            <div className="space-y-3 py-2 text-xs">
              <p className="font-semibold text-foreground">{editingPriceProduct.productName}</p>

              <div>
                <Label className="text-xs">Cost Price (AED) *</Label>
                <Input
                  type="number"
                  value={formCostPrice}
                  onChange={(e) => setFormCostPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs">B2B Wholesale Price (AED) *</Label>
                <Input
                  type="number"
                  value={formWholesalePrice}
                  onChange={(e) => setFormWholesalePrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs">Retail Price (AED) *</Label>
                <Input
                  type="number"
                  value={formRetailPrice}
                  onChange={(e) => setFormRetailPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-9 font-semibold"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPriceProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPriceEdit}>
              Save Updated Prices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
