import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

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
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
