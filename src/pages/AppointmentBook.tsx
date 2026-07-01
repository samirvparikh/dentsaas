import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings2,
  Plus,
  Trash2,
  Ban,
  Building2,
  Stethoscope,
  Clock,
  ChevronLeft,
  ChevronRight,
  Printer,
  Eye,
  LayoutGrid,
  List as ListIcon,
  Search,
  UserPlus,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* ────────────────────────────────────────────── */
/* Types & mock data                              */
/* ────────────────────────────────────────────── */
type Doctor = { id: string; name: string };
type Office = { id: string; name: string };
type SideCol = { id: string; label: string; doctorId: string; officeId: string };
type BlockedRange = { id: string; sideId: string; start: string; end: string; reason: string };
type Appointment = {
  id: string;
  sideId: string;
  start: string; // HH:mm
  end: string;
  patient: string;
  type: string;
  status: "available" | "confirmed" | "allocated" | "message" | "blocked" | "not-available";
  plan?: "M" | "D" | "H" | "DH" | "L.M";
  phone?: string;
  dob?: string;
};

const defaultDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Rollins Thomas" },
  { id: "d2", name: "Dr. Smith" },
  { id: "d3", name: "Dr. Patel" },
];
const defaultOffices: Office[] = [
  { id: "o1", name: "5TH STREET-GD-MS" },
  { id: "o2", name: "Center City Branch" },
];
const defaultSides: SideCol[] = [
  { id: "s1", label: "Side 1", doctorId: "d1", officeId: "o1" },
  { id: "s2", label: "Side 2", doctorId: "d1", officeId: "o1" },
  { id: "s3", label: "Side 3", doctorId: "d1", officeId: "o1" },
  { id: "s4", label: "Side 4", doctorId: "d2", officeId: "o1" },
  { id: "s5", label: "Side 5", doctorId: "d2", officeId: "o1" },
  { id: "s6", label: "Side 6", doctorId: "d3", officeId: "o1" },
];
const seedAppointments: Appointment[] = [
  { id: "a1", sideId: "s1", start: "09:00", end: "09:30", patient: "JOHNSONN ELLA", type: "AWC 16X22", status: "confirmed", plan: "D", phone: "484-903-7236", dob: "02-27-2012" },
  { id: "a2", sideId: "s2", start: "09:00", end: "09:30", patient: "BRAKE ZOIEY", type: "EVAL SPAC", status: "confirmed", plan: "M", phone: "201-616-6586", dob: "08-28-2012" },
  { id: "a3", sideId: "s3", start: "09:00", end: "09:30", patient: "BRAKE ZAKAI", type: "EVAL SPAC", status: "confirmed", plan: "M", phone: "201-616-6586", dob: "10-09-2010" },
  { id: "a4", sideId: "s1", start: "09:30", end: "10:00", patient: "MCNUTT PHEONIX", type: "AWC .018", status: "allocated", plan: "M", phone: "484-597-1934", dob: "02-19-2012" },
  { id: "a5", sideId: "s2", start: "09:30", end: "10:00", patient: "HOLLENBACH OLIVIA", type: "EVAL BITE", status: "allocated", plan: "M", phone: "272-879-9001", dob: "09-17-2004" },
  { id: "a6", sideId: "s4", start: "09:30", end: "10:00", patient: "CURRY NEVAEH", type: "NEW PATIENT", status: "message", plan: "L.M", phone: "484-554-6555", dob: "02-15-2005" },
  { id: "a7", sideId: "s1", start: "10:00", end: "10:30", patient: "DELGADO GENESIS", type: "AWC", status: "confirmed", plan: "M", phone: "862-247-7212", dob: "03-03-2010" },
  { id: "a8", sideId: "s2", start: "10:00", end: "10:30", patient: "BALSECA SAMUEL", type: "NEW PATIENT", status: "confirmed", plan: "M", phone: "201-552-0729", dob: "05-12-2009" },
  { id: "a9", sideId: "s3", start: "10:00", end: "10:30", patient: "BALSECA VALARE JONAH", type: "NEW PATIENT", status: "confirmed", plan: "M", phone: "201-552-0729", dob: "07-29-2010" },
  { id: "a10", sideId: "s4", start: "10:00", end: "10:30", patient: "ESCOBAR TEJADA DARA", type: "CONSULTATION", status: "confirmed", plan: "M", phone: "484-375-5283", dob: "02-01-2013" },
];
const seedBlocks: BlockedRange[] = [
  { id: "b1", sideId: "s5", start: "09:00", end: "10:00", reason: "Blocked from patient search" },
  { id: "b2", sideId: "s6", start: "09:00", end: "10:00", reason: "Blocked from patient search" },
  { id: "b3", sideId: "s4", start: "10:30", end: "12:00", reason: "Out of office" },
  { id: "b4", sideId: "s5", start: "10:00", end: "12:00", reason: "Out of office" },
  { id: "b5", sideId: "s6", start: "10:00", end: "12:00", reason: "Out of office" },
];

/* ────────────────────────────────────────────── */
/* Helpers                                        */
/* ────────────────────────────────────────────── */
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const period = h >= 12 ? "PM" : "AM";
  const dh = h % 12 === 0 ? 12 : h % 12;
  return `${String(dh).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${period}`;
};
const SLOT = 15; // minutes per row
const ROW_H = 28; // px per slot

const statusStyle: Record<Appointment["status"], string> = {
  "not-available": "bg-[hsl(245,80%,85%)] text-foreground border-l-4 border-[hsl(245,70%,55%)]",
  available: "bg-card border border-border text-foreground",
  confirmed: "bg-[hsl(140,60%,80%)] text-foreground border-l-4 border-[hsl(140,55%,40%)]",
  allocated: "bg-[hsl(160,55%,75%)] text-foreground border-l-4 border-[hsl(160,50%,40%)]",
  message: "bg-[hsl(50,95%,80%)] text-foreground border-l-4 border-[hsl(45,90%,50%)]",
  blocked: "bg-muted text-muted-foreground border-l-4 border-border",
};

const legend: { label: string; key: Appointment["status"]; color: string }[] = [
  { label: "APPT. NOT AVAILABLE", key: "not-available", color: "bg-[hsl(245,80%,85%)]" },
  { label: "APPT. AVAILABLE", key: "available", color: "bg-card border border-border" },
  { label: "APPT. CONFIRMED", key: "confirmed", color: "bg-[hsl(140,60%,80%)]" },
  { label: "APPT. ALLOCATED", key: "allocated", color: "bg-[hsl(160,55%,75%)]" },
  { label: "APPT. LEFT MESSAGE", key: "message", color: "bg-[hsl(50,95%,80%)]" },
  { label: "APPT. BLOCKED", key: "blocked", color: "bg-muted" },
];

/* ────────────────────────────────────────────── */
/* Page                                           */
/* ────────────────────────────────────────────── */
export default function AppointmentBook() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [date, setDate] = useState("2026-05-27");

  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);
  const [offices, setOffices] = useState<Office[]>(defaultOffices);
  const [sides, setSides] = useState<SideCol[]>(defaultSides);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [blocks, setBlocks] = useState<BlockedRange[]>(seedBlocks);

  const [activeOffice, setActiveOffice] = useState<string>("o1");
  const [activeDoctor, setActiveDoctor] = useState<string>("all");

  // Schedule range (admin-managed)
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");

  const [manageOpen, setManageOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [view, setView] = useState<"block" | "list">("block");
  const [apptOpen, setApptOpen] = useState(false);
  const [apptPrefill, setApptPrefill] = useState<{ sideId?: string; start?: string; end?: string; existing?: Appointment } | null>(null);

  const startM = toMin(startTime);
  const endM = toMin(endTime);
  const slots = useMemo(() => {
    const arr: number[] = [];
    for (let t = startM; t < endM; t += SLOT) arr.push(t);
    return arr;
  }, [startM, endM]);

  const visibleSides = sides.filter(
    (s) =>
      s.officeId === activeOffice &&
      (activeDoctor === "all" || s.doctorId === activeDoctor)
  );

  const doctorOfSide = (sideId: string) =>
    doctors.find((d) => d.id === sides.find((s) => s.id === sideId)?.doctorId)?.name ?? "";

  /* ── admin actions ── */
  const addSide = () => {
    const id = `s${Date.now()}`;
    setSides((p) => [
      ...p,
      {
        id,
        label: `Side ${p.length + 1}`,
        doctorId: doctors[0]?.id ?? "",
        officeId: activeOffice,
      },
    ]);
  };
  const removeSide = (id: string) => setSides((p) => p.filter((s) => s.id !== id));
  const updateSide = (id: string, patch: Partial<SideCol>) =>
    setSides((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addDoctor = (name: string) =>
    name && setDoctors((p) => [...p, { id: `d${Date.now()}`, name }]);
  const addOffice = (name: string) =>
    name && setOffices((p) => [...p, { id: `o${Date.now()}`, name }]);

  const addBlock = (b: Omit<BlockedRange, "id">) => {
    setBlocks((p) => [...p, { ...b, id: `b${Date.now()}` }]);
    toast({ title: "Time blocked", description: `${b.start} – ${b.end}` });
  };
  const removeBlock = (id: string) => setBlocks((p) => p.filter((b) => b.id !== id));

  const openNewAppt = (prefill: { sideId?: string; start?: string; end?: string; existing?: Appointment } | null = null) => {
    setApptPrefill(prefill);
    setApptOpen(true);
  };
  const saveAppt = (a: Omit<Appointment, "id"> & { id?: string }) => {
    setAppointments((p) => {
      if (a.id) return p.map((x) => (x.id === a.id ? { ...(a as Appointment) } : x));
      return [...p, { ...a, id: `a${Date.now()}` } as Appointment];
    });
    toast({ title: a.id ? "Appointment updated" : "Appointment saved", description: `${a.patient} · ${a.start}–${a.end}` });
  };

  /* ────────────────────────── */
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={[{ label: "Appointment" }, { label: "Book" }]} />

          {/* ── Toolbar ── */}
          <div className="mt-4 bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Office</Label>
                <Select value={activeOffice} onValueChange={setActiveOffice}>
                  <SelectTrigger className="w-56">
                    <Building2 className="w-4 h-4 mr-1 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Doctor</Label>
                <Select value={activeDoctor} onValueChange={setActiveDoctor}>
                  <SelectTrigger className="w-56">
                    <Stethoscope className="w-4 h-4 mr-1 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Start time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-32" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End time</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-32" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="h-9 w-9"><ChevronLeft className="w-4 h-4" /></Button>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
                  <Button size="icon" variant="outline" className="h-9 w-9"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {/* View toggle */}
                <div className="inline-flex rounded-md border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setView("block")}
                    className={cn(
                      "px-3 h-9 text-xs font-medium flex items-center gap-1.5 transition-colors",
                      view === "block" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Block view
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={cn(
                      "px-3 h-9 text-xs font-medium flex items-center gap-1.5 border-l border-border transition-colors",
                      view === "list" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    <ListIcon className="w-3.5 h-3.5" /> List view
                  </button>
                </div>
                <Button size="sm" onClick={() => openNewAppt(null)}>
                  <CalendarPlus className="w-4 h-4 mr-1.5" /> Add Appt
                </Button>
                <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1.5" /> Snapview</Button>
                <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-1.5" /> Print</Button>
                <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Ban className="w-4 h-4 mr-1.5" /> Block Time</Button>
                  </DialogTrigger>
                  <BlockTimeDialog sides={visibleSides} onAdd={addBlock} onClose={() => setBlockOpen(false)} />
                </Dialog>
                <Dialog open={manageOpen} onOpenChange={setManageOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Settings2 className="w-4 h-4 mr-1.5" /> Manage</Button>
                  </DialogTrigger>
                  <ManageDialog
                    doctors={doctors}
                    offices={offices}
                    sides={sides}
                    blocks={blocks}
                    addDoctor={addDoctor}
                    addOffice={addOffice}
                    addSide={addSide}
                    removeSide={removeSide}
                    updateSide={updateSide}
                    removeBlock={removeBlock}
                  />
                </Dialog>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border">
              {legend.map((l) => (
                <div key={l.key} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("w-3.5 h-3.5 rounded-sm", l.color)} />
                  <span className="text-muted-foreground font-medium">{l.label}</span>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-3 text-xs">
                <span className="font-semibold text-destructive">[M]</span><span className="text-muted-foreground">MEDICAID</span>
                <span className="font-semibold text-destructive">[D]</span><span className="text-muted-foreground">DMO</span>
                <span className="font-semibold text-destructive">[H]</span><span className="text-muted-foreground">HMO</span>
                <span className="font-semibold text-destructive">[DH]</span><span className="text-muted-foreground">DHMO</span>
              </div>
            </div>
          </div>

          {/* ── Calendar grid (block view) ── */}
          {view === "block" && (
          <div className="mt-4 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Header row */}
            <div
              className="grid bg-secondary/60 border-b border-border text-xs font-semibold uppercase tracking-wide"
              style={{ gridTemplateColumns: `80px repeat(${visibleSides.length}, minmax(160px, 1fr)) 80px` }}
            >
              <div className="p-2 text-center text-muted-foreground border-r border-border">Time</div>
              {visibleSides.map((s) => (
                <div key={s.id} className="p-2 border-r border-border text-center">
                  <div className="text-foreground">{s.label}</div>
                  <div className="text-[10px] font-normal text-muted-foreground normal-case truncate">
                    {doctors.find((d) => d.id === s.doctorId)?.name}
                  </div>
                </div>
              ))}
              <div className="p-2 text-center text-muted-foreground">Time</div>
            </div>

            {/* Body */}
            <div
              className="grid relative"
              style={{
                gridTemplateColumns: `80px repeat(${visibleSides.length}, minmax(160px, 1fr)) 80px`,
                gridAutoRows: `${ROW_H}px`,
              }}
            >
              {/* time + cells */}
              {slots.map((t, rowIdx) => (
                <RowCells
                  key={t}
                  t={t}
                  rowIdx={rowIdx}
                  visibleSides={visibleSides}
                  onCellClick={(sideId, startMin) =>
                    openNewAppt({
                      sideId,
                      start: `${String(Math.floor(startMin / 60)).padStart(2, "0")}:${String(startMin % 60).padStart(2, "0")}`,
                      end: `${String(Math.floor((startMin + 30) / 60)).padStart(2, "0")}:${String((startMin + 30) % 60).padStart(2, "0")}`,
                    })
                  }
                />
              ))}

              {/* Appointments overlay */}
              {visibleSides.map((side, colIdx) =>
                appointments
                  .filter((a) => a.sideId === side.id)
                  .map((a) => {
                    const top = ((toMin(a.start) - startM) / SLOT) * ROW_H;
                    const height = ((toMin(a.end) - toMin(a.start)) / SLOT) * ROW_H - 2;
                    if (toMin(a.start) < startM || toMin(a.end) > endM) return null;
                    return (
                      <div
                        key={a.id}
                        onClick={() => openNewAppt({ existing: a })}
                        className={cn(
                          "absolute rounded-md p-1.5 text-[11px] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer",
                          statusStyle[a.status]
                        )}
                        style={{
                          top,
                          height,
                          left: `calc(80px + ${colIdx} * ((100% - 160px) / ${visibleSides.length}) + 2px)`,
                          width: `calc((100% - 160px) / ${visibleSides.length} - 4px)`,
                        }}
                      >
                        <div className="font-bold leading-tight truncate">
                          {a.patient}{" "}
                          {a.plan && <span className="text-destructive font-semibold">[{a.plan}]</span>}
                        </div>
                        <div className="text-[10px] opacity-75 truncate">{a.dob} · {a.phone}</div>
                        <div className="text-[10px] truncate">{a.type}</div>
                      </div>
                    );
                  })
              )}

              {/* Blocks overlay */}
              {visibleSides.map((side, colIdx) =>
                blocks
                  .filter((b) => b.sideId === side.id)
                  .map((b) => {
                    const top = ((toMin(b.start) - startM) / SLOT) * ROW_H;
                    const height = ((toMin(b.end) - toMin(b.start)) / SLOT) * ROW_H - 2;
                    if (toMin(b.start) < startM || toMin(b.end) > endM) return null;
                    return (
                      <div
                        key={b.id}
                        className="absolute rounded-md bg-muted/80 border border-dashed border-border p-1.5 text-[11px] text-muted-foreground overflow-hidden"
                        style={{
                          top,
                          height,
                          left: `calc(80px + ${colIdx} * ((100% - 160px) / ${visibleSides.length}) + 2px)`,
                          width: `calc((100% - 160px) / ${visibleSides.length} - 4px)`,
                        }}
                      >
                        <div className="font-semibold uppercase text-[10px] tracking-wide">Blocked</div>
                        <div className="text-[10px] truncate">{b.reason}</div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
          )}

          {/* ── List view ── */}
          {view === "list" && (
            <div className="mt-4 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">DOB</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Side</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Doctor</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter((a) => visibleSides.some((s) => s.id === a.sideId))
                      .sort((a, b) => toMin(a.start) - toMin(b.start))
                      .map((a) => {
                        const side = sides.find((s) => s.id === a.sideId);
                        return (
                          <tr
                            key={a.id}
                            onClick={() => openNewAppt({ existing: a })}
                            className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{fmt(toMin(a.start))} – {fmt(toMin(a.end))}</td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {a.patient} {a.plan && <span className="text-destructive text-xs ml-1">[{a.plan}]</span>}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{a.phone}</td>
                            <td className="px-4 py-3 text-muted-foreground">{a.dob}</td>
                            <td className="px-4 py-3 text-foreground">{a.type}</td>
                            <td className="px-4 py-3 text-muted-foreground">{side?.label}</td>
                            <td className="px-4 py-3 text-muted-foreground">{doctorOfSide(a.sideId)}</td>
                            <td className="px-4 py-3">
                              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize", statusStyle[a.status])}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {appointments.filter((a) => visibleSides.some((s) => s.id === a.sideId)).length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">No appointments found.</div>
                )}
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Showing {visibleSides.length} columns · {slots.length} slots ({SLOT}-min each) from{" "}
            {fmt(startM)} to {fmt(endM)}
          </p>

          {/* Appointment dialog */}
          <Dialog open={apptOpen} onOpenChange={setApptOpen}>
            <AppointmentDialog
              key={apptOpen ? "open" : "closed"}
              sides={visibleSides}
              doctors={doctors}
              prefill={apptPrefill}
              onSave={(a) => { saveAppt(a); setApptOpen(false); }}
              onClose={() => setApptOpen(false)}
            />
          </Dialog>
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Row helper                                     */
/* ────────────────────────────────────────────── */
function RowCells({
  t,
  rowIdx,
  visibleSides,
  onCellClick,
}: {
  t: number;
  rowIdx: number;
  visibleSides: SideCol[];
  onCellClick?: (sideId: string, startMin: number) => void;
}) {
  const isHour = t % 60 === 0;
  return (
    <>
      <div
        className={cn(
          "border-r border-border px-2 text-[10px] text-muted-foreground flex items-start pt-1",
          isHour ? "border-t-2 border-t-border/60 bg-secondary/30" : "border-t border-border/40"
        )}
      >
        {isHour && fmt(t)}
      </div>
      {visibleSides.map((s) => (
        <div
          key={s.id + t}
          onClick={() => onCellClick?.(s.id, t)}
          className={cn(
            "border-r border-border hover:bg-primary/5 cursor-pointer transition-colors",
            isHour ? "border-t-2 border-t-border/60" : "border-t border-border/40"
          )}
        />
      ))}
      <div
        className={cn(
          "px-2 text-[10px] text-muted-foreground flex items-start pt-1",
          isHour ? "border-t-2 border-t-border/60 bg-secondary/30" : "border-t border-border/40"
        )}
      >
        {isHour && fmt(t)}
      </div>
    </>
  );
}

/* ────────────────────────────────────────────── */
/* Appointment dialog (Search patient → Save)     */
/* ────────────────────────────────────────────── */
type PatientRow = { id: string; name: string; phone: string; dob: string; insurance?: string };
const mockPatients: PatientRow[] = [
  { id: "p1", name: "JOHNSONN ELLA", phone: "484-903-7236", dob: "02-27-2012", insurance: "D" },
  { id: "p2", name: "BRAKE ZOIEY", phone: "201-616-6586", dob: "08-28-2012", insurance: "M" },
  { id: "p3", name: "MCNUTT PHEONIX", phone: "484-597-1934", dob: "02-19-2012", insurance: "M" },
  { id: "p4", name: "DELGADO GENESIS", phone: "862-247-7212", dob: "03-03-2010", insurance: "M" },
  { id: "p5", name: "BALSECA SAMUEL", phone: "201-552-0729", dob: "05-12-2009", insurance: "M" },
  { id: "p6", name: "CURRY NEVAEH", phone: "484-554-6555", dob: "02-15-2005", insurance: "L.M" },
];

function AppointmentDialog({
  sides,
  doctors,
  prefill,
  onSave,
  onClose,
}: {
  sides: SideCol[];
  doctors: Doctor[];
  prefill: { sideId?: string; start?: string; end?: string; existing?: Appointment } | null;
  onSave: (a: Omit<Appointment, "id"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const existing = prefill?.existing;
  const [step, setStep] = useState<"search" | "form">(existing ? "form" : "search");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PatientRow | null>(
    existing ? { id: "x", name: existing.patient, phone: existing.phone ?? "", dob: existing.dob ?? "", insurance: existing.plan } : null
  );

  const [sideId, setSideId] = useState(existing?.sideId ?? prefill?.sideId ?? sides[0]?.id ?? "");
  const [start, setStart] = useState(existing?.start ?? prefill?.start ?? "09:00");
  const [end, setEnd] = useState(existing?.end ?? prefill?.end ?? "09:30");
  const [type, setType] = useState(existing?.type ?? "");
  const [status, setStatus] = useState<Appointment["status"]>(existing?.status ?? "confirmed");

  const results = mockPatients.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.dob.includes(query)
  );

  const pickPatient = (p: PatientRow) => {
    setSelected(p);
    setStep("form");
  };

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-primary" />
          {existing ? "Edit Appointment" : step === "search" ? "Add Appointment · Find Patient" : "Add Appointment · Details"}
        </DialogTitle>
        <DialogDescription>
          {step === "search"
            ? "Search for an existing patient before creating the appointment."
            : "Fill in appointment information and save."}
        </DialogDescription>
      </DialogHeader>

      {step === "search" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search by name, phone, or DOB…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="border border-border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">DOB</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Ins.</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => pickPatient(p)}
                    className="border-t border-border hover:bg-primary/5 cursor-pointer"
                  >
                    <td className="px-3 py-2 font-medium text-foreground">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.phone}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.dob}</td>
                    <td className="px-3 py-2 text-destructive font-semibold">[{p.insurance}]</td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Button variant="outline" size="sm" onClick={() => pickPatient({ id: "new", name: query || "NEW PATIENT", phone: "", dob: "", insurance: "M" })}>
              <UserPlus className="w-4 h-4 mr-1.5" /> Use as new patient
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}

      {step === "form" && selected && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">{selected.name} {selected.insurance && <span className="text-destructive text-xs ml-1">[{selected.insurance}]</span>}</div>
              <div className="text-xs text-muted-foreground">{selected.phone} · DOB {selected.dob || "—"}</div>
            </div>
            {!existing && (
              <Button variant="ghost" size="sm" onClick={() => setStep("search")}>Change</Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Side / Operatory</Label>
              <Select value={sideId} onValueChange={setSideId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sides.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label} · {doctors.find((d) => d.id === s.doctorId)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Appointment["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="allocated">Allocated</SelectItem>
                  <SelectItem value="message">Left Message</SelectItem>
                  <SelectItem value="not-available">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Start</Label>
              <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">End</Label>
              <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Appointment Type</Label>
              <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. EVAL, AWC, NEW PATIENT" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              onClick={() =>
                onSave({
                  id: existing?.id,
                  sideId,
                  start,
                  end,
                  patient: selected.name,
                  type: type || "APPT",
                  status,
                  plan: (selected.insurance as Appointment["plan"]) ?? undefined,
                  phone: selected.phone,
                  dob: selected.dob,
                })
              }
            >
              <CalendarPlus className="w-4 h-4 mr-1.5" /> {existing ? "Update" : "Save Appointment"}
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}

/* ────────────────────────────────────────────── */
/* Manage dialog                                  */
/* ────────────────────────────────────────────── */
function ManageDialog({
  doctors,
  offices,
  sides,
  blocks,
  addDoctor,
  addOffice,
  addSide,
  removeSide,
  updateSide,
  removeBlock,
}: {
  doctors: Doctor[];
  offices: Office[];
  sides: SideCol[];
  blocks: BlockedRange[];
  addDoctor: (n: string) => void;
  addOffice: (n: string) => void;
  addSide: () => void;
  removeSide: (id: string) => void;
  updateSide: (id: string, patch: Partial<SideCol>) => void;
  removeBlock: (id: string) => void;
}) {
  const [newDoctor, setNewDoctor] = useState("");
  const [newOffice, setNewOffice] = useState("");

  return (
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Manage Appointment Settings</DialogTitle>
        <DialogDescription>Admin only — configure doctors, offices, side columns and blocks.</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Doctors */}
        <section>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-primary" /> Doctors</h4>
          <div className="flex gap-2 mb-2">
            <Input placeholder="New doctor name" value={newDoctor} onChange={(e) => setNewDoctor(e.target.value)} />
            <Button onClick={() => { addDoctor(newDoctor); setNewDoctor(""); }}><Plus className="w-4 h-4" /></Button>
          </div>
          <ul className="text-sm space-y-1">
            {doctors.map((d) => <li key={d.id} className="px-3 py-1.5 rounded bg-muted/50">{d.name}</li>)}
          </ul>
        </section>

        {/* Offices */}
        <section>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Offices</h4>
          <div className="flex gap-2 mb-2">
            <Input placeholder="New office name" value={newOffice} onChange={(e) => setNewOffice(e.target.value)} />
            <Button onClick={() => { addOffice(newOffice); setNewOffice(""); }}><Plus className="w-4 h-4" /></Button>
          </div>
          <ul className="text-sm space-y-1">
            {offices.map((o) => <li key={o.id} className="px-3 py-1.5 rounded bg-muted/50">{o.name}</li>)}
          </ul>
        </section>

        {/* Sides */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Side Columns</h4>
            <Button size="sm" onClick={addSide}><Plus className="w-4 h-4 mr-1" /> Add Side</Button>
          </div>
          <div className="space-y-2">
            {sides.map((s) => (
              <div key={s.id} className="grid grid-cols-12 gap-2 items-center bg-muted/40 rounded p-2">
                <Input className="col-span-3" value={s.label} onChange={(e) => updateSide(s.id, { label: e.target.value })} />
                <Select value={s.doctorId} onValueChange={(v) => updateSide(s.id, { doctorId: v })}>
                  <SelectTrigger className="col-span-4"><SelectValue /></SelectTrigger>
                  <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={s.officeId} onValueChange={(v) => updateSide(s.id, { officeId: v })}>
                  <SelectTrigger className="col-span-4"><SelectValue /></SelectTrigger>
                  <SelectContent>{offices.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="col-span-1" onClick={() => removeSide(s.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Blocks */}
        <section>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Ban className="w-4 h-4 text-destructive" /> Blocked Times</h4>
          <ul className="text-sm space-y-1">
            {blocks.length === 0 && <li className="text-muted-foreground italic">No blocks defined.</li>}
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-3 py-1.5 rounded bg-muted/50">
                <span>
                  <strong>{sides.find((s) => s.id === b.sideId)?.label}</strong> · {b.start}–{b.end} · {b.reason}
                </span>
                <Button size="icon" variant="ghost" onClick={() => removeBlock(b.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DialogContent>
  );
}

/* ────────────────────────────────────────────── */
/* Block dialog                                   */
/* ────────────────────────────────────────────── */
function BlockTimeDialog({
  sides,
  onAdd,
  onClose,
}: {
  sides: SideCol[];
  onAdd: (b: Omit<BlockedRange, "id">) => void;
  onClose: () => void;
}) {
  const [sideId, setSideId] = useState(sides[0]?.id ?? "");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [reason, setReason] = useState("");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Ban className="w-4 h-4 text-destructive" /> Block Time</DialogTitle>
        <DialogDescription>Mark a time range on a side as unavailable.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Side</Label>
          <Select value={sideId} onValueChange={setSideId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{sides.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Start</Label>
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">End</Label>
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div>
          <Label className="text-xs">Reason</Label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Lunch, Training" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (!sideId) return;
            onAdd({ sideId, start, end, reason: reason || "Blocked" });
            onClose();
          }}
        >
          <Clock className="w-4 h-4 mr-1.5" /> Block
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}