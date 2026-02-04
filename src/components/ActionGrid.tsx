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
  { icon: Calendar, label: "Today's Appointment..." },
  { icon: Stethoscope, label: "Today's Procedure" },
  { icon: UserCheck, label: "Today's Patient In" },
  { icon: UserX, label: "Today's Patient Out" },
  { icon: GripVertical, label: "Drag & Drop..." },
  { icon: ClipboardList, label: "Patient Registration From..." },
  { icon: Search, label: "Search Appointment..." },
  { icon: CalendarCheck, label: "Proposed Appointments" },
  { icon: CalendarX, label: "Appts Not Allocated" },
  { icon: Phone, label: "Cold Contact List" },
  { icon: RotateCcw, label: "6 Month Recall List" },
  { icon: UserPlus, label: "Eligibility Status From..." },
  { icon: Receipt, label: "Daily Receipt" },
  { icon: Upload, label: "Upload Documents" },
  { icon: Printer, label: "Print Form" },
  { icon: FileSearch, label: "Search Lost Documents" },
  { icon: FileText, label: "Preauth Report" },
  { icon: Users, label: "View Referrals" },
  { icon: UserCog, label: "Doctor Screen" },
  { icon: UserPlus, label: "Import Patient..." },
  { icon: Users, label: "Pat Multiple Ids..." },
  { icon: FileSpreadsheet, label: "Ins Fees Schedules" },
  { icon: DollarSign, label: "Patient Invoice Followup" },
  { icon: AlertTriangle, label: "Claim / Preauth Immediate Attention", highlight: true },
  { icon: CreditCard, label: "Restricted Payment Allocation..." },
  { icon: Wallet, label: "Patient with Outstanding Balance" },
  { icon: ClipboardCheck, label: "Claim Status" },
  { icon: FileBarChart, label: "ADP Report" },
  { icon: CalendarDays, label: "Ortho Appt." },
];

interface ActionGridProps {
  title: string;
  actions: ActionItem[];
}

function ActionGridSection({ title, actions }: ActionGridProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="section-header">{title}</div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`action-card ${action.highlight ? "text-destructive border-destructive/30" : ""}`}
            >
              <div className={`action-card-icon ${action.highlight ? "bg-destructive/10" : ""}`}>
                <action.icon className={`w-4 h-4 ${action.highlight ? "text-destructive" : ""}`} />
              </div>
              <span className="text-left truncate flex-1">{action.label}</span>
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
