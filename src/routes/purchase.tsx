import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { Plus, PackagePlus, IndianRupee, Truck, Boxes } from "lucide-react";
import { suppliers, products, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/purchase")({
  head: () => ({ meta: [{ title: "Purchase — VyaparOS" }, { name: "description", content: "Record supplier purchases with GST." }] }),
  component: PurchasePage,
});

function PurchasePage() {
  const rows = suppliers.slice(0, 10).map((s, i) => {
    const amt = 40000 + i * 12000;
    return { id: s.id, po: `PO/2026/${1201 + i}`, supplier: s.name, date: `2026-07-${String(2 + i).padStart(2,"0")}`,
      items: 5 + (i % 6), amt, gst: Math.round(amt * 0.18), status: i % 3 === 0 ? "Received" : i % 3 === 1 ? "Partial" : "Pending" };
  });

  const preview = products.slice(4, 9).map(p => ({ ...p, qty: 20 + Math.floor(Math.random()*30) }));
  const sub = preview.reduce((s,p) => s + p.purchasePrice * p.qty, 0);
  const expenses = 2500;
  const gst = Math.round(sub * 0.18);
  const total = sub + expenses + gst;

  return (
    <AppShell
      title="Purchase"
      subtitle="Record inward stock, GST, and supplier bills."
      actions={<Btn><Plus className="h-4 w-4" /> New Purchase Entry</Btn>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="This Month" value={inr(1150000)} icon={IndianRupee} tone="primary" />
        <StatCard label="Suppliers Active" value="15" icon={Truck} tone="info" />
        <StatCard label="POs Open" value="24" icon={PackagePlus} tone="warning" />
        <StatCard label="Items Received" value="1,284" icon={Boxes} tone="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Purchase Entry</div>
              <div className="font-display text-xl font-bold">PO/2026/1225</div>
            </div>
            <Badge tone="info">Draft</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Supplier">{suppliers[3].name}</Field>
            <Field label="Supplier Invoice #">SI-88421/2026</Field>
            <Field label="GSTIN">{suppliers[3].gstin}</Field>
            <Field label="Invoice Date">10 Jul 2026</Field>
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
                {preview.map(it => (
                  <tr key={it.id} className="border-b border-border">
                    <td className="py-3 font-medium">{it.name}</td>
                    <td className="text-muted-foreground">{it.hsn}</td>
                    <td className="text-right">{it.qty}</td>
                    <td className="text-right">{inr(it.purchasePrice)}</td>
                    <td className="text-right">{it.gst}%</td>
                    <td className="text-right font-semibold">{inr(it.purchasePrice * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl border border-border p-4 text-sm space-y-2 max-w-sm ml-auto">
            <Row label="Subtotal" value={inr(sub)} />
            <Row label="Freight & Expenses" value={inr(expenses)} />
            <Row label="GST @ 18%" value={inr(gst)} />
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="font-display font-bold">Grand Total</span>
              <span className="font-display text-lg font-bold text-primary">{inr(total)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold mb-4">Top Suppliers</div>
          <ul className="space-y-3">
            {suppliers.slice(0, 6).map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/10 text-secondary text-xs font-bold">
                  {s.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.city}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{inr(s.totalPurchase)}</div>
                  <div className="text-[10px] text-muted-foreground">FY total</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold mb-3">Purchase Orders</h2>
        <TableToolbar />
        <DataTable
          rows={rows}
          columns={[
            { key: "po", label: "PO #", render: (r) => <span className="font-mono text-xs">{r.po}</span> },
            { key: "supplier", label: "Supplier" },
            { key: "date", label: "Date" },
            { key: "items", label: "Items" },
            { key: "amt", label: "Amount", render: (r) => inr(r.amt) },
            { key: "gst", label: "GST", render: (r) => inr(r.gst) },
            { key: "status", label: "Status", render: (r) => (
              <Badge tone={r.status === "Received" ? "success" : r.status === "Partial" ? "warning" : "info"}>{r.status}</Badge>
            ) },
          ]}
        />
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <div className="text-[10px] uppercase text-muted-foreground tracking-wide">{label}</div>
      <div className="mt-1 text-sm font-medium">{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>);
}
