// Main API export file that combines all API modules
import { API_BASE_URL, apiRequest } from './core';
import contactApi from './contact';
import notificationBarsApi from './notification-bars';
import roomsApi from './rooms';
import galleryApi from './gallery';
import menuApi from './menu';

// Combined API object
export const api = {
  contact: contactApi,
  notificationBars: notificationBarsApi,
  rooms: roomsApi,
  gallery: galleryApi,
  menu: menuApi,
};

// Export individual modules and utilities
export { API_BASE_URL, apiRequest };
export { contactApi };
export { notificationBarsApi };
export { roomsApi };
export { galleryApi };
export { menuApi };

// Default export for backward compatibility
export default api;
