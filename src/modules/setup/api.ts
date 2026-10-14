import api from '../../config/axios';
import type { SubscriptionPlan, RestaurantSetupFormData } from './types';

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get('/subscription-plans');
  return response.data.data; // Returning the array of plans
};

export const submitRestaurantSetup = async (setupData: RestaurantSetupFormData) => {
  const response = await api.post('/restaurants/setup', setupData);
  return response.data;
};

export const createPaymentOrder = async (plan_id: number) => {
  const response = await api.post('/payments/create-subscription-order', { plan_id });
  return response.data;
};