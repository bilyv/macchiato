import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Image } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GalleryImage } from '@/lib/api/gallery';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MyPagesGallery = () => {
  // Gallery-related state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  // Gallery image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newGalleryImage, setNewGalleryImage] = useState({
    title: '',
    description: '',
    category: 'attractions' as 'attractions' | 'neighbourhood' | 'foods' | 'events'
  });

  // Fetch gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const galleryResponse = await api.gallery.getAll();
        if (galleryResponse.data) {
          setGalleryImages(galleryResponse.data);
        }
        setIsLoadingGallery(false);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        toast.error('Failed to load gallery images');
        setIsLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Handle image selection
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

  // Handle gallery image upload
  const handleCreateGalleryImage = async () => {
    try {
      if (!selectedImage) {
        toast.error('Please select an image to upload');
        return;
      }

      if (!newGalleryImage.title.trim()) {
        toast.error('Please enter a title for the image');
        return;
      }

      // Upload the image
      await api.gallery.create(newGalleryImage, selectedImage);

      // Show success message
      toast.success('Gallery image uploaded successfully');

      // Reset form
      setNewGalleryImage({
        title: '',
        description: '',
        category: 'attractions'
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh gallery images
      const response = await api.gallery.getAll();
      if (response.data) {
        setGalleryImages(response.data);
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      toast.error('Failed to upload gallery image');
    }
  };

  // Handle gallery image deletion
  const handleDeleteGalleryImage = async (id: string) => {
    try {
      await api.gallery.delete(id);
      toast.success('Gallery image deleted successfully');

      // Refresh gallery images
      setGalleryImages(galleryImages.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Failed to delete gallery image');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>
            Manage images for your gallery page
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs h-7 px-2 py-1">
              <Plus className="h-3 w-3 mr-1" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
              <DialogDescription>
                Upload a new image to your gallery
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="image-upload">Image</Label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-title">Title</Label>
                <Input
                  id="image-title"
                  value={newGalleryImage.title}
                  onChange={(e) => setNewGalleryImage({...newGalleryImage, title: e.target.value})}
                  placeholder="Enter image title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-description">Description (Optional)</Label>
                <Textarea
                  id="image-description"
                  value={newGalleryImage.description}
                  onChange={(e) => setNewGalleryImage({...newGalleryImage, description: e.target.value})}
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-category">Category</Label>
                <Select
                  value={newGalleryImage.category}
                  onValueChange={(value: any) => setNewGalleryImage({...newGalleryImage, category: value})}
                >
                  <SelectTrigger id="image-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="neighbourhood">Neighbourhood</SelectItem>
                    <SelectItem value="foods">Foods</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateGalleryImage}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoadingGallery ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8A5A44]"></div>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No gallery images uploaded yet</p>
            <p className="text-sm">Upload images to display in your gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative group rounded-md overflow-hidden border">
                <div className="aspect-square">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div>
                    <h4 className="text-white font-medium">{image.title}</h4>
                    <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                    <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs rounded mt-2">
                      {image.category}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this image from your gallery.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteGalleryImage(image.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyPagesGallery;
