// src/components/OrderTracker.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ChefHat,
  Truck,
  Utensils,
  AlertCircle,
  Receipt,
  Sparkles,
  PartyPopper,
  User,
  Phone,
  MapPin,
  Timer
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';
import type { OrderMaster } from '../types/order';
import FeedbackForm from './FeedbackForm';

interface OrderTrackerProps {
  orderId: number;
  tableName: string;
  onClose: () => void;
  onOrderComplete?: () => void;
}

const statusConfig: Record<string, { 
  label: string; 
  icon: any; 
  color: string; 
  bgColor: string; 
  progress: number;
  description: string;
  emoji: string;
}> = {
  pending: {
    label: 'Order Placed',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    progress: 0,
    description: 'Your order is being processed',
    emoji: '📋'
  },
  received: {
    label: 'Order Received',
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    progress: 25,
    description: 'Kitchen has received your order',
    emoji: '👨‍🍳'
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    progress: 50,
    description: 'Chef is preparing your meal',
    emoji: '🔥'
  },
  ready: {
    label: 'Ready to Serve',
    icon: Truck,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    progress: 75,
    description: 'Your order is ready to be served!',
    emoji: '🍽️'
  },
  served: {
    label: 'Served',
    icon: Utensils,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    progress: 90,
    description: 'Your order has been served. Enjoy!',
    emoji: '😋'
  },
  completed: {
    label: 'Completed',
    icon: PartyPopper,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    progress: 100,
    description: 'Order completed. Thank you!',
    emoji: '🎉'
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    progress: 0,
    description: 'Order has been cancelled',
    emoji: '❌'
  }
};

export default function OrderTracker({ orderId, tableName, onClose, onOrderComplete }: OrderTrackerProps) {
  const [order, setOrder] = useState<OrderMaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchOrderStatus();

    const unsubscribe = orderApi.pollOrderStatus(orderId, (updatedOrder) => {
      console.log('Order update received:', updatedOrder);
      setOrder(updatedOrder);
      
      if (updatedOrder.om_status === 'ready') {
        toast.success('Your order is ready! 🎉', {
          duration: 5000,
          icon: '🍽️'
        });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      
      if (updatedOrder.om_status === 'served' || updatedOrder.om_status === 'completed') {
        if (onOrderComplete) {
          setTimeout(onOrderComplete, 3000);
        }
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe.then(cleanup => cleanup && cleanup());
      }
    };
  }, [orderId]);

  useEffect(() => {
    if (order?.om_status === 'completed' || order?.om_status === 'cancelled') {
      // Update the order in localStorage
      const savedOrders = localStorage.getItem('active_orders');
      if (savedOrders) {
        try {
          const orders = JSON.parse(savedOrders);
          // Keep the order in history but mark it as completed/cancelled
          localStorage.setItem('active_orders', JSON.stringify(orders));
        } catch (e) {
          console.error('Error updating orders:', e);
        }
      }
    }
  }, [order?.om_status]);

  useEffect(() => {
    if (!order?.om_created_at) return;
    
    const startTime = new Date(order.om_created_at).getTime();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      setElapsedTime(elapsed);
    }, 60000);

    return () => clearInterval(timer);
  }, [order?.om_created_at]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderDetails(orderId);
      if (response.status === 'success') {
        setOrder(response.data);
      } else {
        throw new Error('Failed to fetch order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order status');
      toast.error('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto shadow-2xl">
        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500 w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Oops! Something went wrong</h3>
        <p className="text-gray-500 mt-1 text-sm">{error || 'Order not found'}</p>
        <button 
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    );
  }

  const currentStatus = order.om_status || 'pending';
  const statusInfo = statusConfig[currentStatus] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden relative">
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * 400 - 200, opacity: 1 }}
              animate={{ y: 600, x: Math.random() * 400 - 200, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              className="absolute text-2xl"
            >
              {['🎉', '✨', '🌟', '🎊', '💫', '⭐'][i % 6]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{statusInfo.emoji}</span>
              <h2 className="text-2xl font-black tracking-tight">{order.order_no}</h2>
            </div>
            <div className="flex items-center gap-3 mt-1 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> Table {tableName}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1">
                <Timer size={14} /> {elapsedTime}m ago
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Status Card */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
          <div className={`p-3 rounded-full ${statusInfo.bgColor} shadow-inner`}>
            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{statusInfo.label}</p>
            <p className="text-sm text-gray-500">{statusInfo.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
            <span>📋 Placed</span>
            <span>👨‍🍳 Received</span>
            <span>🔥 Preparing</span>
            <span>🍽️ Ready</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className={`h-full rounded-full transition-all duration-700 ${
                order.om_status === 'cancelled' ? 'bg-red-500' : 
                order.om_status === 'completed' ? 'bg-green-500' :
                'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${statusInfo.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                <Receipt size={16} />
                Order Items
                <span className="text-xs text-gray-400 font-normal">
                  ({order.items.length} items)
                </span>
              </h4>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {order.items.map((item: any, index: number) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between text-sm py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">
                      {item.qty}× {item.name}
                    </span>
                    {item.variant && (
                      <span className="text-gray-400 text-xs ml-1">({item.variant})</span>
                    )}
                    {item.addons && item.addons.length > 0 && (
                      <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-1">
                        {item.addons.map((a: any, i: number) => (
                          <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded-full">
                            + {a.name} {a.qty > 1 ? `×${a.qty}` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-gray-700 ml-4">₹{item.total}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Total & Customer Info */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-black text-orange-600">₹{order.om_grand_total}</span>
          </div>

          {order.om_customer_name && (
            <div className="flex flex-wrap gap-3 text-sm bg-gray-50 p-3 rounded-xl">
              <span className="flex items-center gap-1.5 text-gray-600">
                <User size={14} /> {order.om_customer_name}
              </span>
              {order.om_customer_mobile && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Phone size={14} /> {order.om_customer_mobile}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {(order.om_status === 'served' || order.om_status === 'completed') && (
             <button
                onClick={() => setShowFeedback(true)}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Star size={18} className="fill-current" /> Leave Feedback
             </button>
          )}
          <div className="flex gap-3">
            {order.om_status !== 'cancelled' && 
             order.om_status !== 'completed' && 
             order.om_status !== 'served' && (
              <button
                onClick={() => {
                  toast.error('Order cancellation is not available in demo');
                }}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors border border-red-100"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={onClose}
              className={`${
                order.om_status !== 'cancelled' && 
                order.om_status !== 'completed' && 
                order.om_status !== 'served' ? 'flex-1' : 'w-full'
              } py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors`}
            >
              Close
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-center">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            order.om_status === 'cancelled' ? 'bg-red-100 text-red-600' :
            order.om_status === 'completed' || order.om_status === 'served' ? 'bg-green-100 text-green-600' :
            'bg-orange-100 text-orange-600'
          }`}>
            <Clock size={12} />
            Updated: {new Date(order.om_updated_at || order.om_created_at).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <FeedbackForm 
              restaurantId={order.restaurant_id} 
              branchId={order.branch_id}
              orderId={order.om_id}
              primaryColor="#ea580c"
              onClose={() => setShowFeedback(false)} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}