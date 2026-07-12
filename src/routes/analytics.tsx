import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, StatCard, Badge } from "@/components/app-shell";
import { TrendingUp, Percent, PackageX, Zap, Layers, Star } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadialBar, RadialBarChart } from "recharts";
import { monthlySales, categoryMix, products, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — VyaparOS" }, { name: "description", content: "Business growth, margin & product analytics." }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const growth = monthlySales.map(m => ({ m: m.m, growth: Math.round(((m.sales - m.purchase) / m.sales) * 100) }));
  const dead = products.filter(p => p.stock > 150).slice(0, 5);
  const fast = products.slice(0, 5);

  return (
    <AppShell title="Analytics" subtitle="Understand what's really happening in your business">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Business Growth" value="+18.4%" icon={TrendingUp} tone="success" delta="6-mo CAGR" />
        <StatCard label="Profit Margin" value="19.8%" icon={Percent} tone="primary" delta="▲ 1.2pp MoM" />
        <StatCard label="Dead Stock" value={inr(184000)} icon={PackageX} tone="destructive" delta="12 SKUs" />
        <StatCard label="Fast Movers" value="16 SKUs" icon={Zap} tone="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <div className="text-sm font-semibold mb-1">Gross Margin Trend</div>
          <div className="text-xs text-muted-foreground mb-3">Monthly gross margin %</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="m" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} />
              <Line type="monotone" dataKey="growth" stroke="#2563EB" strokeWidth={3} dot={{ r: 5, fill: "#2563EB" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-semibold mb-3">Business Health Score</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "score", value: 82, fill: "#2563EB" }]} startAngle={220} endAngle={-40}>
              <RadialBar background dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-24 text-center">
            <div className="font-display text-4xl font-bold">82</div>
            <div className="text-xs text-muted-foreground">Excellent</div>
          </div>
          <div className="mt-16 space-y-2 text-xs">
            {[["Liquidity","Strong","success"],["Receivables ageing","Watch","warning"],["Inventory turn","Healthy","success"]].map(([k,v,t]) => (
              <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><Badge tone={t as any}>{v}</Badge></div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3"><Layers className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">Top Categories</span></div>
          <ul className="space-y-2">
            {categoryMix.map(c => (
              <li key={c.name}>
                <div className="flex justify-between text-xs mb-1"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">{c.value}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${c.value * 2.5}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-warning" /><span className="text-sm font-semibold">Fast-Moving Products</span></div>
          <ul className="space-y-2 text-sm">
            {fast.map(p => (
              <li key={p.id} className="flex items-center justify-between border-b border-border last:border-0 py-2">
                <span className="truncate">{p.name}</span><Badge tone="success">▲ 240</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3"><Star className="h-4 w-4 text-success" /><span className="text-sm font-semibold">Most Profitable Products</span></div>
          <ul className="space-y-2 text-sm">
            {products.slice(2, 7).map(p => (
              <li key={p.id} className="flex items-center justify-between border-b border-border last:border-0 py-2">
                <span className="truncate">{p.name}</span>
                <span className="font-semibold text-success">
                  {Math.round(((p.sellingPrice - p.purchasePrice)/p.sellingPrice)*100)}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-3"><PackageX className="h-4 w-4 text-destructive" /><span className="text-sm font-semibold">Dead Stock — no movement in 90 days</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {dead.map(p => (
            <div key={p.id} className="rounded-xl border border-border p-3">
              <div className="text-sm font-semibold truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.stock} units · {inr(p.stock * p.purchasePrice)} blocked</div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
