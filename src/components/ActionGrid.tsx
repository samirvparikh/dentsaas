import {
  BookOpen,
  Calendar,
  Stethoscope,
  UserCheck,
  UserX,
  GripVertical,
  ClipboardList,
  Search,
  CalendarCheck,
  CalendarX,
  Phone,
  RotateCcw,
  UserPlus,
  Receipt,
  Upload,
  Printer,
  FileSearch,
  FileText,
  Users,
  UserCog,
  FileSpreadsheet,
  DollarSign,
  AlertTriangle,
  CreditCard,
  Wallet,
  ClipboardCheck,
  FileBarChart,
  CalendarDays,
} from "lucide-react";

interface ActionItem {
  icon: React.ElementType;
  label: string;
  highlight?: boolean;
}

const dailyRoutineActions: ActionItem[] = [
  { icon: BookOpen, label: "Patient's App Book" },
  { icon: Calendar, label: "Today's Appointment List" },
  { icon: Stethoscope, label: "Today's Procedure" },
  { icon: UserCheck, label: "Today's Patient In" },
  { icon: UserX, label: "Today's Patient Out" },
  { icon: GripVertical, label: "Drag & Drop Scheduler" },
  { icon: ClipboardList, label: "Patient Registration Form" },
  { icon: Search, label: "Search Appointment" },
  { icon: CalendarCheck, label: "Proposed Appointments" },
  { icon: CalendarX, label: "Appointments Not Allocated" },
  { icon: Phone, label: "Cold Contact List" },
  { icon: RotateCcw, label: "6 Month Recall List" },
  { icon: UserPlus, label: "Eligibility Status Form" },
  { icon: Receipt, label: "Daily Receipt" },
  { icon: Upload, label: "Upload Documents" },
  { icon: Printer, label: "Print Form" },
  { icon: FileSearch, label: "Search Lost Documents" },
  { icon: FileText, label: "Preauth Report" },
  { icon: Users, label: "View Referrals" },
  { icon: UserCog, label: "Doctor Screen" },
  { icon: UserPlus, label: "Import Patient" },
  { icon: Users, label: "Patient Multiple IDs" },
  { icon: FileSpreadsheet, label: "Insurance Fee Schedules" },
  { icon: DollarSign, label: "Patient Invoice Followup" },
  { icon: AlertTriangle, label: "Claim / Preauth Immediate Attention", highlight: true },
  { icon: CreditCard, label: "Restricted Payment Allocation" },
  { icon: Wallet, label: "Patient Outstanding Balance" },
  { icon: ClipboardCheck, label: "Claim Status" },
  { icon: FileBarChart, label: "ADP Report" },
  { icon: CalendarDays, label: "Ortho Appointment" },
];

interface ActionGridProps {
  title: string;
  actions: ActionItem[];
}

function ActionGridSection({ title, actions }: ActionGridProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="section-header flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        {title}
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`action-card group ${action.highlight ? "border-destructive/50 bg-destructive/5" : ""}`}
            >
              <div 
                className={`action-card-icon flex-shrink-0 ${
                  action.highlight 
                    ? "bg-destructive/10 animate-blink" 
                    : "group-hover:scale-110 transition-transform duration-200"
                }`}
              >
                <action.icon 
                  className={`w-4 h-4 ${
                    action.highlight 
                      ? "text-destructive" 
                      : "text-action-icon"
                  }`} 
                />
              </div>
              <span 
                className={`text-left text-sm leading-tight ${
                  action.highlight 
                    ? "text-destructive font-medium" 
                    : "text-foreground"
                }`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActionGrid() {
  return (
    <ActionGridSection
      title="Patient's Section Daily Routine"
      actions={dailyRoutineActions}
    />
  );
}
