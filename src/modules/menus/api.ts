import api from '../../config/axios';
import type { Menu, MenuFormData } from './types';

// Normalize API response: mapping backend mm_id to frontend menu_id
const normalizeMenu = (item: any): Menu => ({
  menu_id: Number(item.mm_id ?? item.menu_id ?? item.id), 
  mm_name: item.mm_name || '',
  mm_code: item.mm_code || '',
  mm_description: item.mm_description || '',
  mm_start_time: item.mm_start_time?.slice(0, 5) ?? '09:00', // Trim seconds
  mm_end_time: item.mm_end_time?.slice(0, 5) ?? '17:00',
  mm_available_days: Array.isArray(item.mm_available_days) ? item.mm_available_days : [],
  mm_sort_order: item.mm_sort_order ?? 0,
  mm_theme_color: item.mm_theme_color ?? '#F97316',
  mm_is_default: item.mm_is_default ?? false,
  mm_created_at: item.mm_created_at,
  mm_updated_at: item.mm_updated_at,
});

export const menusApi = {
  getMenus: async (): Promise<Menu[]> => {
    try {
      const response = await api.get('/menus/list');
      let data = response.data;
      if (!Array.isArray(data)) data = data?.data || [];
      return data.map(normalizeMenu);
    } catch (error) {
      console.error('getMenus error:', error);
      throw error;
    }
  },

  createMenu: async (data: MenuFormData) => {
    const { menu_id, ...createData } = data;
    const response = await api.post('/menus/create', createData);
    return response.data;
  },

  updateMenu: async (data: MenuFormData) => {
    if (!data.menu_id) throw new Error('menu_id is required for update');
    const response = await api.put('/menus/update', data);
    return response.data;
  },

  deleteMenu: async (id: number) => {
    const response = await api.delete(`/menus/delete/${id}`);
    return response.data;
  },
};