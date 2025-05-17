import { useAuth } from '@/hooks/useAuth';
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b h-16 flex items-center px-4 md:px-6">
      {/* Mobile Title */}
      {isMobile && (
        <div className="flex-1">
          <Link to="/admin/dashboard" className="text-xl font-serif font-bold text-[#8A5A44]">
            Macchiato Admin
          </Link>
        </div>
      )}

      {/* Desktop - Empty space */}
      {!isMobile && <div className="flex-1"></div>}

      <div className="flex items-center space-x-3 md:space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#EEDFD0] text-[#8A5A44]">
                {user?.firstName?.charAt(0) || <User className="h-4 w-4" />}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
