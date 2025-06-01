// Main API export file that combines all API modules
import { API_BASE_URL, apiRequest } from './core';
import contactApi from './contact';
import notificationBarsApi from './notification-bars';
import roomsApi from './rooms';
import galleryApi from './gallery';
import menuApi from './menu';
import bookingsApi from './bookings';
import externalUsersApi from './external-users';
import guestsApi from './guests';

// Combined API object
export const api = {
  contact: contactApi,
  notificationBars: notificationBarsApi,
  rooms: roomsApi,
  gallery: galleryApi,
  menu: menuApi,
  bookings: bookingsApi,
  externalUsers: externalUsersApi,
  guests: guestsApi,
};

// Export individual modules and utilities
export { API_BASE_URL, apiRequest };
export { contactApi };
export { notificationBarsApi };
export { roomsApi };
export { galleryApi };
export { menuApi };
export { bookingsApi };
export { externalUsersApi };
export { guestsApi };

// Default export for backward compatibility
export default api;
