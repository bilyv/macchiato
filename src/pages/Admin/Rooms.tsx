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
import { Pencil, Trash2, Plus, BedDouble, Upload, Loader2, X } from 'lucide-react';
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

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentAmenity, setCurrentAmenity] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newRoom, setNewRoom] = useState<RoomFormData>({
    name: '',
    description: '',
    price_per_night: 0,
    capacity: 1,
    size_sqm: 0,
    bed_type: '',
    amenities: [],
    category: '',
    is_available: true,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await api.rooms.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!validateRoomData(newRoom)) return;

    // Ensure numeric values are properly converted to numbers
    const roomData: RoomFormData = {
      ...newRoom,
      price_per_night: Number(newRoom.price_per_night),
      capacity: Number(newRoom.capacity),
      size_sqm: Number(newRoom.size_sqm)
    };

    setIsSubmitting(true);
    try {
      await api.rooms.create(roomData, selectedImage || undefined);
      toast.success('Room created successfully');

      // Reset form
      setNewRoom({
        name: '',
        description: '',
        price_per_night: 0,
        capacity: 1,
        size_sqm: 0,
        bed_type: '',
        amenities: [],
        category: '',
        is_available: true,
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh room list
      fetchRooms();
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
      name: editingRoom.name,
      description: editingRoom.description,
      price_per_night: Number(editingRoom.price_per_night),
      capacity: Number(editingRoom.capacity),
      size_sqm: Number(editingRoom.size_sqm),
      bed_type: editingRoom.bed_type,
      amenities: editingRoom.amenities,
      category: editingRoom.category,
      is_available: editingRoom.is_available,
    };

    if (!validateRoomData(roomData)) return;

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

      // Refresh room list
      fetchRooms();
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

  const validateRoomData = (data: RoomFormData): boolean => {
    if (!data.name.trim()) {
      toast.error('Room name is required');
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
    if (data.size_sqm <= 0) {
      toast.error('Size must be greater than 0');
      return false;
    }
    if (!data.bed_type.trim()) {
      toast.error('Bed type is required');
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Create a new room to display on your website.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                      placeholder="Deluxe Suite"
                      className="h-8"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="price">Price Per Night ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newRoom.price_per_night || ''}
                      onChange={(e) => setNewRoom({...newRoom, price_per_night: parseFloat(e.target.value) || 0})}
                      placeholder="299.99"
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="category">Room Category</Label>
                  <select
                    id="category"
                    value={newRoom.category || ''}
                    onChange={(e) => setNewRoom({...newRoom, category: e.target.value})}
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
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
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
                  <div className="grid gap-1.5">
                    <Label htmlFor="size">Size (sqm)</Label>
                    <Input
                      id="size"
                      type="number"
                      value={newRoom.size_sqm || ''}
                      onChange={(e) => setNewRoom({...newRoom, size_sqm: parseFloat(e.target.value) || 0})}
                      placeholder="35"
                      className="h-8"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bed_type">Bed Type</Label>
                    <Input
                      id="bed_type"
                      value={newRoom.bed_type}
                      onChange={(e) => setNewRoom({...newRoom, bed_type: e.target.value})}
                      placeholder="King Size"
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="amenities">Amenities</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="amenities"
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
                    id="available"
                    checked={newRoom.is_available}
                    onCheckedChange={(checked) => setNewRoom({...newRoom, is_available: checked})}
                  />
                  <Label htmlFor="available" className="text-sm">Available for booking</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleCreateRoom}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Room'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Rooms</CardTitle>
              <CardDescription>
                Manage your hotel rooms and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No rooms created yet</p>
                  <p className="text-sm">Create rooms to display on your website</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Amenities</TableHead>
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
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
                              <BedDouble className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>
                          {room.category ? (
                            <Badge variant="secondary">{room.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </TableCell>
                        <TableCell>{formatPrice(room.price_per_night)}</TableCell>
                        <TableCell>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.length > 0 ? (
                              room.amenities.slice(0, 3).map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                            {room.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{room.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
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
                                        <Label htmlFor="edit-name">Room Name</Label>
                                        <Input
                                          id="edit-name"
                                          value={editingRoom.name}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            name: e.target.value
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
                                      <Label htmlFor="edit-category">Room Category</Label>
                                      <select
                                        id="edit-category"
                                        value={editingRoom.category || ''}
                                        onChange={(e) => setEditingRoom({
                                          ...editingRoom,
                                          category: e.target.value
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
                                    <div className="grid grid-cols-3 gap-3">
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
                                        <Label htmlFor="edit-size">Size (sqm)</Label>
                                        <Input
                                          id="edit-size"
                                          type="number"
                                          value={editingRoom.size_sqm || ''}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            size_sqm: parseFloat(e.target.value) || 0
                                          })}
                                          className="h-8"
                                        />
                                      </div>
                                      <div className="grid gap-1.5">
                                        <Label htmlFor="edit-bed-type">Bed Type</Label>
                                        <Input
                                          id="edit-bed-type"
                                          value={editingRoom.bed_type}
                                          onChange={(e) => setEditingRoom({
                                            ...editingRoom,
                                            bed_type: e.target.value
                                          })}
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
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
