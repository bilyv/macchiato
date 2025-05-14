import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, CalendarClock, Users, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  pendingBookings: number;
  totalMessages: number;
  unreadMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real application, you would have an endpoint to get all stats in one request
        // For now, we'll simulate it by making separate requests
        const [roomsRes, bookingsRes, messagesRes] = await Promise.all([
          api.rooms.getAll(),
          api.bookings.getAll(),
          api.contact.getAll(),
        ]);

        setStats({
          totalRooms: roomsRes.data.length,
          totalBookings: bookingsRes.data.length,
          pendingBookings: bookingsRes.data.filter((booking: any) => booking.status === 'pending').length,
          totalMessages: messagesRes.data.length,
          unreadMessages: messagesRes.data.filter((message: any) => !message.is_read).length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rooms Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  stats.totalRooms
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for booking
              </p>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  stats.totalBookings
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  `${stats.pendingBookings} pending approval`
                )}
              </p>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  stats.totalMessages
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                ) : (
                  `${stats.unreadMessages} unread messages`
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent bookings to display.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
