import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { Plus, Package, AlertTriangle, Warehouse, Boxes } from "lucide-react";
import { products, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — VyaparOS" }, { name: "description", content: "Product master with GST, HSN & stock." }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const totalValue = products.reduce((s, p) => s + p.purchasePrice * p.stock, 0);
  const low = products.filter(p => p.stock < 30).length;

  return (
    <AppShell title="Inventory" subtitle="44 SKUs across 3 warehouses" actions={<Btn><Plus className="h-4 w-4" /> Add Product</Btn>}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Products" value={String(products.length)} icon={Package} tone="primary" />
        <StatCard label="Inventory Value" value={inr(totalValue)} icon={Boxes} tone="success" />
        <StatCard label="Low Stock" value={String(low)} icon={AlertTriangle} tone="warning" />
        <StatCard label="Warehouses" value="3" icon={Warehouse} tone="info" />
      </div>

      <TableToolbar placeholder="Search SKU, name, barcode…" />
      <DataTable
        rows={products}
        columns={[
          { key: "name", label: "Product", render: (p) => (
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">{p.brand} · {p.category}</div>
            </div>
          )},
          { key: "sku", label: "SKU / HSN", render: (p) => (
            <div className="font-mono text-xs">
              <div>{p.sku}</div>
              <div className="text-muted-foreground">HSN {p.hsn}</div>
            </div>
          )},
          { key: "gst", label: "GST", render: (p) => <Badge tone="info">{p.gst}%</Badge> },
          { key: "purchasePrice", label: "Purchase", render: (p) => inr(p.purchasePrice) },
          { key: "sellingPrice", label: "Selling", render: (p) => <span className="font-semibold">{inr(p.sellingPrice)}</span> },
          { key: "stock", label: "Stock", render: (p) => (
            <span className={`font-semibold ${p.stock < p.minStock ? "text-destructive" : p.stock < 30 ? "text-warning" : "text-success"}`}>
              {p.stock}
            </span>
          )},
          { key: "warehouse", label: "Warehouse", render: (p) => <Badge>{p.warehouse}</Badge> },
        ]}
      />
    </AppShell>
  );
}
