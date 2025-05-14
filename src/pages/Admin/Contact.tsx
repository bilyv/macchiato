import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContact = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await api.contact.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      await api.contact.delete(messageToDelete);
      setMessages(messages.filter(message => message.id !== messageToDelete));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setMessageToDelete(null);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.contact.markAsRead(id);
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, is_read: true } : message
        )
      );
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No contact messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.id} className={message.is_read ? '' : 'bg-blue-50'}>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            message.is_read
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {message.is_read ? 'Read' : 'Unread'}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell>{formatDate(message.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {!message.is_read && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setMessageToDelete(message.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the message.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setMessageToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteMessage}
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

      {/* Message View Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border-t pt-4">
            <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Received on {selectedMessage && formatDate(selectedMessage.created_at)}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContact;
