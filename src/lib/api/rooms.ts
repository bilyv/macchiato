// Room-related API functions
import { apiRequest } from './core';

export interface Room {
  id: string;
  room_number: number;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  image_url: string | null;
  amenities: string[];
  display_category?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomFormData {
  room_number: number;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  amenities: string[];
  display_category?: string;
  is_available: boolean;
}

export const roomsApi = {
  getAll: () => apiRequest<{ status: string; data: Room[] }>('/rooms'),

  getById: (id: string) => apiRequest<{ status: string; data: Room }>(`/rooms/${id}`),

  getByRoomNumber: (roomNumber: number) => apiRequest<{ status: string; data: Room }>(`/rooms/number/${roomNumber}`),

  create: (data: RoomFormData, image?: File) => {
    const formData = new FormData();

    // Add the room data as JSON
    formData.append('data', JSON.stringify(data));

    // Add the image if provided
    if (image) {
      formData.append('image', image);
    }

    return apiRequest<{ status: string; data: Room }>('/rooms', {
      method: 'POST',
      body: formData,
      headers: {} // Let the browser set the content type for FormData
    });
  },

  update: (id: string, data: RoomFormData, image?: File) => {
    const formData = new FormData();

    // Add the room data as JSON
    formData.append('data', JSON.stringify(data));

    // Add the image if provided
    if (image) {
      formData.append('image', image);
    }

    return apiRequest<{ status: string; data: Room }>(`/rooms/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {} // Let the browser set the content type for FormData
    });
  },

  delete: (id: string) => apiRequest<{}>(`/rooms/${id}`, { method: 'DELETE' }),
};

export default roomsApi;
