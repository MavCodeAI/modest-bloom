import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
              <ChevronRight size={14} className="opacity-50" />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-primary transition-colors truncate max-w-[160px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'truncate max-w-[200px]',
                    isLast && 'text-foreground font-medium'
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
