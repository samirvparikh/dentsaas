import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

export type DataTableColumn<T, K extends string = string> = {
  key: K;
  label: string;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
  getText: (row: T) => string;
  getSortValue: (row: T) => string | number;
  searchable?: boolean;
};

type UseDataTableOptions<T, K extends string> = {
  data: T[];
  columns: DataTableColumn<T, K>[];
  initialSortKey: K;
  initialSortDir?: SortDir;
};

export function useDataTable<T, K extends string>({
  data,
  columns,
  initialSortKey,
  initialSortDir = "asc",
}: UseDataTableOptions<T, K>) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<K>(initialSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir);

  const emptyFilters = useMemo(() => {
    const init = {} as Record<K, string>;
    columns.forEach((col) => {
      init[col.key] = col.type === "select" ? "all" : "";
    });
    return init;
  }, [columns]);

  const [columnFilters, setColumnFilters] = useState<Record<K, string>>(() => {
    const init = {} as Record<K, string>;
    columns.forEach((col) => {
      init[col.key] = col.type === "select" ? "all" : "";
    });
    return init;
  });

  const handleSort = (key: K) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const updateColumnFilter = (key: K, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearch("");
    setColumnFilters(emptyFilters);
    setSortKey(initialSortKey);
    setSortDir(initialSortDir);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const colMap = Object.fromEntries(columns.map((c) => [c.key, c])) as Record<K, DataTableColumn<T, K>>;

    let rows = data.filter((row) => {
      if (q) {
        const haystack = columns
          .filter((c) => c.searchable !== false)
          .map((c) => c.getText(row))
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      for (const col of columns) {
        const filterValue = columnFilters[col.key];
        if (!filterValue || filterValue === "all") continue;
        if (!col.getText(row).toLowerCase().includes(filterValue.trim().toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    const activeCol = colMap[sortKey];
    rows = [...rows].sort((a, b) => {
      const av = activeCol.getSortValue(a);
      const bv = activeCol.getSortValue(b);
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [data, search, columnFilters, columns, sortKey, sortDir]);

  const filterColumns = useMemo(
    () =>
      columns.map((c) => ({
        key: c.key,
        type: c.type,
        options: c.options,
      })),
    [columns]
  );

  return {
    search,
    setSearch,
    showFilters,
    setShowFilters,
    sortKey,
    sortDir,
    handleSort,
    columnFilters,
    updateColumnFilter,
    resetFilters,
    filtered,
    total: data.length,
    filterColumns,
  };
}
