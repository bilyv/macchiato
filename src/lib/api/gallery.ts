// Gallery-related API functions
import { apiRequest } from './core';

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category: 'attractions' | 'neighbourhood' | 'foods' | 'events';
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageFormData {
  title: string;
  description?: string;
  category: 'attractions' | 'neighbourhood' | 'foods' | 'events';
}

export const galleryApi = {
  getAll: (category?: string) => {
    const url = category ? `/gallery?category=${category}` : '/gallery';
    return apiRequest<{ status: string; data: GalleryImage[] }>(url);
  },

  getById: (id: string) => apiRequest<{ status: string; data: GalleryImage }>(`/gallery/${id}`),

  create: (data: GalleryImageFormData, image: File) => {
    const formData = new FormData();

    // Add the form data
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);

    // Add the image
    formData.append('image', image);

    return apiRequest<{ status: string; data: GalleryImage }>('/gallery', {
      method: 'POST',
      body: formData,
      headers: {} // Let the browser set the content type for FormData
    });
  },

  delete: (id: string) => apiRequest<{}>(`/gallery/${id}`, { method: 'DELETE' }),
};

export default galleryApi;
