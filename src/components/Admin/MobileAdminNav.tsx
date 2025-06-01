import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  MessageSquare,
  FileEdit,
  BedDouble,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MobileAdminNav = () => {
  const location = useLocation();

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
      title: 'Messages',
      path: '/admin/contact',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Pages',
      path: '/admin/my-pages',
      icon: <FileEdit className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
      <TooltipProvider>
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Tooltip key={item.path} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 transition-colors",
                    isActive(item.path)
                      ? "text-[#8A5A44]"
                      : "text-gray-500 hover:text-[#8A5A44]"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full",
                    isActive(item.path) ? "bg-[#EEDFD0]" : ""
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                {item.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MobileAdminNav;
