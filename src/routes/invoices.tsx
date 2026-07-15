import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { Plus, FileText, Wallet, AlertCircle } from "lucide-react";
import { invoices, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — VyaparOS" },
      { name: "description", content: "All invoices with GST and payment status." },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const total = invoices.reduce((s, i) => s + i.total, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.total, 0);
  return (
    <AppShell
      title="Invoices"
      subtitle="Every invoice, one place"
      actions={
        <Btn>
          <Plus className="h-4 w-4" /> New Invoice
        </Btn>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Invoiced (MTD)" value={inr(total)} icon={FileText} tone="primary" />
        <StatCard label="Pending" value={inr(pending)} icon={Wallet} tone="warning" />
        <StatCard label="Overdue" value={inr(overdue)} icon={AlertCircle} tone="destructive" />
        <StatCard label="Paid" value={inr(total - pending)} icon={Wallet} tone="success" />
      </div>
      <TableToolbar placeholder="Search invoice #, customer…" />
      <DataTable
        rows={invoices}
        columns={[
          {
            key: "number",
            label: "Invoice #",
            render: (r) => <span className="font-mono text-xs">{r.number}</span>,
          },
          {
            key: "customerName",
            label: "Customer",
            render: (r) => <span className="font-medium">{r.customerName}</span>,
          },
          { key: "date", label: "Date" },
          { key: "items", label: "Items" },
          { key: "amount", label: "Taxable", render: (r) => inr(r.amount) },
          { key: "gst", label: "GST", render: (r) => inr(r.gst) },
          {
            key: "total",
            label: "Total",
            render: (r) => <span className="font-semibold">{inr(r.total)}</span>,
          },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge
                tone={
                  r.status === "Paid"
                    ? "success"
                    : r.status === "Overdue"
                      ? "destructive"
                      : r.status === "Partial"
                        ? "warning"
                        : "info"
                }
              >
                {r.status}
              </Badge>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
