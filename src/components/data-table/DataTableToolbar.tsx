import { Filter, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportMenu } from "@/components/data-table/ExportMenu";

type DataTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh?: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  exportDisabled?: boolean;
  children?: React.ReactNode;
};

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  showFilters,
  onToggleFilters,
  onRefresh,
  onExportCsv,
  onExportPdf,
  exportDisabled,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto lg:justify-end">
      <div className="relative w-full sm:w-72 lg:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <Button variant="outline" className="gap-2" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
        <Button
          variant={showFilters ? "default" : "outline"}
          className="gap-2"
          onClick={onToggleFilters}
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <ExportMenu disabled={exportDisabled} onExportCsv={onExportCsv} onExportPdf={onExportPdf} />
        {children}
      </div>
    </div>
  );
}
