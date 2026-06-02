import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Stethoscope, ChevronRight, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const teeth = [
  { num: 1, status: "healthy" }, { num: 2, status: "healthy" }, { num: 3, status: "cavity" },
  { num: 4, status: "healthy" }, { num: 5, status: "filled" }, { num: 6, status: "healthy" },
  { num: 7, status: "crown" }, { num: 8, status: "missing" }, { num: 9, status: "missing" },
  { num: 10, status: "crown" }, { num: 11, status: "healthy" }, { num: 12, status: "filled" },
  { num: 13, status: "healthy" }, { num: 14, status: "cavity" }, { num: 15, status: "healthy" },
  { num: 16, status: "healthy" },
  { num: 17, status: "healthy" }, { num: 18, status: "healthy" }, { num: 19, status: "cavity" },
  { num: 20, status: "filled" }, { num: 21, status: "healthy" }, { num: 22, status: "healthy" },
  { num: 23, status: "crown" }, { num: 24, status: "missing" }, { num: 25, status: "missing" },
  { num: 26, status: "crown" }, { num: 27, status: "healthy" }, { num: 28, status: "filled" },
  { num: 29, status: "healthy" }, { num: 30, status: "cavity" }, { num: 31, status: "healthy" },
  { num: 32, status: "healthy" },
];

const statusColors: Record<string, string> = {
  healthy: "bg-success/20 border-success text-success",
  cavity: "bg-destructive/20 border-destructive text-destructive",
  filled: "bg-primary/20 border-primary text-primary",
  crown: "bg-warning/20 border-warning text-warning",
  missing: "bg-muted border-muted-foreground/30 text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  healthy: "Healthy",
  cavity: "Cavity",
  filled: "Filled",
  crown: "Crown",
  missing: "Missing",
};

const chartNotes = [
  {
    tooth: 3,
    status: "cavity",
    note: "Moderate occlusal caries. Recommend composite filling.",
    date: "May 20, 2026",
    dentist: "Dr. Smith",
  },
  {
    tooth: 14,
    status: "cavity",
    note: "Distal proximal caries. Scheduled for filling next visit.",
    date: "May 18, 2026",
    dentist: "Dr. Lee",
  },
  {
    tooth: 8,
    status: "missing",
    note: "Extracted due to severe decay. Consider implant option.",
    date: "Apr 15, 2026",
    dentist: "Dr. Patel",
  },
  {
    tooth: 7,
    status: "crown",
    note: "Porcelain-fused-to-metal crown placed. Good fit.",
    date: "Apr 2, 2026",
    dentist: "Dr. Smith",
  },
];

export default function Chart() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Chart" },
  ];

  const upperTeeth = teeth.slice(0, 16);
  const lowerTeeth = teeth.slice(16, 32);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dental Chart</h1>
              <p className="text-sm text-muted-foreground mt-1">Interactive odontogram and patient charting</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Odontogram */}
              <div className="xl:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    Odontogram
                  </h2>
                  <div className="flex items-center gap-3 text-xs">
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className={cn("w-3 h-3 rounded-full border", statusColors[key].split(" ")[1].replace("border-", "bg-").replace("/30", ""))} />
                        <span className="text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upper arch */}
                <div className="flex justify-center gap-1 mb-2">
                  {upperTeeth.map((t) => (
                    <button
                      key={t.num}
                      onClick={() => setSelectedTooth(t.num)}
                      className={cn(
                        "w-8 h-10 rounded-t-lg border text-xs font-medium flex items-center justify-center transition-all hover:scale-105",
                        statusColors[t.status],
                        selectedTooth === t.num && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                      )}
                    >
                      {t.num}
                    </button>
                  ))}
                </div>

                {/* Lower arch */}
                <div className="flex justify-center gap-1">
                  {lowerTeeth.map((t) => (
                    <button
                      key={t.num}
                      onClick={() => setSelectedTooth(t.num)}
                      className={cn(
                        "w-8 h-10 rounded-b-lg border text-xs font-medium flex items-center justify-center transition-all hover:scale-105",
                        statusColors[t.status],
                        selectedTooth === t.num && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                      )}
                    >
                      {t.num}
                    </button>
                  ))}
                </div>

                {selectedTooth && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-foreground">Tooth #{selectedTooth}</span>
                      <Badge
                        className={cn(
                          "capitalize",
                          statusColors[teeth.find((t) => t.num === selectedTooth)?.status || "healthy"]
                        )}
                      >
                        {statusLabels[teeth.find((t) => t.num === selectedTooth)?.status || "healthy"]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Click a tooth to view or add chart notes.</p>
                  </div>
                )}
              </div>

              {/* Chart notes */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Chart Notes
                </h2>
                <div className="space-y-4">
                  {chartNotes.map((note, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">Tooth #{note.tooth}</span>
                          <span
                            className={cn(
                              "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full",
                              statusColors[note.status]
                            )}
                          >
                            {statusLabels[note.status]}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">{note.dentist}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
