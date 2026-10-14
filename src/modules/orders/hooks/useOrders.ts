import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ordersApi } from '../api/ordersApi';

export const useKitchenOrders = () => {
  return useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: ordersApi.getKitchenOrders,
    // Enterprise KDS feature: Auto-refresh data every 10 seconds
    refetchInterval: 10000, 
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number, status: string }) => 
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      let action = 'updated';
      if (variables.status === 'preparing') action = 'started cooking';
      if (variables.status === 'food_ready') action = 'marked as ready';
      
      toast.success(`Order ${action}!`);
      // Immediately refresh the board
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    },
    onError: () => {
      toast.error('Failed to update order status.');
    }
  });
};

export const usePayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, paymentMethod }: { orderId: number, paymentMethod: string }) => 
      ordersApi.payOrder(orderId, paymentMethod),
    onSuccess: () => {
      toast.success('Bill generated and order completed!');
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    },
    onError: () => {
      toast.error('Failed to complete order.');
    }
  });
};