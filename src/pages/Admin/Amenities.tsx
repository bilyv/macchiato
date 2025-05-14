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

interface Amenity {
  id: number;
  name: string;
  description: string;
  iconName: string;
}

const AdminAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amenityToDelete, setAmenityToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setIsLoading(true);
    try {
      const response = await api.amenities.getAll();
      setAmenities(response.data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      toast.error('Failed to load amenities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAmenity = async () => {
    if (!amenityToDelete) return;
    
    try {
      await api.amenities.delete(amenityToDelete);
      setAmenities(amenities.filter(amenity => amenity.id !== amenityToDelete));
      toast.success('Amenity deleted successfully');
    } catch (error) {
      console.error('Error deleting amenity:', error);
      toast.error('Failed to delete amenity');
    } finally {
      setAmenityToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Amenities Management</h1>
          <Button className="bg-[#C45D3A] hover:bg-[#A74B2F] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Amenity
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
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No amenities found. Add your first amenity to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  amenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>
                        <div className="h-8 w-8 rounded-full bg-[#EEDFD0] flex items-center justify-center text-[#8A5A44]">
                          {amenity.iconName ? (
                            <span className="text-lg">{amenity.iconName}</span>
                          ) : (
                            <span>?</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{amenity.name}</TableCell>
                      <TableCell className="max-w-md truncate">{amenity.description}</TableCell>
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
                                onClick={() => setAmenityToDelete(amenity.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the amenity
                                  and remove it from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setAmenityToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteAmenity}
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

export default AdminAmenities;
