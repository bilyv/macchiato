
import { Button } from "@/components/ui/button";
import { ArrowRight, BedDouble, Coffee, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-[#8A5A44]">Macchiato Suites</div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Home</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Rooms</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Amenities</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Gallery</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Contact</Link>
          </nav>
          <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">Book Now</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-white">
              <span className="text-[#E8C3A3]">Luxurious</span> <span className="text-[#C45D3A]">Comfort</span> in the Heart of the City
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Experience unparalleled elegance and tranquility at Macchiato Suites, 
              where every stay is crafted for perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
                Book Your Stay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                Explore Rooms
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-[#8A5A44]">
            Why Choose Macchiato Suites?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-6">
                <BedDouble className="h-7 w-7 text-[#C45D3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Luxurious Rooms</h3>
              <p className="text-neutral-600">
                Our spacious suites are designed for comfort with premium bedding and elegant decor.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-6">
                <Coffee className="h-7 w-7 text-[#C45D3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Fine Dining</h3>
              <p className="text-neutral-600">
                Enjoy our award-winning restaurant serving gourmet meals made from local ingredients.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-6">
                <Wifi className="h-7 w-7 text-[#C45D3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Modern Amenities</h3>
              <p className="text-neutral-600">
                From high-speed WiFi to spa services, we offer everything for a comfortable stay.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Room Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#8A5A44]">
            Our Elegant Suites
          </h2>
          <p className="text-lg text-neutral-600 mb-10">
            Discover our collection of thoughtfully designed accommodations
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room Card 1 */}
            <div className="group rounded-lg overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070" 
                  alt="Deluxe Suite" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Deluxe Suite</h3>
                <p className="text-neutral-600 mb-4">Spacious room with king-size bed and city view</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C45D3A]">$299 <span className="text-sm font-normal text-neutral-500">/night</span></span>
                  <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Room Card 2 */}
            <div className="group rounded-lg overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070" 
                  alt="Executive Suite" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Executive Suite</h3>
                <p className="text-neutral-600 mb-4">Luxury suite with separate living area and balcony</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C45D3A]">$499 <span className="text-sm font-normal text-neutral-500">/night</span></span>
                  <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Room Card 3 */}
            <div className="group rounded-lg overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070" 
                  alt="Penthouse Suite" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Penthouse Suite</h3>
                <p className="text-neutral-600 mb-4">Ultimate luxury with panoramic views and private terrace</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C45D3A]">$799 <span className="text-sm font-normal text-neutral-500">/night</span></span>
                  <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button className="bg-[#8A5A44] hover:bg-[#6B4636] text-white">
              View All Rooms <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Experience the Ultimate Luxury Stay
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your stay today and enjoy exclusive amenities and personalized service
          </p>
          <Button size="lg" className="bg-white text-[#C45D3A] hover:bg-neutral-100">
            Book Now and Save 15% <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#332A27] text-white/80 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4 text-white">Macchiato Suites</h3>
              <p className="mb-4">
                Luxury accommodations with exceptional service and unforgettable experiences.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Rooms & Suites</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Dining</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Amenities</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>123 Luxury Avenue</li>
                <li>New York, NY 10001</li>
                <li>+1 (555) 123-4567</li>
                <li>info@macchiatosuites.com</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Newsletter</h4>
              <p className="mb-4">Subscribe to receive special offers and updates</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 text-neutral-800 rounded-l-md w-full focus:outline-none"
                />
                <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] rounded-l-none">
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm">
            © {new Date().getFullYear()} Macchiato Suites. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
