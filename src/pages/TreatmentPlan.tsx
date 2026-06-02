import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ClipboardList, Plus, Search, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const treatmentPlans = [
  {
    id: 1,
    patient: "Sarah Johnson",
    plan: "Comprehensive Restoration",
    dentist: "Dr. Smith",
    created: "May 20, 2026",
    status: "active",
    procedures: 8,
    completed: 3,
    cost: "$4,200",
  },
  {
    id: 2,
    patient: "Michael Chen",
    plan: "Orthodontic Treatment",
    dentist: "Dr. Lee",
    created: "May 18, 2026",
    status: "pending",
    procedures: 12,
    completed: 0,
    cost: "$6,500",
  },
  {
    id: 3,
    patient: "Emily Davis",
    plan: "Periodontal Therapy",
    dentist: "Dr. Patel",
    created: "May 15, 2026",
    status: "active",
    procedures: 6,
    completed: 4,
    cost: "$2,800",
  },
  {
    id: 4,
    patient: "Robert Wilson",
    plan: "Implant Restoration",
    dentist: "Dr. Smith",
    created: "May 10, 2026",
    status: "completed",
    procedures: 5,
    completed: 5,
    cost: "$5,100",
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    plan: "Cosmetic Veneers",
    dentist: "Dr. Lee",
    created: "May 5, 2026",
    status: "active",
    procedures: 10,
    completed: 2,
    cost: "$7,200",
  },
];

export default function TreatmentPlan() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = treatmentPlans.filter(
    (t) =>
      t.patient.toLowerCase().includes(search.toLowerCase()) ||
      t.plan.toLowerCase().includes(search.toLowerCase()) ||
      t.dentist.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Treatment Plan" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Treatment Plans</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage patient treatment plans and track progress</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Plan
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, plan, or dentist..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Plans table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dentist</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Procedures</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cost</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((plan) => (
                      <tr key={plan.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{plan.patient}</td>
                        <td className="px-4 py-3 text-foreground">{plan.plan}</td>
                        <td className="px-4 py-3 text-muted-foreground">{plan.dentist}</td>
                        <td className="px-4 py-3 text-muted-foreground">{plan.created}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{plan.completed}/{plan.procedures}</span>
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(plan.completed / plan.procedures) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{plan.cost}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              plan.status === "active" && "border-success/30 text-success bg-success/10",
                              plan.status === "pending" && "border-warning/30 text-warning bg-warning/10",
                              plan.status === "completed" && "border-primary/30 text-primary bg-primary/10"
                            )}
                          >
                            {plan.status === "active" && <Clock className="w-3 h-3 mr-1" />}
                            {plan.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {plan.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {plan.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No treatment plans found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
