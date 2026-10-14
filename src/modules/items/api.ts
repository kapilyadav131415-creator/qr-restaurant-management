import api from '../../config/axios';
import type { ItemEntity, ItemFormData, VariantEntity, VariantFormData } from './types';

// Item Normalizer
const normalizeItem = (item: any): ItemEntity => ({
  ...item,
  im_id: Number(item.im_id || item.item_id || item.id),
  im_name: item.im_name || item.name || '',
  im_food_type: item.im_food_type || item.food_type || 'veg',
  im_is_available: Boolean(item.im_is_available ?? item.is_available ?? true),
  menu_id: Number(item.im_menu_id || item.menu_id || 0),
  category_id: Number(item.im_category_id || item.category_id || 0),
  branch_id: item.im_branch_id || item.branch_id ? Number(item.im_branch_id || item.branch_id) : 0,
});

// Variant Normalizer (FIXED VARIABLES)
const normalizeVariant = (item: any): VariantEntity => ({
  variant_id: Number(item.ivm_id || item.variant_id || item.id),
  item_id: Number(item.ivm_item_id || item.item_id),
  variant_name: item.ivm_variant_name || item.variant_name || '',
  variant_code: item.ivm_variant_code || item.variant_code || '',
  price: Number(item.ivm_price || item.price || 0),
  discount_price: Number(item.ivm_discount_price || item.discount_price || 0),
  sort_order: Number(item.ivm_sort_order || item.sort_order || 0),
  is_default: Boolean(item.ivm_is_default ?? item.is_default ?? false),
  is_available: Boolean(item.ivm_is_available ?? item.is_available ?? true),
});

export const catalogApi = {
  // ITEMS
  getItems: async (): Promise<ItemEntity[]> => {
    const response = await api.get('/items/list');
    const data = Array.isArray(response.data?.data) ? response.data.data : (response.data || []);
    return data.map(normalizeItem);
  },
  createItem: async (data: ItemFormData) => {
    const { item_id, ...createData } = data;
    return (await api.post('/items/create', createData)).data;
  },
  updateItem: async (data: ItemFormData) => {
    if (!data.item_id) throw new Error('item_id is required');
    return (await api.put('/items/update', data)).data;
  },
  deleteItem: async (id: number) => {
    return (await api.delete(`/items/delete/${id}`)).data;
  },

  // VARIANTS
  getVariants: async (): Promise<VariantEntity[]> => {
    const response = await api.get('/item-variants/list');
    const data = Array.isArray(response.data?.data) ? response.data.data : (response.data || []);
    return data.map(normalizeVariant);
  },
  createVariant: async (data: VariantFormData) => {
    const { variant_id, ...createData } = data;
    return (await api.post('/item-variants/create', createData)).data;
  },
  updateVariant: async (data: VariantFormData) => {
    if (!data.variant_id) throw new Error('variant_id is required');
    return (await api.put('/item-variants/update', data)).data;
  },
  deleteVariant: async (id: number) => {
    return (await api.delete(`/item-variants/delete/${id}`)).data;
  }
};