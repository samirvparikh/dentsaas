import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExportMenuProps = {
  disabled?: boolean;
  onExportCsv: () => void;
  onExportPdf: () => void;
};

export function ExportMenu({ disabled, onExportCsv, onExportPdf }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={disabled}>
          <Download className="w-4 h-4" />
          Export
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onExportCsv}>
          <FileSpreadsheet className="w-4 h-4" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onExportPdf}>
          <FileText className="w-4 h-4" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
