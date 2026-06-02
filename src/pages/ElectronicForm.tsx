import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FileSignature, Plus, Search, Send, Clock, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const forms = [
  {
    id: 1,
    name: "Patient Consent Form",
    type: "Consent",
    patient: "Sarah Johnson",
    status: "signed",
    sent: "May 20, 2026",
    signed: "May 20, 2026",
  },
  {
    id: 2,
    name: "Medical History Update",
    type: "History",
    patient: "Michael Chen",
    status: "pending",
    sent: "May 18, 2026",
    signed: null,
  },
  {
    id: 3,
    name: "HIPAA Privacy Notice",
    type: "Compliance",
    patient: "Emily Davis",
    status: "signed",
    sent: "May 15, 2026",
    signed: "May 15, 2026",
  },
  {
    id: 4,
    name: "Treatment Plan Acknowledgment",
    type: "Consent",
    patient: "Robert Wilson",
    status: "pending",
    sent: "May 12, 2026",
    signed: null,
  },
  {
    id: 5,
    name: "Insurance Authorization",
    type: "Insurance",
    patient: "Lisa Anderson",
    status: "signed",
    sent: "May 10, 2026",
    signed: "May 11, 2026",
  },
];

export default function ElectronicForm() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = forms.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.patient.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Electronic Form" },
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
                <h1 className="text-2xl font-bold text-foreground">Electronic Forms</h1>
                <p className="text-sm text-muted-foreground mt-1">Send, track, and manage digital patient forms</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Template
                </Button>
                <Button className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Form
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by form, patient, or type..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Forms table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Form</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Sent</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Signed</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((form) => (
                      <tr key={form.id} className="border-b border-border hover:bg-muted/30 transition-colors">
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
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No forms found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
