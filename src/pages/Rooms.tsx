import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Loader2, Wifi, Users, Check, X, BedDouble, Home, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Room } from "@/lib/api/rooms";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        // Use getWebsiteRooms to only fetch approved/visible rooms for public display
        const response = await api.rooms.getWebsiteRooms();
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching website rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Observe room cards when they mount
  const observeCard = (element: HTMLDivElement | null, index: number) => {
    if (element && observerRef.current) {
      element.setAttribute('data-index', index.toString());
      observerRef.current.observe(element);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Enhanced Hero Section with Parallax Effect */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Animated Background with Parallax */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070')] bg-cover bg-center transform scale-110 transition-transform duration-1000 ease-out"
            style={{
              transform: 'scale(1.1) translateY(0px)',
              animation: 'parallaxFloat 20s ease-in-out infinite'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-white/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#8A5A44]/10 to-[#C45D3A]/10"></div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#C45D3A]/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-[#8A5A44]/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#C45D3A]/40 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-[#8A5A44]/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 text-[#8A5A44] leading-tight">
                Luxury
                <span className="block text-[#C45D3A] relative">
                  Accommodations
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#C45D3A] to-[#8A5A44] rounded-full"></div>
                </span>
              </h1>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl md:text-2xl text-neutral-700 mb-10 leading-relaxed font-light">
                Discover our collection of thoughtfully designed rooms and suites, where
                <span className="text-[#8A5A44] font-medium"> comfort meets elegance</span> in perfect harmony.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <BookingFormDialog
                  buttonText="Book Your Stay"
                  buttonSize="lg"
                  buttonClassName="bg-[#C45D3A] text-white hover:bg-[#A74B2F] px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  showArrow={true}
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#8A5A44] text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white px-8 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  View Gallery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Room Showcase with Animations */}
      <section className="py-20 bg-gradient-to-b from-white via-[#F9F5F2]/50 to-[#F9F5F2]">
        <div className="container mx-auto px-4">
          {/* Section Header with Animation */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#C45D3A]"></div>
              <BedDouble className="h-5 w-5 text-[#C45D3A]" />
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#C45D3A]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A5A44]">
              Our Accommodations
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Each room is thoughtfully designed to provide comfort and convenience
              for our guests during their stay.
            </p>
          </div>

          {isLoading ? (
            // Enhanced Loading Skeleton
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="group rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm">
                  <Skeleton className="h-72 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  ref={(el) => observeCard(el, index)}
                  className={`group rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
                    visibleCards.has(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: visibleCards.has(index) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {/* Enhanced Image Container */}
                  <div className="h-72 overflow-hidden relative group">
                    <img
                      src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                      alt={`Room ${room.room_number} - ${room.room_type}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Status Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                      <div className="bg-[#C45D3A] text-white text-sm px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm">
                        {room.room_type}
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm ${
                        room.is_available
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {room.is_available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        {room.is_available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    {/* Hover Overlay with Quick Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          className="bg-white/90 text-[#8A5A44] hover:bg-white shadow-lg backdrop-blur-sm"
                          asChild
                        >
                          <Link to={`/rooms/${room.id}`}>
                            Quick View
                          </Link>
                        </Button>
                        <BookingFormDialog
                          buttonText="Book Now"
                          buttonSize="sm"
                          buttonClassName="bg-[#C45D3A] text-white hover:bg-[#A74B2F] shadow-lg backdrop-blur-sm"
                          showArrow={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Room Content - Only Essential Data */}
                  <div className="p-6">
                    {/* Room Type */}
                    <div className="mb-3">
                      <h3 className="text-xl font-serif font-bold text-[#8A5A44] leading-tight">
                        {room.room_type}
                      </h3>
                      <p className="text-sm text-neutral-500">Room {room.room_number}</p>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 mb-4 text-neutral-600">
                      <Users className="h-4 w-4 text-[#C45D3A]" />
                      <span className="text-sm">Capacity: {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 mb-4 leading-relaxed text-sm">
                      {room.description}
                    </p>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#8A5A44] mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, amenityIndex) => (
                            <Badge
                              key={amenityIndex}
                              variant="outline"
                              className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] text-xs font-medium px-3 py-1"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Per Night */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div>
                        <span className="text-2xl font-bold text-[#C45D3A]">${room.price_per_night}</span>
                        <span className="text-sm text-neutral-500 ml-1">/night</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#C45D3A] border-[#C45D3A] hover:bg-[#C45D3A] hover:text-white transition-all duration-300 transform hover:scale-105"
                        asChild
                      >
                        <Link to={`/rooms/${room.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#F9F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BedDouble className="h-8 w-8 text-[#C45D3A]" />
                </div>
                <h3 className="text-xl font-semibold text-[#8A5A44] mb-2">No Rooms Available</h3>
                <p className="text-neutral-600">We're currently updating our room inventory. Please check back soon!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#C45D3A] via-[#B8512E] to-[#8A5A44] text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
                Ready to Experience
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200">
                  Unparalleled Luxury?
                </span>
              </h2>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Book your stay today and immerse yourself in exclusive amenities,
                personalized service, and unforgettable moments that define true hospitality.
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <BookingFormDialog
                  buttonText="Reserve Your Suite"
                  buttonSize="lg"
                  buttonClassName="bg-white text-[#C45D3A] hover:bg-amber-50 px-10 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  showArrow={true}
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#C45D3A] px-10 py-5 text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <MapPin className="mr-3 h-6 w-6" />
                  Find Us
                </Button>
              </div>
            </div>

            {/* Simple Trust Indicators */}
            <div className="animate-fade-in mt-16" style={{ animationDelay: '1.4s' }}>
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm font-medium">Quality Accommodations</span>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-purple-300" />
                  <span className="text-sm font-medium">Comfortable Rooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
