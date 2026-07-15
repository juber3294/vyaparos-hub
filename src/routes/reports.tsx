import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Btn } from "@/components/app-shell";
import { FileBarChart, Download, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlySales, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — VyaparOS" },
      { name: "description", content: "GST, sales, purchase & profit reports." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { title: "Sales Report", desc: "Item-wise, party-wise, day-wise" },
  { title: "Purchase Report", desc: "Supplier wise inward with GST" },
  { title: "GST Report", desc: "GSTR-1, GSTR-3B, HSN summary" },
  { title: "Profit Report", desc: "Gross & net margin by month" },
  { title: "Inventory Report", desc: "Stock value, ageing, movement" },
  { title: "Customer Report", desc: "Ledger, ageing, top buyers" },
  { title: "Supplier Report", desc: "Payables, ageing, PO status" },
  { title: "Cash & Bank", desc: "Day book, bank reconciliation" },
];

function ReportsPage() {
  return (
    <AppShell
      title="Reports"
      subtitle="One-click statutory & business reports"
      actions={
        <Btn>
          <Download className="h-4 w-4" /> Export All
        </Btn>
      }
    >
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Monthly Sales & Purchase</div>
            <div className="text-xs text-muted-foreground">FY 2026-27</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="m" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${v / 100000}L`} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }}
              formatter={(value: number) => inr(value)}
            />
            <Bar dataKey="sales" fill="#2563EB" radius={[8, 8, 0, 0]} />
            <Bar dataKey="purchase" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {reports.map((r) => (
          <Card key={r.title} className="p-5 hover:-translate-y-0.5 transition cursor-pointer">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            <div className="mt-4 text-xs text-primary font-semibold inline-flex items-center gap-1">
              View report <ChevronRight className="h-3 w-3" />
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
