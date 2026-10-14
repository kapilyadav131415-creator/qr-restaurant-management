import api from '../../config/axios';

export const billingApi = {
  // Generate Bill
  generateBill: async (orderId: number) => {
    const res = await api.post(`/billing/generate`, { orderId });
    return res.data?.data || res.data;
  },

  // Get All Bills
  getAllBills: async () => {
    const res = await api.get(`/billing`);
    return res.data?.data || res.data;
  },

  // Get Bill Details
  getBillDetails: async (billId: number) => {
    const res = await api.get(`/billing/${billId}`);
    return res.data?.data || res.data;
  },

  // Apply Discount
  applyDiscount: async (billId: number, discountValue: number, isPercentage: boolean) => {
    const res = await api.post(`/billing/${billId}/discount`, { discountValue, isPercentage });
    return res.data?.data || res.data;
  },

  // Pay Bill
  payBill: async (billId: number, payments: { mode: string; amount: number }[]) => {
    const res = await api.post(`/billing/${billId}/pay`, { payments });
    return res.data?.data || res.data;
  },

  // Cancel Bill
  cancelBill: async (billId: number, reason: string) => {
    const res = await api.post(`/billing/${billId}/cancel`, { reason });
    return res.data;
  }
};
