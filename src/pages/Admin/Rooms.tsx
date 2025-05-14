import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { toast } from '@/components/ui/sonner';

interface Room {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  image_url: string;
  is_available: boolean;
}

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

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

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      await api.rooms.delete(roomToDelete);
      setRooms(rooms.filter(room => room.id !== roomToDelete));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    } finally {
      setRoomToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
          <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No rooms found. Add your first room to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div className="h-10 w-16 rounded overflow-hidden bg-gray-100">
                          {room.image_url && (
                            <img
                              src={room.image_url}
                              alt={room.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.room_type}</TableCell>
                      <TableCell>${room.price_per_night.toFixed(2)}</TableCell>
                      <TableCell>{room.capacity} guests</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            room.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {room.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setRoomToDelete(room.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the room
                                  and remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRoomToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteRoom}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
