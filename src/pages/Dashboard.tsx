import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Users,
  CalendarCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Stethoscope,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

/* ── Mock data ── */
const stats = [
  {
    label: "Total Patients",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    label: "Today's Appointments",
    value: "42",
    change: "+5",
    trend: "up",
    icon: CalendarCheck,
    color: "success",
  },
  {
    label: "Pending Claims",
    value: "18",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    color: "warning",
  },
  {
    label: "Monthly Revenue",
    value: "$84,250",
    change: "+8.4%",
    trend: "up",
    icon: DollarSign,
    color: "primary",
  },
];

const appointmentData = [
  { name: "Mon", scheduled: 45, completed: 38 },
  { name: "Tue", scheduled: 52, completed: 48 },
  { name: "Wed", scheduled: 48, completed: 42 },
  { name: "Thu", scheduled: 55, completed: 50 },
  { name: "Fri", scheduled: 40, completed: 35 },
  { name: "Sat", scheduled: 20, completed: 18 },
  { name: "Sun", scheduled: 10, completed: 8 },
];

const revenueData = [
  { name: "Week 1", revenue: 18500 },
  { name: "Week 2", revenue: 22100 },
  { name: "Week 3", revenue: 19800 },
  { name: "Week 4", revenue: 23850 },
];

const procedureData = [
  { name: "Cleaning", value: 35, color: "hsl(var(--primary))" },
  { name: "Fillings", value: 25, color: "hsl(var(--success))" },
  { name: "Extraction", value: 15, color: "hsl(var(--warning))" },
  { name: "Ortho", value: 15, color: "hsl(var(--destructive))" },
  { name: "Other", value: 10, color: "hsl(var(--muted))" },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Sarah Johnson",
    time: "09:00 AM",
    type: "Cleaning",
    doctor: "Dr. Smith",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Michael Chen",
    time: "09:30 AM",
    type: "Root Canal",
    doctor: "Dr. Lee",
    status: "confirmed",
  },
  {
    id: 3,
    patient: "Emily Davis",
    time: "10:00 AM",
    type: "Consultation",
    doctor: "Dr. Smith",
    status: "waiting",
  },
  {
    id: 4,
    patient: "Robert Wilson",
    time: "10:30 AM",
    type: "Filling",
    doctor: "Dr. Patel",
    status: "confirmed",
  },
  {
    id: 5,
    patient: "Lisa Anderson",
    time: "11:00 AM",
    type: "Extraction",
    doctor: "Dr. Lee",
    status: "confirmed",
  },
];

const recentActivity = [
  { id: 1, text: "New patient registered: James Miller", time: "5 min ago", icon: Users },
  { id: 2, text: "Claim #4821 approved by insurance", time: "12 min ago", icon: FileText },
  { id: 3, text: "Appointment rescheduled for Sarah Johnson", time: "28 min ago", icon: CalendarCheck },
  { id: 4, text: "Dr. Smith checked in", time: "45 min ago", icon: Stethoscope },
  { id: 5, text: "Payment received: $350 from Michael Chen", time: "1 hr ago", icon: DollarSign },
];

/* ── Stat card ── */
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const Icon = stat.icon;
  const isUp = stat.trend === "up";
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          <div className="flex items-center gap-1.5">
            {isUp ? (
              <ArrowUpRight className="w-4 h-4 text-success" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-destructive" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isUp ? "text-success" : "text-destructive"
              )}
            >
              {stat.change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            stat.color === "primary" && "bg-primary/10 text-primary",
            stat.color === "success" && "bg-success/10 text-success",
            stat.color === "warning" && "bg-warning/10 text-warning"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

/* ── Custom tooltip for charts ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-popover-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Page ── */
export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 space-y-6">
            {/* ── Stats row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Appointment trends */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Appointment Trends</h3>
                    <p className="text-xs text-muted-foreground">Scheduled vs Completed — Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Scheduled
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Completed
                    </span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentData}>
                      <defs>
                        <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="scheduled" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScheduled)" name="Scheduled" />
                      <Area type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Procedure breakdown */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-1">Procedures</h3>
                <p className="text-xs text-muted-foreground mb-4">By volume this month</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={procedureData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                        {procedureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {procedureData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-muted-foreground">{p.name}</span>
                      <span className="ml-auto font-medium text-foreground">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue bar chart */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Revenue</h3>
                    <p className="text-xs text-muted-foreground">Weekly overview</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming appointments */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
                    <p className="text-xs text-muted-foreground">Today — May 27, 2026</p>
                  </div>
                  <button className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary text-xs font-semibold leading-tight">
                        <Clock className="w-3.5 h-3.5 mb-0.5" />
                        {apt.time.split(" ")[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{apt.patient}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.type} · {apt.doctor}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full",
                          apt.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground">Live updates from your practice</p>
                  </div>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  {recentActivity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-action-icon" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-snug">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
