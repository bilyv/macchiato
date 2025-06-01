// Guests-related API functions
import { apiRequest } from './core';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  identification_type?: 'passport' | 'driver_license' | 'national_id' | 'other';
  identification_number?: string;
  special_requirements?: string;
  // Booking details for local guests
  room_number?: number;
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  total_price?: number;
  created_by_user_id?: string;
  created_by_external_user_id?: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_type?: 'admin' | 'external_user';
}

export interface CreateGuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: 'passport' | 'driver_license' | 'national_id' | 'other';
  identificationNumber?: string;
  specialRequirements?: string;
  // Booking details for local guests
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
}

export interface UpdateGuestData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: 'passport' | 'driver_license' | 'national_id' | 'other';
  identificationNumber?: string;
  specialRequirements?: string;
  // Booking details for local guests
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
}

export const guestsApi = {
  // Get guests (filtered based on user role)
  getAll: () => apiRequest<{ status: string; data: Guest[] }>('/guests'),

  // Admin only - get all guests
  getAllAdmin: () => apiRequest<{ status: string; data: Guest[] }>('/guests/admin/all'),

  getById: (id: string) => apiRequest<{ status: string; data: Guest }>(`/guests/${id}`),

  create: (data: CreateGuestData) =>
    apiRequest<{ status: string; data: Guest }>('/guests', {
      method: 'POST',
      body: data
    }),

  update: (id: string, data: UpdateGuestData) =>
    apiRequest<{ status: string; data: Guest }>(`/guests/${id}`, {
      method: 'PUT',
      body: data
    }),

  delete: (id: string) =>
    apiRequest<{ status: string; message: string }>(`/guests/${id}`, {
      method: 'DELETE'
    })
};

export default guestsApi;
