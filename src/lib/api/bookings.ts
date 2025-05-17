// Booking-related API functions
import { apiRequest } from './core';

export const bookingsApi = {
  getAll: () => apiRequest<any>('/bookings'),
  getById: (id: number) => apiRequest<any>(`/bookings/${id}`),
  updateStatus: (id: number, status: string) =>
    apiRequest<any>(`/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
};

export default bookingsApi;
