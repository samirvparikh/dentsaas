import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    id: "misc",
    title: "Misc Daily Activity Section",
    content: "Miscellaneous daily activities and tasks.",
  },
  {
    id: "claim",
    title: "Claim/Preauthorization Section",
    content: "Manage claims and preauthorization workflows.",
  },
  {
    id: "appointment",
    title: "Appointment Section",
    content: "Appointment scheduling and management tools.",
  },
  {
    id: "marketing",
    title: "Marketing Section",
    content: "Marketing campaigns and patient outreach.",
  },
  {
    id: "corporate",
    title: "Corporate Area Section",
    content: "Corporate management and reporting.",
  },
  {
    id: "other",
    title: "Other",
    content: "Additional tools and settings.",
  },
];

export function CollapsibleSections() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <Accordion type="multiple" className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border-b border-border last:border-0">
            <AccordionTrigger className="section-header hover:no-underline [&[data-state=open]]:bg-sidebar-accent [&>svg]:text-section-header-foreground">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="p-4 text-muted-foreground animate-fade-in">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
