import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Scan, Upload, Image, Eye, Download, Trash2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const imagingRecords = [
  {
    id: 1,
    patient: "Sarah Johnson",
    type: "Panoramic X-Ray",
    date: "May 20, 2026",
    dentist: "Dr. Smith",
    images: 2,
    tags: ["pre-op"],
  },
  {
    id: 2,
    patient: "Michael Chen",
    type: "Bitewing",
    date: "May 18, 2026",
    dentist: "Dr. Lee",
    images: 4,
    tags: ["caries", "follow-up"],
  },
  {
    id: 3,
    patient: "Emily Davis",
    type: "CBCT Scan",
    date: "May 15, 2026",
    dentist: "Dr. Patel",
    images: 1,
    tags: ["implant"],
  },
  {
    id: 4,
    patient: "Robert Wilson",
    type: "Periapical",
    date: "May 12, 2026",
    dentist: "Dr. Smith",
    images: 3,
    tags: ["root-canal"],
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    type: "Intraoral Photo",
    date: "May 10, 2026",
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

export default function Imaging() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = imagingRecords.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.dentist.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Imaging" },
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
                <h1 className="text-2xl font-bold text-foreground">Imaging</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage dental imaging and radiology records</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </Button>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, type, or dentist..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Imaging grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((record) => (
                <div
                  key={record.id}
                  className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className={cn("text-xs", typeColors[record.type])}>
                      {record.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>

                  <p className="font-semibold text-foreground mb-1">{record.patient}</p>
                  <p className="text-sm text-muted-foreground mb-3">{record.dentist}</p>

                  <div className="flex items-center gap-1.5 mb-4">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{record.images} image(s)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {record.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="gap-1 flex-1">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 flex-1">
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">No imaging records found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
