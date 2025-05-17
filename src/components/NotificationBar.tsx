import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NotificationBarProps {
  className?: string;
}

interface NotificationBar {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

const NotificationBar = ({ className }: NotificationBarProps) => {
  const [notification, setNotification] = useState<NotificationBar | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveNotification = async () => {
      try {
        console.log('Fetching active notifications...');
        const response = await api.notificationBars.getAll(true);
        console.log('Notification response:', response);

        if (response.data && response.data.length > 0) {
          // Get the most recent active notification
          console.log('Found active notification:', response.data[0]);
          setNotification(response.data[0]);

          // Check if this notification was previously dismissed
          const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
          if (dismissedNotifications.includes(response.data[0].id)) {
            setDismissed(true);
          }
        } else {
          console.log('No active notifications found');
        }
      } catch (error) {
        console.error('Error fetching notification bar:', error);
      }
    };

    fetchActiveNotification();

    // Refresh notifications every 5 minutes
    const intervalId = setInterval(fetchActiveNotification, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDismiss = () => {
    if (notification) {
      setDismissed(true);

      // Store the dismissed notification ID in localStorage
      const dismissedNotifications = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
      dismissedNotifications.push(notification.id);
      localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedNotifications));
    }
  };

  if (!notification || dismissed) {
    return null;
  }

  const bgColorMap = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={cn(
        'py-2 px-4 text-center relative',
        bgColorMap[notification.type],
        className
      )}
    >
      <p className="text-sm font-medium">{notification.message}</p>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/10"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NotificationBar;
