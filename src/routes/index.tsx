import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, StatCard, Btn, Badge } from "@/components/app-shell";
import {
  IndianRupee, ShoppingBag, ArrowDownRight, Wallet, Users, Truck, Package,
  TrendingUp, Plus, FileText, UserPlus, PackagePlus, AlertTriangle,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { monthlySales, topCustomers, topProducts, categoryMix, products, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VyaparOS — Smart Business OS for Wholesale & Retail" },
      { name: "description", content: "Cloud ERP for Indian wholesale & retail: billing, GST, inventory, AI insights." },
      { property: "og:title", content: "VyaparOS — Smart Business OS" },
      { property: "og:description", content: "Modern ERP for Indian businesses with AI-powered insights." },
    ],
  }),
  component: Dashboard,
});

const chartColors = ["#2563EB", "#0EA5E9", "#16A34A", "#F59E0B", "#DC2626", "#8B5CF6"];

function Dashboard() {
  const lowStock = products.filter(p => p.stock < 30).slice(0, 5);
  return (
    <AppShell
      title="Dashboard"
      subtitle="Real-time business snapshot for Sharma Traders."
      actions={
        <>
          <Btn variant="outline"><FileText className="h-4 w-4" /> Export</Btn>
          <Btn><Plus className="h-4 w-4" /> Create Invoice</Btn>
        </>
      }
    >
      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Today's Sales" value={inr(184500)} delta="▲ 12.4% vs yesterday" icon={IndianRupee} tone="primary" />
        <StatCard label="Monthly Sales" value={inr(1720000)} delta="▲ 8.9% MoM" icon={ShoppingBag} tone="info" />
        <StatCard label="Monthly Purchase" value={inr(1150000)} delta="▲ 4.1% MoM" icon={ArrowDownRight} tone="warning" />
        <StatCard label="Net Profit" value={inr(342000)} delta="▲ 15.2% MoM" icon={TrendingUp} tone="success" />
        <StatCard label="Receivables" value={inr(1284500)} icon={Wallet} tone="destructive" />
        <StatCard label="Payables" value={inr(864200)} icon={Wallet} tone="warning" />
        <StatCard label="Customers" value="248" delta="+12 this month" icon={Users} tone="info" />
        <StatCard label="Products / Suppliers" value="44 · 15" icon={Package} tone="primary" />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Sales vs Purchase</div>
              <div className="text-xs text-muted-foreground">Last 6 months</div>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge tone="primary">● Sales</Badge>
              <Badge tone="info">● Purchase</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="m" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${v/100000}L`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} formatter={(v: any) => inr(v)} />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fill="url(#gSales)" />
              <Area type="monotone" dataKey="purchase" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#gPur)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-2 text-sm font-semibold">Category Mix</div>
          <div className="text-xs text-muted-foreground mb-2">Share of sales</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryMix} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {categoryMix.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categoryMix.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors[i % chartColors.length] }} />
                <span className="truncate">{c.name}</span>
                <span className="ml-auto text-muted-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="mb-4 text-sm font-semibold">Top Selling Products</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={110} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} />
              <Bar dataKey="sold" fill="#2563EB" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-4 text-sm font-semibold">Top Customers</div>
          <ul className="space-y-3">
            {topCustomers.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-xs font-bold">
                  {c.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Rank #{i+1}</div>
                </div>
                <div className="text-sm font-semibold">{inr(c.value)}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold">Low Stock Alerts</span>
          </div>
          <ul className="space-y-3">
            {lowStock.map(p => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-warning/15 text-warning text-xs font-bold">
                  {p.stock}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Min {p.minStock} · {p.warehouse}</div>
                </div>
                <Badge tone="warning">Reorder</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <div className="text-sm font-semibold mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Create Invoice", tone: "bg-primary/10 text-primary" },
            { icon: PackagePlus, label: "Create Purchase", tone: "bg-secondary/10 text-secondary" },
            { icon: Package, label: "Add Product", tone: "bg-success/10 text-success" },
            { icon: UserPlus, label: "Add Customer", tone: "bg-warning/15 text-warning" },
          ].map(a => (
            <Card key={a.label} className="p-5 hover:-translate-y-0.5 transition cursor-pointer">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.tone}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">{a.label}</div>
              <div className="text-xs text-muted-foreground">One-click shortcut</div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
