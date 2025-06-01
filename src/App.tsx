import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ChatButtonWrapper from "@/components/ChatButtonWrapper";

// Public Pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Menu from "./pages/Menu";
import AboutUs from "./pages/AboutUs";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminBookings from "./pages/Admin/Bookings";
import AdminRooms from "./pages/Admin/Rooms";
import AdminContact from "./pages/Admin/Contact";
import AdminMyPages from "./pages/Admin/MyPages";
import AdminGuests from "./pages/Admin/Guests";

// External User Pages
import ExternalUserLogin from "./pages/ExternalUser/Login";
import ExternalUserDashboard from "./pages/ExternalUser/Dashboard";

// Worker Pages
import WorkerLogin from "./pages/WorkerLogin";

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
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/guests" element={<AdminGuests />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/my-pages" element={<AdminMyPages />} />

            {/* External User Routes */}
            <Route path="/external-user/login" element={<ExternalUserLogin />} />
            <Route path="/external-user/dashboard" element={<ExternalUserDashboard />} />

            {/* Worker Routes */}
            <Route path="/worker/login" element={<WorkerLogin />} />
            <Route path="/worker/dashboard" element={<ExternalUserDashboard />} />

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatButtonWrapper />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
