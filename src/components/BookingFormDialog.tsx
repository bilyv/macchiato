import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CalendarClock, Users, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { api } from '@/lib/api';
import { Room } from '@/lib/api/rooms';
import { BookingFormData } from '@/lib/api/bookings';

interface BookingFormDialogProps {
  trigger?: React.ReactNode;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonClassName?: string;
  showArrow?: boolean;
  preselectedRoomId?: string;
}

export function BookingFormDialog({
  trigger,
  buttonText = 'Book Now',
  buttonVariant = 'default',
  buttonSize = 'default',
  buttonClassName = 'bg-[#C45D3A] hover:bg-[#A74B2F] text-white',
  showArrow = false,
  preselectedRoomId,
}: BookingFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    room_id: preselectedRoomId || '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    special_requests: ''
  });

  // Fetch available rooms when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  const fetchRooms = async () => {
    try {
      const response = await api.rooms.getWebsiteRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load available rooms');
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.guest_name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.guest_email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.room_id) {
      toast.error('Please select a room');
      return false;
    }
    if (!formData.check_in_date) {
      toast.error('Please select check-in date');
      return false;
    }
    if (!formData.check_out_date) {
      toast.error('Please select check-out date');
      return false;
    }
    if (new Date(formData.check_out_date) <= new Date(formData.check_in_date)) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }
    if (formData.number_of_guests < 1) {
      toast.error('Number of guests must be at least 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await api.bookings.create(formData);
      toast.success('Booking request submitted successfully! We will contact you soon to confirm your reservation.');
      setIsOpen(false);
      // Reset form
      setFormData({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        room_id: preselectedRoomId || '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        special_requests: ''
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to submit booking request';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get minimum checkout date (day after checkin)
  const minCheckoutDate = formData.check_in_date
    ? new Date(new Date(formData.check_in_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : today;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize} className={buttonClassName}>
            {buttonText}
            {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#8A5A44] flex items-center gap-2">
            <CalendarClock className="h-6 w-6" />
            Book Your Stay
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to make a reservation. We'll contact you to confirm your booking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest_name">Full Name *</Label>
                <Input
                  id="guest_name"
                  type="text"
                  value={formData.guest_name}
                  onChange={(e) => handleInputChange('guest_name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest_email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => handleInputChange('guest_email', e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest_phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="guest_phone"
                  type="tel"
                  value={formData.guest_phone}
                  onChange={(e) => handleInputChange('guest_phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Booking Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="room_id">Select Room *</Label>
              <Select value={formData.room_id} onValueChange={(value) => handleInputChange('room_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.room_number} - {room.room_type} (${room.price_per_night}/night)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_in_date">Check-in Date *</Label>
                <Input
                  id="check_in_date"
                  type="date"
                  value={formData.check_in_date}
                  onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                  min={today}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out_date">Check-out Date *</Label>
                <Input
                  id="check_out_date"
                  type="date"
                  value={formData.check_out_date}
                  onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                  min={minCheckoutDate}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_guests">Number of Guests *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="number_of_guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.number_of_guests}
                  onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value) || 1)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Special Requests (Optional)
            </h3>

            <div className="space-y-2">
              <Label htmlFor="special_requests">Any special requests or preferences?</Label>
              <Textarea
                id="special_requests"
                value={formData.special_requests}
                onChange={(e) => handleInputChange('special_requests', e.target.value)}
                placeholder="Let us know about any special requirements, dietary restrictions, accessibility needs, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#8A5A44] hover:bg-[#6D4836] text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Submit Booking Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
