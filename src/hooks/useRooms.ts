import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  size_sqm: number;
  bed_type: string;
  image_url: string;
  amenities: string[];
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await api.rooms.getAll();
        setRooms(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch rooms'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, isLoading, error };
}
