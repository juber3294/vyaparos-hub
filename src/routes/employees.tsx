import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Btn, Badge, DataTable, TableToolbar, StatCard } from "@/components/app-shell";
import { UserPlus, Users, Briefcase, Shield } from "lucide-react";
import { employees } from "@/lib/demo-data";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employees — VyaparOS" },
      { name: "description", content: "Team, roles and permissions." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <AppShell
      title="Employees"
      subtitle="Team members & role-based access"
      actions={
        <Btn>
          <UserPlus className="h-4 w-4" /> Add Member
        </Btn>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Team" value={String(employees.length)} icon={Users} tone="primary" />
        <StatCard label="Departments" value="6" icon={Briefcase} tone="info" />
        <StatCard label="Admins" value="2" icon={Shield} tone="warning" />
        <StatCard label="Active Today" value="7" icon={Users} tone="success" />
      </div>
      <TableToolbar placeholder="Search team member…" />
      <DataTable
        rows={employees}
        columns={[
          {
            key: "name",
            label: "Member",
            render: (e) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold">
                  {e.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground">{e.phone}</div>
                </div>
              </div>
            ),
          },
          { key: "role", label: "Role", render: (e) => <Badge tone="primary">{e.role}</Badge> },
          { key: "dept", label: "Department" },
          {
            key: "id",
            label: "Employee ID",
            render: (e) => <span className="font-mono text-xs">{e.id}</span>,
          },
          { key: "status", label: "Status", render: () => <Badge tone="success">Active</Badge> },
        ]}
      />
    </AppShell>
  );
}
