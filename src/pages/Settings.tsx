import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Plug,
  Database,
  Globe,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Section = ({ title, description, children }: SectionProps) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    <Separator />
  </div>
);

const Field = ({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2 space-y-2" : "space-y-2"}>
    <Label className="text-sm">{label}</Label>
    {children}
  </div>
);

const ToggleRow = ({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 py-2 md:col-span-2">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <Switch defaultChecked={defaultChecked} />
  </div>
);

export default function Settings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your changes have been saved." });
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((s) => !s)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your practice, account, billing, and app preferences.
                </p>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>

            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full h-auto">
                <TabsTrigger value="practice" className="gap-2">
                  <Building2 className="w-4 h-4" /> Practice
                </TabsTrigger>
                <TabsTrigger value="account" className="gap-2">
                  <User className="w-4 h-4" /> Account
                </TabsTrigger>
                <TabsTrigger value="appointments" className="gap-2">
                  <Database className="w-4 h-4" /> Appointments
                </TabsTrigger>
                <TabsTrigger value="billing" className="gap-2">
                  <CreditCard className="w-4 h-4" /> Billing
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="w-4 h-4" /> Alerts
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="w-4 h-4" /> Security
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette className="w-4 h-4" /> Appearance
                </TabsTrigger>
                <TabsTrigger value="integrations" className="gap-2">
                  <Plug className="w-4 h-4" /> Integrations
                </TabsTrigger>
              </TabsList>

              {/* PRACTICE */}
              <TabsContent value="practice" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Practice Information" description="Basic details about your dental practice.">
                  <Field label="Practice Name">
                    <Input defaultValue="DentaLens Clinic" />
                  </Field>
                  <Field label="Legal Entity Name">
                    <Input defaultValue="DentaLens LLC" />
                  </Field>
                  <Field label="Tax ID / EIN">
                    <Input defaultValue="00-0000000" />
                  </Field>
                  <Field label="NPI Number">
                    <Input defaultValue="1234567890" />
                  </Field>
                  <Field label="Phone">
                    <Input defaultValue="215-224-4343" />
                  </Field>
                  <Field label="Email">
                    <Input type="email" defaultValue="info@dentalens.com" />
                  </Field>
                  <Field label="Website">
                    <Input defaultValue="https://dentalens.com" />
                  </Field>
                  <Field label="Timezone">
                    <Select defaultValue="est">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern (EST)</SelectItem>
                        <SelectItem value="cst">Central (CST)</SelectItem>
                        <SelectItem value="mst">Mountain (MST)</SelectItem>
                        <SelectItem value="pst">Pacific (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Office Address" full>
                    <Textarea defaultValue="6100 N 5TH ST, #2, Philadelphia, Pennsylvania, 19120" rows={2} />
                  </Field>
                </Section>

                <Section title="Working Hours" description="Default office hours used in scheduling.">
                  <Field label="Start Time">
                    <Input type="time" defaultValue="08:00" />
                  </Field>
                  <Field label="End Time">
                    <Input type="time" defaultValue="18:00" />
                  </Field>
                  <Field label="Working Days">
                    <Select defaultValue="mon-fri">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mon-fri">Monday – Friday</SelectItem>
                        <SelectItem value="mon-sat">Monday – Saturday</SelectItem>
                        <SelectItem value="all">All Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Default Appointment Duration">
                    <Select defaultValue="30">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </Section>
              </TabsContent>

              {/* ACCOUNT */}
              <TabsContent value="account" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Profile" description="Personal information for the signed-in user.">
                  <Field label="First Name"><Input defaultValue="Samir" /></Field>
                  <Field label="Last Name"><Input defaultValue="Admin" /></Field>
                  <Field label="Email"><Input type="email" defaultValue="samir@dentalens.com" /></Field>
                  <Field label="Phone"><Input defaultValue="+1 215 000 0000" /></Field>
                  <Field label="Role">
                    <Select defaultValue="admin">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="staff">Front Desk</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Language">
                    <Select defaultValue="en">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </Section>
              </TabsContent>

              {/* APPOINTMENTS */}
              <TabsContent value="appointments" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Appointment Defaults" description="Configure scheduling behavior across the app.">
                  <Field label="Default View">
                    <Select defaultValue="day">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Slot Interval">
                    <Select defaultValue="15">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 min</SelectItem>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Buffer Between Appointments (min)">
                    <Input type="number" defaultValue="5" />
                  </Field>
                  <Field label="Max Attachment Size (MB)">
                    <Input type="number" defaultValue="10" />
                  </Field>
                  <ToggleRow label="Allow Online Booking" description="Patients can self-schedule from the portal." defaultChecked />
                  <ToggleRow label="Require Insurance Verification" description="Block bookings without verified insurance." />
                  <ToggleRow label="Send Reminder Emails" defaultChecked />
                  <ToggleRow label="Send Reminder SMS" defaultChecked />
                </Section>
              </TabsContent>

              {/* BILLING */}
              <TabsContent value="billing" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Billing & Plan" description="Manage your DentaLens subscription.">
                  <Field label="Current Plan">
                    <Select defaultValue="pro">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter – $49/mo</SelectItem>
                        <SelectItem value="pro">Pro – $149/mo</SelectItem>
                        <SelectItem value="enterprise">Enterprise – Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Billing Cycle">
                    <Select defaultValue="monthly">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual (save 20%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Currency">
                    <Select defaultValue="usd">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Tax Rate (%)"><Input type="number" defaultValue="6" /></Field>
                  <Field label="Billing Email" full><Input type="email" defaultValue="billing@dentalens.com" /></Field>
                </Section>
              </TabsContent>

              {/* NOTIFICATIONS */}
              <TabsContent value="notifications" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Notifications" description="Choose how you'd like to be notified.">
                  <ToggleRow label="New Appointment Booked" defaultChecked />
                  <ToggleRow label="Appointment Cancelled" defaultChecked />
                  <ToggleRow label="Patient Check-in" />
                  <ToggleRow label="Payment Received" defaultChecked />
                  <ToggleRow label="Claim Status Updates" defaultChecked />
                  <ToggleRow label="Weekly Practice Summary" description="Receive a digest every Monday." defaultChecked />
                </Section>
              </TabsContent>

              {/* SECURITY */}
              <TabsContent value="security" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Security" description="Protect your account and patient data.">
                  <Field label="Current Password"><Input type="password" placeholder="••••••••" /></Field>
                  <Field label="New Password"><Input type="password" placeholder="••••••••" /></Field>
                  <Field label="Session Timeout (minutes)">
                    <Select defaultValue="30">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                        <SelectItem value="120">120</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Password Policy">
                    <Select defaultValue="strong">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ chars)</SelectItem>
                        <SelectItem value="strong">Strong (12+ mixed)</SelectItem>
                        <SelectItem value="hipaa">HIPAA Recommended</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <ToggleRow label="Two-Factor Authentication" description="Require a code in addition to password." defaultChecked />
                  <ToggleRow label="Audit Log" description="Track all changes for compliance." defaultChecked />
                  <ToggleRow label="IP Whitelist" description="Restrict access to specific networks." />
                </Section>
              </TabsContent>

              {/* APPEARANCE */}
              <TabsContent value="appearance" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Appearance" description="Customize the look and feel of DentaLens.">
                  <Field label="Date Format">
                    <Select defaultValue="mdy">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Time Format">
                    <Select defaultValue="12">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <ToggleRow label="Compact Sidebar by Default" />
                  <ToggleRow label="Show Onboarding Tips" defaultChecked />
                  <p className="text-xs text-muted-foreground md:col-span-2">
                    Tip: theme color and dark mode can be changed from the header switcher.
                  </p>
                </Section>
              </TabsContent>

              {/* INTEGRATIONS */}
              <TabsContent value="integrations" className="mt-6 bg-card border border-border rounded-lg p-6 space-y-6">
                <Section title="Integrations" description="Connect DentaLens to other services.">
                  <ToggleRow label="Google Calendar Sync" description="Two-way sync for appointments." />
                  <ToggleRow label="Stripe Payments" description="Accept patient payments online." defaultChecked />
                  <ToggleRow label="Twilio SMS" description="Send appointment reminders via SMS." defaultChecked />
                  <ToggleRow label="Mailchimp" description="Sync patients to marketing lists." />
                  <ToggleRow label="QuickBooks" description="Export accounting data." />
                  <Field label="API Webhook URL" full>
                    <Input placeholder="https://your-app.com/webhooks/dentalens" />
                  </Field>
                </Section>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}