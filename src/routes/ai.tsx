import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Badge, Btn } from "@/components/app-shell";
import {
  Sparkles,
  ShoppingCart,
  TrendingUp,
  PackageX,
  Activity,
  ShieldAlert,
  UserSearch,
  Mic,
  MessageCircle,
  Barcode,
  Building2,
  Smartphone,
  Bike,
  Users,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { monthlySales, products, customers, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Center — VyaparOS" },
      {
        name: "description",
        content: "AI-powered forecasting, dead stock detection & credit risk.",
      },
    ],
  }),
  component: AIPage,
});

const aiCards = [
  {
    icon: ShoppingCart,
    tone: "bg-primary/10 text-primary",
    title: "AI Purchase Suggestion",
    desc: "Reorder plan based on velocity, lead-time & festivals.",
    metric: "22 SKUs · ₹4.8L reorder",
  },
  {
    icon: TrendingUp,
    tone: "bg-secondary/10 text-secondary",
    title: "AI Sales Forecast",
    desc: "Next 30-day sales prediction with 92% confidence.",
    metric: "₹18.4L expected",
  },
  {
    icon: PackageX,
    tone: "bg-destructive/10 text-destructive",
    title: "Dead Stock Detection",
    desc: "SKUs with no movement in 90 days blocking capital.",
    metric: "12 SKUs · ₹1.84L",
  },
  {
    icon: Activity,
    tone: "bg-success/10 text-success",
    title: "Business Health Score",
    desc: "Liquidity, ageing, margin & inventory-turn composite.",
    metric: "82 / 100 Excellent",
  },
  {
    icon: ShieldAlert,
    tone: "bg-warning/15 text-warning",
    title: "Credit Risk Score",
    desc: "Party-wise default probability & credit limit advice.",
    metric: "3 parties flagged",
  },
  {
    icon: UserSearch,
    tone: "bg-primary/10 text-primary",
    title: "Customer Buying Pattern",
    desc: "Segments, RFM cohorts & next-best-offer suggestions.",
    metric: "6 segments identified",
  },
];

const futureFeatures = [
  { icon: Mic, title: "Voice Billing", desc: "Dictate invoices in Hindi & English" },
  { icon: MessageCircle, title: "WhatsApp Order", desc: "Customers order via WhatsApp bot" },
  { icon: Barcode, title: "Barcode Scanner", desc: "USB / camera scanner support" },
  { icon: Building2, title: "Multi Store", desc: "Unified view across branches" },
  { icon: Smartphone, title: "Mobile App", desc: "iOS & Android native app" },
  { icon: Bike, title: "Delivery App", desc: "Rider tracking & PoD" },
  { icon: Users, title: "Salesman App", desc: "Field orders & collection" },
];

const forecast = monthlySales.map((m) => ({ ...m, forecast: Math.round(m.sales * 1.12) }));

function AIPage() {
  return (
    <AppShell
      title="AI Center"
      subtitle="Your business, smarter. Intelligence that actually acts."
      actions={
        <Btn>
          <Sparkles className="h-4 w-4" /> Run all insights
        </Btn>
      }
    >
      {/* Hero */}
      <Card className="p-8 bg-gradient-ai text-primary-foreground overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(600px circle at 80% 20%, white, transparent)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <Badge tone="muted">
              <span className="opacity-100">✨ VyaparOS AI</span>
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Predict. Prevent. Profit.
            </h2>
            <p className="mt-2 text-sm opacity-90">
              Six AI models watch your data 24×7 and surface what needs your attention today — from
              restocking Basmati Rice to flagging a risky customer.
            </p>
            <div className="mt-5 flex gap-2">
              <Btn
                variant="outline"
                className="!bg-white/15 !text-white !border-white/25 hover:!bg-white/25"
              >
                See recommendations
              </Btn>
              <Btn variant="ghost" className="!text-white hover:!bg-white/15">
                How it works
              </Btn>
            </div>
          </div>
          <div className="w-full md:w-80">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4">
              <div className="text-xs uppercase tracking-wide opacity-80">30-day forecast</div>
              <div className="font-display text-3xl font-bold mt-1">{inr(1840000)}</div>
              <div className="text-xs opacity-80 mt-1 inline-flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +14% vs last 30d
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={forecast}>
                  <defs>
                    <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="white" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      color: "white",
                    }}
                    formatter={(value: number) => inr(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="white"
                    strokeWidth={2}
                    fill="url(#gAI)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* AI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {aiCards.map((c) => (
          <Card key={c.title} className="p-6 hover:-translate-y-0.5 transition">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold flex items-center gap-2">
              {c.title} <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{c.metric}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Suggestions detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Purchase Suggestions
            </div>
            <Badge tone="primary">AI</Badge>
          </div>
          <ul className="space-y-3">
            {products.slice(0, 5).map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {p.stock}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Reorder qty: <b>{40 + i * 10}</b> · Lead time 4d · Festival demand ↑
                  </div>
                </div>
                <Btn variant="outline">Create PO</Btn>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning" /> Credit Risk Watchlist
            </div>
            <Badge tone="warning">AI</Badge>
          </div>
          <ul className="space-y-3">
            {customers
              .filter((c) => c.outstanding > 100000)
              .slice(0, 5)
              .map((c) => {
                const util = Math.min(100, Math.round((c.outstanding / c.creditLimit) * 100));
                return (
                  <li key={c.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/15 text-warning text-xs font-bold">
                        {util}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {inr(c.outstanding)} of {inr(c.creditLimit)} used
                        </div>
                      </div>
                      <Badge tone={util > 80 ? "destructive" : "warning"}>
                        {util > 80 ? "High risk" : "Watch"}
                      </Badge>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${util > 80 ? "bg-destructive" : "bg-warning"}`}
                        style={{ width: `${util}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </Card>
      </div>

      {/* Coming soon */}
      <div className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="font-display text-lg font-bold">Coming to VyaparOS</h2>
            <p className="text-sm text-muted-foreground">Roadmap features shipping next quarter.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {futureFeatures.map((f) => (
            <Card key={f.title} className="p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                <Lock className="h-2.5 w-2.5" /> Soon
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-3 font-semibold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
