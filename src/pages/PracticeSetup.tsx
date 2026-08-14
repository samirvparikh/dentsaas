import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { ColumnFilterRow } from "@/components/data-table/ColumnFilterRow";
import { useDataTable, type DataTableColumn } from "@/hooks/useDataTable";
import { exportToCsv, exportToPdf } from "@/lib/table-export";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Building2,
  Building,
  UserRound,
  Shield,
  FileCode2,
  Store,
  BadgeCheck,
  Scale,
  MessageSquare,
  Landmark,
  ChevronRight,
  ChevronDown,
  Calendar,
  Save,
  Plus,
} from "lucide-react";

type SetupChild = { label: string; path: string };
type SetupSection = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: SetupChild[];
};

const setupSections: SetupSection[] = [
  {
    id: "corporation",
    label: "Corporation",
    icon: Building2,
    children: [
      { label: "Add Corporation", path: "/practice-setup/corporation/add" },
      { label: "Manage Corporation", path: "/practice-setup/corporation/manage" },
    ],
  },
  {
    id: "office",
    label: "Office",
    icon: Building,
    children: [
      { label: "Add Office", path: "/practice-setup/office/add" },
      { label: "Manage Offices", path: "/practice-setup/office/manage" },
    ],
  },
  {
    id: "provider",
    label: "Provider",
    icon: UserRound,
    children: [
      { label: "Add Provider", path: "/practice-setup/provider/add" },
      { label: "Manage Providers", path: "/practice-setup/provider/manage" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: Shield,
    children: [
      { label: "Add Insurance", path: "/practice-setup/insurance/add" },
      { label: "Manage Insurance", path: "/practice-setup/insurance/manage" },
    ],
  },
  {
    id: "ada-codes",
    label: "ADA Codes",
    icon: FileCode2,
    children: [
      { label: "Add Code", path: "/practice-setup/ada-codes/add" },
      { label: "Manage Codes", path: "/practice-setup/ada-codes/manage" },
    ],
  },
  {
    id: "dental-store",
    label: "Dental Store",
    icon: Store,
    children: [
      { label: "Catalog", path: "/practice-setup/dental-store/catalog" },
      { label: "Orders", path: "/practice-setup/dental-store/orders" },
    ],
  },
  {
    id: "credentialing",
    label: "Credentialing",
    icon: BadgeCheck,
    children: [
      { label: "Add Credential", path: "/practice-setup/credentialing/add" },
      { label: "Manage Credentials", path: "/practice-setup/credentialing/manage" },
    ],
  },
  {
    id: "business-rule",
    label: "Business Rule",
    icon: Scale,
    children: [
      { label: "Add Rule", path: "/practice-setup/business-rule/add" },
      { label: "Manage Rules", path: "/practice-setup/business-rule/manage" },
    ],
  },
  {
    id: "communication",
    label: "Communication / Directory",
    icon: MessageSquare,
    children: [
      { label: "Templates", path: "/practice-setup/communication/templates" },
      { label: "Directory", path: "/practice-setup/communication/directory" },
    ],
  },
  {
    id: "corporate-area",
    label: "Corporate Area",
    icon: Landmark,
    children: [
      { label: "Overview", path: "/practice-setup/corporate-area/overview" },
      { label: "Settings", path: "/practice-setup/corporate-area/settings" },
    ],
  },
];

const corporationSchema = z.object({
  displayName: z.string().trim().min(1, "Display Name is required").max(100),
  brandNames: z.string().trim().max(150).optional().or(z.literal("")),
  addressLine1: z.string().trim().min(1, "Address Line 1 is required").max(150),
  addressLine2: z.string().trim().max(150).optional().or(z.literal("")),
  townCity: z.string().min(1, "Town/City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^[\d\s\-()+]+$/, "Phone contains invalid characters"),
  fax: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  taxIdName: z.string().trim().min(1, "Tax Id Name is required").max(100),
  taxId: z.string().trim().min(1, "Tax Id is required").max(50),
  npiType: z.string().min(1, "Npi Type is required"),
  npiNumber: z.string().trim().min(1, "Npi Number is required").max(20),
  effectiveDate: z.string().optional().or(z.literal("")),
});

type CorporationFormData = z.infer<typeof corporationSchema>;

type CorporationRecord = {
  id: number;
  displayName: string;
  brandNames: string;
  townCity: string;
  stateProvince: string;
  phone: string;
  email: string;
  npiNumber: string;
  status: "Active" | "Inactive";
};

const mockCorporations: CorporationRecord[] = [
  {
    id: 1,
    displayName: "DentaLens Group LLC",
    brandNames: "DentaLens",
    townCity: "Newark",
    stateProvince: "NJ",
    phone: "973-555-0100",
    email: "admin@dentalens.com",
    npiNumber: "1234567890",
    status: "Active",
  },
  {
    id: 2,
    displayName: "Smile Care Partners",
    brandNames: "Smile Care",
    townCity: "Jersey City",
    stateProvince: "NJ",
    phone: "201-555-0142",
    email: "ops@smilecare.com",
    npiNumber: "1987654321",
    status: "Active",
  },
];

type CorpKey = "displayName" | "location" | "phone" | "email" | "npiNumber" | "status";

const corporationColumns: DataTableColumn<CorporationRecord, CorpKey>[] = [
  {
    key: "displayName",
    label: "Name",
    getText: (r) => `${r.displayName} ${r.brandNames}`,
    getSortValue: (r) => r.displayName,
  },
  {
    key: "location",
    label: "Location",
    getText: (r) => `${r.townCity}, ${r.stateProvince}`,
    getSortValue: (r) => `${r.townCity}, ${r.stateProvince}`,
  },
  { key: "phone", label: "Phone", getText: (r) => r.phone, getSortValue: (r) => r.phone },
  { key: "email", label: "Email", getText: (r) => r.email, getSortValue: (r) => r.email },
  { key: "npiNumber", label: "NPI", getText: (r) => r.npiNumber, getSortValue: (r) => r.npiNumber },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    getText: (r) => r.status,
    getSortValue: (r) => r.status,
  },
];

const corporationExportColumns = [
  { header: "Name", value: (r: CorporationRecord) => r.displayName },
  { header: "Brand", value: (r: CorporationRecord) => r.brandNames },
  { header: "Location", value: (r: CorporationRecord) => `${r.townCity}, ${r.stateProvince}` },
  { header: "Phone", value: (r: CorporationRecord) => r.phone },
  { header: "Email", value: (r: CorporationRecord) => r.email },
  { header: "NPI", value: (r: CorporationRecord) => r.npiNumber },
  { header: "Status", value: (r: CorporationRecord) => r.status },
];

function getActiveMeta(pathname: string) {
  for (const section of setupSections) {
    for (const child of section.children) {
      if (pathname === child.path || pathname.startsWith(child.path + "/")) {
        return { section, child };
      }
    }
  }
  return {
    section: setupSections[0],
    child: setupSections[0].children[0],
  };
}

function SetupMenu({ pathname }: { pathname: string }) {
  const active = getActiveMeta(pathname);
  const [openIds, setOpenIds] = useState<string[]>([active.section.id]);

  const toggle = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Setup Menu
        </p>
      </div>
      <nav className="p-2 space-y-0.5">
        {setupSections.map((section) => {
          const open = openIds.includes(section.id);
          const Icon = section.icon;
          const sectionActive = active.section.id === section.id;

          return (
            <Collapsible key={section.id} open={open} onOpenChange={() => toggle(section.id)}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    sectionActive
                      ? "bg-muted/60 text-foreground font-medium"
                      : "text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left truncate">{section.label}</span>
                  {open ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-3 pb-1 space-y-0.5">
                {section.children.map((child) => {
                  const isActive = pathname === child.path;
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </aside>
  );
}

function FormRow({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 items-start">
      <FormLabel className="md:pt-2.5 md:text-right text-sm text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FormLabel>
      <div className="space-y-1.5">
        {children}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}

function AddCorporationForm() {
  const navigate = useNavigate();
  const form = useForm<CorporationFormData>({
    resolver: zodResolver(corporationSchema),
    defaultValues: {
      displayName: "",
      brandNames: "",
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      stateProvince: "",
      country: "",
      phone: "",
      fax: "",
      email: "",
      taxIdName: "",
      taxId: "",
      npiType: "Group",
      npiNumber: "",
      effectiveDate: "",
    },
    mode: "onSubmit",
  });

  const errorCount = Object.keys(form.formState.errors).length;

  const onSubmit = (data: CorporationFormData) => {
    toast.success("Corporation created", {
      description: `${data.displayName} has been added to practice setup.`,
    });
    navigate("/practice-setup/corporation/manage");
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-6 py-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Add New Corporation</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a corporation profile for practice setup and billing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-primary">
          <button type="button" className="hover:underline" onClick={() => navigate(-1)}>
            Back
          </button>
          <span className="text-muted-foreground">|</span>
          <Link to="/practice-setup" className="hover:underline">
            Back To Practice Setup
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/dashboard" className="hover:underline">
            Back To Dashboard
          </Link>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        <p className="text-xs text-muted-foreground">
          Fields with <span className="text-destructive">*</span> are required.
        </p>

        {form.formState.isSubmitted && errorCount > 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Please fix {errorCount} required field{errorCount === 1 ? "" : "s"} below.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Display Name" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandNames"
              render={({ field }) => (
                <FormItem>
                  <FormRow label="Brand Names">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Address Line 1" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormRow label="Address Line 2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="townCity"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Town/City" required error={fieldState.error?.message}>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && "border-destructive focus:ring-destructive")}
                        >
                          <SelectValue placeholder="Select town/city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Newark">Newark</SelectItem>
                        <SelectItem value="Jersey City">Jersey City</SelectItem>
                        <SelectItem value="Paterson">Paterson</SelectItem>
                        <SelectItem value="Elizabeth">Elizabeth</SelectItem>
                        <SelectItem value="Trenton">Trenton</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateProvince"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="State/Province" required error={fieldState.error?.message}>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && "border-destructive focus:ring-destructive")}
                        >
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Country" required error={fieldState.error?.message}>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && "border-destructive focus:ring-destructive")}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Phone" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="xxx-xxx-xxxx"
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fax"
              render={({ field }) => (
                <FormItem>
                  <FormRow label="Fax">
                    <FormControl>
                      <Input {...field} placeholder="xxx-xxx-xxxx" />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Email" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxIdName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Tax Id Name" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Tax Id" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="npiType"
              render={({ field }) => (
                <FormItem>
                  <FormRow label="Npi Type">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select NPI type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="npiNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormRow label="Npi Number" required error={fieldState.error?.message}>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
                      />
                    </FormControl>
                  </FormRow>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effectiveDate"
              render={({ field }) => (
                <FormItem>
                  <FormRow label="Effective Date For Fictitious Name Regn.">
                    <div className="relative">
                      <FormControl>
                        <Input {...field} type="date" className="pr-10" />
                      </FormControl>
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </FormRow>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Save Corporation
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function ManageCorporation() {
  const columns = useMemo(() => corporationColumns, []);
  const table = useDataTable({
    data: mockCorporations,
    columns,
    initialSortKey: "displayName",
    initialSortDir: "asc",
  });

  const handleExportCsv = () => {
    exportToCsv("corporations", corporationExportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} corporation(s) as CSV`);
  };

  const handleExportPdf = () => {
    exportToPdf("corporations", "Corporations", corporationExportColumns, table.filtered);
    toast.success(`Exported ${table.filtered.length} corporation(s) as PDF`);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 px-6 py-5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Manage Corporation</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Showing {table.filtered.length} of {table.total} records
            </p>
          </div>
          <DataTableToolbar
            search={table.search}
            onSearchChange={table.setSearch}
            searchPlaceholder="Search corporations..."
            showFilters={table.showFilters}
            onToggleFilters={() => table.setShowFilters((v) => !v)}
            onRefresh={table.resetFilters}
            onExportCsv={handleExportCsv}
            onExportPdf={handleExportPdf}
            exportDisabled={table.filtered.length === 0}
          >
            <Button asChild className="gap-2">
              <Link to="/practice-setup/corporation/add">
                <Plus className="w-4 h-4" />
                Add
              </Link>
            </Button>
          </DataTableToolbar>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((col) => (
                <SortableHeader
                  key={col.key}
                  label={col.label}
                  columnKey={col.key}
                  sortKey={table.sortKey}
                  sortDir={table.sortDir}
                  onSort={table.handleSort}
                />
              ))}
            </tr>
            {table.showFilters && (
              <ColumnFilterRow
                columns={table.filterColumns}
                values={table.columnFilters}
                onChange={table.updateColumnFilter}
              />
            )}
          </thead>
          <tbody>
            {table.filtered.map((corp, index) => (
              <tr
                key={corp.id}
                className={cn(
                  "border-b border-border hover:bg-muted/30 transition-colors",
                  index % 2 === 1 && "bg-muted/15"
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{corp.displayName}</div>
                  {corp.brandNames && (
                    <div className="text-xs text-muted-foreground">{corp.brandNames}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {corp.townCity}, {corp.stateProvince}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{corp.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{corp.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{corp.npiNumber}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="border-success/30 text-success bg-success/10">
                    {corp.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">No corporations found.</div>
      )}
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{description}</p>
    </div>
  );
}

function PracticeSetupContent({ pathname }: { pathname: string }) {
  if (pathname === "/practice-setup/corporation/add" || pathname === "/practice-setup") {
    return <AddCorporationForm />;
  }
  if (pathname === "/practice-setup/corporation/manage") {
    return <ManageCorporation />;
  }

  const active = getActiveMeta(pathname);
  return (
    <PlaceholderPanel
      title={active.child.label}
      description={`${active.child.label} under ${active.section.label} will be available here. Use the setup menu to navigate other practice configuration areas.`}
    />
  );
}

export default function PracticeSetup() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const active = useMemo(() => getActiveMeta(pathname), [pathname]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Practice Setup", href: "/practice-setup" },
    { label: active.child.label },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-2 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Practice Setup</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Corporation, offices, providers, insurance and codes.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <SetupMenu pathname={pathname} />
            <div className="flex-1 min-w-0 w-full">
              <PracticeSetupContent pathname={pathname} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
