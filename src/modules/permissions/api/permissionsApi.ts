import api from '../../../config/axios';
import type { RoleEntity, PermissionItem, SavePermissionsPayload } from '../types';

export const permissionsApi = {
  // Fetch all roles for the sidebar
  getRoles: async (): Promise<RoleEntity[]> => {
    const res = await api.get('/roles');
    const data = res.data?.data || res.data || [];
    return data.map((r: any) => ({
      id: Number(r.rm_id || r.role_id || r.id),
      name: r.rm_name || r.role_name || r.name || 'Unknown'
    }));
  },

  // Fetch the permissions matrix for a specific role
  getRolePermissions: async (roleId: number): Promise<PermissionItem[]> => {
    const res = await api.get(`/permissions/role/${roleId}`);
    const data = res.data?.data || res.data || [];
    return data.map((p: any) => ({
      module_id: Number(p.module_id),
      module_name: p.module_name,
      can_view: Boolean(p.can_view),
      can_add: Boolean(p.can_add),
      can_edit: Boolean(p.can_edit),
      can_delete: Boolean(p.can_delete),
      can_print: Boolean(p.can_print),
    }));
  },

  // Save the updated permissions matrix
  saveRolePermissions: async (payload: SavePermissionsPayload) => {
    console.log(payload)
    const res = await api.post('/permissions/save', payload);
    return res.data;
  }
};