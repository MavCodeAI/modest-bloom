import { useState, useMemo } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import {
  Search,
  History,
  ShieldCheck,
  User,
  Clock,
  Filter,
  Layers
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AuditTrailModule() {
  const { auditLogs } = useAccounting();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.recordId.toLowerCase().includes(q);

      const matchesModule = selectedModule === 'all' || log.module.toLowerCase().includes(selectedModule.toLowerCase());

      return matchesSearch && matchesModule;
    });
  }, [auditLogs, searchQuery, selectedModule]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <Card className="p-4 bg-card border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-foreground">
              Immutable Accounting Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Cryptographically ordered activity trail of all sales, voids, payments, stock changes, and drawer shifts.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {auditLogs.length} Events Logged
        </Badge>
      </Card>

      {/* Main Table Card */}
      <Card className="border bg-card">
        <div className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit trail by keyword, user, or record ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="Sales">POS & Sales</SelectItem>
              <SelectItem value="Purchases">Purchases & Bills</SelectItem>
              <SelectItem value="Customers">Customers Khata</SelectItem>
              <SelectItem value="Suppliers">Suppliers</SelectItem>
              <SelectItem value="Inventory">Inventory Stock</SelectItem>
              <SelectItem value="Expenses">Expenses</SelectItem>
              <SelectItem value="Cash Register">Cash Register</SelectItem>
              <SelectItem value="Settings">System Settings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action Code</th>
                <th className="p-3">Module</th>
                <th className="p-3">Event Details</th>
                <th className="p-3">Staff / User</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3 font-mono font-semibold text-primary">
                    {log.action}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px]">
                      {log.module}
                    </Badge>
                  </td>
                  <td className="p-3 text-foreground font-medium">
                    {log.details}
                  </td>
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{log.user}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No audit records match the filter criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
