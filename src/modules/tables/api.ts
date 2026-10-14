import api from '../../config/axios';
import type { TableFormData } from './types';

export const tablesApi = {
  getTables: async () => {
    const response = await api.get('/tables/list');
    return response.data;
  },

  createTable: async (data: TableFormData) => {
    const response = await api.post('/tables/create', data);
    return response.data;
  },

  updateTable: async (data: TableFormData) => {
    const response = await api.put('/tables/update', data);
    return response.data;
  },

  deleteTable: async (id: number) => {
    const response = await api.delete(`/tables/delete/${id}`);
    return response.data;
  }
};