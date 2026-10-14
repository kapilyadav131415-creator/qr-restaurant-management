import api from '../../config/axios';
import type { CreateStaffDTO, UpdateStaffDTO, StaffEntity } from './types';

export const staffApi = {
  getStaffList: async (): Promise<StaffEntity[]> => {
    const res = await api.get('/staff/list');
    return Array.isArray(res.data?.data) ? res.data.data : (res.data || []);
  },
  
  createStaff: async (data: CreateStaffDTO) => {
    return (await api.post('/staff/create', data)).data;
  },
  
  updateStaff: async (data: UpdateStaffDTO) => {
    return (await api.put('/staff/update', data)).data;
  },
  
  deleteStaff: async (staffId: number) => {
    return (await api.delete(`/staff/delete/${staffId}`)).data;
  },
  
  lockStaff: async (staffId: number) => {
    return (await api.put(`/staff/lock/${staffId}`)).data;
  },
  
  unlockStaff: async (staffId: number) => {
    return (await api.put(`/staff/unlock/${staffId}`)).data;
  },
  
  resetPassword: async (data: { staff_id: number; password: string }) => {
    return (await api.put('/staff/reset-password', data)).data;
  }
};