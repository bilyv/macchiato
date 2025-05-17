
import { Button } from "@/components/ui/button";
import { ArrowRight, BedDouble, Coffee, Menu, Wifi, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-[#8A5A44]">Macchiato Suites</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Home</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Rooms</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Amenities</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Gallery</Link>
            <Link to="/" className="text-neutral-800 hover:text-[#C45D3A] transition-colors">Contact</Link>
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
                      <Link to="/" className="text-lg font-medium text-neutral-800 hover:text-[#C45D3A] transition-colors">Home</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="text-lg font-medium text-neutral-800 hover:text-[#C45D3A] transition-colors">Rooms</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="text-lg font-medium text-neutral-800 hover:text-[#C45D3A] transition-colors">Amenities</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="text-lg font-medium text-neutral-800 hover:text-[#C45D3A] transition-colors">Gallery</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/" className="text-lg font-medium text-neutral-800 hover:text-[#C45D3A] transition-colors">Contact</Link>
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

      {/* Tabs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="flex justify-center mb-8 bg-[#F9F5F2] p-1 rounded-lg overflow-x-auto">
              <TabsTrigger value="home" className="data-[state=active]:bg-[#C45D3A] data-[state=active]:text-white px-6">
                Home
              </TabsTrigger>
              <TabsTrigger value="rooms" className="data-[state=active]:bg-[#C45D3A] data-[state=active]:text-white px-6">
                Rooms
              </TabsTrigger>
              <TabsTrigger value="amenities" className="data-[state=active]:bg-[#C45D3A] data-[state=active]:text-white px-6">
                Amenities
              </TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-[#C45D3A] data-[state=active]:text-white px-6">
                Gallery
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-[#C45D3A] data-[state=active]:text-white px-6">
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Home Tab Content */}
            <TabsContent value="home" className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                  Welcome to Macchiato Suites
                </h2>
                <p className="text-lg text-neutral-600">
                  Nestled in the vibrant heart of the city, Macchiato Suites offers a perfect blend of luxury, comfort,
                  and exceptional service. Whether you're visiting for business or pleasure, our elegant accommodations
                  and world-class amenities ensure an unforgettable stay.
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
            </TabsContent>

            {/* Rooms Tab Content */}
            <TabsContent value="rooms" className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                  Our Luxury Accommodations
                </h2>
                <p className="text-lg text-neutral-600">
                  Discover our range of thoughtfully designed rooms and suites, each offering a unique blend of comfort,
                  style, and modern conveniences to ensure a restful stay.
                </p>
              </div>

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

              <div className="text-center mt-12">
                <Button className="bg-[#8A5A44] hover:bg-[#6B4636] text-white">
                  View All Accommodations <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Amenities Tab Content */}
            <TabsContent value="amenities" className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                  Exceptional Amenities
                </h2>
                <p className="text-lg text-neutral-600">
                  At Macchiato Suites, we've thought of everything to make your stay as comfortable and enjoyable as possible.
                </p>
              </div>

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
            </TabsContent>

            {/* Gallery Tab Content */}
            <TabsContent value="gallery" className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                  Photo Gallery
                </h2>
                <p className="text-lg text-neutral-600">
                  Explore our elegant spaces through our carefully curated photo gallery showcasing the beauty of Macchiato Suites.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
                  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070",
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
                  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070",
                  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
                  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
                ].map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg group">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Contact Tab Content */}
            <TabsContent value="contact" className="animate-fade-in">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#8A5A44]">
                  Contact Us
                </h2>
                <p className="text-lg text-neutral-600">
                  We're here to assist you. Reach out to us for reservations, inquiries, or any assistance you may need.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-[#8A5A44]">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#C45D3A] mt-1">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-neutral-800">Address</h4>
                        <p className="text-neutral-600">123 Luxury Avenue, New York, NY 10001</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#C45D3A] mt-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-neutral-800">Phone</h4>
                        <p className="text-neutral-600">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#C45D3A] mt-1">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-neutral-800">Email</h4>
                        <p className="text-neutral-600">info@macchiatosuites.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#C45D3A] mt-1">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-neutral-800">Hours</h4>
                        <p className="text-neutral-600">
                          Reception: 24/7<br />
                          Restaurant: 6:30 AM - 10:30 PM<br />
                          Spa: 9:00 AM - 9:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F9F5F2] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-[#8A5A44]">Send Us a Message</h3>
                  <p className="text-neutral-600 mb-4">
                    Please visit our <Link to="/contact" className="text-[#C45D3A] hover:underline">Contact page</Link> to send us a message.
                  </p>
                  <Button asChild className="w-full bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
                    <Link to="/contact">Go to Contact Page</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
