import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PatientSearch() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Search Patient</h2>
        <button className="p-2 hover:bg-muted rounded-md transition-colors">
          <UserPlus className="w-5 h-5 text-primary" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Patient ID</label>
            <input
              type="text"
              placeholder="Enter Number"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Phone Number</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">S# S# No-</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Member Id2 (S#S#NO.)</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>

          {/* Row 2 */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">First Name</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">DOB</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5 lg:col-span-2 flex items-end gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm text-muted-foreground">Member Id1 (INS ID)</label>
              <input
                type="text"
                className="search-input w-full"
              />
            </div>
            <Button className="h-9 px-6">
              <Search className="w-4 h-4 mr-2" />
              SEARCH
            </Button>
          </div>

          {/* Row 3 */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Last Name</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Insurance Id</label>
            <input
              type="text"
              className="search-input w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
