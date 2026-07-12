import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { Plus, Printer, Download, MessageCircle, IndianRupee, TrendingUp, Receipt } from "lucide-react";
import { invoices, inr, customers, products } from "@/lib/demo-data";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales — VyaparOS" }, { name: "description", content: "Create GST invoices and manage sales." }] }),
  component: SalesPage,
});

function SalesPage() {
  const preview = {
    number: "VYP/2026-27/1033",
    customer: customers[0],
    items: products.slice(0, 4).map(p => ({ ...p, qty: Math.ceil(Math.random()*5)+1 })),
  };
  const subtotal = preview.items.reduce((s, it) => s + it.sellingPrice * it.qty, 0);
  const discount = 1500;
  const transport = 500;
  const gst = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + transport + gst;

  return (
    <AppShell
      title="Sales"
      subtitle="Create invoices, track payments, share on WhatsApp."
      actions={<><Btn variant="outline"><Receipt className="h-4 w-4" /> Templates</Btn><Btn><Plus className="h-4 w-4" /> New Invoice</Btn></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today" value={inr(184500)} icon={IndianRupee} tone="primary" delta="▲ 12%" />
        <StatCard label="This Month" value={inr(1720000)} icon={TrendingUp} tone="success" delta="▲ 8.9%" />
        <StatCard label="Invoices Raised" value="128" icon={Receipt} tone="info" />
        <StatCard label="Avg Ticket Size" value={inr(13400)} icon={IndianRupee} tone="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Invoice builder preview */}
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Invoice</div>
              <div className="font-display text-xl font-bold">{preview.number}</div>
              <div className="text-xs text-muted-foreground mt-1">Dated 12 Jul 2026 · Place of supply: Maharashtra (27)</div>
            </div>
            <div className="flex gap-2">
              <Btn variant="outline"><Printer className="h-4 w-4" /> Print</Btn>
              <Btn variant="outline"><Download className="h-4 w-4" /> PDF</Btn>
              <Btn variant="success"><MessageCircle className="h-4 w-4" /> WhatsApp</Btn>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">Bill To</div>
              <div className="font-semibold mt-1">{preview.customer.name}</div>
              <div className="text-xs text-muted-foreground">{preview.customer.address}</div>
              <div className="text-xs mt-1"><span className="text-muted-foreground">GSTIN: </span>{preview.customer.gstin}</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">Ship To</div>
              <div className="font-semibold mt-1">{preview.customer.name}</div>
              <div className="text-xs text-muted-foreground">{preview.customer.city} Warehouse</div>
              <div className="text-xs mt-1"><span className="text-muted-foreground">Phone: </span>{preview.customer.phone}</div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                  <th className="py-2">Item</th><th>HSN</th><th className="text-right">Qty</th>
                  <th className="text-right">Rate</th><th className="text-right">GST</th><th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map(it => (
                  <tr key={it.id} className="border-b border-border">
                    <td className="py-3 font-medium">{it.name}</td>
                    <td className="text-muted-foreground">{it.hsn}</td>
                    <td className="text-right">{it.qty}</td>
                    <td className="text-right">{inr(it.sellingPrice)}</td>
                    <td className="text-right">{it.gst}%</td>
                    <td className="text-right font-semibold">{inr(it.sellingPrice * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 text-xs space-y-1">
              <div className="font-semibold text-sm mb-1">Notes</div>
              <div>Goods once sold will not be taken back. E&OE.</div>
              <div>Bank: HDFC 50100XXXX234 · IFSC HDFC0001234</div>
            </div>
            <div className="rounded-xl border border-border p-4 text-sm space-y-2">
              <Row label="Subtotal" value={inr(subtotal)} />
              <Row label="Discount" value={`- ${inr(discount)}`} />
              <Row label="Transport" value={inr(transport)} />
              <Row label="GST @ 18%" value={inr(gst)} />
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="font-display font-bold">Grand Total</span>
                <span className="font-display text-lg font-bold text-primary">{inr(total)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold mb-3">Payment Status</div>
            <div className="grid grid-cols-3 gap-2">
              {["Paid","Partial","Pending"].map((s, i) => (
                <button key={s} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  i===0 ? "border-success bg-success/10 text-success" : "border-border hover:bg-accent"
                }`}>{s}</button>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Received via UPI (rajesh@okhdfc)</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm font-semibold mb-3">GST Summary</div>
            <div className="text-xs space-y-2">
              <Row label="CGST 9%" value={inr(gst/2)} />
              <Row label="SGST 9%" value={inr(gst/2)} />
              <Row label="IGST" value="—" />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold">Recent Invoices</h2>
        </div>
        <TableToolbar placeholder="Search by invoice number, customer…" />
        <DataTable
          rows={invoices.slice(0, 12)}
          columns={[
            { key: "number", label: "Invoice #", render: (r) => <span className="font-mono text-xs">{r.number}</span> },
            { key: "customerName", label: "Customer", render: (r) => <span className="font-medium">{r.customerName}</span> },
            { key: "date", label: "Date" },
            { key: "items", label: "Items" },
            { key: "total", label: "Total", className: "text-right", render: (r) => <span className="font-semibold">{inr(r.total)}</span> },
            { key: "status", label: "Status", render: (r) => (
              <Badge tone={r.status === "Paid" ? "success" : r.status === "Overdue" ? "destructive" : r.status === "Partial" ? "warning" : "info"}>{r.status}</Badge>
            )},
          ]}
        />
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
