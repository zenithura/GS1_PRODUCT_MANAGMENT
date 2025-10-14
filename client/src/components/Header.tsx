import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Package } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3" data-testid="link-home">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Digital Link Generator</h1>
              <p className="text-xs text-muted-foreground">GS1 Product Management</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
