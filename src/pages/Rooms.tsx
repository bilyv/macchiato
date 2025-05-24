import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, Wifi, Users, Check, X, BedDouble, Home } from "lucide-react";
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
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Room } from "@/lib/api/rooms";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [elegantSuites, setElegantSuites] = useState<Room[]>([]);
  const [premiumRooms, setPremiumRooms] = useState<Room[]>([]);
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
        setPremiumRooms(response.data.filter(room => room.category === 'Premium Rooms'));
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C45D3A]" />
            </div>
          ) : featuredRooms.length > 0 ? (
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {featuredRooms.map((room) => (
                  <CarouselItem key={room.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="group p-1">
                      <div className="overflow-hidden rounded-lg relative">
                        <img
                          src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                          alt={room.name}
                          className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className={`absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded ${room.is_available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {room.is_available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {room.is_available ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">{room.name}</h3>
                        <div className="flex items-center gap-2 mb-2 text-xs text-neutral-600">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-[#C45D3A]" />
                            {room.capacity}
                          </span>
                          <span className="flex items-center">
                            <Home className="h-3 w-3 mr-1 text-[#C45D3A]" />
                            {room.size_sqm}m²
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-3 text-sm">{room.description.length > 60 ? `${room.description.substring(0, 60)}...` : room.description}</p>

                        {/* Amenities */}
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {room.amenities.slice(0, 2).map((amenity, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] text-xs"
                                >
                                  +{room.amenities.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <span className="font-bold text-[#C45D3A]">From ${room.price_per_night} per night</span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static translate-y-0" />
                <CarouselNext className="relative static translate-y-0" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No featured rooms available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Room Showcase */}
      <section className="py-16 bg-[#F9F5F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-[#8A5A44] text-center">All Accommodations</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C45D3A]" />
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.id} className="group rounded-lg overflow-hidden shadow-sm bg-white border border-neutral-200 hover:shadow-md transition-all">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      {room.category && (
                        <div className="bg-[#C45D3A] text-white text-xs px-2 py-1 rounded">
                          {room.category}
                        </div>
                      )}
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${room.is_available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {room.is_available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {room.is_available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-[#8A5A44]">{room.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Users className="h-4 w-4 mr-1 text-[#C45D3A]" />
                        {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Home className="h-4 w-4 mr-1 text-[#C45D3A]" />
                        {room.size_sqm} m²
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm">
                        <BedDouble className="h-4 w-4 mr-1 text-[#C45D3A]" />
                        {room.bed_type}
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-3">{room.description.length > 80 ? `${room.description.substring(0, 80)}...` : room.description}</p>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-[#8A5A44] mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 4 && (
                            <Badge
                              variant="outline"
                              className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] text-xs"
                            >
                              +{room.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C45D3A]">${room.price_per_night} <span className="text-sm font-normal text-neutral-500">/night</span></span>
                      <Button variant="outline" size="sm" className="text-[#C45D3A] border-[#C45D3A]">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No rooms available at the moment.</p>
            </div>
          )}
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
          <BookingFormDialog
            buttonText="Book Now"
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

export default Rooms;
