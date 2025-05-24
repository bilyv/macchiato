// Contact-related API functions
import { apiRequest } from './core';

// Define the ContactMessage type
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const contactApi = {
  getAll: () => apiRequest<{ status: string; data: ContactMessage[] }>('/contact'),
  getById: (id: string) => apiRequest<{ status: string; data: ContactMessage }>(`/contact/${id}`),
  markAsRead: (id: string) => apiRequest<{ status: string; data: ContactMessage }>(`/contact/${id}/read`, { method: 'PATCH' }),
  delete: (id: string) => apiRequest<{}>(`/contact/${id}`, { method: 'DELETE' }),
  submit: (data: Omit<ContactMessage, 'id' | 'is_read' | 'created_at' | 'updated_at'>) =>
    apiRequest<{ status: string; message: string; data: ContactMessage }>('/contact', { method: 'POST', body: data }),
};

export default contactApi;
