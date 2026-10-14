import api from '../../config/axios';
import type { Role,RoleFormData } from './types';

export const rolesApi = {
  // Get all roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data; 
  },

  // Create new role
  createRole: async (data: RoleFormData) => {
    const response = await api.post('/roles/create', data);
    return response.data;
  },

  // Update existing role
  updateRole: async (data: RoleFormData) => {
    // Assuming backend expects role_id in the body for /update
    const response = await api.put('/roles/update', data);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number) => {
    const response = await api.delete(`/roles/delete/${id}`);
    return response.data;
  }
};