import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import NotificationBar from "./NotificationBar";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BookingFormDialog } from "./BookingFormDialog";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pastHero, setPastHero] = useState(false);
  const lastScrollY = useRef(0);

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle scroll event with optimized performance
  useEffect(() => {
    // Use requestAnimationFrame for smoother performance
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight; // Assuming hero section is viewport height
      const isHomePage = location.pathname === '/';

      // Check if we've scrolled past the hero section
      const isPastHero = currentScrollY > heroHeight * 0.8; // 80% of hero height

      // Determine scroll direction with a small threshold to prevent flickering
      const scrollDifference = currentScrollY - lastScrollY.current;
      const isScrollingDown = scrollDifference > 2; // Only consider "scrolling down" if moved more than 2px
      const isScrollingUp = scrollDifference < -2; // Only consider "scrolling up" if moved more than 2px

      // Update scroll state
      const isScrolled = currentScrollY > 5;

      // Update navbar visibility
      if (isHomePage) {
        // Home page behavior: hide after hero section when scrolling down
        if (isPastHero) {
          // Past hero section: show when scrolling up, hide when scrolling down
          if (isScrollingDown) {
            setVisible(false);
          } else if (isScrollingUp) {
            setVisible(true);
          }
          // If neither significantly scrolling up or down, maintain current visibility
          setPastHero(true);
        } else {
          // In hero section: always show navbar
          setVisible(true);
          setPastHero(false);
        }
      } else {
        // Other pages behavior: show when scrolling up, hide when scrolling down
        // But only after scrolling down a bit (200px)
        if (currentScrollY > 200) {
          if (isScrollingDown) {
            setVisible(false);
          } else if (isScrollingUp) {
            setVisible(true);
          }
          // If neither significantly scrolling up or down, maintain current visibility
          setPastHero(true);
        } else {
          setVisible(true);
          setPastHero(false);
        }
      }

      // Update scrolled state for navbar style
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Save current scroll position
      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame to optimize performance
        window.requestAnimationFrame(() => {
          handleScroll();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrolled, location.pathname]);

  return (
    <header className={cn(
      "fixed w-full z-50 flex flex-col navbar-scroll-transition",
      scrolled ? "pt-2" : "pt-0",
      visible ? "navbar-visible" : "navbar-hidden",
      pastHero ? "pointer-events-auto" : "pointer-events-auto" // Always enable pointer events when visible
    )}>
      <NotificationBar scrolled={scrolled} visible={visible} />
      <div className={cn(
        "navbar-transition",
        scrolled
          ? "container mx-auto px-6 pb-2"
          : "w-full px-0 pb-0"
      )}>
        <div className={cn(
          "navbar-transition",
          scrolled
            ? "border border-[#E8C3A3] rounded-lg p-4 mx-0 bg-white/90 backdrop-blur-sm shadow-md"
            : "border-b border-[#E8C3A3]/50 rounded-none p-4 mx-0 bg-white/80 backdrop-blur-sm"
        )}>
          <div className="flex justify-between items-center">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`transition-colors ${isActive('/') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className={`transition-colors ${isActive('/rooms') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                Rooms
              </Link>
              <Link
                to="/menu"
                className={`transition-colors ${isActive('/menu') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                Menu
              </Link>
              <Link
                to="/about-us"
                className={`transition-colors ${isActive('/about-us') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                About Us
              </Link>
            </nav>

            {/* Center Logo - Desktop */}
            <Link to="/" className="hidden md:block text-2xl font-serif font-bold text-[#8A5A44]">
              Macchiato Suites
            </Link>

            {/* Mobile Logo */}
            <Link to="/" className="md:hidden text-2xl font-serif font-bold text-[#8A5A44]">
              Macchiato Suites
            </Link>

            {/* Right Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/gallery"
                className={`transition-colors ${isActive('/gallery') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                Gallery
              </Link>
              <Link
                to="/contact"
                className={`transition-colors ${isActive('/contact') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
              >
                Contact
              </Link>
              <BookingFormDialog />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-[#F9F5F2] transition-colors"
                  >
                    <Menu className="h-6 w-6 text-[#8A5A44]" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] p-3 bg-white/95 backdrop-blur-sm mobile-dropdown-menu rounded-lg">
                  <div className="text-[#8A5A44] font-serif font-semibold text-sm mb-1 pb-1 border-b border-[#E8C3A3]/30">
                    Menu
                  </div>
                  <nav className="flex flex-col space-y-1">
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        Home
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/rooms"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/rooms') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        Rooms
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/menu"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/menu') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        Menu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/about-us"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/about-us') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        About Us
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/gallery"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/gallery') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        Gallery
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <Link
                        to="/contact"
                        className={`text-sm font-medium transition-colors w-full ${isActive('/contact') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                      >
                        Contact
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#E8C3A3]/30 my-1" />
                    <DropdownMenuItem asChild className="cursor-pointer mobile-dropdown-item rounded-md p-1.5">
                      <BookingFormDialog
                        buttonClassName="w-full h-8 bg-[#C45D3A] hover:bg-[#A74B2F] text-white text-sm"
                      />
                    </DropdownMenuItem>
                  </nav>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
