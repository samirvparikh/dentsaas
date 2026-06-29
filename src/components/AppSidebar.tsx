import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Building2,
  ClipboardList,
  Stethoscope,
  Scan,
  FileSignature,
  BarChart3,
  Clipboard,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/dentalens-logo.png.asset.json";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Appointment", icon: Building2, url: "/appointment/book" },
  { title: "Accounts", icon: Clipboard, url: "/patient/billing" },
  { title: "Treatment Plan", icon: ClipboardList, url: "/treatment-plan" },
  { title: "Chart", icon: Stethoscope, url: "/chart" },
  { title: "Imaging", icon: Scan, url: "/imaging" },
  { title: "Electronic Form", icon: FileSignature, url: "/electronic-form" },
  { title: "Report", icon: BarChart3, url: "/report" },
  { title: "Setting", icon: Settings, url: "/settings" },
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
        "min-h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out flex-shrink-0",
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
          <div className="ml-3 flex items-center gap-2">
            <img src={logoAsset.url} alt="DentaLens" className="h-8 w-8 object-contain" />
            <span className="font-bold text-base text-sidebar-primary tracking-tight">
              DENTA<span className="font-normal text-sidebar-muted">LENS</span>
            </span>
          </div>
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
