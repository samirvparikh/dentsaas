import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Building2,
  Users,
  Briefcase,
  Shield,
  UsersRound,
  CheckSquare,
  Clipboard,
  DollarSign,
  Scale,
  FileText,
  CreditCard,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Practice Setup", icon: Settings, url: "/practice-setup" },
  { title: "Front Office", icon: Building2, url: "/front-office" },
  { title: "Patient Waiting Area", icon: Users, url: "/patient-waiting" },
  { title: "Corporate/Central Office", icon: Briefcase, url: "/corporate" },
  { title: "Back Office", icon: Clipboard, url: "/back-office" },
  { title: "Admin", icon: Shield, url: "/admin" },
  { title: "Group Appts", icon: UsersRound, url: "/group-appts" },
  { title: "Group Eligibility", icon: CheckSquare, url: "/group-eligibility" },
  { title: "Group Procedures", icon: Clipboard, url: "/group-procedures" },
  { title: "Accounting", icon: DollarSign, url: "/accounting" },
  { title: "Legal Department", icon: Scale, url: "/legal" },
  { title: "eForm", icon: FileText, url: "/eform" },
  { title: "eCard", icon: CreditCard, url: "/ecard" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo Header */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        {!collapsed && (
          <span className="ml-3 font-bold text-lg text-sidebar-primary tracking-tight">
            DENT<span className="font-normal text-sidebar-muted">SAAS</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item-active"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
