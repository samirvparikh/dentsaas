import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PatientSearch } from "@/components/PatientSearch";
import { ActionGrid } from "@/components/ActionGrid";
import { CollapsibleSections } from "@/components/CollapsibleSections";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Network Station", href: "#" },
    { label: "Front Office", href: "#" },
    { label: "FrontDesk" },
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
          
          <div className="space-y-4">
            <PatientSearch />
            <ActionGrid />
            <CollapsibleSections />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
