import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import MobileAdminNav from './MobileAdminNav';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Redirect to login if not authenticated or not an admin
    if (!isLoading && (!user || !isAdmin())) {
      navigate('/admin/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8A5A44]"></div>
      </div>
    );
  }

  // Don't render the layout if not authenticated or not an admin
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Show sidebar on desktop, hide on mobile */}
      {!isMobile && <AdminSidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className={`flex-1 overflow-y-auto p-6 bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
          {children}
        </main>

        {/* Show bottom navigation on mobile */}
        {isMobile && <MobileAdminNav />}
      </div>
    </div>
  );
};

export default AdminLayout;
