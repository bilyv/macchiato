// Room-related API functions
import { apiRequest } from './core';

export const roomsApi = {
  getAll: () => apiRequest<any>('/rooms'),
  getById: (id: number) => apiRequest<any>(`/rooms/${id}`),
  create: (data: any) => apiRequest<any>('/rooms', { method: 'POST', body: data }),
  update: (id: number, data: any) => apiRequest<any>(`/rooms/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => apiRequest<any>(`/rooms/${id}`, { method: 'DELETE' }),
};

export default roomsApi;
