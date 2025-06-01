import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  BedDouble,
  Image,
  Utensils,
  TrendingUp,
  Users,
  ArrowRight,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calendar,
  UserPlus,
  DollarSign,
  Clock,
  Star,
  Shield,
  BarChart3,
  PieChart,
  TrendingDown
} from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalRooms: number;
  availableRooms: number;
  totalGalleryImages: number;
  totalMenuItems: number;
  activeNotifications: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalGuests: number;
  vipGuests: number;
  totalExternalUsers: number;
  activeExternalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalRooms: 0,
    availableRooms: 0,
    totalGalleryImages: 0,
    totalMenuItems: 0,
    activeNotifications: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalGuests: 0,
    vipGuests: 0,
    totalExternalUsers: 0,
    activeExternalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Fetch all data in parallel for better performance
      const [messagesRes, roomsRes, galleryRes, menuRes, bookingsRes, guestsRes, externalUsersRes] = await Promise.all([
        api.contact.getAll().catch(() => ({ data: [] })),
        api.rooms.getAll().catch(() => ({ data: [] })),
        api.gallery.getAll().catch(() => ({ data: [] })),
        api.menu.getAllItems().catch(() => ({ data: [] })),
        api.bookings.getAll().catch(() => ({ data: [] })),
        api.guests.getAllAdmin().catch(() => ({ data: [] })),
        api.externalUsers.getAll().catch(() => ({ data: [] })),
      ]);

      // Calculate statistics
      const totalMessages = messagesRes.data?.length || 0;
      const unreadMessages = messagesRes.data?.filter((message: any) => !message.is_read).length || 0;
      const totalRooms = roomsRes.data?.length || 0;
      const availableRooms = roomsRes.data?.filter((room: any) => room.is_available).length || 0;
      const totalGalleryImages = galleryRes.data?.length || 0;
      const totalMenuItems = menuRes.data?.length || 0;

      // Booking statistics
      const totalBookings = bookingsRes.data?.length || 0;
      const pendingBookings = bookingsRes.data?.filter((booking: any) => booking.booking_status === 'pending').length || 0;
      const confirmedBookings = bookingsRes.data?.filter((booking: any) => booking.booking_status === 'confirmed').length || 0;

      // Guest statistics
      const totalGuests = guestsRes.data?.length || 0;
      const vipGuests = guestsRes.data?.filter((guest: any) => guest.is_vip).length || 0;

      // External user statistics
      const totalExternalUsers = externalUsersRes.data?.length || 0;
      const activeExternalUsers = externalUsersRes.data?.filter((user: any) => user.is_active).length || 0;

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
        totalMessages,
        unreadMessages,
        totalRooms,
        availableRooms,
        totalGalleryImages,
        totalMenuItems,
        activeNotifications: 0, // Will be updated when notification API is available
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalGuests,
        vipGuests,
        totalExternalUsers,
        activeExternalUsers,
        totalRevenue,
        monthlyRevenue,
      });

      // Set recent messages (last 5)
      const recent = messagesRes.data?.slice(0, 5) || [];
      setRecentMessages(recent);
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

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

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

          {/* External Users Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-cyan-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">External Users</CardTitle>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalExternalUsers
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    {stats.activeExternalUsers} active
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Active Rate</span>
                  <span className="font-bold text-green-600">
                    {stats.totalExternalUsers > 0 ? Math.round((stats.activeExternalUsers / stats.totalExternalUsers) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: stats.totalExternalUsers > 0 ? `${(stats.activeExternalUsers / stats.totalExternalUsers) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
              <Link to="/admin/guests">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  Manage Users
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Messages Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Contact Messages</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalMessages
                )}
              </div>
              <div className="flex items-center mt-2">
                {stats.unreadMessages > 0 && (
                  <Badge variant="destructive" className="mr-2">
                    {stats.unreadMessages} unread
                  </Badge>
                )}
                <p className="text-xs text-gray-500">
                  {isLoading ? (
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    `Total messages received`
                  )}
                </p>
              </div>
              <Link to="/admin/contact">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  View Messages
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

          {/* Gallery Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gallery Images</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalGalleryImages
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isLoading ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  `Images in gallery`
                )}
              </p>
              <Link to="/admin/my-pages">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  Manage Gallery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Menu Items Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Menu Items</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Utensils className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  stats.totalMenuItems
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isLoading ? (
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  `Menu suggestions`
                )}
              </p>
              <Link to="/admin/my-pages">
                <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                  Manage Menu
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-macchiato-brown" />
              <span>Recent Messages</span>
            </CardTitle>
            <CardDescription>
              Latest contact messages from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-macchiato-light flex items-center justify-center">
                      <Users className="h-5 w-5 text-macchiato-brown" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {!message.is_read && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(message.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
                <Link to="/admin/contact">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Messages
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No recent messages</p>
                <p className="text-xs text-gray-400 mt-1">
                  New messages will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-macchiato-brown" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription>
                Key performance indicators for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Room Occupancy */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Room Occupancy</span>
                    <span className="text-sm font-bold text-green-600">
                      {stats.totalRooms > 0 ? Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.totalRooms > 0 ? `${((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{stats.totalRooms - stats.availableRooms} occupied</span>
                    <span>{stats.availableRooms} available</span>
                  </div>
                </div>

                {/* Booking Conversion */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Booking Confirmation Rate</span>
                    <span className="text-sm font-bold text-blue-600">
                      {stats.totalBookings > 0 ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.totalBookings > 0 ? `${(stats.confirmedBookings / stats.totalBookings) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{stats.confirmedBookings} confirmed</span>
                    <span>{stats.pendingBookings} pending</span>
                  </div>
                </div>

                {/* VIP Guest Ratio */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">VIP Guest Ratio</span>
                    <span className="text-sm font-bold text-yellow-600">
                      {stats.totalGuests > 0 ? Math.round((stats.vipGuests / stats.totalGuests) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: stats.totalGuests > 0 ? `${(stats.vipGuests / stats.totalGuests) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{stats.vipGuests} VIP guests</span>
                    <span>{stats.totalGuests - stats.vipGuests} regular guests</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-macchiato-brown" />
                <span>Quick Stats</span>
              </CardTitle>
              <CardDescription>
                At-a-glance system overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.unreadMessages}
                  </div>
                  <p className="text-sm text-blue-700 font-medium">Unread Messages</p>
                  {stats.unreadMessages > 0 && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      Needs Attention
                    </Badge>
                  )}
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.availableRooms}
                  </div>
                  <p className="text-sm text-green-700 font-medium">Available Rooms</p>
                  <Badge variant="outline" className="mt-2 text-xs border-green-300 text-green-700">
                    Ready to Book
                  </Badge>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalGalleryImages + stats.totalMenuItems}
                  </div>
                  <p className="text-sm text-purple-700 font-medium">Content Items</p>
                  <Badge variant="outline" className="mt-2 text-xs border-purple-300 text-purple-700">
                    Gallery & Menu
                  </Badge>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">
                    {stats.activeExternalUsers}
                  </div>
                  <p className="text-sm text-cyan-700 font-medium">Active Staff</p>
                  <Badge variant="outline" className="mt-2 text-xs border-cyan-300 text-cyan-700">
                    External Users
                  </Badge>
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-700">This Month</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ${stats.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  {stats.monthlyRevenue > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                      <span className="text-sm text-emerald-600 font-medium">
                        Revenue flowing in
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        No revenue this month yet
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
