import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { Plus, Truck, Wallet, PackageCheck } from "lucide-react";
import { suppliers, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — VyaparOS" },
      { name: "description", content: "Supplier ledger and purchase history." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <AppShell
      title="Suppliers"
      subtitle="Ledger, purchase history & payments"
      actions={
        <Btn>
          <Plus className="h-4 w-4" /> Add Supplier
        </Btn>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Suppliers"
          value={String(suppliers.length)}
          icon={Truck}
          tone="primary"
        />
        <StatCard
          label="Payables"
          value={inr(suppliers.reduce((s, x) => s + x.outstanding, 0))}
          icon={Wallet}
          tone="warning"
        />
        <StatCard
          label="FY Purchase"
          value={inr(suppliers.reduce((s, x) => s + x.totalPurchase, 0))}
          icon={PackageCheck}
          tone="info"
        />
        <StatCard label="On-Time Rate" value="94.2%" icon={PackageCheck} tone="success" />
      </div>
      <TableToolbar placeholder="Search supplier, GSTIN…" />
      <DataTable
        rows={suppliers}
        columns={[
          {
            key: "name",
            label: "Supplier",
            render: (s) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/10 text-secondary text-xs font-bold">
                  {s.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.phone}</div>
                </div>
              </div>
            ),
          },
          { key: "city", label: "City" },
          {
            key: "gstin",
            label: "GSTIN",
            render: (s) => <span className="font-mono text-[11px]">{s.gstin}</span>,
          },
          { key: "totalPurchase", label: "FY Purchase", render: (s) => inr(s.totalPurchase) },
          {
            key: "outstanding",
            label: "Outstanding",
            render: (s) => (
              <span
                className={`font-semibold ${s.outstanding > 200000 ? "text-destructive" : "text-warning"}`}
              >
                {inr(s.outstanding)}
              </span>
            ),
          },
          { key: "status", label: "Status", render: () => <Badge tone="success">Active</Badge> },
        ]}
      />
    </AppShell>
  );
}
