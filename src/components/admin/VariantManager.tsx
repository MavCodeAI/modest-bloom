import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VariantManagerProps {
  type: 'size' | 'color';
  values: string[];
  onChange: (values: string[]) => void;
  presets?: string[];
}

const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size', '50', '52', '54', '56', '58', '60'];
const COLOR_PRESETS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Navy', hex: '#1a2238' },
  { name: 'Beige', hex: '#d9c5a0' },
  { name: 'Maroon', hex: '#6b1f2a' },
  { name: 'Olive', hex: '#5b6f3a' },
  { name: 'Grey', hex: '#8a8a8a' },
  { name: 'Brown', hex: '#5a3a22' },
  { name: 'White', hex: '#f5f1ea' },
];

// Stored format for color: "Name:#hex" — backwards compatible (plain "Name" still works)
const parseColor = (raw: string): { name: string; hex?: string } => {
  const [name, hex] = raw.split(':');
  return { name: name.trim(), hex: hex?.trim() };
};

export const VariantManager = ({ type, values, onChange }: VariantManagerProps) => {
  const [input, setInput] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  const add = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (values.some(v => v.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...values, trimmed]);
  };

  const remove = (val: string) => {
    onChange(values.filter(v => v !== val));
  };

  const handleAddCustom = () => {
    if (!input.trim()) return;
    if (type === 'color') {
      add(`${input.trim()}:${colorHex}`);
    } else {
      add(input.trim());
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md border border-border">
          {values.map(val => {
            if (type === 'color') {
              const { name, hex } = parseColor(val);
              return (
                <Badge
                  key={val}
                  variant="secondary"
                  className="gap-2 pl-1.5 pr-1 py-1 text-xs"
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: hex || '#ccc' }}
                  />
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => remove(val)}
                    className="hover:bg-destructive/20 rounded-sm p-0.5"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }
            return (
              <Badge key={val} variant="secondary" className="gap-1.5 pr-1 py-1 text-xs">
                {val}
                <button
                  type="button"
                  onClick={() => remove(val)}
                  className="hover:bg-destructive/20 rounded-sm p-0.5"
                  aria-label={`Remove ${val}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Presets */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick add</p>
        <div className="flex flex-wrap gap-1.5">
          {type === 'size'
            ? SIZE_PRESETS.map(s => {
                const active = values.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => (active ? remove(s) : add(s))}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-md border transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    )}
                  >
                    {s}
                  </button>
                );
              })
            : COLOR_PRESETS.map(c => {
                const stored = `${c.name}:${c.hex}`;
                const active = values.some(v => parseColor(v).name.toLowerCase() === c.name.toLowerCase());
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => (active ? remove(values.find(v => parseColor(v).name.toLowerCase() === c.name.toLowerCase())!) : add(stored))}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border transition-colors',
                      active ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:bg-muted'
                    )}
                  >
                    <span
                      className="inline-block w-3.5 h-3.5 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                );
              })}
        </div>
      </div>

      {/* Custom add */}
      <div className="flex gap-2 items-center">
        {type === 'color' && (
          <input
            type="color"
            value={colorHex}
            onChange={e => setColorHex(e.target.value)}
            className="h-10 w-12 rounded-md border border-border cursor-pointer bg-background shrink-0"
            aria-label="Pick color"
          />
        )}
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={type === 'size' ? 'Custom size (e.g. 62)' : 'Color name (e.g. Sand)'}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAddCustom} className="gap-1 shrink-0">
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
};
