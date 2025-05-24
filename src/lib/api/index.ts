// Main API export file that combines all API modules
import { API_BASE_URL, apiRequest } from './core';
import contactApi from './contact';
import notificationBarsApi from './notification-bars';
import roomsApi from './rooms';
import galleryApi from './gallery';

// Combined API object
export const api = {
  contact: contactApi,
  notificationBars: notificationBarsApi,
  rooms: roomsApi,
  gallery: galleryApi,
};

// Export individual modules and utilities
export { API_BASE_URL, apiRequest };
export { contactApi };
export { notificationBarsApi };
export { roomsApi };
export { galleryApi };

// Default export for backward compatibility
export default api;
