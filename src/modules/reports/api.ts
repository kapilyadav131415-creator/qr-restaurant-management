import api from '../../config/axios';
import type { ReportFilters, OrderReportItem, BillingReportItem, PaymentReportItem, ReportResponse } from './types';

export const reportsApi = {
  getOrders: async (filters: ReportFilters): Promise<ReportResponse<OrderReportItem>> => {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/reports/orders?${params.toString()}`);
    return { data: response.data.data, total: response.data.total };
  },

  getBilling: async (filters: ReportFilters): Promise<ReportResponse<BillingReportItem>> => {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/reports/billing?${params.toString()}`);
    return { data: response.data.data, total: response.data.total };
  },

  getPayments: async (filters: ReportFilters): Promise<ReportResponse<PaymentReportItem>> => {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/reports/payments?${params.toString()}`);
    return { data: response.data.data, total: response.data.total };
  }
};
