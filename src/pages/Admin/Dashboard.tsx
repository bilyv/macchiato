import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BedDouble,
  TrendingUp,
  Users,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  activeNotifications: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalGuests: number;
  vipGuests: number;
  totalRevenue: number;
  monthlyRevenue: number;
}



const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    availableRooms: 0,
    activeNotifications: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalGuests: 0,
    vipGuests: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Fetch all data in parallel for better performance
      const [roomsRes, bookingsRes, guestsRes] = await Promise.all([
        api.rooms.getAll().catch(() => ({ data: [] })),
        api.bookings.getAll().catch(() => ({ data: [] })),
        api.guests.getAllAdmin().catch(() => ({ data: [] })),
      ]);

      // Calculate statistics
      const totalRooms = roomsRes.data?.length || 0;
      const availableRooms = roomsRes.data?.filter((room: any) => room.is_available).length || 0;

      // Booking statistics
      const totalBookings = bookingsRes.data?.length || 0;
      const pendingBookings = bookingsRes.data?.filter((booking: any) => booking.booking_status === 'pending').length || 0;
      const confirmedBookings = bookingsRes.data?.filter((booking: any) => booking.booking_status === 'confirmed').length || 0;

      // Guest statistics
      const totalGuests = guestsRes.data?.length || 0;
      const vipGuests = guestsRes.data?.filter((guest: any) => guest.is_vip).length || 0;

      // Revenue calculations (from bookings)
      const totalRevenue = (bookingsRes.data as any[])?.reduce((sum: number, booking: any) => {
        return sum + (parseFloat(booking.total_amount) || 0);
      }, 0) || 0;

      // Monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = (bookingsRes.data as any[])?.filter((booking: any) => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }).reduce((sum: number, booking: any) => {
        return sum + (parseFloat(booking.total_amount) || 0);
      }, 0) || 0;

      setStats({
        totalRooms,
        availableRooms,
        activeNotifications: 0, // Will be updated when notification API is available
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalGuests,
        vipGuests,
        totalRevenue,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);



  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-macchiato-brown to-macchiato-red rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">Welcome back!</h1>
              <p className="text-macchiato-light mt-2">
                Here's what's happening at Macchiato Suite Dreams today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchStats}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStats}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bookings Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bookings</CardTitle>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalBookings
                )}
              </div>
              <div className="flex items-center mt-2 space-x-2">
                {stats.pendingBookings > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.pendingBookings} pending
                  </Badge>
                )}
                {stats.confirmedBookings > 0 && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats.confirmedBookings} confirmed
                  </Badge>
                )}
              </div>
              <Link to="/admin/bookings">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  View Bookings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  `$${stats.totalRevenue.toLocaleString()}`
                )}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm font-medium text-emerald-700">
                  ${stats.monthlyRevenue.toLocaleString()} this month
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Monthly Progress</span>
                  <span className="font-bold">
                    {stats.totalRevenue > 0 ? Math.round((stats.monthlyRevenue / stats.totalRevenue) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: stats.totalRevenue > 0 ? `${Math.min((stats.monthlyRevenue / stats.totalRevenue) * 100, 100)}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
              <Link to="/admin/bookings">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Guests Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-rose-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Guests</CardTitle>
              <div className="p-2 bg-rose-100 rounded-lg">
                <Users className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalGuests
                )}
              </div>
              <div className="flex items-center mt-2">
                {stats.vipGuests > 0 && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    {stats.vipGuests} VIP
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>VIP Rate</span>
                  <span className="font-bold text-yellow-600">
                    {stats.totalGuests > 0 ? Math.round((stats.vipGuests / stats.totalGuests) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: stats.totalGuests > 0 ? `${(stats.vipGuests / stats.totalGuests) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
              <Link to="/admin/guests">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  Manage Guests
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Rooms Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rooms</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <BedDouble className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalRooms
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    {stats.availableRooms} available
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span className="font-medium">Availability Rate</span>
                  <span className="font-bold text-green-600">
                    {stats.totalRooms > 0 ? Math.round((stats.availableRooms / stats.totalRooms) * 100) : 0}%
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden"
                      style={{
                        width: stats.totalRooms > 0 ? `${(stats.availableRooms / stats.totalRooms) * 100}%` : '0%'
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <Link to="/admin/rooms">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  Manage Rooms
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>




      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
