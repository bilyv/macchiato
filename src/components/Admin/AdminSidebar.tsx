import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  FileEdit,
  BedDouble,
  CalendarClock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Bookings',
      path: '/admin/bookings',
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: 'Rooms',
      path: '/admin/rooms',
      icon: <BedDouble className="h-5 w-5" />,
    },
    {
      title: 'Guests',
      path: '/admin/guests',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Contact Messages',
      path: '/admin/contact',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'My Pages',
      path: '/admin/my-pages',
      icon: <FileEdit className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col shadow-sm">
      <div className="p-4 border-b">
        <Link to="/admin/dashboard" className="text-xl font-serif font-bold text-[#8A5A44]">
          Macchiato Admin
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-[#EEDFD0] text-[#8A5A44]"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
