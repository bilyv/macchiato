import { apiRequest } from './core';

// Booking interfaces
export interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests?: string;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Joined room data
  room_number?: number;
  room_type?: string;
  price_per_night?: number;
  room_description?: string;
  room_image_url?: string;
}

export interface BookingFormData {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests?: string;
}

export interface BookingFilters {
  status?: string;
  room_id?: string;
  guest_email?: string;
  page?: number;
  limit?: number;
}

export interface BookingResponse {
  status: string;
  data: Booking[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleBookingResponse {
  status: string;
  data: Booking;
}

// Booking API functions
const bookingsApi = {
  // Get all bookings (admin only)
  getAll: async (filters?: BookingFilters): Promise<BookingResponse> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.room_id) params.append('room_id', filters.room_id);
    if (filters?.guest_email) params.append('guest_email', filters.guest_email);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/bookings?${queryString}` : '/bookings';

    return apiRequest(url);
  },

  // Get booking by ID (admin only)
  getById: async (id: string): Promise<SingleBookingResponse> => {
    return apiRequest(`/bookings/${id}`);
  },

  // Create a new booking (public)
  create: async (bookingData: BookingFormData): Promise<SingleBookingResponse> => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: bookingData, // Let apiRequest handle JSON.stringify
    });
  },

  // Update booking status (admin only)
  updateStatus: async (id: string, status: Booking['booking_status']): Promise<SingleBookingResponse> => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { booking_status: status }, // Let apiRequest handle JSON.stringify
    });
  },

  // Cancel booking (admin only)
  cancel: async (id: string): Promise<SingleBookingResponse> => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Delete booking (admin only)
  delete: async (id: string): Promise<{ status: string; message: string }> => {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

export default bookingsApi;
