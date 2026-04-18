import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Wand2 } from 'lucide-react';
import { useProductVariants, useUpsertVariants, ProductVariant } from '@/hooks/useProductVariants';

interface Props {
  productId: string;
  sizes: string[];
  colors: string[]; // stored as "Name:#hex" or plain "Name"
}

const parseColor = (raw: string) => {
  const [name, hex] = raw.split(':');
  return { name: name.trim(), hex: hex?.trim() };
};

type Row = { size: string; color: string; stock: number };

const keyOf = (size: string, color: string) => `${size}__${color}`;

export const VariantInventoryManager = ({ productId, sizes, colors }: Props) => {
  const { data: variants, isLoading } = useProductVariants(productId);
  const upsert = useUpsertVariants();

  const [rows, setRows] = useState<Record<string, Row>>({});

  // Build/sync rows whenever sizes, colors, or saved variants change
  useEffect(() => {
    const next: Record<string, Row> = {};
    sizes.forEach(size => {
      colors.forEach(color => {
        const k = keyOf(size, color);
        const existing = (variants || []).find(v => v.size === size && v.color === color);
        next[k] = { size, color, stock: existing?.stock ?? 0 };
      });
    });
    setRows(next);
  }, [sizes, colors, variants]);

  const totalStock = useMemo(
    () => Object.values(rows).reduce((sum, r) => sum + (Number(r.stock) || 0), 0),
    [rows]
  );

  const setStock = (k: string, val: number) => {
    setRows(prev => ({ ...prev, [k]: { ...prev[k], stock: val } }));
  };

  const fillAll = (val: number) => {
    setRows(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => (next[k] = { ...next[k], stock: val }));
      return next;
    });
  };

  const handleSave = () => {
    const toSave = Object.values(rows).filter(r => r.stock > 0);
    upsert.mutate({ productId, variants: toSave });
  };

  if (sizes.length === 0 || colors.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        پہلے sizes اور colors add کریں — پھر ہر combination کا stock یہاں ظاہر ہو گا۔
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xs text-muted-foreground">
          Total stock: <span className="font-semibold text-foreground">{totalStock}</span>
          {' · '}
          {sizes.length} × {colors.length} = {sizes.length * colors.length} combos
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fillAll(10)} className="gap-1">
            <Wand2 className="h-3.5 w-3.5" />
            Fill all 10
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => fillAll(0)}>
            Clear
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading variants…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Size</th>
                {colors.map(c => {
                  const { name, hex } = parseColor(c);
                  return (
                    <th key={c} className="px-3 py-2 font-medium">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: hex || '#ccc' }}
                        />
                        <span className="text-xs">{name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sizes.map(size => (
                <tr key={size} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{size}</td>
                  {colors.map(color => {
                    const k = keyOf(size, color);
                    return (
                      <td key={k} className="px-2 py-1.5">
                        <Input
                          type="number"
                          min={0}
                          value={rows[k]?.stock ?? 0}
                          onChange={e => setStock(k, Math.max(0, parseInt(e.target.value) || 0))}
                          className="h-8 w-16 text-center text-xs"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={upsert.isPending}
        size="sm"
        className="gap-2"
      >
        {upsert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Inventory
      </Button>
    </div>
  );
};
