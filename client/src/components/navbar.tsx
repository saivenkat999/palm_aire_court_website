import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/stays", label: "Stays" },
    { href: "/rates", label: "Rates" },
    { href: "/amenities", label: "Amenities" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/assets/Logo.png" 
                alt="Palm Aire Court Logo" 
                className="h-10 w-auto"
              />
              <span className="font-display font-bold text-xl text-primary hidden sm:inline">
                Palm Aire Court
              </span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? "text-primary font-medium"
                      : "text-gray-700 hover:text-primary"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              data-testid="search-button"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/stays">
              <Button data-testid="check-availability-button">
                Check Availability
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                data-testid="mobile-menu-trigger"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="font-display font-bold text-lg text-primary"
                  data-testid="mobile-home-link"
                >
                  Palm Aire Court
                </Link>
                
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`p-2 rounded-lg transition-colors ${
                        location === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-muted"
                      }`}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                <Link href="/stays" className="mt-6">
                  <Button className="w-full" data-testid="mobile-check-availability">
                    Check Availability
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
