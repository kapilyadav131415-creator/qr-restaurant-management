import api from '../../config/axios';
import type { BranchFormData } from './types';

export const branchesApi = {
  // GET: Fetch all branches
  getBranches: async () => {
    const response = await api.get('/branches/list');
    // Backend returns: { status: 'success', data: [...] }
    return response.data;
  },

  // POST: Create a new branch
  createBranch: async (data: BranchFormData) => {
    const response = await api.post('/branches/create', data);
    return response.data;
  },

  // PUT: Update branch
  updateBranch: async (data: BranchFormData) => {
    const response = await api.put('/branches/update', data);
    return response.data;
  },

  // DELETE: Delete branch (Sending bm_id in the request body as per your backend)
  deleteBranch: async (bm_id: number) => {
    const response = await api.delete('/branches/delete', {
      data: { bm_id }
    });
    return response.data;
  }
};