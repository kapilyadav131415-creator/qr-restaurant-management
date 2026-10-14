import api from '../../config/axios';
import type { CategoryEntity, CategoryFormData } from './types';

// Normalizing response safely
const normalizeCategory = (item: any): CategoryEntity => ({
  cm_id: Number(item.cm_id || item.category_id || item.id),
  cm_name: item.cm_name || item.category_name || '',
  cm_code: item.cm_code || item.category_code || '',
  cm_description: item.cm_description || item.description || '',
  cm_image_url: item.cm_image_url || item.image_url || null,
  cm_banner_image_url: item.cm_banner_image_url || item.banner_image_url || null,
  cm_icon: item.cm_icon || item.icon || null,
  cm_sort_order: Number(item.cm_sort_order || item.sort_order || 0),
  cm_is_recommended: Boolean(item.cm_is_recommended || item.is_recommended),
  cm_slug: item.cm_slug || item.slug || '',
  menu_id: Number(item.menu_id)|| Number(item.cm_menu_id),
  menu_name: item.menu_name || 'Unknown Menu',
  cm_created_at: item.cm_created_at || item.created_at,
});

export const categoriesApi = {
  getCategories: async (): Promise<CategoryEntity[]> => {
    try {
      const response = await api.get('/categories/list');
      let data = response.data;
      if (!Array.isArray(data)) data = data?.data || [];
      return data.map(normalizeCategory);
    } catch (error) {
      console.error('API Error (getCategories):', error);
      throw error;
    }
  },

  createCategory: async (data: CategoryFormData) => {
    const { category_id, ...createData } = data;
    const response = await api.post('/categories/create', createData);
    return response.data;
  },

  updateCategory: async (data: CategoryFormData) => {
    if (!data.category_id) throw new Error('category_id is required');
    const response = await api.put('/categories/update', data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/delete/${id}`);
    return response.data;
  }
};