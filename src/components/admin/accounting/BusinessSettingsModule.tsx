import { useState } from 'react';
import { useAccounting } from '@/contexts/AccountingContext';
import { BusinessSettings } from '@/types/accounting';
import {
  Building2,
  FileText,
  Save,
  Download,
  Upload,
  RefreshCw,
  Printer,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export function BusinessSettingsModule() {
  const { settings, updateSettings, sales, purchases, inventory, customers, suppliers, expenses } = useAccounting();

  const [form, setForm] = useState<BusinessSettings>(settings);

  const handleSave = () => {
    updateSettings(form);
  };

  const handleExportFullBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      business: form,
      sales,
      purchases,
      inventory,
      customers,
      suppliers,
      expenses,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ModestWay_Accounting_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Full financial database backup downloaded');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Legal Entity & Tax Info */}
      <Card className="p-5 bg-card border space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Company & Tax Profile (Federal Tax Authority UAE)
          </h3>
          <p className="text-xs text-muted-foreground">
            Official business entity name and TRN printed on all legal tax invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <Label className="text-xs">Trading Brand Name</Label>
            <Input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Legal Registered Entity Name</Label>
            <Input
              value={form.legalName}
              onChange={(e) => setForm({ ...form, legalName: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">TRN (Tax Registration Number) *</Label>
            <Input
              value={form.trn}
              onChange={(e) => setForm({ ...form, trn: e.target.value })}
              className="mt-1 h-9 text-xs font-mono font-semibold"
            />
          </div>

          <div>
            <Label className="text-xs">Business Phone / WhatsApp</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Official Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">City & Emirate</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs">Showroom & Headquarters Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* 2. Tax & VAT Configuration */}
      <Card className="p-5 bg-card border space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            VAT & Sales Policy
          </h3>
          <p className="text-xs text-muted-foreground">
            Configure default VAT rate and invoice numbering rules.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
            <div>
              <p className="font-semibold text-foreground">Apply UAE VAT on Invoices</p>
              <p className="text-muted-foreground text-[11px]">Enables 5% VAT calculation on POS and Sales invoices.</p>
            </div>
            <Switch
              checked={form.enableVat}
              onCheckedChange={(checked) => setForm({ ...form, enableVat: checked })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Default VAT Rate (%)</Label>
              <Input
                type="number"
                value={form.defaultVatRate}
                onChange={(e) => setForm({ ...form, defaultVatRate: parseFloat(e.target.value) || 0 })}
                className="mt-1 h-9 text-xs font-bold"
              />
            </div>

            <div>
              <Label className="text-xs">Base Currency</Label>
              <Input
                value={form.currency}
                disabled
                className="mt-1 h-9 text-xs bg-muted font-bold"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Thermal Receipt Customization */}
      <Card className="p-5 bg-card border space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
            <Printer className="w-4 h-4 text-primary" />
            POS Thermal Receipt & A4 Template
          </h3>
          <p className="text-xs text-muted-foreground">
            Customize header greeting, footer return policies, and terms.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <Label className="text-xs">Receipt Header Subtext</Label>
            <Input
              value={form.receiptHeader}
              onChange={(e) => setForm({ ...form, receiptHeader: e.target.value })}
              className="mt-1 h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Receipt Footer Return Policy</Label>
            <Textarea
              value={form.receiptFooter}
              onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
              rows={3}
              className="mt-1 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">A4 Tax Invoice Terms & Conditions</Label>
            <Textarea
              value={form.termsAndConditions}
              onChange={(e) => setForm({ ...form, termsAndConditions: e.target.value })}
              rows={2}
              className="mt-1 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* 4. Data Backup & Export */}
      <Card className="p-5 bg-card border space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Data Archiving & Portability
          </h3>
          <p className="text-xs text-muted-foreground">
            Download your entire financial ledger, inventory catalog, customer khatas, and suppliers.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-xs text-foreground">Export Complete JSON Database</p>
            <p className="text-[11px] text-muted-foreground">Creates a snapshot of all sales, payments, and stock movements.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportFullBackup} className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download Backup
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 px-6 shadow-md">
          <Save className="w-4 h-4" />
          Save Business Profile & Settings
        </Button>
      </div>
    </div>
  );
}
