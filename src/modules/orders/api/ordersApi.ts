import api from '../../../config/axios';
import type { KitchenOrder } from '../types';

export const ordersApi = {
  // Fetch active kitchen orders
  getKitchenOrders: async (): Promise<KitchenOrder[]> => {
    const res = await api.get('/orders/kitchen');
    // Ensure we handle both { data: [...] } and [...] formats
    return res.data?.data || res.data || [];
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string) => {
    const res = await api.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  // Get full details (Optional, if you want a detailed modal later)
  getOrderDetails: async (orderId: number) => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data?.data || res.data;
  },

  // Pay and complete order
  payOrder: async (orderId: number, paymentMethod: string) => {
    const res = await api.post(`/orders/${orderId}/pay`, { paymentMethod });
    return res.data;
  }
};