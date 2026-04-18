import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AdminSidebar, AdminTab } from './AdminSidebar';

interface AdminLayoutProps {
  active: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onRefresh?: () => void;
  children: ReactNode;
}

export function AdminLayout({
  active,
  onTabChange,
  title,
  subtitle,
  actions,
  onRefresh,
  children,
}: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar active={active} onChange={onTabChange} />

        <SidebarInset className="flex flex-col min-w-0">
          {/* Sticky header */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-background/95 backdrop-blur-md">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-base sm:text-lg leading-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="gap-2"
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              )}
              {actions}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
