import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useStore } from '@/hooks/useStore';

interface SearchBarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchBar({ isOpen, onOpenChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const { products } = useStore();
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const lowerValue = searchValue.toLowerCase();
    const uniqueNames = new Set(
      products
        .filter(p => p.name.toLowerCase().includes(lowerValue))
        .map(p => p.name)
    );
    return Array.from(uniqueNames).slice(0, 5);
  }, [products, searchValue]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
      setSearchValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="p-2 text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((name) => (
                <CommandItem
                  key={name}
                  onSelect={() => handleSearch(name)}
                >
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}