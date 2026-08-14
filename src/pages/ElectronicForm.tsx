import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { ColumnFilterRow } from "@/components/data-table/ColumnFilterRow";
import { useDataTable, type DataTableColumn } from "@/hooks/useDataTable";
import { exportToCsv, exportToPdf } from "@/lib/table-export";
import { Plus, Send, Clock, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FormRow = {
  id: number;
  name: string;
  type: string;
  patient: string;
  status: "signed" | "pending";
  sent: string;
  sentSort: string;
  signed: string | null;
};

type FormKey = "name" | "type" | "patient" | "sent" | "signed" | "status";

const forms: FormRow[] = [
  {
    id: 1,
    name: "Patient Consent Form",
    type: "Consent",
    patient: "Sarah Johnson",
    status: "signed",
    sent: "May 20, 2026",
    sentSort: "2026-05-20",
    signed: "May 20, 2026",
  },
  {
    id: 2,
    name: "Medical History Update",
    type: "History",
    patient: "Michael Chen",
    status: "pending",
    sent: "May 18, 2026",
    sentSort: "2026-05-18",
    signed: null,
  },
  {
    id: 3,
    name: "HIPAA Privacy Notice",
    type: "Compliance",
    patient: "Emily Davis",
    status: "signed",
    sent: "May 15, 2026",
    sentSort: "2026-05-15",
    signed: "May 15, 2026",
  },
  {
    id: 4,
    name: "Treatment Plan Acknowledgment",
    type: "Consent",
    patient: "Robert Wilson",
    status: "pending",
    sent: "May 12, 2026",
    sentSort: "2026-05-12",
    signed: null,
  },
  {
    id: 5,
    name: "Insurance Authorization",
    type: "Insurance",
    patient: "Lisa Anderson",
    status: "signed",
    sent: "May 10, 2026",
    sentSort: "2026-05-10",
    signed: "May 11, 2026",
  },
];

const formColumns: DataTableColumn<FormRow, FormKey>[] = [
  { key: "name", label: "Form", getText: (r) => r.name, getSortValue: (r) => r.name },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: [
      { label: "Consent", value: "Consent" },
      { label: "History", value: "History" },
      { label: "Compliance", value: "Compliance" },
      { label: "Insurance", value: "Insurance" },
    ],
    getText: (r) => r.type,
    getSortValue: (r) => r.type,
  },
  { key: "patient", label: "Patient", getText: (r) => r.patient, getSortValue: (r) => r.patient },
  { key: "sent", label: "Sent", getText: (r) => r.sent, getSortValue: (r) => r.sentSort },
  {
    key: "signed",
    label: "Signed",
    getText: (r) => r.signed ?? "",
    getSortValue: (r) => r.signed ?? "",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Signed", value: "signed" },
      { label: "Pending", value: "pending" },
    ],
    getText: (r) => r.status,
    getSortValue: (r) => r.status,
  },
];

const exportColumns = [
  { header: "Form", value: (r: FormRow) => r.name },
  { header: "Type", value: (r: FormRow) => r.type },
  { header: "Patient", value: (r: FormRow) => r.patient },
  { header: "Sent", value: (r: FormRow) => r.sent },
  { header: "Signed", value: (r: FormRow) => r.signed ?? "" },
  { header: "Status", value: (r: FormRow) => r.status },
];

export default function ElectronicForm() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const columns = useMemo(() => formColumns, []);
  const table = useDataTable({
    data: forms,
    columns,
    initialSortKey: "sent",
    initialSortDir: "desc",
  });

  const handleExportCsv = () => {
    exportToCsv("electronic-forms", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} form(s) as CSV`);
  };

  const handleExportPdf = () => {
    exportToPdf("electronic-forms", "Electronic Forms", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} form(s) as PDF`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Electronic Form" }]} />

          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Electronic Forms</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {table.filtered.length} of {table.total} records
                </p>
              </div>

              <DataTableToolbar
                search={table.search}
                onSearchChange={table.setSearch}
                searchPlaceholder="Search by form, patient, or type..."
                showFilters={table.showFilters}
                onToggleFilters={() => table.setShowFilters((v) => !v)}
                onRefresh={table.resetFilters}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                exportDisabled={table.filtered.length === 0}
              >
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Template
                </Button>
                <Button className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Form
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
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                    {table.showFilters && (
                      <ColumnFilterRow
                        columns={table.filterColumns}
                        values={table.columnFilters}
                        onChange={table.updateColumnFilter}
                        trailingEmptyCells={1}
                      />
                    )}
                  </thead>
                  <tbody>
                    {table.filtered.map((form, index) => (
                      <tr
                        key={form.id}
                        className={cn(
                          "border-b border-border hover:bg-muted/30 transition-colors",
                          index % 2 === 1 && "bg-muted/15"
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{form.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs bg-secondary text-secondary-foreground">
                            {form.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{form.patient}</td>
                        <td className="px-4 py-3 text-muted-foreground">{form.sent}</td>
                        <td className="px-4 py-3 text-muted-foreground">{form.signed ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              form.status === "signed" && "border-success/30 text-success bg-success/10",
                              form.status === "pending" && "border-warning/30 text-warning bg-warning/10"
                            )}
                          >
                            {form.status === "signed" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {form.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {form.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No forms found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
