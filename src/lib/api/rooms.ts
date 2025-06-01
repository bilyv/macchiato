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
  is_available: boolean;
  is_website_visible: boolean;
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
  is_available: boolean;
  is_website_visible?: boolean;
}

export const roomsApi = {
  // Admin access - gets all rooms regardless of visibility
  getAll: () => apiRequest<{ status: string; data: Room[] }>('/rooms'),

  // Public access - gets only website-visible rooms (approved rooms)
  getWebsiteRooms: () => apiRequest<{ status: string; data: Room[] }>('/rooms/website'),

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

  // Bulk update rooms to make them website visible
  addToSite: (roomIds: string[]) => apiRequest<{ status: string; data: Room[] }>('/rooms/add-to-site', {
    method: 'POST',
    body: { roomIds } // Let apiRequest handle Content-Type and JSON.stringify
  }),

  // Bulk update rooms to remove them from website
  removeFromSite: (roomIds: string[]) => apiRequest<{ status: string; data: Room[] }>('/rooms/remove-from-site', {
    method: 'POST',
    body: { roomIds } // Let apiRequest handle Content-Type and JSON.stringify
  }),
};

export default roomsApi;
