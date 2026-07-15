import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Boxes,
  Users,
  Truck,
  FileText,
  Wallet,
  BarChart3,
  LineChart,
  UserCog,
  Settings,
  Sparkles,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Key, ReactNode } from "react";
import { company } from "@/lib/demo-data";

type AppRoute =
  | "/"
  | "/ai"
  | "/sales"
  | "/purchase"
  | "/inventory"
  | "/customers"
  | "/suppliers"
  | "/invoices"
  | "/payments"
  | "/reports"
  | "/analytics"
  | "/employees"
  | "/settings";

type NavItem = { to: AppRoute; label: string; icon: LucideIcon; exact?: boolean; badge?: string };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/ai", label: "AI Center", icon: Sparkles, badge: "New" },
  { to: "/sales", label: "Sales", icon: ShoppingCart },
  { to: "/purchase", label: "Purchase", icon: PackageSearch },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/employees", label: "Employees", icon: UserCog },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-sidebar">
          <div className="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-soft">
              V
            </div>
            <div className="min-w-0">
              <div className="font-display text-[15px] font-bold leading-tight">VyaparOS</div>
              <div className="text-[11px] text-muted-foreground truncate">Business OS</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span className="rounded-full bg-gradient-ai px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <div className="rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-soft">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-90">
                <Sparkles className="h-3.5 w-3.5" /> Pro Plan
              </div>
              <div className="mt-2 text-sm">GST filing, multi-store & AI included.</div>
              <button className="mt-3 w-full rounded-lg bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-semibold hover:bg-white/25 transition">
                Manage plan
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:pl-64 min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex h-full items-center gap-3 px-4 md:px-8">
              <div className="lg:hidden grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-bold">
                V
              </div>
              <div className="hidden md:flex items-center gap-2 min-w-0">
                <div className="font-semibold truncate">{company.name}</div>
                <span className="rounded-md bg-success/10 text-success text-[10px] font-bold px-1.5 py-0.5 uppercase">
                  GST
                </span>
                <span className="text-xs text-muted-foreground truncate">{company.gstin}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 w-72">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search invoices, customers, SKUs…"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <kbd className="hidden xl:inline text-[10px] text-muted-foreground border border-border rounded px-1">
                    ⌘K
                  </kbd>
                </div>
                <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-accent">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-border bg-card pl-1 pr-3 py-1 hover:bg-accent">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground text-xs font-bold">
                    RS
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold leading-tight">{company.owner}</div>
                    <div className="text-[10px] text-muted-foreground">Owner</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </header>

          <nav className="lg:hidden sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-xl overflow-x-auto">
            <div className="flex gap-2 px-4 py-2 min-w-max">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-card text-muted-foreground border border-border"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Page header */}
          <div className="px-4 md:px-8 pt-6 pb-2 flex flex-wrap items-end gap-4 justify-between">
            <div className="min-w-0">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                {title}
              </h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>

          <main className="px-4 md:px-8 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-secondary/10 text-secondary",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </div>
          <div className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</div>
          {delta && <div className="mt-1 text-xs text-success font-medium">{delta}</div>}
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export type BadgeTone = "muted" | "success" | "warning" | "destructive" | "info" | "primary";

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: BadgeTone }) {
  const t: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-secondary/10 text-secondary",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${t[tone]}`}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline" | "success";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v: Record<string, string> = {
    primary: "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95",
    ghost: "bg-transparent hover:bg-accent text-foreground",
    outline: "border border-border bg-card hover:bg-accent text-foreground",
    success: "bg-success text-success-foreground hover:opacity-95",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${v[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

type DataTableColumn<TRow extends { id?: Key }> = {
  key: Extract<keyof TRow, string>;
  label: string;
  className?: string;
  render?: (row: TRow) => ReactNode;
};

export function DataTable<TRow extends { id?: Key }>({
  columns,
  rows,
}: {
  columns: DataTableColumn<TRow>[];
  rows: TRow[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
              {columns.map((c) => (
                <th key={c.key} className={`px-5 py-3 font-semibold ${c.className ?? ""}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id ?? i}
                className="border-b border-border last:border-0 hover:bg-accent/40 transition"
              >
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3 ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-xs text-muted-foreground border-t border-border">
        <span>Showing {rows.length} results</span>
        <div className="flex items-center gap-1">
          <button className="rounded-lg border border-border px-2 py-1 hover:bg-accent">
            Prev
          </button>
          <span className="px-2">Page 1 of 3</span>
          <button className="rounded-lg border border-border px-2 py-1 hover:bg-accent">
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

export function TableToolbar({
  placeholder = "Search…",
  right,
}: {
  placeholder?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 w-full md:w-80">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder={placeholder} className="flex-1 bg-transparent outline-none text-sm" />
      </div>
      <Btn variant="outline">Filter</Btn>
      <Btn variant="outline">Export</Btn>
      <div className="ml-auto flex gap-2">{right}</div>
    </div>
  );
}
