import { Button } from "@/components/ui/button";
import { ArrowRight, BedDouble, Coffee, Wifi, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfiniteScrollReviews from "@/components/InfiniteScrollReviews";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { api } from "@/lib/api";
import { Room } from "@/lib/api/rooms";

interface PageContent {
  welcomeTitle: string;
  welcomeDescription: string;
  heroTitle: string;
  heroSubtitle: string;
}

const Home = () => {
  const [content, setContent] = useState<PageContent>({
    welcomeTitle: "Welcome to Macchiato Suites",
    welcomeDescription: "Nestled in the vibrant heart of the city, Macchiato Suites offers a perfect blend of luxury, comfort, and exceptional service. Whether you're visiting for business or pleasure, our elegant accommodations and world-class amenities ensure an unforgettable stay.",
    heroTitle: "<span class=\"text-[#E8C3A3]\">Luxurious</span> <span class=\"text-[#C45D3A]\">Comfort</span> in the Heart of the City",
    heroSubtitle: "Experience unparalleled elegance and tranquility at Macchiato Suites, where every stay is crafted for perfection."
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [elegantSuites, setElegantSuites] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await api.rooms.getAll();
        setRooms(response.data);

        // Filter rooms by category
        setFeaturedRooms(response.data.filter(room => room.category === 'Featured Rooms'));
        setElegantSuites(response.data.filter(room => room.category === 'Our Elegant Suites'));
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-white"
              dangerouslySetInnerHTML={{ __html: content.heroTitle }}
            />
            <p className="text-xl text-white/90 mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <BookingFormDialog
                buttonText="Book Your Stay"
                buttonSize="lg"
                showArrow={true}
              />
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                <Link to="/rooms">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
              {content.welcomeTitle}
            </h2>
            <p className="text-lg text-neutral-600">
              {content.welcomeDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#EEDFD0] flex items-center justify-center mt-1">
                  <BedDouble className="h-5 w-5 text-[#C45D3A]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Premium Accommodations</h3>
                  <p className="text-neutral-600">
                    Our rooms and suites are meticulously designed with your comfort in mind,
                    featuring plush bedding, elegant décor, and all the modern amenities you need.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#EEDFD0] flex items-center justify-center mt-1">
                  <Coffee className="h-5 w-5 text-[#C45D3A]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Fine Dining Experience</h3>
                  <p className="text-neutral-600">
                    Indulge in exceptional cuisine at our restaurant, where our chefs create
                    memorable meals using the finest locally-sourced ingredients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#EEDFD0] flex items-center justify-center mt-1">
                  <Wifi className="h-5 w-5 text-[#C45D3A]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">Comprehensive Amenities</h3>
                  <p className="text-neutral-600">
                    From our state-of-the-art fitness center to our relaxing spa services,
                    we provide everything you need for a comfortable and enjoyable stay.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070"
                alt="Hotel Lobby"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
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

      {/* Elegant Suites Showcase */}
      {elegantSuites.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#8A5A44]">
              Our Elegant Suites
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              Discover our collection of thoughtfully designed accommodations
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {elegantSuites.slice(0, 3).map((room) => (
                <div key={room.id} className="group rounded-lg overflow-hidden shadow-sm border border-neutral-200 hover:shadow-md transition-all">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">{room.name}</h3>
                    <p className="text-neutral-600 mb-4">{room.description.length > 100 ? `${room.description.substring(0, 100)}...` : room.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C45D3A]">${room.price_per_night} <span className="text-sm font-normal text-neutral-500">/night</span></span>
                      <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                        <Link to="/rooms">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show placeholder cards if we have less than 3 rooms */}
              {elegantSuites.length < 3 && isLoading && (
                Array(3 - elegantSuites.length).fill(0).map((_, index) => (
                  <div key={`placeholder-${index}`} className="rounded-lg overflow-hidden shadow-sm border border-neutral-200 animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 text-center">
              <Button className="bg-[#8A5A44] hover:bg-[#6B4636] text-white">
                <Link to="/rooms">View All Rooms</Link> <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Rooms Showcase */}
      {featuredRooms.length > 0 && (
        <section className="py-16 bg-[#F9F5F2]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#8A5A44]">
              Featured Rooms
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              Our most popular accommodations with premium amenities
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.slice(0, 3).map((room) => (
                <div key={room.id} className="group rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-200 hover:shadow-md transition-all">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">{room.name}</h3>
                    <p className="text-neutral-600 mb-4">{room.description.length > 100 ? `${room.description.substring(0, 100)}...` : room.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C45D3A]">${room.price_per_night} <span className="text-sm font-normal text-neutral-500">/night</span></span>
                      <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                        <Link to="/rooms">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show placeholder cards if we have less than 3 rooms */}
              {featuredRooms.length < 3 && isLoading && (
                Array(3 - featuredRooms.length).fill(0).map((_, index) => (
                  <div key={`placeholder-${index}`} className="rounded-lg overflow-hidden shadow-sm border border-neutral-200 animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#EEDFD0] mb-4">
              <Quote className="h-6 w-6 text-[#C45D3A]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#8A5A44]">
              What Our Guests Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover why guests from around the world choose Macchiato Suites for their stay
            </p>
          </div>

          <div className="py-4">
            <InfiniteScrollReviews />
          </div>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="py-12 bg-gradient-to-br from-[#F9F5F2] to-[#EEDFD0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-[#8A5A44]">
                A Message from Our CEO
              </h2>
              <div className="w-16 h-0.5 bg-[#C45D3A] mx-auto"></div>
            </div>

            {/* Enhanced Board Design */}
            <div className="relative group">
              {/* Outer frame with shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A5A44] to-[#6B4636] rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>

              {/* Inner board */}
              <div className="relative bg-gradient-to-br from-white to-[#FEFCFA] rounded-2xl p-1 shadow-2xl">
                {/* Decorative corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-[#C45D3A] rounded-tl-lg"></div>
                <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-[#C45D3A] rounded-tr-lg"></div>
                <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-[#C45D3A] rounded-bl-lg"></div>
                <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[#C45D3A] rounded-br-lg"></div>

                {/* Content area */}
                <div className="bg-white rounded-xl p-6 md:p-8 m-2 shadow-inner border border-[#E8C3A3]/30 relative overflow-hidden">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, #8A5A44 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  {/* Elegant quote marks */}
                  <div className="absolute top-4 left-4 text-4xl text-[#E8C3A3] font-serif leading-none opacity-60 transform -rotate-12">
                    "
                  </div>
                  <div className="absolute bottom-4 right-4 text-4xl text-[#E8C3A3] font-serif leading-none opacity-60 transform rotate-12">
                    "
                  </div>

                  <div className="relative z-10 pt-6">
                    {/* Message content with staggered animation */}
                    <div className="space-y-4 text-neutral-700 leading-relaxed">
                      <p className="font-medium text-[#8A5A44] animate-fade-in" style={{animationDelay: '0.2s'}}>
                        Dear Guests,
                      </p>

                      <p className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                        I am <span className="font-bold text-[#8A5A44] bg-[#EEDFD0]/30 px-1 rounded">Andrew Kayitani</span>, a passionate Rwandan hotelier and founder of Macchiato Suites Kigali. With a Master's Degree from <span className="font-semibold text-[#C45D3A]">Les Roches International School</span> in Switzerland and experience at <span className="font-semibold">Intercontinental Hotels</span> and <span className="font-semibold">Serena Hotels</span>, I bring world-class hospitality to Rwanda.
                      </p>

                      <p className="animate-fade-in" style={{animationDelay: '0.6s'}}>
                        Macchiato Suites is where every detail creates a magical experience—your home away from home. We take pride in exceptional attention to detail and ensuring every guest enjoys their stay.
                      </p>

                      <p className="font-medium text-[#8A5A44] animate-fade-in" style={{animationDelay: '0.8s'}}>
                        Welcome to Macchiato Suites Kigali, where your comfort is our priority.
                      </p>
                    </div>

                    {/* CEO signature area with enhanced design */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-[#E8C3A3]/50 animate-fade-in" style={{animationDelay: '1s'}}>
                      <div className="text-center md:text-left mb-4 md:mb-0">
                        {/* Signature line */}
                        <div className="mb-2">
                          <div className="w-32 h-8 bg-gradient-to-r from-[#8A5A44] to-[#C45D3A] rounded-full opacity-20 mx-auto md:mx-0 flex items-center justify-center">
                            <span className="text-xs font-serif italic text-[#8A5A44] opacity-80">Signature</span>
                          </div>
                        </div>

                        <div className="text-lg font-serif font-bold text-[#8A5A44] mb-1">
                          Andrew Kayitani
                        </div>
                        <div className="text-[#C45D3A] font-semibold text-sm">
                          Founder & CEO
                        </div>
                        <div className="text-xs text-neutral-600 mt-1 font-medium">
                          Les Roches Switzerland Graduate
                        </div>
                      </div>

                      {/* Enhanced CEO avatar */}
                      <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#C45D3A] to-[#8A5A44] rounded-full animate-pulse"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#E8C3A3] to-[#D4B896] rounded-full flex items-center justify-center text-[#8A5A44] font-serif font-bold text-lg shadow-lg border-2 border-white group-hover/avatar:scale-110 transition-transform duration-300">
                          AK
                        </div>
                        {/* Professional badge */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#C45D3A] rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-xs font-bold">★</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
            Experience the Ultimate Luxury Stay
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your stay today and enjoy exclusive amenities and personalized service
          </p>
          <BookingFormDialog
            buttonText="Book Now and Save 15%"
            buttonSize="lg"
            buttonClassName="bg-white text-[#C45D3A] hover:bg-neutral-100"
            showArrow={true}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
