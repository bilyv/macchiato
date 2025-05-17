// Contact-related API functions
import { apiRequest } from './core';

export const contactApi = {
  getAll: () => apiRequest<any>('/contact'),
  getById: (id: number) => apiRequest<any>(`/contact/${id}`),
  markAsRead: (id: number) => apiRequest<any>(`/contact/${id}/read`, { method: 'PATCH' }),
  delete: (id: number) => apiRequest<any>(`/contact/${id}`, { method: 'DELETE' }),
  submit: (data: any) => apiRequest<any>('/contact', { method: 'POST', body: data }),
};

export default contactApi;
