import axios from 'axios';
import type { TableInfo, Menu, Category, MenuItem, ItemDetails } from './types';

const API_URL = 'http://localhost:5000/api/v1/customer';

export const customerApi = {
 getMenuByQr: async (qrToken: string): Promise<{ table: TableInfo, menus: Menu[] }> => {
  const res = await axios.get(`${API_URL}/menu/${qrToken}`);
  console.log('Raw API response from getMenuByQr:', res.data); // Add this
  
  const payload = res.data?.data || res.data;
  console.log('Parsed payload:', payload); // Add this

  if (!payload || !payload.table) throw new Error("Invalid payload format");

  const tableData = {
    id: Number(payload.table.tm_id),
    tableName: payload.table.tm_table_name,
    restaurantId: Number(payload.table.tm_restaurant_id),
    branchId: Number(payload.table.tm_branch_id),
    restaurantName: payload.table.rm_name,
    restaurantLogo: payload.table.rm_logo_url || null,
    branchName: payload.table.bm_name
  };
  
  console.log('Processed table data:', tableData); // Add this

  return {
    table: tableData,
    menus: (payload.menus || []).map((m: any) => ({
      id: Number(m.mm_id),
      name: m.mm_name,
      description: m.mm_description || null,
      imageUrl: m.mm_image_url || null,
      themeColor: m.mm_theme_color || '#ea580c',
      startTime: m.mm_start_time || null,
      endTime: m.mm_end_time || null
    }))
  };
},
  getCategories: async (menuId: number): Promise<Category[]> => {
    const res = await axios.get(`${API_URL}/categories/${menuId}`);
    const payload = res.data?.data || res.data;

    return (payload || []).map((c: any) => ({
      id: Number(c.cm_id),
      name: c.cm_name,
      description: c.cm_description || null,
      image: c.cm_image_url || null,
      icon: c.cm_icon || null,
      isRecommended: Boolean(c.cm_is_recommended)
    }));
  },

  getItems: async (categoryId: number): Promise<MenuItem[]> => {
    const res = await axios.get(`${API_URL}/items/${categoryId}`);
    const payload = res.data?.data || res.data;

    return (payload || []).map((i: any) => ({
      id: Number(i.im_id),
      name: i.im_name,
      description: i.im_short_description || null,
      image: i.im_image_url || null,
      type: i.im_food_type || 'veg',
      isBestseller: Boolean(i.im_is_bestseller),
      isRecommended: Boolean(i.im_is_recommended),
      prepTime: Number(i.im_preparation_time) || null
    }));
  },

  getItemDetails: async (itemId: number): Promise<ItemDetails> => {
    const res = await axios.get(`${API_URL}/item-details/${itemId}`);
    const payload = res.data?.data || res.data;

    return {
      item: {
        id: Number(payload.item?.im_id || itemId),
        name: payload.item?.im_name || '',
        description: payload.item?.im_description || payload.item?.im_short_description || '',
        image: payload.item?.im_image_url || null,
        type: payload.item?.im_food_type || 'veg',
        isBestseller: Boolean(payload.item?.im_is_bestseller),
        isRecommended: Boolean(payload.item?.im_is_recommended),
        prepTime: Number(payload.item?.im_preparation_time) || null
      },
      variants: (payload.variants || []).map((v: any) => ({
        id: Number(v.ivm_id),
        name: v.ivm_variant_name,
        price: Number(v.ivm_price) || 0,
        isDefault: Boolean(v.ivm_is_default)
      })).sort((a: any, b: any) => a.price - b.price),
      
      addonGroups: (payload.addon_groups || []).map((g: any) => ({
        id: Number(g.agm_id),
        name: g.agm_name,
        selectionType: g.agm_selection_type || 'multiple',
        minSelect: Number(g.agm_min_select) || 0,
        maxSelect: Number(g.agm_max_select) || 1,
        isRequired: Boolean(g.agm_is_required),
        items: (g.addon_items || []).map((ai: any) => ({
          id: Number(ai.aim_id),
          name: ai.aim_name,
          price: Number(ai.aim_price) || 0
        }))
      }))
    };
  }
};