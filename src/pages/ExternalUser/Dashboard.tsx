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
import { toast } from '@/components/ui/sonner';

const ExternalUserDashboard = () => {
  const { user, logout, isExternalUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateGuestOpen, setIsCreateGuestOpen] = useState(false);

  // Form State
  const [guestForm, setGuestForm] = useState<CreateGuestData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
    identificationType: undefined,
    identificationNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    specialRequirements: '',
    notes: '',
    isVip: false
  });

  // Check authentication
  useEffect(() => {
    if (!user || !isExternalUser()) {
      navigate('/external-user/login');
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

  useEffect(() => {
    if (user && isExternalUser()) {
      fetchGuests();
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
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
        identificationType: undefined,
        identificationNumber: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        specialRequirements: '',
        notes: '',
        isVip: false
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

  const getVipBadge = (isVip: boolean) => {
    return isVip ? (
      <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
        <Shield className="h-3 w-3 mr-1" />
        VIP
      </Badge>
    ) : null;
  };

  if (!user || !isExternalUser()) {
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
                <p className="text-sm text-gray-600">Welcome, {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
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
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={guestForm.address}
                            onChange={(e) => setGuestForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter address"
                          />
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
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                            <Input
                              id="emergencyContactName"
                              value={guestForm.emergencyContactName}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                              placeholder="Enter emergency contact name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                            <Input
                              id="emergencyContactPhone"
                              value={guestForm.emergencyContactPhone}
                              onChange={(e) => setGuestForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                              placeholder="Enter emergency contact phone"
                            />
                          </div>
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
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={guestForm.notes}
                            onChange={(e) => setGuestForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Enter any additional notes"
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isVip"
                            checked={guestForm.isVip}
                            onCheckedChange={(checked) => setGuestForm(prev => ({ ...prev, isVip: checked }))}
                          />
                          <Label htmlFor="isVip">VIP Guest</Label>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{guest.first_name} {guest.last_name}</div>
                                {getVipBadge(guest.is_vip)}
                              </div>
                            </div>
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
                            <Badge variant="outline">Guest</Badge>
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