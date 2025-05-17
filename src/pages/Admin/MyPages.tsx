import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Plus, Trash2, Bell, X, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';

interface NotificationBar {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface PageContent {
  id: string;
  page_name: string;
  section_name: string;
  content: any;
  created_at: string;
  updated_at: string;
}

const AdminMyPages = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeContentTab, setActiveContentTab] = useState('notification');
  const [notificationBars, setNotificationBars] = useState<NotificationBar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState<NotificationBar | null>(null);
  const [newNotification, setNewNotification] = useState({
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    is_active: true,
    start_date: '',
    end_date: '',
  });

  // Fetch notification bars
  useEffect(() => {
    const fetchNotificationBars = async () => {
      try {
        const response = await api.notificationBars.getAll();
        if (response.data) {
          setNotificationBars(response.data);
        }
      } catch (error) {
        console.error('Error fetching notification bars:', error);
        toast.error('Failed to load notification bars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationBars();
  }, []);

  const handleCreateNotification = async () => {
    try {
      console.log('Creating notification with data:', newNotification);

      // Check if message is empty
      if (!newNotification.message.trim()) {
        toast.error('Notification message cannot be empty');
        return;
      }

      // Create a copy of the notification data to send to the API
      const notificationToSend = {
        ...newNotification,
        // Ensure empty dates are sent as empty strings
        start_date: newNotification.start_date || '',
        end_date: newNotification.end_date || ''
      };

      console.log('Sending notification data:', notificationToSend);

      const response = await api.notificationBars.create(notificationToSend);
      console.log('Notification creation response:', response);

      toast.success('Notification created successfully');

      // Reset form
      setNewNotification({
        message: '',
        type: 'info',
        is_active: true,
        start_date: '',
        end_date: '',
      });

      // Refresh notification list
      const listResponse = await api.notificationBars.getAll();
      console.log('Notification list response:', listResponse);

      if (listResponse.data) {
        setNotificationBars(listResponse.data);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Failed to create notification: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateNotification = async () => {
    if (!editingNotification) return;

    try {
      // Create a copy of the notification data to send to the API
      const notificationToSend = {
        ...editingNotification,
        // Ensure empty dates are sent as empty strings
        start_date: editingNotification.start_date || '',
        end_date: editingNotification.end_date || ''
      };

      console.log('Updating notification with data:', notificationToSend);

      await api.notificationBars.update(editingNotification.id, notificationToSend);
      toast.success('Notification updated successfully');

      // Refresh notification list
      const response = await api.notificationBars.getAll();
      if (response.data) {
        setNotificationBars(response.data);
      }

      setEditingNotification(null);
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.notificationBars.delete(id);
      toast.success('Notification deleted successfully');

      // Refresh notification list
      setNotificationBars(notificationBars.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Pages</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Pages</CardTitle>
            <CardDescription>
              Manage the content of your website pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="home"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="mt-6">
                <Tabs
                  defaultValue="notification"
                  value={activeContentTab}
                  onValueChange={setActiveContentTab}
                  className="w-full"
                >
                  <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="notification">Notification Bar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notification" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Notification Bar</CardTitle>
                          <CardDescription>
                            Add a notification bar to the top of your website
                          </CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Notification
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Notification</DialogTitle>
                              <DialogDescription>
                                Add a new notification bar to display on your website
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  value={newNotification.message}
                                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                                  placeholder="Enter notification message"
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="type">Type</Label>
                                  <Select
                                    value={newNotification.type}
                                    onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="info">Info</SelectItem>
                                      <SelectItem value="warning">Warning</SelectItem>
                                      <SelectItem value="success">Success</SelectItem>
                                      <SelectItem value="error">Error</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="active">Active</Label>
                                  <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                      id="active"
                                      checked={newNotification.is_active}
                                      onCheckedChange={(checked) => setNewNotification({...newNotification, is_active: checked})}
                                    />
                                    <Label htmlFor="active">{newNotification.is_active ? 'Yes' : 'No'}</Label>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                                  <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={newNotification.start_date}
                                    onChange={(e) => setNewNotification({...newNotification, start_date: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="endDate">End Date (Optional)</Label>
                                  <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={newNotification.end_date}
                                    onChange={(e) => setNewNotification({...newNotification, end_date: e.target.value})}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCreateNotification();
                                }}
                              >
                                Create
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        {notificationBars.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No notification bars created yet</p>
                            <p className="text-sm">Create one to display important messages on your website</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {notificationBars.map((notification) => (
                              <div
                                key={notification.id}
                                className="border rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      notification.type === 'info' ? 'bg-blue-500' :
                                      notification.type === 'warning' ? 'bg-yellow-500' :
                                      notification.type === 'success' ? 'bg-green-500' :
                                      'bg-red-500'
                                    }`} />
                                    <span className="font-medium capitalize">{notification.type}</span>
                                    {notification.is_active && (
                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm">{notification.message}</p>
                                  <div className="text-xs text-gray-500">
                                    {notification.start_date && (
                                      <span>From: {new Date(notification.start_date).toLocaleString()} </span>
                                    )}
                                    {notification.end_date && (
                                      <span>To: {new Date(notification.end_date).toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-auto">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingNotification(notification)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Notification</DialogTitle>
                                        <DialogDescription>
                                          Update the notification bar details
                                        </DialogDescription>
                                      </DialogHeader>
                                      {editingNotification && (
                                        <div className="grid gap-4 py-4">
                                          <div className="grid gap-2">
                                            <Label htmlFor="edit-message">Message</Label>
                                            <Textarea
                                              id="edit-message"
                                              value={editingNotification.message}
                                              onChange={(e) => setEditingNotification({
                                                ...editingNotification,
                                                message: e.target.value
                                              })}
                                              rows={3}
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                              <Label htmlFor="edit-type">Type</Label>
                                              <Select
                                                value={editingNotification.type}
                                                onValueChange={(value: any) => setEditingNotification({
                                                  ...editingNotification,
                                                  type: value
                                                })}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="info">Info</SelectItem>
                                                  <SelectItem value="warning">Warning</SelectItem>
                                                  <SelectItem value="success">Success</SelectItem>
                                                  <SelectItem value="error">Error</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="edit-active">Active</Label>
                                              <div className="flex items-center space-x-2 pt-2">
                                                <Switch
                                                  id="edit-active"
                                                  checked={editingNotification.is_active}
                                                  onCheckedChange={(checked) => setEditingNotification({
                                                    ...editingNotification,
                                                    is_active: checked
                                                  })}
                                                />
                                                <Label htmlFor="edit-active">
                                                  {editingNotification.is_active ? 'Yes' : 'No'}
                                                </Label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                              <Label htmlFor="edit-startDate">Start Date (Optional)</Label>
                                              <Input
                                                id="edit-startDate"
                                                type="datetime-local"
                                                value={editingNotification.start_date || ''}
                                                onChange={(e) => setEditingNotification({
                                                  ...editingNotification,
                                                  start_date: e.target.value || null
                                                })}
                                              />
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                                              <Input
                                                id="edit-endDate"
                                                type="datetime-local"
                                                value={editingNotification.end_date || ''}
                                                onChange={(e) => setEditingNotification({
                                                  ...editingNotification,
                                                  end_date: e.target.value || null
                                                })}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={handleUpdateNotification}>Save Changes</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
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
                                          This will permanently delete this notification bar.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteNotification(notification.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Rooms Page</h3>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Edit your rooms page content, room descriptions, and pricing information.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Amenities Page</h3>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Edit your amenities page content, amenity descriptions, and images.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Gallery Page</h3>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Edit your gallery page content, upload new images, and organize your photo gallery.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


      </div>
    </AdminLayout>
  );
};

export default AdminMyPages;
