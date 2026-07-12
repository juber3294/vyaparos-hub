import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { UserPlus, Users, Wallet, CreditCard } from "lucide-react";
import { customers, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — VyaparOS" }, { name: "description", content: "Customer ledger, credit limits, GSTIN." }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const outstanding = customers.reduce((s, c) => s + c.outstanding, 0);
  return (
    <AppShell title="Customers" subtitle="Ledger, credit & GST details" actions={<Btn><UserPlus className="h-4 w-4" /> Add Customer</Btn>}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Customers" value={String(customers.length)} icon={Users} tone="primary" />
        <StatCard label="Total Outstanding" value={inr(outstanding)} icon={Wallet} tone="destructive" />
        <StatCard label="Credit Extended" value={inr(customers.reduce((s,c)=>s+c.creditLimit,0))} icon={CreditCard} tone="info" />
        <StatCard label="Avg Ticket" value={inr(13400)} icon={Wallet} tone="success" />
      </div>
      <TableToolbar placeholder="Search customer, GSTIN, phone…" />
      <DataTable
        rows={customers}
        columns={[
          { key: "name", label: "Customer", render: (c) => (
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-xs font-bold">
                {c.name.split(" ").map((w:string)=>w[0]).slice(0,2).join("")}
              </div>
              <div><div className="font-medium">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.phone}</div></div>
            </div>
          )},
          { key: "city", label: "City" },
          { key: "gstin", label: "GSTIN / PAN", render: (c) => (
            <div className="font-mono text-[11px]"><div>{c.gstin}</div><div className="text-muted-foreground">{c.pan}</div></div>
          )},
          { key: "creditLimit", label: "Credit Limit", render: (c) => inr(c.creditLimit) },
          { key: "outstanding", label: "Outstanding", render: (c) => (
            <span className={`font-semibold ${c.outstanding > 100000 ? "text-destructive" : c.outstanding > 0 ? "text-warning" : "text-success"}`}>{inr(c.outstanding)}</span>
          )},
          { key: "status", label: "Status", render: (c) => (
            <Badge tone={c.outstanding === 0 ? "success" : c.outstanding > c.creditLimit * 0.7 ? "destructive" : "info"}>
              {c.outstanding === 0 ? "Cleared" : c.outstanding > c.creditLimit * 0.7 ? "Risk" : "Active"}
            </Badge>
          )},
        ]}
      />
    </AppShell>
  );
}
