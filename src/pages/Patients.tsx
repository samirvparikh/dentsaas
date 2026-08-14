import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AddPatientModal } from "@/components/AddPatientModal";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { ColumnFilterRow } from "@/components/data-table/ColumnFilterRow";
import { useDataTable, type DataTableColumn } from "@/hooks/useDataTable";
import { exportToCsv, exportToPdf } from "@/lib/table-export";
import { Phone, FileText, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PatientStatus = "Active" | "New";

type Patient = {
  id: number;
  name: string;
  phone: string;
  dob: string;
  lastVisit: string;
  lastVisitSort: string;
  balance: number;
  status: PatientStatus;
};

type PatientSortKey = "id" | "name" | "phone" | "dob" | "lastVisit" | "balance" | "status";

const initialPatients: Patient[] = [
  {
    id: 17005,
    name: "DELGADO GENESIS",
    phone: "862-247-7212",
    dob: "03-03-2010",
    lastVisit: "Today",
    lastVisitSort: "2026-08-14",
    balance: 210,
    status: "Active",
  },
  {
    id: 17004,
    name: "BALSECA SAMUEL",
    phone: "201-552-0729",
    dob: "05-12-2009",
    lastVisit: "Yesterday",
    lastVisitSort: "2026-08-13",
    balance: 0,
    status: "New",
  },
  {
    id: 17003,
    name: "CURRY NEVAEH",
    phone: "484-554-6555",
    dob: "02-15-2005",
    lastVisit: "Today",
    lastVisitSort: "2026-08-14",
    balance: 0,
    status: "Active",
  },
  {
    id: 17002,
    name: "JOHNSONN ELLA",
    phone: "484-903-7236",
    dob: "02-27-2012",
    lastVisit: "Yesterday",
    lastVisitSort: "2026-08-13",
    balance: 0,
    status: "Active",
  },
  {
    id: 17001,
    name: "BRAKE ZOIEY",
    phone: "201-616-6586",
    dob: "08-28-2012",
    lastVisit: "Today",
    lastVisitSort: "2026-08-14",
    balance: 0,
    status: "Active",
  },
  {
    id: 16997,
    name: "MCNUTT PHEONIX",
    phone: "484-597-1934",
    dob: "02-19-2012",
    lastVisit: "Dec 10, 2020",
    lastVisitSort: "2020-12-10",
    balance: 0,
    status: "Active",
  },
  {
    id: 16990,
    name: "PATEL ARYA",
    phone: "973-441-2088",
    dob: "11-04-2011",
    lastVisit: "Aug 1, 2026",
    lastVisitSort: "2026-08-01",
    balance: 85.5,
    status: "Active",
  },
  {
    id: 16985,
    name: "GARCIA MIA",
    phone: "201-889-3341",
    dob: "07-22-2008",
    lastVisit: "Jul 28, 2026",
    lastVisitSort: "2026-07-28",
    balance: 0,
    status: "New",
  },
];

function parseDob(dob: string) {
  const [mm, dd, yyyy] = dob.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const patientColumns: DataTableColumn<Patient, PatientSortKey>[] = [
  {
    key: "id",
    label: "ID",
    getText: (p) => String(p.id),
    getSortValue: (p) => p.id,
  },
  {
    key: "name",
    label: "Patient",
    getText: (p) => p.name,
    getSortValue: (p) => p.name,
  },
  {
    key: "phone",
    label: "Phone",
    getText: (p) => p.phone,
    getSortValue: (p) => p.phone,
  },
  {
    key: "dob",
    label: "DOB",
    getText: (p) => p.dob,
    getSortValue: (p) => parseDob(p.dob),
  },
  {
    key: "lastVisit",
    label: "Last Visit",
    getText: (p) => p.lastVisit,
    getSortValue: (p) => p.lastVisitSort,
  },
  {
    key: "balance",
    label: "Balance",
    getText: (p) => formatBalance(p.balance),
    getSortValue: (p) => p.balance,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "New", value: "New" },
    ],
    getText: (p) => p.status,
    getSortValue: (p) => p.status,
  },
];

const exportColumns = [
  { header: "ID", value: (p: Patient) => p.id },
  { header: "Patient", value: (p: Patient) => p.name },
  { header: "Phone", value: (p: Patient) => p.phone },
  { header: "DOB", value: (p: Patient) => p.dob },
  { header: "Last Visit", value: (p: Patient) => p.lastVisit },
  { header: "Balance", value: (p: Patient) => formatBalance(p.balance) },
  { header: "Status", value: (p: Patient) => p.status },
];

export default function Patients() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [addOpen, setAddOpen] = useState(false);

  const columns = useMemo(() => patientColumns, []);
  const table = useDataTable({
    data: patients,
    columns,
    initialSortKey: "id",
    initialSortDir: "desc",
  });

  const handleRefresh = () => {
    setPatients([...initialPatients]);
    table.resetFilters();
    toast.success("Patient list refreshed");
  };

  const handleExportCsv = () => {
    exportToCsv("patients", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} patient(s) as CSV`);
  };

  const handleExportPdf = () => {
    exportToPdf("patients", "Patients", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} patient(s) as PDF`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Patients" }]} />

          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Patients</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {table.filtered.length} of {table.total} records
                </p>
              </div>

              <DataTableToolbar
                search={table.search}
                onSearchChange={table.setSearch}
                searchPlaceholder="Search patients..."
                showFilters={table.showFilters}
                onToggleFilters={() => table.setShowFilters((v) => !v)}
                onRefresh={handleRefresh}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                exportDisabled={table.filtered.length === 0}
              >
                <Button className="gap-2" onClick={() => setAddOpen(true)}>
                  <UserPlus className="w-4 h-4" />
                  Add Patient
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
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[1%] whitespace-nowrap">
                        Actions
                      </th>
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
                    {table.filtered.map((patient, index) => (
                      <tr
                        key={patient.id}
                        className={cn(
                          "border-b border-border hover:bg-muted/30 transition-colors",
                          index % 2 === 1 && "bg-muted/15"
                        )}
                      >
                        <td className="px-4 py-3 text-muted-foreground">#{patient.id}</td>
                        <td className="px-4 py-3 font-semibold text-foreground tracking-wide">{patient.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground/80" />
                            {patient.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{patient.dob}</td>
                        <td className="px-4 py-3 text-muted-foreground">{patient.lastVisit}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{formatBalance(patient.balance)}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              patient.status === "Active" && "border-primary/30 text-primary bg-primary/10",
                              patient.status === "New" && "border-border text-muted-foreground bg-muted/60"
                            )}
                          >
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5"
                              onClick={() => navigate("/patient/billing")}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Billing
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5"
                              onClick={() => navigate("/appointment/book")}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Appt
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No patients found.</div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AddPatientModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
