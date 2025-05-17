import { Button } from "@/components/ui/button";
import { ArrowRight, BedDouble, Coffee, Wifi, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfiniteScrollReviews from "@/components/InfiniteScrollReviews";

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
              <Button size="lg" className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
                Book Your Stay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                    <Link to="/rooms">View Details</Link>
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
                    <Link to="/rooms">View Details</Link>
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
                    <Link to="/rooms">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-[#8A5A44] hover:bg-[#6B4636] text-white">
              <Link to="/rooms">View All Rooms</Link> <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
};

export default Home;
