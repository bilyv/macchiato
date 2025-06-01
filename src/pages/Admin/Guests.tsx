import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  Filter,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import { api } from '@/lib/api';
import { ExternalUser, CreateExternalUserData, UpdateExternalUserData } from '@/lib/api/external-users';
import { Guest, CreateGuestData, UpdateGuestData } from '@/lib/api/guests';
import { Room } from '@/lib/api/rooms';
import { toast } from '@/components/ui/sonner';

const AdminGuests = () => {
  // External Users State
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [isLoadingExternalUsers, setIsLoadingExternalUsers] = useState(true);

  // Guests State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);

  // Rooms State for booking details
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState('external-users');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateExternalUserOpen, setIsCreateExternalUserOpen] = useState(false);
  const [isCreateGuestOpen, setIsCreateGuestOpen] = useState(false);
  const [selectedExternalUser, setSelectedExternalUser] = useState<ExternalUser | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Form State
  const [externalUserForm, setExternalUserForm] = useState<CreateExternalUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

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

  // Fetch external users
  const fetchExternalUsers = async () => {
    try {
      setIsLoadingExternalUsers(true);
      const response = await api.externalUsers.getAll();
      setExternalUsers(response.data);
    } catch (error) {
      console.error('Error fetching external users:', error);
      toast.error('Failed to fetch external users');
    } finally {
      setIsLoadingExternalUsers(false);
    }
  };

  // Fetch guests
  const fetchGuests = async () => {
    try {
      setIsLoadingGuests(true);
      const response = await api.guests.getAllAdmin();
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Failed to fetch guests');
    } finally {
      setIsLoadingGuests(false);
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

  useEffect(() => {
    fetchExternalUsers();
    fetchGuests();
    fetchRooms();
  }, []);

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

  // Create external user
  const handleCreateExternalUser = async () => {
    // Client-side validation
    if (!externalUserForm.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!externalUserForm.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    if (!externalUserForm.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!externalUserForm.password || externalUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await api.externalUsers.create(externalUserForm);
      toast.success('External user created successfully');
      setIsCreateExternalUserOpen(false);
      setExternalUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      });
      fetchExternalUsers();
    } catch (error: any) {
      console.error('Error creating external user:', error);
      toast.error(error.message || 'Failed to create external user');
    }
  };

  // Create guest
  const handleCreateGuest = async () => {
    try {
      await api.guests.create(guestForm);
      toast.success('Guest created successfully');
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
      toast.error(error.message || 'Failed to create guest');
    }
  };

  // Delete external user
  const handleDeleteExternalUser = async (id: string) => {
    try {
      await api.externalUsers.delete(id);
      toast.success('External user deleted successfully');
      fetchExternalUsers();
    } catch (error: any) {
      console.error('Error deleting external user:', error);
      toast.error(error.message || 'Failed to delete external user');
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

  // Filter functions
  const filteredExternalUsers = externalUsers.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuests = guests.filter(guest =>
    guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? (
          <>
            <UserCheck className="h-3 w-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <UserX className="h-3 w-3 mr-1" />
            Inactive
          </>
        )}
      </Badge>
    );
  };



  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-macchiato-brown to-macchiato-red rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">Guest Management</h1>
              <p className="text-macchiato-light mt-2">
                Manage external users and guest information
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  fetchExternalUsers();
                  fetchGuests();
                }}
                disabled={isLoadingExternalUsers || isLoadingGuests}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(isLoadingExternalUsers || isLoadingGuests) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="external-users" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              External Users ({externalUsers.length})
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests ({guests.length})
            </TabsTrigger>
          </TabsList>

          {/* External Users Tab */}
          <TabsContent value="external-users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      External Users
                    </CardTitle>
                    <CardDescription>
                      Manage external users who can access guest entry functionality
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateExternalUserOpen} onOpenChange={setIsCreateExternalUserOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create External User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create External User</DialogTitle>
                        <DialogDescription>
                          Create a new external user who can login and manage guests
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={externalUserForm.firstName}
                              onChange={(e) => setExternalUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={externalUserForm.lastName}
                              onChange={(e) => setExternalUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={externalUserForm.email}
                            onChange={(e) => setExternalUserForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={externalUserForm.password}
                            onChange={(e) => setExternalUserForm(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter password (minimum 6 characters)"
                            className={externalUserForm.password.length > 0 && externalUserForm.password.length < 6 ? 'border-red-300 focus:border-red-500' : ''}
                          />
                          {externalUserForm.password.length > 0 && externalUserForm.password.length < 6 && (
                            <p className="text-sm text-red-600">Password must be at least 6 characters long</p>
                          )}
                          {externalUserForm.password.length >= 6 && (
                            <p className="text-sm text-green-600">✓ Password meets requirements</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateExternalUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateExternalUser}
                          disabled={
                            !externalUserForm.firstName.trim() ||
                            !externalUserForm.lastName.trim() ||
                            !externalUserForm.email.trim() ||
                            !externalUserForm.password ||
                            externalUserForm.password.length < 6
                          }
                        >
                          Create User
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingExternalUsers ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredExternalUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No external users found</h3>
                    <p className="text-gray-600">Create your first external user to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExternalUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="font-medium">{user.first_name} {user.last_name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4 text-gray-400" />
                                {user.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(user.is_active)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {formatDate(user.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
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
                                      <AlertDialogTitle>Delete External User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {user.first_name} {user.last_name}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteExternalUser(user.id)}
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
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Guests
                    </CardTitle>
                    <CardDescription>
                      Manage guest information and profiles
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateGuestOpen} onOpenChange={setIsCreateGuestOpen}>
                    <DialogTrigger asChild>
                      <Button>
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
                            <Label htmlFor="guestFirstName">First Name *</Label>
                            <Input
                              id="guestFirstName"
                              value={guestForm.firstName}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="Enter first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guestLastName">Last Name *</Label>
                            <Input
                              id="guestLastName"
                              value={guestForm.lastName}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="guestEmail">Email *</Label>
                            <Input
                              id="guestEmail"
                              type="email"
                              value={guestForm.email}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guestPhone">Phone</Label>
                            <Input
                              id="guestPhone"
                              value={guestForm.phone}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="guestCity">City</Label>
                            <Input
                              id="guestCity"
                              value={guestForm.city}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Enter city"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guestCountry">Country</Label>
                            <Input
                              id="guestCountry"
                              value={guestForm.country}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, country: e.target.value }))}
                              placeholder="Enter country"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="guestDob">Date of Birth</Label>
                            <Input
                              id="guestDob"
                              type="date"
                              value={guestForm.dateOfBirth}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guestIdType">ID Type</Label>
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
                          <Label htmlFor="guestIdNumber">ID Number</Label>
                          <Input
                            id="guestIdNumber"
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
                        <Button onClick={handleCreateGuest}>
                          Add Guest
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingGuests ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
                    <p className="text-gray-600">Add your first guest to get started.</p>
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
                          <TableHead>Created By</TableHead>
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
                              <div className="text-sm">
                                <div>{guest.creator_name || 'Unknown'}</div>
                                <div className="text-gray-500 capitalize">{guest.creator_type}</div>
                              </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminGuests;
