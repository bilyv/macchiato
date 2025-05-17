// Main API export file that combines all API modules
import { API_BASE_URL, apiRequest } from './core';
import roomsApi from './rooms';
import bookingsApi from './bookings';
import amenitiesApi from './amenities';
import contactApi from './contact';
import notificationBarsApi from './notification-bars';

// Combined API object
export const api = {
  rooms: roomsApi,
  bookings: bookingsApi,
  amenities: amenitiesApi,
  contact: contactApi,
  notificationBars: notificationBarsApi,
};

// Export individual modules and utilities
export { API_BASE_URL, apiRequest };
export { roomsApi };
export { bookingsApi };
export { amenitiesApi };
export { contactApi };
export { notificationBarsApi };

// Default export for backward compatibility
export default api;
