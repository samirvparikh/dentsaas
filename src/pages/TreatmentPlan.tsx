import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { ColumnFilterRow } from "@/components/data-table/ColumnFilterRow";
import { useDataTable, type DataTableColumn } from "@/hooks/useDataTable";
import { exportToCsv, exportToPdf } from "@/lib/table-export";
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Plan = {
  id: number;
  patient: string;
  plan: string;
  dentist: string;
  created: string;
  createdSort: string;
  status: "active" | "pending" | "completed";
  procedures: number;
  completed: number;
  cost: string;
  costValue: number;
};

type PlanKey = "patient" | "plan" | "dentist" | "created" | "procedures" | "cost" | "status";

const treatmentPlans: Plan[] = [
  {
    id: 1,
    patient: "Sarah Johnson",
    plan: "Comprehensive Restoration",
    dentist: "Dr. Smith",
    created: "May 20, 2026",
    createdSort: "2026-05-20",
    status: "active",
    procedures: 8,
    completed: 3,
    cost: "$4,200",
    costValue: 4200,
  },
  {
    id: 2,
    patient: "Michael Chen",
    plan: "Orthodontic Treatment",
    dentist: "Dr. Lee",
    created: "May 18, 2026",
    createdSort: "2026-05-18",
    status: "pending",
    procedures: 12,
    completed: 0,
    cost: "$6,500",
    costValue: 6500,
  },
  {
    id: 3,
    patient: "Emily Davis",
    plan: "Periodontal Therapy",
    dentist: "Dr. Patel",
    created: "May 15, 2026",
    createdSort: "2026-05-15",
    status: "active",
    procedures: 6,
    completed: 4,
    cost: "$2,800",
    costValue: 2800,
  },
  {
    id: 4,
    patient: "Robert Wilson",
    plan: "Implant Restoration",
    dentist: "Dr. Smith",
    created: "May 10, 2026",
    createdSort: "2026-05-10",
    status: "completed",
    procedures: 5,
    completed: 5,
    cost: "$5,100",
    costValue: 5100,
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    plan: "Cosmetic Veneers",
    dentist: "Dr. Lee",
    created: "May 5, 2026",
    createdSort: "2026-05-05",
    status: "active",
    procedures: 10,
    completed: 2,
    cost: "$7,200",
    costValue: 7200,
  },
];

const planColumns: DataTableColumn<Plan, PlanKey>[] = [
  { key: "patient", label: "Patient", getText: (r) => r.patient, getSortValue: (r) => r.patient },
  { key: "plan", label: "Plan", getText: (r) => r.plan, getSortValue: (r) => r.plan },
  { key: "dentist", label: "Dentist", getText: (r) => r.dentist, getSortValue: (r) => r.dentist },
  { key: "created", label: "Created", getText: (r) => r.created, getSortValue: (r) => r.createdSort },
  {
    key: "procedures",
    label: "Procedures",
    getText: (r) => `${r.completed}/${r.procedures}`,
    getSortValue: (r) => r.completed / r.procedures,
  },
  { key: "cost", label: "Cost", getText: (r) => r.cost, getSortValue: (r) => r.costValue },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
    ],
    getText: (r) => r.status,
    getSortValue: (r) => r.status,
  },
];

const exportColumns = [
  { header: "Patient", value: (r: Plan) => r.patient },
  { header: "Plan", value: (r: Plan) => r.plan },
  { header: "Dentist", value: (r: Plan) => r.dentist },
  { header: "Created", value: (r: Plan) => r.created },
  { header: "Procedures", value: (r: Plan) => `${r.completed}/${r.procedures}` },
  { header: "Cost", value: (r: Plan) => r.cost },
  { header: "Status", value: (r: Plan) => r.status },
];

export default function TreatmentPlan() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const columns = useMemo(() => planColumns, []);
  const table = useDataTable({
    data: treatmentPlans,
    columns,
    initialSortKey: "created",
    initialSortDir: "desc",
  });

  const handleExportCsv = () => {
    exportToCsv("treatment-plans", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} plan(s) as CSV`);
  };

  const handleExportPdf = () => {
    exportToPdf("treatment-plans", "Treatment Plans", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} plan(s) as PDF`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Treatment Plan" }]} />

          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Treatment Plans</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {table.filtered.length} of {table.total} records
                </p>
              </div>

              <DataTableToolbar
                search={table.search}
                onSearchChange={table.setSearch}
                searchPlaceholder="Search by patient, plan, or dentist..."
                showFilters={table.showFilters}
                onToggleFilters={() => table.setShowFilters((v) => !v)}
                onRefresh={table.resetFilters}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                exportDisabled={table.filtered.length === 0}
              >
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Plan
                </Button>
              </DataTableToolbar>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {columns.map((col) => (
                        <SortableHeader
                          key={col.key}
                          label={col.label}
                          columnKey={col.key}
                          sortKey={table.sortKey}
                          sortDir={table.sortDir}
                          onSort={table.handleSort}
                        />
                      ))}
                    </tr>
                    {table.showFilters && (
                      <ColumnFilterRow
                        columns={table.filterColumns}
                        values={table.columnFilters}
                        onChange={table.updateColumnFilter}
                      />
                    )}
                  </thead>
                  <tbody>
                    {table.filtered.map((plan, index) => (
                      <tr
                        key={plan.id}
                        className={cn(
                          "border-b border-border hover:bg-muted/30 transition-colors",
                          index % 2 === 1 && "bg-muted/15"
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{plan.patient}</td>
                        <td className="px-4 py-3 text-foreground">{plan.plan}</td>
                        <td className="px-4 py-3 text-muted-foreground">{plan.dentist}</td>
                        <td className="px-4 py-3 text-muted-foreground">{plan.created}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {plan.completed}/{plan.procedures}
                            </span>
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
              {table.filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No treatment plans found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
