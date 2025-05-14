import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Rooms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A5A44]">
              Our Luxury Accommodations
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Discover our range of thoughtfully designed rooms and suites, each offering a unique blend of comfort, 
              style, and modern conveniences to ensure a restful stay.
            </p>
          </div>
        </div>
      </section>
      
      {/* Rooms Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-[#8A5A44] text-center">Featured Rooms</h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="group p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070" 
                      alt="Deluxe Room" 
                      className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Deluxe Room</h3>
                    <p className="text-neutral-600 mb-4">Spacious accommodation with a king-size bed and city views.</p>
                    <span className="font-bold text-[#C45D3A]">From $299 per night</span>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="group p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070" 
                      alt="Executive Suite" 
                      className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Executive Suite</h3>
                    <p className="text-neutral-600 mb-4">Elegant suite with separate living area and premium amenities.</p>
                    <span className="font-bold text-[#C45D3A]">From $499 per night</span>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="group p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070" 
                      alt="Penthouse Suite" 
                      className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Penthouse Suite</h3>
                    <p className="text-neutral-600 mb-4">Ultimate luxury with panoramic views and private terrace.</p>
                    <span className="font-bold text-[#C45D3A]">From $799 per night</span>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="group p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074" 
                      alt="Family Suite" 
                      className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Family Suite</h3>
                    <p className="text-neutral-600 mb-4">Spacious suite with two bedrooms, perfect for families.</p>
                    <span className="font-bold text-[#C45D3A]">From $599 per night</span>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative static translate-y-0" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>
      
      {/* Room Showcase */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-[#8A5A44] text-center">All Accommodations</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room Card 1 */}
            <div className="group rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-200 hover:shadow-md transition-all">
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
            <div className="group rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-200 hover:shadow-md transition-all">
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
            <div className="group rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-200 hover:shadow-md transition-all">
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
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your stay today and enjoy exclusive amenities and personalized service
          </p>
          <Button size="lg" className="bg-white text-[#C45D3A] hover:bg-neutral-100">
            Book Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Rooms;
