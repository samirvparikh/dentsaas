import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { ColumnFilterRow } from "@/components/data-table/ColumnFilterRow";
import { useDataTable, type DataTableColumn } from "@/hooks/useDataTable";
import { exportToCsv, exportToPdf } from "@/lib/table-export";
import { Upload, Image, Eye, Trash2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ImagingRecord = {
  id: number;
  patient: string;
  type: string;
  date: string;
  dateSort: string;
  dentist: string;
  images: number;
  tags: string[];
};

type ImagingKey = "patient" | "type" | "date" | "dentist" | "images" | "tags";

const imagingRecords: ImagingRecord[] = [
  {
    id: 1,
    patient: "Sarah Johnson",
    type: "Panoramic X-Ray",
    date: "May 20, 2026",
    dateSort: "2026-05-20",
    dentist: "Dr. Smith",
    images: 2,
    tags: ["pre-op"],
  },
  {
    id: 2,
    patient: "Michael Chen",
    type: "Bitewing",
    date: "May 18, 2026",
    dateSort: "2026-05-18",
    dentist: "Dr. Lee",
    images: 4,
    tags: ["caries", "follow-up"],
  },
  {
    id: 3,
    patient: "Emily Davis",
    type: "CBCT Scan",
    date: "May 15, 2026",
    dateSort: "2026-05-15",
    dentist: "Dr. Patel",
    images: 1,
    tags: ["implant"],
  },
  {
    id: 4,
    patient: "Robert Wilson",
    type: "Periapical",
    date: "May 12, 2026",
    dateSort: "2026-05-12",
    dentist: "Dr. Smith",
    images: 3,
    tags: ["root-canal"],
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    type: "Intraoral Photo",
    date: "May 10, 2026",
    dateSort: "2026-05-10",
    dentist: "Dr. Lee",
    images: 6,
    tags: ["cosmetic"],
  },
];

const typeColors: Record<string, string> = {
  "Panoramic X-Ray": "bg-primary/10 text-primary",
  Bitewing: "bg-success/10 text-success",
  "CBCT Scan": "bg-warning/10 text-warning",
  Periapical: "bg-destructive/10 text-destructive",
  "Intraoral Photo": "bg-muted text-muted-foreground",
};

const imagingColumns: DataTableColumn<ImagingRecord, ImagingKey>[] = [
  { key: "patient", label: "Patient", getText: (r) => r.patient, getSortValue: (r) => r.patient },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: Object.keys(typeColors).map((t) => ({ label: t, value: t })),
    getText: (r) => r.type,
    getSortValue: (r) => r.type,
  },
  { key: "date", label: "Date", getText: (r) => r.date, getSortValue: (r) => r.dateSort },
  { key: "dentist", label: "Dentist", getText: (r) => r.dentist, getSortValue: (r) => r.dentist },
  {
    key: "images",
    label: "Images",
    getText: (r) => String(r.images),
    getSortValue: (r) => r.images,
  },
  {
    key: "tags",
    label: "Tags",
    getText: (r) => r.tags.join(" "),
    getSortValue: (r) => r.tags.join(","),
  },
];

const exportColumns = [
  { header: "Patient", value: (r: ImagingRecord) => r.patient },
  { header: "Type", value: (r: ImagingRecord) => r.type },
  { header: "Date", value: (r: ImagingRecord) => r.date },
  { header: "Dentist", value: (r: ImagingRecord) => r.dentist },
  { header: "Images", value: (r: ImagingRecord) => r.images },
  { header: "Tags", value: (r: ImagingRecord) => r.tags.join(", ") },
];

export default function Imaging() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const columns = useMemo(() => imagingColumns, []);
  const table = useDataTable({
    data: imagingRecords,
    columns,
    initialSortKey: "date",
    initialSortDir: "desc",
  });

  const handleExportCsv = () => {
    exportToCsv("imaging-records", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} record(s) as CSV`);
  };

  const handleExportPdf = () => {
    exportToPdf("imaging-records", "Imaging Records", exportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} record(s) as PDF`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Imaging" }]} />

          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Imaging</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {table.filtered.length} of {table.total} records
                </p>
              </div>

              <DataTableToolbar
                search={table.search}
                onSearchChange={table.setSearch}
                searchPlaceholder="Search by patient, type, or dentist..."
                showFilters={table.showFilters}
                onToggleFilters={() => table.setShowFilters((v) => !v)}
                onRefresh={table.resetFilters}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                exportDisabled={table.filtered.length === 0}
              >
                <Button variant="outline" className="gap-2">
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </Button>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
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
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
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
                    {table.filtered.map((record, index) => (
                      <tr
                        key={record.id}
                        className={cn(
                          "border-b border-border hover:bg-muted/30 transition-colors",
                          index % 2 === 1 && "bg-muted/15"
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{record.patient}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={cn("text-xs", typeColors[record.type])}>
                            {record.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{record.date}</td>
                        <td className="px-4 py-3 text-muted-foreground">{record.dentist}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            {record.images}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {record.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No imaging records found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
