import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch contact messages
        const messagesRes = await api.contact.getAll();

        setStats({
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest contact messages</CardDescription>
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
                  No recent messages to display.
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
