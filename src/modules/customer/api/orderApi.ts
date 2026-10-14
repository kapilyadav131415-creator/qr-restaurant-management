// src/api/orderApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/orders';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderApi = {
  // Customer place order (no auth required)
  customerPlaceOrder: async (cartId: number) => {
    try {
      const res = await api.post('/customer/place', { cart_id: cartId });
      console.log('Order placed response:', res.data);
      return res.data;
    } catch (error: any) {
      console.error('Place order error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Staff place order (requires auth)
  staffPlaceOrder: async (cartId: number, token: string) => {
    try {
      const res = await api.post(
        '/staff/place',
        { cart_id: cartId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error: any) {
      console.error('Staff place order error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get order details by ID
  getOrderDetails: async (orderId: number, token?: string) => {
    try {
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await api.get(`/${orderId}`, { headers });
      return res.data;
    } catch (error: any) {
      console.error('Get order details error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get kitchen orders (staff only)
  getKitchenOrders: async (token: string) => {
    try {
      const res = await api.get('/kitchen', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      console.error('Get kitchen orders error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Polling for order status updates (fallback for SSE)
  pollOrderStatus: async (orderId: number, onUpdate: (data: any) => void, interval = 5000) => {
let pollInterval: ReturnType<typeof setInterval> | null = null;
    let lastStatus = '';

    const checkStatus = async () => {
      try {
        const result = await orderApi.getOrderDetails(orderId);
        if (result.status === 'success' && result.data) {
          const order = result.data;
          if (order.om_status !== lastStatus) {
            lastStatus = order.om_status;
            onUpdate(order);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Initial check
    await checkStatus();

    // Start polling
    pollInterval = setInterval(checkStatus, interval);

    // Return cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }
};