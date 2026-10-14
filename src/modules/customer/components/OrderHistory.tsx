// src/components/OrderHistory.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Eye, 
  Trash2, 
  ClipboardList,
  ChevronRight,
  CheckCircle,
  Loader2,
  Utensils
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';

interface OrderHistoryProps {
  orders: number[];
  onViewOrder: (orderId: number) => void;
  onRemoveOrder: (orderId: number) => void;
  onClose: () => void;
}

interface OrderSummary {
  id: number;
  order_no: string;
  status: string;
  total: number;
  created_at: string;
  items_count: number;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  received: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Received' },
  preparing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Preparing' },
  ready: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Ready' },
  served: { bg: 'bg-green-100', text: 'text-green-700', label: 'Served' },
  completed: { bg: 'bg-green-200', text: 'text-green-800', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
};

export default function OrderHistory({ orders, onViewOrder, onRemoveOrder, onClose }: OrderHistoryProps) {
  const [orderDetails, setOrderDetails] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orders]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const details = await Promise.all(
        orders.map(async (orderId) => {
          try {
            const response = await orderApi.getOrderDetails(orderId);
            if (response.status === 'success' && response.data) {
              const order = response.data;
              return {
                id: order.om_id,
                order_no: order.order_no || `ORD-${String(order.om_id).padStart(5, '0')}`,
                status: order.om_status || 'pending',
                total: order.om_grand_total || 0,
                created_at: order.om_created_at,
                items_count: order.items?.length || 0
              };
            }
            return null;
          } catch (error) {
            console.error(`Failed to fetch order ${orderId}:`, error);
            return null;
          }
        })
      );
      setOrderDetails(details.filter((d): d is OrderSummary => d !== null));
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusColors[status] || statusColors.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden max-h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">Order History</h2>
              <p className="text-white/80 text-sm">Track all your orders</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {orderDetails.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Utensils size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Your orders will appear here</p>
          </div>
        ) : (
          orderDetails.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.text.includes('green') ? CheckCircle : Clock;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{order.order_no}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{order.items_count} items</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>₹{order.total}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                      title="View Order"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveOrder(order.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {/* Progress indicator for active orders */}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: order.status === 'received' ? '25%' :
                                 order.status === 'preparing' ? '50%' :
                                 order.status === 'ready' ? '75%' :
                                 order.status === 'served' ? '90%' : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}