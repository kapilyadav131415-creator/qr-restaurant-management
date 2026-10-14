import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { staffApi } from '../api';
import type { CreateStaffDTO, UpdateStaffDTO } from '../types';

export const useStaffList = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getStaffList,
  });
};

export const useStaffMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['staff'] });

  const create = useMutation({
    mutationFn: (data: CreateStaffDTO) => staffApi.createStaff(data),
    onSuccess: () => { toast.success('Staff member added'); invalidate(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add staff')
  });

  const update = useMutation({
    mutationFn: (data: UpdateStaffDTO) => staffApi.updateStaff(data),
    onSuccess: () => { toast.success('Staff member updated'); invalidate(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update staff')
  });

  const remove = useMutation({
    mutationFn: (id: number) => staffApi.deleteStaff(id),
    onSuccess: () => { toast.success('Staff member removed'); invalidate(); },
    onError: (err: any) => toast.error('Failed to remove staff')
  });

  const lock = useMutation({
    mutationFn: (id: number) => staffApi.lockStaff(id),
    onSuccess: () => { toast.success('Staff account locked'); invalidate(); },
    onError: (err: any) => toast.error('Failed to lock account')
  });

  const unlock = useMutation({
    mutationFn: (id: number) => staffApi.unlockStaff(id),
    onSuccess: () => { toast.success('Staff account unlocked'); invalidate(); },
    onError: (err: any) => toast.error('Failed to unlock account')
  });

  const resetPassword = useMutation({
    mutationFn: (data: { staff_id: number; password: string }) => staffApi.resetPassword(data),
    onSuccess: () => toast.success('Password reset successfully'),
    onError: (err: any) => toast.error('Failed to reset password')
  });

  return { create, update, remove, lock, unlock, resetPassword };
};