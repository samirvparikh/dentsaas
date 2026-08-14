import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortDir } from "@/hooks/useDataTable";

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/70" />;
  return dir === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 text-primary" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-primary" />
  );
}

type SortableHeaderProps<K extends string> = {
  label: string;
  columnKey: K;
  sortKey: K;
  sortDir: SortDir;
  onSort: (key: K) => void;
};

export function SortableHeader<K extends string>({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
}: SortableHeaderProps<K>) {
  return (
    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        {label}
        <SortIcon active={sortKey === columnKey} dir={sortDir} />
      </button>
    </th>
  );
}
