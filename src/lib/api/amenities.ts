// Amenity-related API functions
import { apiRequest } from './core';

export const amenitiesApi = {
  getAll: () => apiRequest<any>('/amenities'),
  getById: (id: number) => apiRequest<any>(`/amenities/${id}`),
  create: (data: any) => apiRequest<any>('/amenities', { method: 'POST', body: data }),
  update: (id: number, data: any) => apiRequest<any>(`/amenities/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => apiRequest<any>(`/amenities/${id}`, { method: 'DELETE' }),
};

export default amenitiesApi;
