// Notification bar-related API functions
import { apiRequest } from './core';

export const notificationBarsApi = {
  getAll: (activeOnly: boolean = false) => 
    apiRequest<any>(`/notification-bars${activeOnly ? '?active_only=true' : ''}`),
  getById: (id: string) => apiRequest<any>(`/notification-bars/${id}`),
  create: (data: any) => apiRequest<any>('/notification-bars', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest<any>(`/notification-bars/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<any>(`/notification-bars/${id}`, { method: 'DELETE' }),
};

export default notificationBarsApi;
