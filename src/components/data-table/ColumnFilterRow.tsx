import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterColumn<K extends string> = {
  key: K;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
};

type ColumnFilterRowProps<K extends string> = {
  columns: FilterColumn<K>[];
  values: Record<K, string>;
  onChange: (key: K, value: string) => void;
  trailingEmptyCells?: number;
};

export function ColumnFilterRow<K extends string>({
  columns,
  values,
  onChange,
  trailingEmptyCells = 0,
}: ColumnFilterRowProps<K>) {
  return (
    <tr className="border-b border-border bg-muted/20">
      {columns.map((col) => (
        <th key={col.key} className="px-4 py-2 font-normal">
          {col.type === "select" ? (
            <Select value={values[col.key]} onValueChange={(v) => onChange(col.key, v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {(col.options ?? []).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder="Search..."
              className="h-8 text-xs"
              value={values[col.key]}
              onChange={(e) => onChange(col.key, e.target.value)}
            />
          )}
        </th>
      ))}
      {Array.from({ length: trailingEmptyCells }).map((_, i) => (
        <th key={`empty-${i}`} className="px-4 py-2" />
      ))}
    </tr>
  );
}
