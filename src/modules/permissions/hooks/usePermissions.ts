import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { permissionsApi } from '../api/permissionsApi';
import type { SavePermissionsPayload } from '../types';

export const useRolesList = () => {
  return useQuery({
    queryKey: ['roles-list'],
    queryFn: permissionsApi.getRoles,
  });
};

export const useRolePermissions = (roleId: number | null) => {
  return useQuery({
    queryKey: ['permissions', roleId],
    queryFn: () => permissionsApi.getRolePermissions(roleId!),
    enabled: !!roleId, // Only fetch when a role is selected
  });
};

export const useSavePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SavePermissionsPayload) => permissionsApi.saveRolePermissions(data),
    onSuccess: (_, variables) => {
      toast.success('Permissions saved successfully!');
      // Invalidate the cache for this specific role to keep it fresh
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.role_id] });
    },
    onError: () => {
      toast.error('Failed to save permissions.');
    }
  });
};