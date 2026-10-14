import api from '../../config/axios';
import type { AddonGroupEntity, AddonGroupFormData, AddonItemEntity, AddonItemFormData } from './types';

export const addonsApi = {
  // --- GROUPS ---
  getGroups: async (itemId?: number): Promise<AddonGroupEntity[]> => {
    const res = await api.get('/addon-groups/list', { params: { item_id: itemId } });
    console.log('📦 Raw group response:', res.data);
    
    // Extract data from response
    const data: any[] = res.data?.data || [];
    
    const mapped: AddonGroupEntity[] = data.map((g: any) => ({
      ag_id: Number(g.agm_id),
      item_id: Number(g.agm_item_id),
      ag_name: g.agm_name || 'Unnamed Group',
      ag_code: g.agm_code || '',
      ag_description: g.agm_description || '',
      ag_selection_type: g.agm_selection_type || 'multiple',
      ag_min_select: Number(g.agm_min_select || 0),
      ag_max_select: Number(g.agm_max_select || 1),
      ag_is_required: Boolean(g.agm_is_required ?? false),
      ag_sort_order: Number(g.agm_sort_order || 0),
    }));
    
    // Filter by item_id if provided
    const filtered: AddonGroupEntity[] = itemId 
      ? mapped.filter((g: AddonGroupEntity) => g.item_id === itemId)
      : mapped;
    
    console.log('✅ Mapped groups:', filtered);
    return filtered;
  },

  createGroup: async (data: AddonGroupFormData) => {
    const payload = {
      item_id: data.item_id,
      name: data.name,
      code: data.code,
      description: data.description,
      selection_type: data.selection_type,
      min_select: data.min_select,
      max_select: data.max_select,
      is_required: data.is_required,
      sort_order: data.sort_order,
    };
    const response = await api.post('/addon-groups/create', payload);
    return response.data;
  },

  updateGroup: async (data: AddonGroupFormData) => {
    const payload = {
      group_id: data.group_id,
      name: data.name,
      selection_type: data.selection_type,
      min_select: data.min_select,
      max_select: data.max_select,
      is_required: data.is_required,
      sort_order: data.sort_order,
    };
    const response = await api.put('/addon-groups/update', payload);
    return response.data;
  },

  deleteGroup: async (id: number) => {
    const response = await api.delete(`/addon-groups/delete/${id}`);
    return response.data;
  },

  // --- ITEMS ---
  getAddonItems: async (groupId?: number): Promise<AddonItemEntity[]> => {
    const res = await api.get('/addon-items/list', { params: { group_id: groupId } });
    console.log('📦 Raw addon items response:', res.data);
    
    const data: any[] = res.data?.data || [];
    
    const mapped: AddonItemEntity[] = data.map((i: any) => ({
      ai_id: Number(i.aim_id),                    // ✅ Fixed: use aim_id
      group_id: Number(i.aim_group_id),           // ✅ Fixed: use aim_group_id
      ai_name: i.aim_name || '',
      ai_code: i.aim_code || '',
      ai_description: i.aim_description || '',
      ai_price: Number(i.aim_price || 0),
      ai_discount_price: Number(i.aim_discount_price || 0),
      ai_image_url: i.aim_image_url || '',
      ai_stock_qty: Number(i.aim_stock_qty || 0),
      ai_sort_order: Number(i.aim_sort_order || 0),
      ai_is_available: Boolean(i.aim_is_available ?? true),
    }));
    
    // Filter by group_id if provided
    const filtered = groupId 
      ? mapped.filter(item => item.group_id === groupId)
      : mapped;
    
    console.log('✅ Mapped addon items for group', groupId, ':', filtered);
    return filtered;
  },

  createAddonItem: async (data: AddonItemFormData) => {
    const payload = {
      group_id: data.group_id,
      name: data.name,
      code: data.code,
      description: data.description,
      price: data.price,
      discount_price: data.discount_price,
      image_url: data.image_url,
      stock_qty: data.stock_qty,
      sort_order: data.sort_order,
      is_available: data.is_available,
    };
    const response = await api.post('/addon-items/create', payload);
    return response.data;
  },

  updateAddonItem: async (data: AddonItemFormData) => {
    const payload = {
      addon_item_id: data.addon_item_id,
      name: data.name,
      price: data.price,
      discount_price: data.discount_price,
      stock_qty: data.stock_qty,
      is_available: data.is_available,
    };
    const response = await api.put('/addon-items/update', payload);
    return response.data;
  },

  deleteAddonItem: async (id: number) => {
    const response = await api.delete(`/addon-items/delete/${id}`);
    return response.data;
  }
};