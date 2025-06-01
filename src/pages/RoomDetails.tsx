import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Users, 
  Check, 
  X, 
  BedDouble, 
  Wifi, 
  Car, 
  Coffee,
  MapPin,
  Calendar,
  Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { api } from "@/lib/api";
import { Room } from "@/lib/api/rooms";
import { toast } from "sonner";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) {
        setError("Room ID not provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.rooms.getById(id);
        setRoom(response.data);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setError("Room not found or unavailable");
        toast.error("Failed to load room details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Room Not Found</h1>
              <p className="text-gray-600 mb-6">{error || "The room you're looking for doesn't exist or is no longer available."}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate('/rooms')}
                  className="bg-[#C45D3A] hover:bg-[#A74B2F]"
                >
                  View All Rooms
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Room Details Content */}
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 text-[#8A5A44] hover:text-[#C45D3A] hover:bg-[#F9F5F2]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>

          {/* Room Details Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Room Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"}
                  alt={`${room.room_type} - Room ${room.room_number}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-lg backdrop-blur-sm ${
                  room.is_available 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {room.is_available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {room.is_available ? 'Available' : 'Unavailable'}
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-4xl font-serif font-bold text-[#8A5A44] mb-2">
                  {room.room_type}
                </h1>
                <p className="text-lg text-[#C45D3A] font-medium">Room {room.room_number}</p>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-6 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#C45D3A]" />
                  <span>Capacity: {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-[#C45D3A]" />
                  <span>Luxury Room</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-[#8A5A44] mb-3">Description</h3>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#8A5A44] mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities.map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-[#F9F5F2] text-[#8A5A44] border-[#EEDFD0] px-4 py-2 text-sm font-medium"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price and Booking */}
              <div className="bg-[#F9F5F2] rounded-2xl p-6 border border-[#EEDFD0]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-[#C45D3A]">${room.price_per_night}</span>
                    <span className="text-lg text-neutral-500 ml-2">/night</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600">Starting from</p>
                    <p className="text-xs text-neutral-500">Taxes and fees included</p>
                  </div>
                </div>
                
                <BookingFormDialog
                  buttonText={room.is_available ? "Book This Room" : "Room Unavailable"}
                  buttonSize="lg"
                  buttonClassName={`w-full py-4 text-lg font-semibold ${
                    room.is_available 
                      ? "bg-[#C45D3A] text-white hover:bg-[#A74B2F] shadow-lg hover:shadow-xl transition-all duration-300" 
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  showArrow={room.is_available}
                  disabled={!room.is_available}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetails;
