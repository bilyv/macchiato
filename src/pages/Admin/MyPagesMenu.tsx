import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Utensils, Trash2, Clock, DollarSign, Tag, Edit, Save, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MenuItem, MenuImage, MenuItemFormData } from '@/lib/api/menu';
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
import { Badge } from '@/components/ui/badge';

const MyPagesMenu = () => {
  // State for menu items and images
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // State for editing menu items
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editFormData, setEditFormData] = useState<MenuItemFormData>({
    item_name: '',
    category: 'breakfast',
    description: '',
    price: 0,
    preparation_time: 0,
    tags: []
  });
  const [editTagInput, setEditTagInput] = useState('');

  // Upload menu state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newMenuImage, setNewMenuImage] = useState({
    title: '',
    category: 'drinks' as 'drinks' | 'desserts' | 'others'
  });

  // Create suggestion state
  const suggestionFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSuggestionImage, setSelectedSuggestionImage] = useState<File | null>(null);
  const [suggestionImagePreview, setSuggestionImagePreview] = useState<string | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    item_name: '',
    category: 'breakfast' as 'breakfast' | 'lunch' | 'dinner',
    description: '',
    price: 0,
    preparation_time: 0,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu items with better error handling
        try {
          const itemsResponse = await api.menu.getAllItems();
          console.log('Menu items response:', itemsResponse);

          if (itemsResponse && itemsResponse.data && Array.isArray(itemsResponse.data)) {
            // Validate and sanitize the data
            const validatedItems = itemsResponse.data.map((item: any) => ({
              ...item,
              id: item.id || '',
              item_name: item.item_name || '',
              category: item.category || 'breakfast',
              description: item.description || '',
              price: typeof item.price === 'number' ? item.price : (typeof item.price === 'string' ? parseFloat(item.price) || 0 : 0),
              preparation_time: typeof item.preparation_time === 'number' ? item.preparation_time : (typeof item.preparation_time === 'string' ? parseInt(item.preparation_time) || 0 : 0),
              tags: Array.isArray(item.tags) ? item.tags : [],
              image_url: item.image_url || null,
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString()
            }));
            setMenuItems(validatedItems);
          } else {
            console.warn('Invalid menu items response structure:', itemsResponse);
            setMenuItems([]);
          }
        } catch (itemsError) {
          console.error('Error fetching menu items:', itemsError);
          setMenuItems([]);
          toast.error('Failed to load menu items');
        }
        setIsLoadingItems(false);

        // Fetch menu images with better error handling
        try {
          const imagesResponse = await api.menu.getAllImages();
          console.log('Menu images response:', imagesResponse);

          if (imagesResponse && imagesResponse.data && Array.isArray(imagesResponse.data)) {
            // Validate and sanitize the data
            const validatedImages = imagesResponse.data.map((image: any) => ({
              ...image,
              id: image.id || '',
              title: image.title || '',
              category: image.category || 'others',
              image_url: image.image_url || '',
              created_at: image.created_at || new Date().toISOString(),
              updated_at: image.updated_at || new Date().toISOString()
            }));
            setMenuImages(validatedImages);
          } else {
            console.warn('Invalid menu images response structure:', imagesResponse);
            setMenuImages([]);
          }
        } catch (imagesError) {
          console.error('Error fetching menu images:', imagesError);
          setMenuImages([]);
          toast.error('Failed to load menu images');
        }
        setIsLoadingImages(false);
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast.error('Failed to load menu data');
        setIsLoadingItems(false);
        setIsLoadingImages(false);
        setMenuItems([]);
        setMenuImages([]);
      }
    };

    fetchData();
  }, []);

  // Handle image selection for upload
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

  // Handle image selection for suggestion
  const handleSuggestionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedSuggestionImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSuggestionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle menu image upload
  const handleUploadMenuImage = async () => {
    try {
      if (!selectedImage) {
        toast.error('Please select an image to upload');
        return;
      }

      if (!newMenuImage.title.trim()) {
        toast.error('Please enter a title for the menu image');
        return;
      }

      // Upload the image
      await api.menu.createImage(newMenuImage, selectedImage);

      // Show success message
      toast.success('Menu image uploaded successfully');

      // Reset form
      setNewMenuImage({
        title: '',
        category: 'drinks'
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh menu images
      const response = await api.menu.getAllImages();
      if (response.data) {
        setMenuImages(response.data);
      }
    } catch (error) {
      console.error('Error uploading menu image:', error);
      toast.error('Failed to upload menu image');
    }
  };

  // Handle menu item creation
  const handleCreateMenuItem = async () => {
    try {
      if (!newMenuItem.item_name.trim()) {
        toast.error('Please enter an item name');
        return;
      }

      if (!newMenuItem.description.trim()) {
        toast.error('Please enter a description');
        return;
      }

      if (newMenuItem.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      if (newMenuItem.preparation_time <= 0) {
        toast.error('Please enter a valid preparation time');
        return;
      }

      // Create the menu item with optional image
      await api.menu.createItem(newMenuItem, selectedSuggestionImage || undefined);

      // Show success message
      toast.success('Menu item created successfully');

      // Reset form
      setNewMenuItem({
        item_name: '',
        category: 'breakfast',
        description: '',
        price: 0,
        preparation_time: 0,
        tags: []
      });
      setTagInput('');
      setSelectedSuggestionImage(null);
      setSuggestionImagePreview(null);
      if (suggestionFileInputRef.current) {
        suggestionFileInputRef.current.value = '';
      }

      // Refresh menu items with error handling
      try {
        const response = await api.menu.getAllItems();
        if (response && response.data && Array.isArray(response.data)) {
          const validatedItems = response.data.map((item: any) => ({
            ...item,
            id: item.id || '',
            item_name: item.item_name || '',
            category: item.category || 'breakfast',
            description: item.description || '',
            price: typeof item.price === 'number' ? item.price : (typeof item.price === 'string' ? parseFloat(item.price) || 0 : 0),
            preparation_time: typeof item.preparation_time === 'number' ? item.preparation_time : (typeof item.preparation_time === 'string' ? parseInt(item.preparation_time) || 0 : 0),
            tags: Array.isArray(item.tags) ? item.tags : [],
            image_url: item.image_url || null,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString()
          }));
          setMenuItems(validatedItems);
        }
      } catch (refreshError) {
        console.error('Error refreshing menu items:', refreshError);
        // Don't show error toast here as the main operation succeeded
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('Failed to create menu item');
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !newMenuItem.tags.includes(tagInput.trim())) {
      setNewMenuItem({
        ...newMenuItem,
        tags: [...newMenuItem.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setNewMenuItem({
      ...newMenuItem,
      tags: newMenuItem.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle menu item deletion
  const handleDeleteMenuItem = async (id: string) => {
    try {
      await api.menu.deleteItem(id);
      toast.success('Menu item deleted successfully');

      // Refresh menu items
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  // Handle menu image deletion
  const handleDeleteMenuImage = async (id: string) => {
    try {
      await api.menu.deleteImage(id);
      toast.success('Menu image deleted successfully');

      // Refresh menu images
      setMenuImages(menuImages.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting menu image:', error);
      toast.error('Failed to delete menu image');
    }
  };

  // Handle edit menu item
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditFormData({
      item_name: item.item_name,
      category: item.category,
      description: item.description,
      price: item.price,
      preparation_time: item.preparation_time,
      tags: [...item.tags]
    });
    setEditTagInput('');
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      if (!editFormData.item_name.trim()) {
        toast.error('Please enter an item name');
        return;
      }

      if (!editFormData.description.trim()) {
        toast.error('Please enter a description');
        return;
      }

      if (editFormData.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      if (editFormData.preparation_time <= 0) {
        toast.error('Please enter a valid preparation time');
        return;
      }

      // Update the menu item
      await api.menu.updateItem(editingItem.id, editFormData);
      toast.success('Menu item updated successfully');

      // Update the local state
      setMenuItems(menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...editFormData }
          : item
      ));

      // Reset editing state
      setEditingItem(null);
      setEditFormData({
        item_name: '',
        category: 'breakfast',
        description: '',
        price: 0,
        preparation_time: 0,
        tags: []
      });
      setEditTagInput('');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      item_name: '',
      category: 'breakfast',
      description: '',
      price: 0,
      preparation_time: 0,
      tags: []
    });
    setEditTagInput('');
  };

  // Handle edit tag addition
  const handleAddEditTag = () => {
    if (editTagInput.trim() && !editFormData.tags.includes(editTagInput.trim())) {
      setEditFormData({
        ...editFormData,
        tags: [...editFormData.tags, editTagInput.trim()]
      });
      setEditTagInput('');
    }
  };

  // Handle edit tag removal
  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditFormData({
      ...editFormData,
      tags: editFormData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Menu Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Menu
            </CardTitle>
            <CardDescription>
              Upload menu images with categories like drinks, desserts, and others
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs h-7 px-2 py-1">
                <Plus className="h-3 w-3 mr-1" />
                Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Menu Image</DialogTitle>
                <DialogDescription>
                  Upload a menu image and categorize it
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="menu-image-upload">Image</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="menu-image-upload"
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
                  <Label htmlFor="menu-title">Title</Label>
                  <Input
                    id="menu-title"
                    value={newMenuImage.title}
                    onChange={(e) => setNewMenuImage({...newMenuImage, title: e.target.value})}
                    placeholder="Enter menu title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="menu-category">Category</Label>
                  <Select
                    value={newMenuImage.category}
                    onValueChange={(value: any) => setNewMenuImage({...newMenuImage, category: value})}
                  >
                    <SelectTrigger id="menu-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUploadMenuImage}>
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingImages ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8A5A44]"></div>
            </div>
          ) : menuImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No menu images uploaded yet</p>
              <p className="text-sm">Upload menu images to display in your restaurant</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menuImages.map((image) => (
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
                              This will permanently delete this menu image.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMenuImage(image.id)}
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

      {/* Create Suggestions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Suggestions
            </CardTitle>
            <CardDescription>
              Create menu item suggestions with detailed information
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs h-7 px-2 py-1">
                <Plus className="h-3 w-3 mr-1" />
                Suggestions
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Menu Item Suggestion</DialogTitle>
                <DialogDescription>
                  Add a new menu item with detailed information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item-name">Item Name *</Label>
                    <Input
                      id="item-name"
                      value={newMenuItem.item_name}
                      onChange={(e) => setNewMenuItem({...newMenuItem, item_name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-category">Category *</Label>
                    <Select
                      value={newMenuItem.category}
                      onValueChange={(value: any) => setNewMenuItem({...newMenuItem, category: value})}
                    >
                      <SelectTrigger id="item-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="item-description">Description *</Label>
                  <Textarea
                    id="item-description"
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item-price" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Price *
                    </Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newMenuItem.price === 0 ? '' : newMenuItem.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewMenuItem({
                          ...newMenuItem,
                          price: value === '' ? 0 : parseFloat(value) || 0
                        });
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="prep-time" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Preparation Time (minutes) *
                    </Label>
                    <Input
                      id="prep-time"
                      type="number"
                      min="1"
                      value={newMenuItem.preparation_time === 0 ? '' : newMenuItem.preparation_time}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewMenuItem({
                          ...newMenuItem,
                          preparation_time: value === '' ? 0 : parseInt(value) || 0
                        });
                      }}
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="suggestion-image-upload">Image (Optional)</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="suggestion-image-upload"
                      type="file"
                      accept="image/*"
                      ref={suggestionFileInputRef}
                      onChange={handleSuggestionImageChange}
                    />
                    {suggestionImagePreview && (
                      <div className="relative w-full h-40 rounded-md overflow-hidden border">
                        <img
                          src={suggestionImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Enter a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      Add
                    </Button>
                  </div>
                  {newMenuItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMenuItem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-xs hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateMenuItem}>
                  Create Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingItems ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8A5A44]"></div>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Utensils className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No menu items created yet</p>
              <p className="text-sm">Create menu item suggestions for your restaurant</p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => {
                // Add safety checks for each item
                if (!item || !item.id) {
                  console.warn('Invalid menu item:', item);
                  return null;
                }

                // Check if this item is being edited
                if (editingItem && editingItem.id === item.id) {
                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-blue-50 border-blue-200"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-blue-700">Editing Menu Item</h3>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button onClick={handleCancelEdit} variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-item-name">Item Name *</Label>
                            <Input
                              id="edit-item-name"
                              value={editFormData.item_name}
                              onChange={(e) => setEditFormData({...editFormData, item_name: e.target.value})}
                              placeholder="Enter item name"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category *</Label>
                            <Select
                              value={editFormData.category}
                              onValueChange={(value: 'breakfast' | 'lunch' | 'dinner') =>
                                setEditFormData({...editFormData, category: value})
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description *</Label>
                            <Textarea
                              id="edit-description"
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                              placeholder="Enter item description"
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-price" className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                Price *
                              </Label>
                              <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editFormData.price === 0 ? '' : editFormData.price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    price: value === '' ? 0 : parseFloat(value) || 0
                                  });
                                }}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-prep-time" className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Preparation Time (minutes) *
                              </Label>
                              <Input
                                id="edit-prep-time"
                                type="number"
                                min="1"
                                value={editFormData.preparation_time === 0 ? '' : editFormData.preparation_time}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    preparation_time: value === '' ? 0 : parseInt(value) || 0
                                  });
                                }}
                                placeholder="15"
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              Tags
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                value={editTagInput}
                                onChange={(e) => setEditTagInput(e.target.value)}
                                placeholder="Enter a tag"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddEditTag();
                                  }
                                }}
                              />
                              <Button type="button" onClick={handleAddEditTag} size="sm">
                                Add
                              </Button>
                            </div>
                            {editFormData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {editFormData.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveEditTag(tag)}
                                      className="ml-1 text-xs hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular display mode
                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
                  >
                    {item.image_url && (
                      <div className="w-full md:w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.item_name || 'Menu item'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.warn('Failed to load image:', item.image_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-[#8A5A44]">
                            {item.item_name || 'Unnamed Item'}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.category || 'uncategorized'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${(() => {
                              const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
                              return price.toFixed(2);
                            })()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.preparation_time || 0} min
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{item.description || 'No description available'}</p>
                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag || 'tag'}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          ID: {item.id}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditMenuItem(item)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this menu item suggestion.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMenuItem(item.id)}
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
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPagesMenu;
