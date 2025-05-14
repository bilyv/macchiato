import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Public Pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Amenities from "./pages/Amenities";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRooms from "./pages/Admin/Rooms";
import AdminBookings from "./pages/Admin/Bookings";
import AdminAmenities from "./pages/Admin/Amenities";
import AdminContact from "./pages/Admin/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/amenities" element={<AdminAmenities />} />
            <Route path="/admin/contact" element={<AdminContact />} />

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
