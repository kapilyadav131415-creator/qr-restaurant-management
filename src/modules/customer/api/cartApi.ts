import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/cart';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cartApi = {
  createCart: async (data: any) => {
    const payload = {
      p_cm_restaurant_id: Number(data.p_cm_restaurant_id),
      p_cm_branch_id: Number(data.p_cm_branch_id),
      p_cm_table_id: Number(data.p_cm_table_id),
      p_cm_customer_name: data.p_cm_customer_name || null,
      p_cm_customer_mobile: data.p_cm_customer_mobile || null,
      p_cm_session_id: String(data.p_cm_session_id),
      p_cm_order_type: data.p_cm_order_type || 'dinein',
      p_cm_notes: data.p_cm_notes || null,
      p_cm_created_by: data.p_cm_created_by || null
    };
    
    console.log('Sending payload to backend with customer info:', payload);
    
    try {
      const res = await api.post('/create', payload);
      console.log('Response from backend:', res.data);
      return res.data?.data?.cart_id || res.data?.cart_id;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },


  addItem: async (data: any) => {
    const payload = {
      p_ci_cart_id: Number(data.p_ci_cart_id),
      p_ci_restaurant_id: Number(data.p_ci_restaurant_id),
      p_ci_item_id: Number(data.p_ci_item_id),
      p_ci_variant_id: Number(data.p_ci_variant_id),
      p_ci_item_name: String(data.p_ci_item_name),
      p_ci_variant_name: String(data.p_ci_variant_name),
      p_ci_price: Number(data.p_ci_price || 0),
      p_ci_discount_price: Number(data.p_ci_discount_price || 0),
      p_ci_final_price: Number(data.p_ci_final_price || data.p_ci_price || 0),
      p_ci_qty: Number(data.p_ci_qty || 1),
      p_ci_total_amount: Number(data.p_ci_total_amount || 0),
      p_ci_special_note: data.p_ci_special_note || null
    };
    
    console.log('Sending item payload:', payload);
    
    try {
      const res = await api.post('/item', payload);
      console.log('Item response:', res.data);
      return res.data?.data?.cart_item_id || res.data?.cart_item_id;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateItemQty: async (cartItemId: number, qty: number) => {
    try {
      const res = await api.put(`/item/${cartItemId}`, { 
        p_ci_qty: Number(qty) 
      });
      return res.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  removeItem: async (cartItemId: number) => {
    try {
      const res = await api.delete(`/item/${cartItemId}`);
      return res.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  addAddon: async (data: any) => {
    const payload = {
      p_cia_cart_item_id: Number(data.p_cia_cart_item_id),
      p_cia_restaurant_id: Number(data.p_cia_restaurant_id),
      p_cia_addon_group_id: Number(data.p_cia_addon_group_id),
      p_cia_addon_item_id: Number(data.p_cia_addon_item_id),
      p_cia_addon_name: String(data.p_cia_addon_name),
      p_cia_price: Number(data.p_cia_price || 0),
      p_cia_qty: Number(data.p_cia_qty || 1),
      p_cia_total_amount: Number(data.p_cia_total_amount || 0)
    };
    
    console.log('Sending addon payload:', payload);
    
    try {
      const res = await api.post('/item/addon', payload);
      console.log('Addon response:', res.data);
      return res.data?.data?.cart_addon_id || res.data?.cart_addon_id;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }
};