import { Check, Clock, Package, Truck, Home, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | string;

interface OrderTimelineProps {
  status: OrderStatus;
  className?: string;
  compact?: boolean;
  showHeader?: boolean;
}

const steps = [
  { key: 'pending', label: 'Pending', icon: Clock, desc: 'Order received' },
  { key: 'confirmed', label: 'Confirmed', icon: Package, desc: 'Being prepared' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'On the way' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Order arrived' },
] as const;

export function OrderTimeline({
  status,
  className,
  compact = false,
  showHeader = true,
}: OrderTimelineProps) {
  const normalized = (status || 'pending').toLowerCase();
  const isCancelled = normalized === 'cancelled';
  const currentIndex = isCancelled
    ? -1
    : Math.max(0, steps.findIndex((s) => s.key === normalized));

  if (isCancelled) {
    return (
      <div
        className={cn(
          'rounded-lg border border-destructive/30 bg-destructive/5 flex items-center gap-3',
          compact ? 'p-3' : 'p-4 sm:p-5',
          className
        )}
      >
        <div
          className={cn(
            'rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0',
            compact ? 'w-7 h-7' : 'w-9 h-9'
          )}
        >
          <X className={cn('text-destructive', compact ? 'w-4 h-4' : 'w-5 h-5')} />
        </div>
        <div>
          <p
            className={cn(
              'font-medium text-destructive',
              compact ? 'text-xs' : 'text-sm sm:text-base'
            )}
          >
            Order Cancelled
          </p>
          {!compact && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              This order has been cancelled. Contact support if you have questions.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Compact: single horizontal stepper, no description text
  if (compact) {
    return (
      <div
        className={cn(
          'rounded-md border border-border bg-muted/30 px-3 py-3',
          className
        )}
      >
        <ol className="flex items-center justify-between relative">
          <div className="absolute top-3 left-3 right-3 h-px bg-border" aria-hidden="true">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${currentIndex === 0 ? 0 : (currentIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
          {steps.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;
            return (
              <li
                key={step.key}
                className="relative flex flex-col items-center text-center flex-1 z-10"
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all bg-background',
                    isComplete && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary ring-2 ring-primary/20',
                    !isComplete && !isCurrent && 'border-border text-muted-foreground'
                  )}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                </div>
                <p
                  className={cn(
                    'mt-1.5 text-[10px] font-medium leading-tight',
                    (isComplete || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-card rounded-lg p-4 sm:p-6 border border-border',
        className
      )}
    >
      {showHeader && (
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-lg sm:text-xl">Order Status</h2>
          <span className="text-xs text-muted-foreground">
            Currently:{' '}
            <span className="text-primary font-medium">{steps[currentIndex].label}</span>
          </span>
        </div>
      )}

      {/* Desktop / tablet: horizontal stepper */}
      <ol className="hidden sm:flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-px bg-border" aria-hidden="true">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${currentIndex === 0 ? 0 : (currentIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <li
              key={step.key}
              className="relative flex flex-col items-center text-center flex-1 z-10"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all bg-background',
                  isComplete && 'bg-primary border-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary ring-4 ring-primary/15',
                  !isComplete && !isCurrent && 'border-border text-muted-foreground'
                )}
              >
                {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <p
                className={cn(
                  'mt-2 text-xs font-medium',
                  (isComplete || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-muted-foreground hidden md:block">{step.desc}</p>
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical stepper */}
      <ol className="sm:hidden space-y-0">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <li key={step.key} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0',
                    isComplete && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary ring-4 ring-primary/15 bg-background',
                    !isComplete && !isCurrent && 'border-border text-muted-foreground bg-background'
                  )}
                >
                  {isComplete ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-px flex-1 my-1 min-h-[24px]',
                      isComplete ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
              <div className={cn('pb-4 flex-1', isLast && 'pb-0')}>
                <p
                  className={cn(
                    'text-sm font-medium leading-tight',
                    (isComplete || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
