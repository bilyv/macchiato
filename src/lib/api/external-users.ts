// External users-related API functions
import { apiRequest } from './core';

export interface ExternalUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator_first_name?: string;
  creator_last_name?: string;
}

export interface CreateExternalUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateExternalUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface ExternalUserLoginData {
  email: string;
  password: string;
}

export interface ExternalUserLoginResponse {
  status: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
  };
}

export const externalUsersApi = {
  // Admin functions
  getAll: () => apiRequest<{ status: string; data: ExternalUser[] }>('/external-users'),
  
  getById: (id: string) => apiRequest<{ status: string; data: ExternalUser }>(`/external-users/${id}`),
  
  create: (data: CreateExternalUserData) => 
    apiRequest<{ status: string; data: ExternalUser }>('/external-users', {
      method: 'POST',
      body: data
    }),
  
  update: (id: string, data: UpdateExternalUserData) => 
    apiRequest<{ status: string; data: ExternalUser }>(`/external-users/${id}`, {
      method: 'PUT',
      body: data
    }),
  
  delete: (id: string) => 
    apiRequest<{ status: string; message: string }>(`/external-users/${id}`, {
      method: 'DELETE'
    }),

  // External user functions
  login: (credentials: ExternalUserLoginData) => 
    apiRequest<ExternalUserLoginResponse>('/external-users/login', {
      method: 'POST',
      body: credentials
    }),

  getProfile: () => 
    apiRequest<{ status: string; data: ExternalUser }>('/external-users/profile')
};

export default externalUsersApi;
