import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  Wallet,
  Receipt,
  MoreHorizontal,
  MessageSquare,
  Bell,
  Filter,
  Search,
  UserCircle2,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  date: string;
  type: "invoice" | "claim" | "patient-payment" | "insurance-payment";
  title: string;
  details?: React.ReactNode;
  patient?: string;
  amount: string;
  amountTone?: "default" | "negative";
  expandable?: boolean;
  expandedContent?: React.ReactNode;
};

const typeMeta: Record<Row["type"], { label: string; bar: string; chip: string }> = {
  invoice: { label: "Invoice", bar: "bg-sky-400", chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  claim: { label: "Claim", bar: "bg-amber-400", chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "patient-payment": { label: "Patient Payment", bar: "bg-emerald-400", chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "insurance-payment": { label: "Insurance Payment", bar: "bg-violet-400", chip: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
};

function LineTable({ headers, rows, footer }: { headers: string[]; rows: (string | React.ReactNode)[][]; footer?: (string | React.ReactNode)[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-muted/30">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-muted-foreground uppercase tracking-wide text-[10px] border-b border-border bg-muted/50">
            {headers.map((h) => (
              <th key={h} className="py-2 px-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {r.map((c, j) => (
                <td key={j} className="py-2.5 px-3 text-foreground">{c}</td>
              ))}
            </tr>
          ))}
          {footer && (
            <tr className="bg-muted/60 font-semibold">
              {footer.map((c, j) => (
                <td key={j} className="py-2.5 px-3 text-foreground">{c}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TransactionRow({ row }: { row: Row }) {
  const [open, setOpen] = useState(row.expandable ?? false);
  const meta = typeMeta[row.type];

  return (
    <div className="border-b border-border last:border-0">
      <div className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 hover:bg-muted/40 transition-colors">
        <button
          onClick={() => row.expandable && setOpen(!open)}
          className={cn("col-span-2 flex items-center gap-2 text-left", !row.expandable && "cursor-default")}
        >
          {row.expandable ? (
            open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <span className="w-4" />
          )}
          <span className="text-xs text-foreground font-medium">{row.date}</span>
        </button>
        <div className="col-span-3 flex items-center gap-2">
          <span className={cn("w-1 h-5 rounded-full", meta.bar)} />
          <span className="text-xs font-semibold text-foreground">{row.title}</span>
        </div>
        <div className="col-span-4 text-xs text-muted-foreground truncate">{row.details}</div>
        <div className="col-span-2 text-xs text-foreground">{row.patient}</div>
        <div className="col-span-1 flex items-center justify-end gap-2">
          <span className={cn("text-xs font-bold", row.amountTone === "negative" ? "text-destructive" : "text-foreground")}>{row.amount}</span>
          <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>
      {open && row.expandedContent && (
        <div className="px-10 pb-4 pt-1 bg-muted/20">{row.expandedContent}</div>
      )}
    </div>
  );
}

const transactions: Row[] = [
  {
    id: "inv-5131",
    date: "Nov 19, 2020",
    type: "invoice",
    title: "Invoice #5131",
    details: <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold flex items-center justify-center">$</span> Patient: $152.00</span>,
    patient: "Denise Wingard",
    amount: "$274.00",
    expandable: true,
    expandedContent: (
      <LineTable
        headers={["Line item", "Site", "Provider", "Insurance", "Patient", "Total", "Amount owing"]}
        rows={[[
          "D2393 - Resin Based Restoration, Three Surfaces, Posterior",
          "20-MOD-Composite",
          "Greg Moses",
          <span className="inline-block px-2 py-0.5 rounded border border-border bg-card text-foreground">$67.20</span>,
          "$206.80",
          "$274.00",
          <span className="text-destructive font-semibold">$152.00</span>,
        ]]}
        footer={["Total", "", "", "$67.20", "$206.80", "$274.00", <span className="text-destructive">$152.00</span>]}
      />
    ),
  },
  {
    id: "claim-1136",
    date: "Nov 19, 2020",
    type: "claim",
    title: "Claim #1136",
    details: "CIGNA | Submitted | Claim tag: Open",
    patient: "",
    amount: "",
  },
  {
    id: "pp-5193",
    date: "Dec 10, 2020",
    type: "patient-payment",
    title: "Patient account payment #5193",
    details: "Denise Wingard | Visa",
    patient: "",
    amount: "($54.80) of ($89.00)",
    amountTone: "negative",
    expandable: true,
    expandedContent: (
      <LineTable
        headers={["Line item", "Site", "Provider", "Payment amount"]}
        rows={[
          [<span className="font-semibold">Nov 19, 2020 Invoice #5131 for Denise Wingard</span>, "", "", ""],
          ["D2393 - Resin Based Restoration, Three Surfaces, Posterior", "20-MOD-Composite", "Greg Moses", <span className="text-destructive">($54.80)</span>],
          [<span className="font-semibold">Dec 10, 2020 Invoice #5192 for Denise Wingard</span>, "", "", ""],
          ["D7140 - Extraction, erupted tooth or exposed root (elevation and/or forceps removal)", "3", "Greg Moses", <span className="text-destructive">($34.20)</span>],
        ]}
        footer={["", "", "Total", <span className="text-destructive">($89.00)</span>]}
      />
    ),
  },
  {
    id: "ins-5229",
    date: "Dec 10, 2020",
    type: "insurance-payment",
    title: "Insurance payment #5229",
    details: "CIGNA | Insurance EFT",
    patient: "",
    amount: "($67.20)",
    amountTone: "negative",
  },
];

const sideMenu = [
  "Profile", "Insurance", "Claims", "Billing", "Recare", "Education",
  "Charting", "Perio Charting", "Appointments", "Files and Letters",
  "Correspondence", "Notes", "Prescriptions",
];

const accountAging = [
  { label: "Account Holder", values: ["$0.00", "$0.00", "$0.00", "$948.80", "$948.80"] },
  { label: "Primary Insurance", values: ["$0.00", "$0.00", "$0.00", "$0.00", "$0.00"] },
  { label: "Other Insurance", values: ["$0.00", "$0.00", "$0.00", "$0.00", "$0.00"] },
];

export default function PatientBilling() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [active, setActive] = useState("Billing");

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Patient", href: "#" }, { label: "Billing" }]} />

          <div className="mt-4 grid grid-cols-12 gap-4">
            {/* Main column */}
            <div className="col-span-12 xl:col-span-9 space-y-4">
              {/* Toolbar */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-3 p-3 border-b border-border flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary/15">
                      <Plus className="w-3.5 h-3.5" /> Invoice
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/15">
                      <Plus className="w-3.5 h-3.5" /> Account payment <ChevronDown className="w-3 h-3" />
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-semibold hover:bg-sky-500/15">
                      <Plus className="w-3.5 h-3.5" /> Deposit
                    </button>
                    <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-primary text-xs font-semibold hover:bg-muted">
                      <FileText className="w-3.5 h-3.5" /> Statement
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-md bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80">
                      <Bell className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Responsible Party</label>
                      <select className="text-xs bg-card border border-border rounded-md px-2 py-1.5 pr-7 font-medium text-foreground">
                        <option>Denise Wingard</option>
                      </select>
                    </div>
                    <button className="w-8 h-8 mt-4 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold bg-muted/30 border-b border-border">
                  <div className="col-span-2 pl-6">Date</div>
                  <div className="col-span-3">Transaction</div>
                  <div className="col-span-4">Details</div>
                  <div className="col-span-2">Patient</div>
                  <div className="col-span-1 text-right">Amount</div>
                </div>

                {/* Rows */}
                <div>
                  {transactions.map((r) => (
                    <TransactionRow key={r.id} row={r} />
                  ))}
                </div>
              </div>

              {/* Account Summary */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Account Summary</h3>
                </div>
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-12 md:col-span-2 flex justify-center">
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(24 95% 53%)" strokeWidth="3.5" strokeDasharray="100 0" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground">90+</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-10 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted-foreground text-[10px] uppercase tracking-wide border-b border-border">
                          <th className="py-2 pr-3"></th>
                          <th className="py-2 px-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" />Past 30 Days</span></th>
                          <th className="py-2 px-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" />31-60</span></th>
                          <th className="py-2 px-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-600" />61-90</span></th>
                          <th className="py-2 px-3"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />Over 90</span></th>
                          <th className="py-2 px-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountAging.map((r) => (
                          <tr key={r.label} className="border-b border-border/50">
                            <td className="py-2 pr-3 font-medium text-foreground">{r.label}</td>
                            {r.values.slice(0, 4).map((v, i) => (
                              <td key={i} className="py-2 px-3 text-muted-foreground">{v}</td>
                            ))}
                            <td className="py-2 px-3 text-right font-semibold text-foreground">{r.values[4]}</td>
                          </tr>
                        ))}
                        <tr className="bg-muted/40 font-bold">
                          <td className="py-2.5 pr-3 text-foreground">Total</td>
                          <td className="py-2.5 px-3">$0.00</td>
                          <td className="py-2.5 px-3">$0.00</td>
                          <td className="py-2.5 px-3">$0.00</td>
                          <td className="py-2.5 px-3">$948.80</td>
                          <td className="py-2.5 px-3 text-right text-destructive">$948.80</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <aside className="col-span-12 xl:col-span-3 space-y-4">
              <div className="rounded-xl border-2 border-primary/60 bg-card shadow-sm p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="text" placeholder="Search patient" className="w-full pl-8 pr-9 py-1.5 rounded-md border border-border bg-background text-xs" />
                  <button className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <UserCircle2 className="w-9 h-9 text-muted-foreground/50" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-primary text-base leading-tight">Denise Wingard</p>
                    <p className="text-[11px] text-muted-foreground">Patient #16665</p>
                  </div>
                </div>
                <nav className="space-y-0.5">
                  {sideMenu.map((m) => (
                    <button
                      key={m}
                      onClick={() => setActive(m)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left",
                        active === m
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <ChevronRight className={cn("w-3.5 h-3.5", active === m ? "text-primary-foreground" : "text-primary")} />
                      <span>{m}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mini calendar */}
              <div className="rounded-xl border-2 border-primary/60 bg-card shadow-sm p-3">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <button className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span>August</span>
                    <span className="text-primary text-[11px] underline cursor-pointer">Today</span>
                    <span>2021</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <table className="w-full text-[11px] text-center">
                  <thead>
                    <tr className="text-muted-foreground">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                        <th key={d} className="py-1 font-medium">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    {[
                      [null,null,null,null,null,null,null].map((_,i)=>i===0?1:i+1),
                      [8,9,10,11,12,13,14],
                      [15,16,17,18,19,20,21],
                      [22,23,24,25,26,27,28],
                      [29,30,31,1,2,3,4],
                      [5,6,7,8,9,10,11],
                    ].map((row, ri) => (
                      <tr key={ri}>
                        {row.map((d, ci) => {
                          const muted = ri === 4 && ci >= 3 || ri === 5;
                          const isToday = d === 2 && ri === 0;
                          return (
                            <td key={ci} className="py-1">
                              <span className={cn(
                                "inline-flex w-6 h-6 items-center justify-center rounded-full",
                                muted && "text-muted-foreground/50",
                                isToday && "bg-destructive text-destructive-foreground font-bold"
                              )}>{d}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}