import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { api } from '@/lib/api';
import { Room, RoomFormData } from '@/lib/api/rooms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, BedDouble, Loader2, X, Copy, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentAmenity, setCurrentAmenity] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all-rooms');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multiple rooms state
  const [multipleRoomsData, setMultipleRoomsData] = useState({
    roomType: '',
    fromRoom: 1,
    toRoom: 1,
    pricePerNight: 0,
    capacity: 1,
  });
  const [isCreatingMultiple, setIsCreatingMultiple] = useState(false);
  const [classifiedRooms, setClassifiedRooms] = useState<Room[]>([]);

  const [newRoom, setNewRoom] = useState<RoomFormData>({
    room_number: 0,
    description: '',
    price_per_night: 0,
    capacity: 1,
    room_type: '',
    amenities: [],
    display_category: '',
    is_available: true,
  });

  // New form state for room lookup
  const [roomLookupNumber, setRoomLookupNumber] = useState<number>(0);
  const [isLookingUpRoom, setIsLookingUpRoom] = useState(false);
  const [roomFound, setRoomFound] = useState<Room | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchClassifiedRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await api.rooms.getAll();
      // Filter out rooms that were created through classify (have display_category set)
      const siteRooms = response.data.filter((room: Room) => {
        return !room.display_category || room.display_category.trim() === '';
      });
      setRooms(siteRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms that were created through the classify feature
  const fetchClassifiedRooms = async () => {
    try {
      const response = await api.rooms.getAll();
      // Filter rooms that have display_category set (indicating they were created through classify)
      const classified = response.data.filter((room: Room) => {
        return room.display_category && room.display_category.trim() !== '';
      });
      setClassifiedRooms(classified);
    } catch (error) {
      console.error('Error fetching classified rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!validateRoomData(newRoom)) return;

    // Ensure numeric values are properly converted to numbers
    const roomData: RoomFormData = {
      ...newRoom,
      room_number: Number(newRoom.room_number),
      price_per_night: Number(newRoom.price_per_night),
      capacity: Number(newRoom.capacity)
    };

    setIsSubmitting(true);
    try {
      await api.rooms.create(roomData, selectedImage || undefined);
      toast.success('Room created successfully');

      // Reset form
      handleDialogClose();

      // Refresh room lists
      fetchRooms();
      fetchClassifiedRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      if (error instanceof Error) {
        toast.error(`Failed to create room: ${error.message}`);
      } else {
        toast.error('Failed to create room');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    const roomData: RoomFormData = {
      room_number: Number(editingRoom.room_number),
      description: editingRoom.description,
      price_per_night: Number(editingRoom.price_per_night),
      capacity: Number(editingRoom.capacity),
      room_type: editingRoom.room_type,
      amenities: editingRoom.amenities,
      display_category: editingRoom.display_category,
      is_available: editingRoom.is_available,
    };

    if (!validateRoomData(roomData, true, editingRoom.id)) return;

    setIsSubmitting(true);
    try {
      await api.rooms.update(editingRoom.id, roomData, selectedImage || undefined);
      toast.success('Room updated successfully');

      // Reset form
      setEditingRoom(null);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh room lists
      fetchRooms();
      fetchClassifiedRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      if (error instanceof Error) {
        toast.error(`Failed to update room: ${error.message}`);
      } else {
        toast.error('Failed to update room');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      await api.rooms.delete(roomToDelete);
      setRooms(rooms.filter(room => room.id !== roomToDelete));
      setClassifiedRooms(classifiedRooms.filter(room => room.id !== roomToDelete));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      if (error instanceof Error) {
        toast.error(`Failed to delete room: ${error.message}`);
      } else {
        toast.error('Failed to delete room');
      }
    } finally {
      setRoomToDelete(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateRoomData = (data: RoomFormData, isEdit: boolean = false, editingRoomId?: string): boolean => {
    if (data.room_number <= 0) {
      toast.error('Room number must be greater than 0');
      return false;
    }

    // Check for duplicate room numbers across both site rooms and classified rooms
    const allRooms = [...rooms, ...classifiedRooms];
    const existingRoom = allRooms.find(room => room.room_number === data.room_number);
    if (existingRoom && (!isEdit || existingRoom.id !== editingRoomId)) {
      toast.error(`Room number ${data.room_number} already exists. Please choose a different room number.`);
      return false;
    }

    if (!data.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (data.price_per_night <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    if (data.capacity <= 0) {
      toast.error('Capacity must be greater than 0');
      return false;
    }
    if (!data.room_type.trim()) {
      toast.error('Room type is required');
      return false;
    }
    return true;
  };

  const handleAddAmenity = () => {
    if (!currentAmenity.trim()) return;

    // For new room form
    if (!editingRoom) {
      if (!newRoom.amenities.includes(currentAmenity)) {
        setNewRoom({
          ...newRoom,
          amenities: [...newRoom.amenities, currentAmenity.trim()]
        });
      }
    }
    // For editing room form
    else {
      if (!editingRoom.amenities.includes(currentAmenity)) {
        setEditingRoom({
          ...editingRoom,
          amenities: [...editingRoom.amenities, currentAmenity.trim()]
        });
      }
    }

    // Clear the input
    setCurrentAmenity('');
  };

  const handleRemoveAmenity = (amenity: string) => {
    // For new room form
    if (!editingRoom) {
      setNewRoom({
        ...newRoom,
        amenities: newRoom.amenities.filter(a => a !== amenity)
      });
    }
    // For editing room form
    else {
      setEditingRoom({
        ...editingRoom,
        amenities: editingRoom.amenities.filter(a => a !== amenity)
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle creating multiple rooms
  const handleCreateMultipleRooms = async () => {
    const { roomType, fromRoom, toRoom, pricePerNight, capacity } = multipleRoomsData;

    // Validation
    if (!roomType.trim()) {
      toast.error('Room type is required');
      return;
    }
    if (fromRoom > toRoom) {
      toast.error('From room number must be less than or equal to To room number');
      return;
    }
    if (pricePerNight <= 0) {
      toast.error('Price per night must be greater than 0');
      return;
    }
    if (capacity <= 0) {
      toast.error('Capacity must be greater than 0');
      return;
    }

    // Check for existing room numbers across both site rooms and classified rooms
    const allRooms = [...rooms, ...classifiedRooms];
    const existingRoomNumbers = allRooms.map(room => room.room_number);
    const conflictingRooms = [];
    for (let roomNumber = fromRoom; roomNumber <= toRoom; roomNumber++) {
      if (existingRoomNumbers.includes(roomNumber)) {
        conflictingRooms.push(roomNumber);
      }
    }

    if (conflictingRooms.length > 0) {
      toast.error(`Room numbers already exist: ${conflictingRooms.join(', ')}. Please choose different room numbers.`);
      return;
    }

    setIsCreatingMultiple(true);
    try {
      const roomsToCreate = [];

      // Generate room data for each room number
      for (let roomNumber = fromRoom; roomNumber <= toRoom; roomNumber++) {
        const roomData: RoomFormData = {
          room_number: roomNumber,
          description: `${roomType} room number ${roomNumber}`,
          price_per_night: Number(pricePerNight),
          capacity: Number(capacity),
          room_type: roomType,
          amenities: [],
          display_category: roomType,
          is_available: true,
        };
        roomsToCreate.push(roomData);
      }

      // Create rooms one by one to handle individual failures better
      const results = [];
      const failures = [];

      for (const roomData of roomsToCreate) {
        try {
          const result = await api.rooms.create(roomData);
          results.push(result);
        } catch (error) {
          console.error(`Failed to create room ${roomData.room_number}:`, error);
          failures.push({
            roomNumber: roomData.room_number,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Show results
      if (results.length > 0) {
        toast.success(`Successfully created ${results.length} room${results.length !== 1 ? 's' : ''}`);
      }

      if (failures.length > 0) {
        const failureMessages = failures.map(f => `Room ${f.roomNumber}: ${f.error}`).join('\n');
        toast.error(`Failed to create ${failures.length} room${failures.length !== 1 ? 's' : ''}:\n${failureMessages}`);
      }

      // Reset form only if at least one room was created successfully
      if (results.length > 0) {
        setMultipleRoomsData({
          roomType: '',
          fromRoom: 1,
          toRoom: 1,
          pricePerNight: 0,
          capacity: 1,
        });
      }

      // Refresh room lists
      fetchRooms();
      fetchClassifiedRooms();
    } catch (error) {
      console.error('Error creating multiple rooms:', error);
      if (error instanceof Error) {
        toast.error(`Failed to create rooms: ${error.message}`);
      } else {
        toast.error('Failed to create rooms');
      }
    } finally {
      setIsCreatingMultiple(false);
    }
  };

  // Calculate number of rooms to be created
  const getRoomCount = () => {
    const { fromRoom, toRoom } = multipleRoomsData;
    return Math.max(0, toRoom - fromRoom + 1);
  };

  // Handle room lookup by room number
  const handleRoomLookup = async () => {
    if (!roomLookupNumber || roomLookupNumber <= 0) {
      setLookupError('Please enter a valid room number');
      return;
    }

    setIsLookingUpRoom(true);
    setLookupError(null);
    setRoomFound(null);

    try {
      const response = await api.rooms.getByRoomNumber(roomLookupNumber);
      const room = response.data;

      // Set the found room data
      setRoomFound(room);

      // Pre-fill the form with room details
      setNewRoom({
        room_number: room.room_number,
        description: room.description || '',
        price_per_night: room.price_per_night,
        capacity: room.capacity,
        room_type: room.room_type,
        amenities: room.amenities || [],
        display_category: room.display_category || '',
        is_available: true, // Default to available for new site room
      });

      // Clear any existing image preview since we're starting fresh
      setSelectedImage(null);
      setImagePreview(room.image_url || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success(`Room ${room.room_number} details loaded successfully`);
    } catch (error) {
      console.error('Error looking up room:', error);
      setLookupError(`Room ${roomLookupNumber} not found. You can create a new room with this number.`);

      // Reset form to allow creating new room with this number
      setNewRoom({
        room_number: roomLookupNumber,
        description: '',
        price_per_night: 0,
        capacity: 1,
        room_type: '',
        amenities: [],
        display_category: '',
        is_available: true,
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsLookingUpRoom(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setRoomLookupNumber(0);
    setRoomFound(null);
    setLookupError(null);
    setNewRoom({
      room_number: 0,
      description: '',
      price_per_night: 0,
      capacity: 1,
      room_type: '',
      amenities: [],
      display_category: '',
      is_available: true,
    });
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        </div>

        {/* Tabs for different room management sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-rooms" className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              Add to Site
            </TabsTrigger>
            <TabsTrigger value="classify" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Classify
            </TabsTrigger>
          </TabsList>

          {/* Add to Site Tab Content */}
          <TabsContent value="all-rooms" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Add to Site</CardTitle>
                      <CardDescription>
                        Manage rooms that will be displayed on your website
                      </CardDescription>
                    </div>
                    <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Site
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Room to Site</DialogTitle>
                          <DialogDescription>
                            Enter a room number to load existing details or create a new room. The system will check if the room exists and pre-fill the form with room details like price, capacity, and room type.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-3">
                          {/* Room Lookup Section */}
                          <div className="space-y-3">
                            <div className="grid gap-2">
                              <Label htmlFor="lookup_room_number">Room Number</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="lookup_room_number"
                                  type="number"
                                  value={roomLookupNumber || ''}
                                  onChange={(e) => setRoomLookupNumber(parseInt(e.target.value) || 0)}
                                  placeholder="Enter room number (e.g., 101)"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  onClick={handleRoomLookup}
                                  disabled={isLookingUpRoom || !roomLookupNumber}
                                  className="px-4"
                                >
                                  {isLookingUpRoom ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Looking...
                                    </>
                                  ) : (
                                    'Input Room'
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Error or Success Message */}
                            {lookupError && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">{lookupError}</p>
                              </div>
                            )}

                            {roomFound && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800 font-medium">
                                  ✓ Room {roomFound.room_number} found! Details loaded below.
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                  {roomFound.room_type} • ${roomFound.price_per_night}/night • Capacity: {roomFound.capacity}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Room Details Form - Only show if room number is set */}
                          {newRoom.room_number > 0 && (
                            <>
                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Room Details</h4>
                                <div className="grid gap-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-1.5">
                                      <Label htmlFor="price">Price Per Night ($)</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={newRoom.price_per_night || ''}
                                        onChange={(e) => setNewRoom({...newRoom, price_per_night: parseFloat(e.target.value) || 0})}
                                        placeholder="299.99"
                                        className="h-8"
                                      />
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label htmlFor="capacity">Capacity</Label>
                                      <Input
                                        id="capacity"
                                        type="number"
                                        value={newRoom.capacity || ''}
                                        onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 0})}
                                        placeholder="2"
                                        className="h-8"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label htmlFor="room_type">Room Type</Label>
                                    <Input
                                      id="room_type"
                                      value={newRoom.room_type}
                                      onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}
                                      placeholder="Standard Room, Deluxe Suite, etc."
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label htmlFor="display_category">Display Category</Label>
                                    <select
                                      id="display_category"
                                      value={newRoom.display_category || ''}
                                      onChange={(e) => setNewRoom({...newRoom, display_category: e.target.value})}
                                      className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <option value="">Select a category (optional)</option>
                                      <option value="Featured Rooms">Featured Rooms</option>
                                      <option value="Our Elegant Suites">Our Elegant Suites</option>
                                      <option value="Premium Rooms">Premium Rooms</option>
                                      <option value="Family Rooms">Family Rooms</option>
                                      <option value="Budget Friendly">Budget Friendly</option>
                                    </select>
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                      id="description"
                                      value={newRoom.description}
                                      onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                                      placeholder="Spacious room with a king-size bed and city views."
                                      rows={3}
                                      className="text-sm"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label htmlFor="amenities">Amenities</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id="amenities"
                                        value={currentAmenity}
                                        onChange={(e) => setCurrentAmenity(e.target.value)}
                                        placeholder="e.g., WiFi, Air Conditioning, Mini Bar"
                                        className="flex-1 h-8 text-sm"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddAmenity();
                                          }
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleAddAmenity}
                                        className="h-8"
                                      >
                                        <Plus className="h-3 w-3" />
                                        Add
                                      </Button>
                                    </div>
                                    {newRoom.amenities.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {newRoom.amenities.map((amenity, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 px-1.5 py-0.5 text-xs"
                                          >
                                            {amenity}
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveAmenity(amenity)}
                                              className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                              <X className="h-2.5 w-2.5" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="grid gap-1.5">
                                    <Label htmlFor="image">Room Image</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id="image"
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="flex-1 h-8 text-sm"
                                      />
                                      {imagePreview && (
                                        <div className="w-16 h-16 relative overflow-hidden rounded-md border">
                                          <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Upload a high-quality image of the room (max 5MB)
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="available"
                                      checked={newRoom.is_available}
                                      onCheckedChange={(checked) => setNewRoom({...newRoom, is_available: checked})}
                                    />
                                    <Label htmlFor="available" className="text-sm">Available for booking</Label>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          {newRoom.room_number > 0 && (
                            <Button
                              onClick={handleCreateRoom}
                              disabled={isSubmitting || !newRoom.room_type || !newRoom.description || newRoom.price_per_night <= 0}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                'Add to Site'
                              )}
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No site rooms created yet</p>
                  <p className="text-sm">Create rooms to display on your website</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Room #</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                          {room.image_url ? (
                            <div className="w-12 h-12 relative overflow-hidden rounded-md">
                              <img
                                src={room.image_url}
                                alt={`Room ${room.room_number}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
                              <BedDouble className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">#{room.room_number}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{room.room_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {room.display_category ? (
                            <Badge variant="secondary">{room.display_category}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </TableCell>
                        <TableCell>{formatPrice(room.price_per_night)}</TableCell>
                        <TableCell>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              room.is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {room.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRoom(room);
                                    setImagePreview(room.image_url);
                                    setSelectedImage(null);
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = '';
                                    }
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Room</DialogTitle>
                                  <DialogDescription>
                                    Update the room details.
                                  </DialogDescription>
                                </DialogHeader>
                                {editingRoom && (
                                  <div className="grid gap-3 py-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="grid gap-1.5">
                                        <Label htmlFor="edit-room-number">Room Number</Label>
                                        <Input
                                          id="edit-room-number"
                                          type="number"
                                          value={editingRoom.room_number || ''}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            room_number: parseInt(e.target.value) || 0
                                          })}
                                          className="h-8"
                                        />
                                      </div>
                                      <div className="grid gap-1.5">
                                        <Label htmlFor="edit-price">Price Per Night ($)</Label>
                                        <Input
                                          id="edit-price"
                                          type="number"
                                          value={editingRoom.price_per_night || ''}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            price_per_night: parseFloat(e.target.value) || 0
                                          })}
                                          className="h-8"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label htmlFor="edit-display-category">Display Category</Label>
                                      <select
                                        id="edit-display-category"
                                        value={editingRoom.display_category || ''}
                                        onChange={(e) => setEditingRoom({
                                          ...editingRoom,
                                          display_category: e.target.value
                                        })}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        <option value="">Select a category (optional)</option>
                                        <option value="Featured Rooms">Featured Rooms</option>
                                        <option value="Our Elegant Suites">Our Elegant Suites</option>
                                        <option value="Premium Rooms">Premium Rooms</option>
                                        <option value="Family Rooms">Family Rooms</option>
                                        <option value="Budget Friendly">Budget Friendly</option>
                                      </select>
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label htmlFor="edit-description">Description</Label>
                                      <Textarea
                                        id="edit-description"
                                        value={editingRoom.description}
                                        onChange={(e) => setEditingRoom({
                                          ...editingRoom,
                                          description: e.target.value
                                        })}
                                        rows={2}
                                        className="text-sm"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="grid gap-1.5">
                                        <Label htmlFor="edit-capacity">Capacity</Label>
                                        <Input
                                          id="edit-capacity"
                                          type="number"
                                          value={editingRoom.capacity || ''}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            capacity: parseInt(e.target.value) || 0
                                          })}
                                          className="h-8"
                                        />
                                      </div>
                                      <div className="grid gap-1.5">
                                        <Label htmlFor="edit-room-type">Room Type</Label>
                                        <Input
                                          id="edit-room-type"
                                          value={editingRoom.room_type}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            room_type: e.target.value
                                          })}
                                          placeholder="Standard Room"
                                          className="h-8"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                      <Label htmlFor="edit-amenities">Amenities</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          id="edit-amenities"
                                          value={currentAmenity}
                                          onChange={(e) => setCurrentAmenity(e.target.value)}
                                          placeholder="e.g., WiFi, Air Conditioning"
                                          className="flex-1 h-8 text-sm"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              handleAddAmenity();
                                            }
                                          }}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={handleAddAmenity}
                                          className="h-8"
                                        >
                                          <Plus className="h-3 w-3" />
                                          Add
                                        </Button>
                                      </div>
                                      {editingRoom.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {editingRoom.amenities.map((amenity, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="flex items-center gap-1 px-1.5 py-0.5 text-xs"
                                            >
                                              {amenity}
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveAmenity(amenity)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                              >
                                                <X className="h-2.5 w-2.5" />
                                              </button>
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="grid gap-1.5">
                                      <Label htmlFor="edit-image">Room Image</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          id="edit-image"
                                          type="file"
                                          ref={fileInputRef}
                                          accept="image/*"
                                          onChange={handleImageChange}
                                          className="flex-1 h-8 text-sm"
                                        />
                                        {imagePreview && (
                                          <div className="w-12 h-12 relative overflow-hidden rounded-md">
                                            <img
                                              src={imagePreview}
                                              alt="Preview"
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="edit-available"
                                        checked={editingRoom.is_available}
                                        onCheckedChange={(checked) => setEditingRoom({
                                          ...editingRoom,
                                          is_available: checked
                                        })}
                                      />
                                      <Label htmlFor="edit-available" className="text-sm">Available for booking</Label>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button
                                    onClick={handleUpdateRoom}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                      </>
                                    ) : (
                                      'Save Changes'
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => setRoomToDelete(room.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this room. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setRoomToDelete(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteRoom}
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
              )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Classify Tab Content */}
          <TabsContent value="classify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classify Rooms</CardTitle>
                <CardDescription>
                  Create multiple rooms of the same type with sequential numbering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Add Multiple
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Create Multiple Rooms</DialogTitle>
                        <DialogDescription>
                          Create multiple rooms of the same type with sequential room numbers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="room-type">Room Type</Label>
                          <Input
                            id="room-type"
                            value={multipleRoomsData.roomType}
                            onChange={(e) => setMultipleRoomsData({
                              ...multipleRoomsData,
                              roomType: e.target.value
                            })}
                            placeholder="e.g., Deluxe Suite, Standard Room"
                            className="h-9"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label htmlFor="from-room">From Room</Label>
                            <Input
                              id="from-room"
                              type="number"
                              min="1"
                              value={multipleRoomsData.fromRoom}
                              onChange={(e) => setMultipleRoomsData({
                                ...multipleRoomsData,
                                fromRoom: parseInt(e.target.value) || 1
                              })}
                              className="h-9"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="to-room">To Room</Label>
                            <Input
                              id="to-room"
                              type="number"
                              min="1"
                              value={multipleRoomsData.toRoom}
                              onChange={(e) => setMultipleRoomsData({
                                ...multipleRoomsData,
                                toRoom: parseInt(e.target.value) || 1
                              })}
                              className="h-9"
                            />
                          </div>
                        </div>

                        {getRoomCount() > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                              <strong>Rooms to create:</strong> {getRoomCount()} rooms
                              {getRoomCount() > 1 && (
                                <span className="block text-xs mt-1">
                                  ({multipleRoomsData.roomType} {multipleRoomsData.fromRoom} to {multipleRoomsData.roomType} {multipleRoomsData.toRoom})
                                </span>
                              )}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label htmlFor="price-per-night">Price Per Night ($)</Label>
                            <Input
                              id="price-per-night"
                              type="number"
                              min="0"
                              step="0.01"
                              value={multipleRoomsData.pricePerNight || ''}
                              onChange={(e) => setMultipleRoomsData({
                                ...multipleRoomsData,
                                pricePerNight: parseFloat(e.target.value) || 0
                              })}
                              placeholder="299.99"
                              className="h-9"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              min="1"
                              value={multipleRoomsData.capacity}
                              onChange={(e) => setMultipleRoomsData({
                                ...multipleRoomsData,
                                capacity: parseInt(e.target.value) || 1
                              })}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          onClick={handleCreateMultipleRooms}
                          disabled={isCreatingMultiple || getRoomCount() === 0}
                        >
                          {isCreatingMultiple ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating {getRoomCount()} rooms...
                            </>
                          ) : (
                            `Create ${getRoomCount()} Room${getRoomCount() !== 1 ? 's' : ''}`
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Classified Rooms List */}
                {classifiedRooms.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Classified Rooms ({classifiedRooms.length})</h3>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Room #</TableHead>
                            <TableHead>Room Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classifiedRooms.map((room) => (
                            <TableRow key={room.id}>
                              <TableCell className="font-medium">#{room.room_number}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{room.room_type}</Badge>
                              </TableCell>
                              <TableCell>
                                {room.display_category ? (
                                  <Badge variant="secondary">{room.display_category}</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-xs">None</span>
                                )}
                              </TableCell>
                              <TableCell>{formatPrice(room.price_per_night)}</TableCell>
                              <TableCell>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    room.is_available
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {room.is_available ? 'Available' : 'Unavailable'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingRoom(room);
                                      setImagePreview(room.image_url);
                                      setSelectedImage(null);
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                      }
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setRoomToDelete(room.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {classifiedRooms.length === 0 && (
                  <div className="mt-8 text-center py-8 text-gray-500">
                    <Copy className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No classified rooms created yet</p>
                    <p className="text-sm">Use the "Add Multiple" button above to create rooms in bulk</p>
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

export default AdminRooms;
