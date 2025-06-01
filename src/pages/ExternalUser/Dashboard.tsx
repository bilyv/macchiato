import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Guest, CreateGuestData } from '@/lib/api/guests';
import { Room } from '@/lib/api/rooms';
import { toast } from '@/components/ui/sonner';

const ExternalUserDashboard = () => {
  const { user, logout, isExternalUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateGuestOpen, setIsCreateGuestOpen] = useState(false);

  // Rooms State for booking details
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Form State
  const [guestForm, setGuestForm] = useState<CreateGuestData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    dateOfBirth: '',
    identificationType: undefined,
    identificationNumber: '',
    specialRequirements: '',
    // Booking details for local guests
    roomNumber: undefined,
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    totalPrice: undefined
  });

  // Check authentication - support both external user and worker tokens
  useEffect(() => {
    const workerToken = localStorage.getItem('worker_token');
    const workerUser = localStorage.getItem('worker_user');

    if (workerToken && workerUser) {
      // Worker is logged in, continue
      return;
    }

    if (!user || !isExternalUser()) {
      // Check if we're on worker route
      if (window.location.pathname.includes('/worker/')) {
        navigate('/worker/login');
      } else {
        navigate('/external-user/login');
      }
    }
  }, [user, isExternalUser, navigate]);

  // Fetch guests
  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const response = await api.guests.getAll();
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Failed to fetch guests');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms for booking details
  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const response = await api.rooms.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Calculate total price based on room and dates
  const calculateTotalPrice = (roomNumber: number, checkInDate: string, checkOutDate: string) => {
    if (!roomNumber || !checkInDate || !checkOutDate) return 0;

    const room = rooms.find(r => r.room_number === roomNumber);
    if (!room) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) return 0;

    return numberOfNights * room.price_per_night;
  };

  // Update total price when booking details change
  useEffect(() => {
    if (guestForm.roomNumber && guestForm.checkInDate && guestForm.checkOutDate) {
      const totalPrice = calculateTotalPrice(guestForm.roomNumber, guestForm.checkInDate, guestForm.checkOutDate);
      setGuestForm(prev => ({ ...prev, totalPrice }));
    }
  }, [guestForm.roomNumber, guestForm.checkInDate, guestForm.checkOutDate, rooms]);

  useEffect(() => {
    const workerToken = localStorage.getItem('worker_token');

    if ((user && isExternalUser()) || workerToken) {
      fetchGuests();
      fetchRooms();
    }
  }, [user, isExternalUser]);

  // Create guest
  const handleCreateGuest = async () => {
    try {
      await api.guests.create(guestForm);
      toast.success('Guest added successfully');
      setIsCreateGuestOpen(false);
      setGuestForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        dateOfBirth: '',
        identificationType: undefined,
        identificationNumber: '',
        specialRequirements: '',
        // Booking details for local guests
        roomNumber: undefined,
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        totalPrice: undefined
      });
      fetchGuests();
    } catch (error: any) {
      console.error('Error creating guest:', error);
      toast.error(error.message || 'Failed to add guest');
    }
  };

  // Delete guest
  const handleDeleteGuest = async (id: string) => {
    try {
      await api.guests.delete(id);
      toast.success('Guest deleted successfully');
      fetchGuests();
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast.error(error.message || 'Failed to delete guest');
    }
  };

  // Filter guests
  const filteredGuests = guests.filter(guest =>
    guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };



  // Get current user info (either from auth context or worker storage)
  const getCurrentUser = () => {
    const workerUser = localStorage.getItem('worker_user');
    if (workerUser) {
      return JSON.parse(workerUser);
    }
    return user;
  };

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-[#8A5A44] p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Guest Entry Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {currentUser.firstName} {currentUser.lastName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const workerToken = localStorage.getItem('worker_token');
                if (workerToken) {
                  // Worker logout
                  localStorage.removeItem('worker_token');
                  localStorage.removeItem('worker_user');
                  navigate('/worker/login');
                } else {
                  // Regular external user logout
                  logout();
                }
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Management
              </CardTitle>
              <CardDescription>
                Add and manage guest information for hotel check-ins
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search guests by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchGuests}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Dialog open={isCreateGuestOpen} onOpenChange={setIsCreateGuestOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#C45D3A] hover:bg-[#A74B2F]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Guest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Guest</DialogTitle>
                        <DialogDescription>
                          Enter guest information for registration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={guestForm.firstName}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={guestForm.lastName}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={guestForm.email}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={guestForm.phone}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={guestForm.city}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Enter city"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={guestForm.country}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, country: e.target.value }))}
                              placeholder="Enter country"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={guestForm.dateOfBirth}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="identificationType">ID Type</Label>
                            <Select
                              value={guestForm.identificationType}
                              onValueChange={(value: any) => setGuestForm(prev => ({ ...prev, identificationType: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ID type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="driver_license">Driver's License</SelectItem>
                                <SelectItem value="national_id">National ID</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="identificationNumber">ID Number</Label>
                          <Input
                            id="identificationNumber"
                            value={guestForm.identificationNumber}
                            onChange={(e) => setGuestForm(prev => ({ ...prev, identificationNumber: e.target.value }))}
                            placeholder="Enter ID number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialRequirements">Special Requirements</Label>
                          <Textarea
                            id="specialRequirements"
                            value={guestForm.specialRequirements}
                            onChange={(e) => setGuestForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                            placeholder="Enter any special requirements"
                            rows={3}
                          />
                        </div>

                        {/* Booking Details Section */}
                        <div className="border-t pt-4">
                          <h3 className="text-lg font-medium mb-4">Booking Details (Optional)</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="roomNumber">Room Number</Label>
                                <Select
                                  value={guestForm.roomNumber?.toString()}
                                  onValueChange={(value) => setGuestForm(prev => ({ ...prev, roomNumber: value ? parseInt(value) : undefined }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {rooms.map((room) => (
                                      <SelectItem key={room.id} value={room.room_number.toString()}>
                                        Room {room.room_number} - {room.room_type} (${room.price_per_night}/night)
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="numberOfGuests">Number of Guests</Label>
                                <Input
                                  id="numberOfGuests"
                                  type="number"
                                  min="1"
                                  value={guestForm.numberOfGuests}
                                  onChange={(e) => setGuestForm(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) || 1 }))}
                                  placeholder="Number of guests"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="checkInDate">Check-in Date</Label>
                                <Input
                                  id="checkInDate"
                                  type="date"
                                  value={guestForm.checkInDate}
                                  onChange={(e) => setGuestForm(prev => ({ ...prev, checkInDate: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="checkOutDate">Check-out Date</Label>
                                <Input
                                  id="checkOutDate"
                                  type="date"
                                  value={guestForm.checkOutDate}
                                  onChange={(e) => setGuestForm(prev => ({ ...prev, checkOutDate: e.target.value }))}
                                />
                              </div>
                            </div>
                            {guestForm.totalPrice && guestForm.totalPrice > 0 && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Total Price:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${guestForm.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                                {guestForm.roomNumber && guestForm.checkInDate && guestForm.checkOutDate && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {Math.ceil((new Date(guestForm.checkOutDate).getTime() - new Date(guestForm.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateGuestOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGuest} className="bg-[#C45D3A] hover:bg-[#A74B2F]">
                          Add Guest
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Guests ({filteredGuests.length})
              </CardTitle>
              <CardDescription>
                Guests you have added to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No guests match your search.' : 'Add your first guest to get started.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Booking Details</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div className="font-medium">{guest.first_name} {guest.last_name}</div>
                            {guest.room_number && (
                              <div className="text-sm text-gray-600">Room {guest.room_number}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{guest.email}</span>
                              </div>
                              {guest.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{guest.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {guest.city || guest.country ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">
                                  {[guest.city, guest.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {guest.check_in_date && guest.check_out_date ? (
                              <div className="text-sm">
                                <div className="font-medium">
                                  {new Date(guest.check_in_date).toLocaleDateString()} - {new Date(guest.check_out_date).toLocaleDateString()}
                                </div>
                                {guest.number_of_guests && (
                                  <div className="text-gray-600">{guest.number_of_guests} guest{guest.number_of_guests > 1 ? 's' : ''}</div>
                                )}
                                {guest.total_price && (
                                  <div className="text-green-600 font-medium">${guest.total_price}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No booking details</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Guest</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {guest.first_name} {guest.last_name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteGuest(guest.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExternalUserDashboard;