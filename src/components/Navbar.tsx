import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import NotificationBar from "./NotificationBar";

const Navbar = () => {
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b flex flex-col">
      <NotificationBar className="w-full" />
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-[#8A5A44]">Macchiato Suites</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
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
            to="/amenities"
            className={`transition-colors ${isActive('/amenities') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
          >
            Amenities
          </Link>
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
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">Book Now</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-bold text-[#8A5A44]">Menu</h2>
                  <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-4">
                  <SheetClose asChild>
                    <Link
                      to="/"
                      className={`text-lg font-medium transition-colors ${isActive('/') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                    >
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/rooms"
                      className={`text-lg font-medium transition-colors ${isActive('/rooms') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                    >
                      Rooms
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/amenities"
                      className={`text-lg font-medium transition-colors ${isActive('/amenities') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                    >
                      Amenities
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/gallery"
                      className={`text-lg font-medium transition-colors ${isActive('/gallery') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                    >
                      Gallery
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/contact"
                      className={`text-lg font-medium transition-colors ${isActive('/contact') ? 'text-[#C45D3A]' : 'text-neutral-800 hover:text-[#C45D3A]'}`}
                    >
                      Contact
                    </Link>
                  </SheetClose>
                </nav>
                <div className="mt-auto pt-6">
                  <Button className="w-full bg-[#C45D3A] hover:bg-[#A74B2F] text-white">Book Now</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Book Now Button */}
        <Button className="hidden md:flex bg-[#C45D3A] hover:bg-[#A74B2F] text-white">Book Now</Button>
      </div>
    </header>
  );
};

export default Navbar;
