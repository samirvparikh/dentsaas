import { Moon, Sun, Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme, colorThemes, ColorTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const themeColors: Record<ColorTheme, string> = {
  teal: "bg-[hsl(174,62%,35%)]",
  blue: "bg-[hsl(210,80%,50%)]",
  purple: "bg-[hsl(270,70%,50%)]",
  rose: "bg-[hsl(340,75%,55%)]",
  amber: "bg-[hsl(38,92%,50%)]",
};

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, toggleMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-muted"
        >
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
              themeColors[colorTheme]
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        
        {/* Mode Toggle */}
        <DropdownMenuItem
          onClick={toggleMode}
          className="flex items-center gap-3 cursor-pointer"
        >
          {mode === "light" ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Color Theme
        </DropdownMenuLabel>

        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className={cn(
                "h-4 w-4 rounded-full",
                themeColors[theme.id]
              )}
            />
            <span className="flex-1">{theme.name}</span>
            {colorTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
