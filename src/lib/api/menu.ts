// Menu-related API functions
import { apiRequest } from './core';

// Menu item interface for suggestions
export interface MenuItem {
  id: string;
  item_name: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  price: number;
  preparation_time: number; // in minutes
  tags: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Menu image interface for uploads
export interface MenuImage {
  id: string;
  title: string;
  category: 'drinks' | 'desserts' | 'others';
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Form data interfaces
export interface MenuItemFormData {
  item_name: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  price: number;
  preparation_time: number;
  tags: string[];
}

export interface MenuImageFormData {
  title: string;
  category: 'drinks' | 'desserts' | 'others';
}

export const menuApi = {
  // Menu Items (Suggestions)
  getAllItems: (category?: string) => {
    const url = category ? `/menu/items?category=${category}` : '/menu/items';
    return apiRequest<{ status: string; data: MenuItem[] }>(url);
  },

  getItemById: (id: string) =>
    apiRequest<{ status: string; data: MenuItem }>(`/menu/items/${id}`),

  createItem: (data: MenuItemFormData, image?: File) => {
    if (image) {
      const formData = new FormData();

      // Add the form data
      formData.append('item_name', data.item_name);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('preparation_time', data.preparation_time.toString());
      formData.append('tags', JSON.stringify(data.tags));

      // Add the image
      formData.append('image', image);

      return apiRequest<{ status: string; data: MenuItem }>('/menu/items', {
        method: 'POST',
        body: formData,
        headers: {} // Let the browser set the content type for FormData
      });
    } else {
      return apiRequest<{ status: string; data: MenuItem }>('/menu/items', {
        method: 'POST',
        body: data
      });
    }
  },

  updateItem: (id: string, data: MenuItemFormData) =>
    apiRequest<{ status: string; data: MenuItem }>(`/menu/items/${id}`, {
      method: 'PUT',
      body: data
    }),

  deleteItem: (id: string) =>
    apiRequest<{}>(`/menu/items/${id}`, { method: 'DELETE' }),

  // Menu Images (Uploads)
  getAllImages: (category?: string) => {
    const url = category ? `/menu/images?category=${category}` : '/menu/images';
    return apiRequest<{ status: string; data: MenuImage[] }>(url);
  },

  getImageById: (id: string) =>
    apiRequest<{ status: string; data: MenuImage }>(`/menu/images/${id}`),

  createImage: (data: MenuImageFormData, image: File) => {
    const formData = new FormData();

    // Add the form data
    formData.append('title', data.title);
    formData.append('category', data.category);

    // Add the image
    formData.append('image', image);

    return apiRequest<{ status: string; data: MenuImage }>('/menu/images', {
      method: 'POST',
      body: formData,
      headers: {} // Let the browser set the content type for FormData
    });
  },

  deleteImage: (id: string) =>
    apiRequest<{}>(`/menu/images/${id}`, { method: 'DELETE' }),
};

export default menuApi;
