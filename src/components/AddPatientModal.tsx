import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";

const patientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      return dob < today;
    }, "Date of birth must be in the past"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s\-\(\)\+]+$/,
      "Phone number contains invalid characters"
    )
    .min(10, "Phone number must be at least 10 digits"),
  address: z
    .string()
    .trim()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .max(50, "City must be less than 50 characters")
    .optional(),
  state: z
    .string()
    .trim()
    .max(50, "State must be less than 50 characters")
    .optional(),
  zipCode: z
    .string()
    .trim()
    .regex(/^[\d\-]*$/, "Invalid zip code format")
    .max(10, "Zip code must be less than 10 characters")
    .optional()
    .or(z.literal("")),
  insuranceId: z
    .string()
    .trim()
    .max(50, "Insurance ID must be less than 50 characters")
    .optional(),
  insuranceProvider: z
    .string()
    .trim()
    .max(100, "Insurance provider must be less than 100 characters")
    .optional(),
  memberId: z
    .string()
    .trim()
    .max(50, "Member ID must be less than 50 characters")
    .optional(),
  emergencyContactName: z
    .string()
    .trim()
    .max(100, "Emergency contact name must be less than 100 characters")
    .optional(),
  emergencyContactPhone: z
    .string()
    .trim()
    .regex(/^[\d\s\-\(\)\+]*$/, "Phone number contains invalid characters")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface AddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPatientModal({ open, onOpenChange }: AddPatientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      insuranceId: "",
      insuranceProvider: "",
      memberId: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log("Patient data:", data);
    toast.success("Patient registered successfully!", {
      description: `${data.firstName} ${data.lastName} has been added to the system.`,
    });
    
    form.reset();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-card to-muted/20">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <UserPlus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold">Register New Patient</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Fill in the patient details below
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4 bg-card/50 rounded-xl p-5 border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-lg">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="patient@email.com"
                          className="h-11 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4 bg-card/50 rounded-xl p-5 border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-muted-foreground">Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Philadelphia" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">State</FormLabel>
                        <FormControl>
                          <Input placeholder="PA" className="h-11 rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="19120" className="h-11 rounded-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="space-y-4 bg-card/50 rounded-xl p-5 border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="Delta Dental" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Insurance ID</FormLabel>
                      <FormControl>
                        <Input placeholder="INS-12345" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Member ID</FormLabel>
                      <FormControl>
                        <Input placeholder="MEM-67890" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4 bg-card/50 rounded-xl p-5 border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-destructive rounded-full" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" className="h-11 rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4 bg-card/50 rounded-xl p-5 border border-border/50 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-muted-foreground rounded-full" />
                Additional Notes
              </h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about the patient..."
                        className="min-h-[100px] rounded-lg resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Patient
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
