import api from '../../config/axios';
import type { VariantEntity, VariantFormData } from './types';

const normalizeVariant = (item: any): VariantEntity => ({
  ivm_id: Number(item.ivm_id || item.variant_id || item.id),
  item_id: Number(item.ivm_item_id || item.item_id),
  ivm_variant_name: item.ivm_variant_name || item.name || '',
  ivm_variant_code: item.ivm_variant_code || item.code || '',
  ivm_sku: item.ivm_sku || item.sku || '',
  ivm_price: Number(item.ivm_price || item.price || 0),
  ivm_compare_price: Number(item.ivm_discount_price || item.compare_price || 0),
  ivm_stock_qty: Number(item.ivm_stock_qty || item.stock_qty || 0),
  ivm_sort_order: Number(item.ivm_sort_order || item.sort_order || 0),
  ivm_is_default: Boolean(item.ivm_is_default ?? item.is_default ?? false),
  ivm_is_available: Boolean(item.ivm_is_available ?? item.is_available ?? true),
});

export const variantsApi = {
  getVariants: async (itemId?: number): Promise<VariantEntity[]> => {
    try {
      const response = await api.get('/item-variants/list', { params: { item_id: itemId } });
      let data = response.data;
      if (!Array.isArray(data)) data = data?.data || [];
      
      const normalized: VariantEntity[] = data.map(normalizeVariant);
      return itemId ? normalized.filter((v: VariantEntity) => v.item_id === itemId) : normalized;
    } catch (error) {
      console.error('getVariants error:', error);
      throw error;
    }
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