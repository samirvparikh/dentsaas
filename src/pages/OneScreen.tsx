import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  User,
  Stethoscope,
  DollarSign,
  Bell,
  FileText,
  Image as ImageIcon,
  FileSignature,
  Upload,
  Calendar,
  ClipboardList,
  Activity,
  CreditCard,
  Wallet,
  Receipt,
  ShieldAlert,
  CheckSquare,
  ShieldCheck,
  Share2,
  Mail,
  Phone,
  MapPin,
  Cake,
  UserCircle2,
  Users,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "clinical" | "finance" | "alert";

const toneStyles: Record<Tone, { panel: string; header: string; icon: string; chip: string; ring: string }> = {
  info: {
    panel: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20 border-sky-200/60 dark:border-sky-900/40",
    header: "text-sky-700 dark:text-sky-300",
    icon: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300",
    chip: "border-sky-200 hover:bg-sky-100/60 dark:border-sky-900/50 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    ring: "border-l-sky-400",
  },
  clinical: {
    panel: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border-violet-200/60 dark:border-violet-900/40",
    header: "text-violet-700 dark:text-violet-300",
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300",
    chip: "border-violet-200 hover:bg-violet-100/60 dark:border-violet-900/50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    ring: "border-l-violet-400",
  },
  finance: {
    panel: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/60 dark:border-amber-900/40",
    header: "text-amber-700 dark:text-amber-300",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300",
    chip: "border-amber-200 hover:bg-amber-100/60 dark:border-amber-900/50 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    ring: "border-l-amber-400",
  },
  alert: {
    panel: "from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20 border-rose-200/60 dark:border-rose-900/40",
    header: "text-rose-700 dark:text-rose-300",
    icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300",
    chip: "border-rose-200 hover:bg-rose-100/60 dark:border-rose-900/50 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    ring: "border-l-rose-400",
  },
};

function CategoryCard({
  tone,
  icon: Icon,
  title,
  subtitle,
  items,
}: {
  tone: Tone;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  items: { icon: React.ElementType; label: string }[];
}) {
  const s = toneStyles[tone];
  return (
    <div className={cn("rounded-xl border bg-gradient-to-br p-4 shadow-sm", s.panel)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className={cn("font-semibold leading-tight", s.header)}>{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <button
            key={it.label}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md bg-card/70 dark:bg-card/40 border text-xs font-medium transition-colors text-left",
              s.chip
            )}
          >
            <it.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionPanel({
  tone,
  icon: Icon,
  title,
  action,
  children,
}: {
  tone: Tone;
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const s = toneStyles[tone];
  return (
    <div className={cn("rounded-xl border bg-gradient-to-br shadow-sm overflow-hidden", s.panel)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", s.header)} />
          <h3 className={cn("font-semibold text-sm", s.header)}>{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-4 bg-card/60 dark:bg-card/30">{children}</div>
    </div>
  );
}

const appointments = [
  { date: "09-25-2025", time: "12:45 PM", doctor: "Patel Joseph (Doctor)", remarks: "—" },
  { date: "06-29-2022", time: "12:00 PM", doctor: "Patel Joseph (Doctor)", remarks: "test" },
  { date: "03-04-2022", time: "11:00 AM", doctor: "Patel Joseph (Doctor)", remarks: "test" },
];

export default function OneScreen() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "OneScreen" }]} />

          <div className="mt-4 space-y-4">
            {/* Top: category quick-action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <CategoryCard
                tone="info"
                icon={User}
                title="Patient Information"
                subtitle="Demographics, imaging, forms & perio"
                items={[
                  { icon: User, label: "Patient Info" },
                  { icon: ImageIcon, label: "View X-Ray" },
                  { icon: FileSignature, label: "eForm" },
                  { icon: Upload, label: "Scan Upload Document" },
                ]}
              />
              <CategoryCard
                tone="clinical"
                icon={Stethoscope}
                title="Clinical"
                subtitle="Appointments, Forms & Follow-ups"
                items={[
                  { icon: Calendar, label: "Appt History" },
                  { icon: ClipboardList, label: "Tx Notes" },
                  { icon: FileText, label: "Tx Plan" },
                  { icon: Activity, label: "Perio Chart" },
                ]}
              />
              <CategoryCard
                tone="finance"
                icon={DollarSign}
                title="Financial"
                subtitle="Payments, Fees, Insurance & Ledger"
                items={[
                  { icon: CreditCard, label: "Checkout" },
                  { icon: Wallet, label: "Patient Ledger" },
                  { icon: Receipt, label: "Payment Hist." },
                  { icon: FileText, label: "Invoices" },
                  { icon: ShieldCheck, label: "Pre-Auth Info" },
                ]}
              />
              <CategoryCard
                tone="alert"
                icon={Bell}
                title="Alerts, Status & Support Tools"
                subtitle="Claims, referrals & external links"
                items={[
                  { icon: ShieldAlert, label: "Med. Alerts" },
                  { icon: CheckSquare, label: "Claim Status" },
                  { icon: Shield, label: "Preauth Status" },
                  { icon: Share2, label: "Referrals" },
                ]}
              />
            </div>

            {/* Patient summary banner */}
            <div className="rounded-xl border border-sky-200/60 dark:border-sky-900/40 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/20 p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Identity */}
                <div className="lg:col-span-5 flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                    <UserCircle2 className="w-16 h-16 text-muted-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-foreground">TEST2 TEST2</h2>
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                        Patient ID: #16665
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      <InfoRow icon={Mail} label="Email" value="na@na.com" />
                      <InfoRow icon={Cake} label="DOB" value="10-12-2015 [10 Yrs]" />
                      <InfoRow icon={Phone} label="Phone" value="445-555-5555" />
                      <InfoRow icon={User} label="Gender" value="Male" />
                      <InfoRow icon={MapPin} label="Address" value="nadfsdfsf, Lansdale 19446" />
                      <InfoRow icon={Stethoscope} label="Primary Doctor" value="N/A" />
                      <div className="sm:col-span-2 flex items-baseline gap-2 pt-1">
                        <DollarSign className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">Approx Balance</span>
                        <span className="text-base font-bold text-destructive">$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family */}
                <div className="lg:col-span-4 bg-card/70 dark:bg-card/40 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                      <Users className="w-4 h-4" /> Other Family Member (Our Patients)
                    </div>
                    <button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Add New Member</button>
                  </div>
                  <div className="grid grid-cols-5 text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border pb-1.5">
                    <span>Pat ID</span><span>Name</span><span>Relation</span><span>DOB</span><span>Sex</span>
                  </div>
                  <p className="text-center text-xs text-destructive py-4">No Records Found</p>
                </div>

                {/* Insurance */}
                <div className="lg:col-span-3 bg-card/70 dark:bg-card/40 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
                    <Shield className="w-4 h-4" /> Dental Insurance
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground border-b border-border pb-1.5 mb-2">
                    Insurance Detail
                  </div>
                  <p className="text-xs text-foreground">
                    DELTACARE USA(HMO-DMO-DHMO)(PA11A)<span className="font-semibold">[PRIMARY-As Self (E)]</span>
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border text-xs">
                    <button className="text-primary hover:underline">View Fees</button>
                    <span className="text-muted-foreground">SUB.ID <span className="text-foreground font-medium">111111111</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionPanel
                tone="info"
                icon={Calendar}
                title="Appointments History"
                action={<button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Appointment History For Insurance</button>}
              >
                <Table headers={["Date", "Time", "Doctor", "Remarks"]} rows={appointments.map(a => [a.date, a.time, a.doctor, a.remarks])} />
              </SectionPanel>

              <SectionPanel
                tone="finance"
                icon={Bell}
                title="Procedure History"
                action={<button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Full History</button>}
              >
                <Table headers={["DOS", "Code", "Tooth / Surface", "Doctor", "Insurance", "Office Fees", "Patient Resp."]} rows={[]} />
              </SectionPanel>

              <SectionPanel
                tone="clinical"
                icon={ClipboardList}
                title="Recent Tx History"
                action={<button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Full History</button>}
              >
                <Table headers={["Date", "Proc Type", "PR Code", "Tooth / Surface", "Doctor"]} rows={[]} />
              </SectionPanel>

              <SectionPanel tone="alert" icon={Bell} title="Recalls">
                <Table headers={["Code", "Date", "Start Doctor", "Interval", "Due Date", "Appt Date", "Appt Time", "Finish Doctor"]} rows={[]} />
              </SectionPanel>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-3.5 h-3.5 text-sky-600 mt-1 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-muted-foreground uppercase tracking-wide text-[10px] border-b border-border">
            {headers.map((h) => (
              <th key={h} className="py-2 pr-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center text-destructive py-6">No Records Found</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="py-2.5 pr-3 text-foreground">{c}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}