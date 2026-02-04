import { Phone, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Header() {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Office Address */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border">
          <span className="font-medium text-foreground">Office Address:</span>
          <span className="text-muted-foreground">
            5TH STREET-GD-MS, 6100 N 5TH ST, #2, Philadelphia, Pennsylvania, 19120
          </span>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">215-224-4343</span>
          </div>
        </div>
        <button className="text-primary hover:underline text-sm font-medium">
          Change Office
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-muted px-3 py-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">samir</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}