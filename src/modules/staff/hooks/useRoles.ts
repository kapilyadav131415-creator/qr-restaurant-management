import { useQuery } from '@tanstack/react-query';
import api from '../../../config/axios';

export interface RoleEntity {
  id: number;
  name: string;
}

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<RoleEntity[]> => {
      // Adjust the endpoint if your base URL is different
      const res = await api.get('/roles'); 
      
      const data = Array.isArray(res.data?.data) ? res.data.data : (res.data || []);
      
      // Normalize data safely
      return data.map((r: any) => ({
        id: Number(r.id || r.role_id || r.rm_id),
        name: r.name || r.role_name || r.rm_name || 'Unknown Role'
      }));
    }
  });
};