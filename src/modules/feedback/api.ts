import api from '../../config/axios';

export const feedbackApi = {
  submitFeedback: async (data: any) => {
    const res = await api.post('/feedback', data);
    return res.data;
  },
  
  getFeedback: async (params: { page?: number, limit?: number, rating?: number, start_date?: string, end_date?: string }) => {
    const res = await api.get('/feedback', { params });
    return res.data;
  },
  
  getFeedbackStats: async () => {
    const res = await api.get('/feedback/stats');
    return res.data.data;
  }
};
