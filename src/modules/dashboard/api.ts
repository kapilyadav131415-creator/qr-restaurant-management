import api from '../../config/axios';

export const dashboardApi = {
  getStats: async (startDate: string, endDate: string) => {
    const res = await api.get(`/dashboard/stats?start_date=${startDate}&end_date=${endDate}`);
    return res.data.data;
  },
  getSalesTrend: async (startDate: string, endDate: string) => {
    const res = await api.get(`/dashboard/sales-trend?start_date=${startDate}&end_date=${endDate}`);
    return res.data.data;
  },
  getTopItems: async (startDate: string, endDate: string) => {
    const res = await api.get(`/dashboard/top-items?start_date=${startDate}&end_date=${endDate}`);
    return res.data.data;
  },
  getCategoryDistribution: async (startDate: string, endDate: string) => {
    const res = await api.get(`/dashboard/category-distribution?start_date=${startDate}&end_date=${endDate}`);
    return res.data.data;
  },
  getRecentOrders: async () => {
    const res = await api.get(`/dashboard/recent-orders`);
    return res.data.data;
  }
};
