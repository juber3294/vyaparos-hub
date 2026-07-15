import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, Btn, Badge } from "@/components/app-shell";
import { Building2, FileText, Users, Bell, Shield, Wallet } from "lucide-react";
import { company } from "@/lib/demo-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VyaparOS" },
      { name: "description", content: "Company, GST, invoice & user settings." },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { icon: Building2, title: "Company Profile", desc: "Business name, address, logo, contact" },
  { icon: Wallet, title: "GST & Tax", desc: "GSTIN, PAN, tax rates, e-invoice" },
  { icon: FileText, title: "Invoice Template", desc: "Layout, colors, terms, signature" },
  { icon: Users, title: "Users & Roles", desc: "Team access, permissions" },
  { icon: Shield, title: "Permissions", desc: "Module-level access controls" },
  { icon: Bell, title: "Notifications", desc: "WhatsApp, email, SMS reminders" },
];

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Configure your VyaparOS workspace">
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground text-2xl font-bold shadow-soft">
            {company.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-2xl font-bold">{company.name}</div>
            <div className="text-sm text-muted-foreground">{company.city}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge tone="success">GST Registered</Badge>
              <Badge tone="primary">Pro Plan</Badge>
              <Badge>GSTIN {company.gstin}</Badge>
            </div>
          </div>
          <Btn variant="outline">Edit Profile</Btn>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Card key={s.title} className="p-5 hover:-translate-y-0.5 transition cursor-pointer">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold">{s.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-6">
        <div className="text-sm font-semibold mb-4">Preferences</div>
        {[
          ["WhatsApp invoice reminders", true],
          ["Auto GST calculation", true],
          ["Low stock alerts", true],
          ["Send SMS payment receipts", false],
          ["Beta features (Voice Billing)", false],
        ].map(([label, on]) => (
          <div
            key={String(label)}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <span className="text-sm">{label}</span>
            <div
              className={`h-6 w-11 rounded-full p-0.5 transition ${on ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`}
              />
            </div>
          </div>
        ))}
      </Card>
    </AppShell>
  );
}
