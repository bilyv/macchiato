import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Wifi } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Amenities = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#8A5A44]">
              Exceptional Amenities
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              At Macchiato Suites, we've thought of everything to make your stay as comfortable and enjoyable as possible.
            </p>
          </div>
        </div>
      </section>
      
      {/* Amenities Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <Coffee className="h-7 w-7 text-[#C45D3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Gourmet Restaurant</h3>
              <p className="text-neutral-600">
                Our on-site restaurant offers an exquisite dining experience with a menu featuring both local and international cuisine.
              </p>
            </div>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#C45D3A]">
                  <path d="M16 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
                  <path d="M12 14v2" />
                  <path d="M4 4L2 6" />
                  <path d="m2 6 8 0" />
                  <path d="M22 6a2 2 0 0 0-2-2" />
                  <path d="M18 4V2" />
                  <path d="M14 4V2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Luxury Spa</h3>
              <p className="text-neutral-600">
                Indulge in rejuvenating treatments at our spa, featuring massages, facials, and other wellness services.
              </p>
            </div>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#C45D3A]">
                  <path d="M18 7c0-2-2-3-5-3-3.5 0-5 1-5 3 0 1.4.5 2 2 3 1.4.9 2 1.6 2 3 0 1.4-.6 3-3.5 3-2 0-2.5-.5-2.5-2" />
                  <path d="M12 2v20" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Swimming Pool</h3>
              <p className="text-neutral-600">
                Enjoy our temperature-controlled indoor swimming pool with a relaxing lounge area.
              </p>
            </div>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#C45D3A]">
                  <path d="m2 8 2 2-2 2 2 2-2 2" />
                  <path d="m22 8-2 2 2 2-2 2 2 2" />
                  <rect width="10" height="16" x="7" y="4" rx="2" />
                  <path d="M11 12h2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Fitness Center</h3>
              <p className="text-neutral-600">
                Stay active in our modern fitness center equipped with the latest cardio and strength training equipment.
              </p>
            </div>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#C45D3A]">
                  <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
                  <path d="m22 17-3-3-2 2" />
                  <path d="M11 18H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v7" />
                  <path d="M15 10H7" />
                  <path d="M15 14H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Business Center</h3>
              <p className="text-neutral-600">
                Our fully-equipped business center offers everything you need for productive work during your stay.
              </p>
            </div>
            
            <div className="bg-[#F9F5F2] rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[#EEDFD0] flex items-center justify-center mb-4">
                <Wifi className="h-7 w-7 text-[#C45D3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#8A5A44]">Complimentary Wi-Fi</h3>
              <p className="text-neutral-600">
                Stay connected with high-speed internet access available throughout the hotel.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Premium Services */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-[#8A5A44] text-center">Premium Services</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070" 
                alt="Concierge Service" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-[#8A5A44]">Personalized Concierge</h3>
                <p className="text-neutral-600">
                  Our dedicated concierge team is available 24/7 to assist with restaurant reservations, 
                  transportation arrangements, tour bookings, and any special requests to enhance your stay.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-[#8A5A44]">Room Service</h3>
                <p className="text-neutral-600">
                  Enjoy gourmet dining in the comfort of your room with our 24-hour room service, 
                  featuring a curated menu from our restaurant.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-[#8A5A44]">Valet Parking</h3>
                <p className="text-neutral-600">
                  Arrive with ease and let our professional valet team take care of your vehicle 
                  during your stay with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#C45D3A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Experience Our World-Class Amenities
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your stay today and indulge in luxury and comfort
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

export default Amenities;
