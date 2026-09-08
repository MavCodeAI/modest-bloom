import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Store,
  Calculator,
  Boxes,
  Users,
  Building2,
  BarChart3,
  Receipt,
  Scale,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import { cn } from '@/lib/utils';

export type AdminTab =
  | 'dashboard'
  | 'accounting'
  | 'pos_terminal'
  | 'inventory_valuation'
  | 'customer_khata'
  | 'suppliers_payables'
  | 'financial_reports'
  | 'products'
  | 'quotes'
  | 'orders'
  | 'ai_assistant';

const accountingItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; badge?: string }> = [
  { id: 'pos_terminal', label: 'POS Terminal', icon: Store, badge: 'Live' },
  { id: 'accounting', label: 'Business & Accounting', icon: Calculator },
  { id: 'inventory_valuation', label: 'Inventory & Stock', icon: Boxes },
  { id: 'customer_khata', label: 'Customer Khata', icon: Users },
  { id: 'suppliers_payables', label: 'Suppliers & Vendors', icon: Building2 },
  { id: 'financial_reports', label: 'Financial Reports & P&L', icon: BarChart3 },
];

const storeItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; badge?: string }> = [
  { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Online Products', icon: Package },
  { id: 'orders', label: 'Web Orders', icon: ShoppingBag },
  { id: 'quotes', label: 'Wholesale Quotes', icon: FileText },
  { id: 'ai_assistant', label: 'AI Assistant & Concierge', icon: Bot, badge: 'Mock' },
];

interface AdminSidebarProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export function AdminSidebar({ active, onChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className={cn('flex items-center gap-2 px-2 py-3', collapsed && 'justify-center px-0')}>
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-serif text-sm flex-shrink-0 font-bold shadow-sm">
            M
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-serif text-sm leading-tight truncate font-bold">Modest Way</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accounting & Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Accounting & POS Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Accounting & POS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountingItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onChange(item.id)}
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        'transition-colors text-xs',
                        isActive && 'bg-primary/10 text-primary font-medium hover:bg-primary/15'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && !collapsed && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* E-Commerce Operations Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Online Store
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storeItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onChange(item.id)}
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        'transition-colors text-xs',
                        isActive && 'bg-primary/10 text-primary font-medium hover:bg-primary/15'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && !collapsed && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/')}
                  tooltip="View store"
                  className="text-xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Storefront</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Logout"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
