import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Btn, Badge, DataTable, StatCard } from "@/components/app-shell";
import { Plus, Wallet, ArrowDownLeft, ArrowUpRight, IndianRupee } from "lucide-react";
import { customers, suppliers, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — VyaparOS" }, { name: "description", content: "Received & paid entries with UPI/NEFT." }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const methods = ["UPI","NEFT","Cheque","Cash","RTGS"];
  const received = customers.slice(0, 8).map((c, i) => ({
    id: `RCPT-${9001+i}`, party: c.name, mode: methods[i % methods.length],
    ref: `TXN${Math.floor(100000 + Math.random()*899999)}`, amount: 20000 + i*15000,
    date: `2026-07-${String(2+i).padStart(2,"0")}`, type: "IN",
  }));
  const paid = suppliers.slice(0, 6).map((s, i) => ({
    id: `PAY-${9101+i}`, party: s.name, mode: methods[(i+2) % methods.length],
    ref: `NEFT${Math.floor(100000 + Math.random()*899999)}`, amount: 45000 + i*22000,
    date: `2026-07-${String(3+i).padStart(2,"0")}`, type: "OUT",
  }));
  const rows = [...received, ...paid].sort((a,b) => a.date < b.date ? 1 : -1);

  return (
    <AppShell title="Payments" subtitle="All money in and out" actions={<Btn><Plus className="h-4 w-4" /> Record Payment</Btn>}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Cash Inflow (MTD)" value={inr(2842000)} icon={ArrowDownLeft} tone="success" />
        <StatCard label="Cash Outflow (MTD)" value={inr(1650000)} icon={ArrowUpRight} tone="destructive" />
        <StatCard label="Cash on Hand" value={inr(1192000)} icon={Wallet} tone="primary" />
        <StatCard label="UPI Volume" value={inr(984200)} icon={IndianRupee} tone="info" />
      </div>

      <Card className="p-5 mb-6 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase opacity-90">Bank Balance</div>
            <div className="font-display text-3xl font-bold mt-1">{inr(4820500)}</div>
            <div className="text-xs opacity-80 mt-1">HDFC Bank ••••4321 · Auto-reconciled</div>
          </div>
          <Btn variant="outline" className="!bg-white/15 !text-white !border-white/25 hover:!bg-white/25">Sync now</Btn>
        </div>
      </Card>

      <DataTable
        rows={rows}
        columns={[
          { key: "date", label: "Date" },
          { key: "id", label: "Ref #", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: "party", label: "Party", render: (r) => <span className="font-medium">{r.party}</span> },
          { key: "mode", label: "Mode", render: (r) => <Badge tone="info">{r.mode}</Badge> },
          { key: "ref", label: "Txn Ref", render: (r) => <span className="font-mono text-[11px] text-muted-foreground">{r.ref}</span> },
          { key: "type", label: "Type", render: (r) => (
            <Badge tone={r.type === "IN" ? "success" : "destructive"}>{r.type === "IN" ? "Received" : "Paid"}</Badge>
          )},
          { key: "amount", label: "Amount", className: "text-right", render: (r) => (
            <span className={`font-semibold ${r.type === "IN" ? "text-success" : "text-destructive"}`}>
              {r.type === "IN" ? "+" : "−"} {inr(r.amount)}
            </span>
          )},
        ]}
      />
    </AppShell>
  );
}
