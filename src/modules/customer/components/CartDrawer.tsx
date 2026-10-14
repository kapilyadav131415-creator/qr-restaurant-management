// src/components/CartDrawer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  Loader2,
  CreditCard,
  Receipt,
  Tag,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (orderId: number) => void;
}

export default function CartDrawer({ isOpen, onClose, onOrderPlaced }: CartDrawerProps) {
  const { cart, updateItemQty, removeItem, cartTotal, clearCart, isSyncing } = useCart();
  const [placingOrder, setPlacingOrder] = React.useState(false);

  const handlePlaceOrder = async () => {
    if (!cart?.cm_id) {
      toast.error('Cart not found');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      const result = await orderApi.customerPlaceOrder(cart.cm_id);
      
      if (result.status === 'success') {
        const orderId = result.data?.order_id;
        toast.success('Order placed successfully! 🎉');
        clearCart();
        onClose();
        
        if (onOrderPlaced && orderId) {
          onOrderPlaced(orderId);
        }
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Place order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  const calculateItemTotal = (item: any) => {
    const itemTotal = (item.final_price || item.price || 0) * (item.qty || 0);
    const addonsTotal = item.addons?.reduce((sum: number, a: any) => sum + ((a.price || 0) * (a.qty || 0)), 0) || 0;
    return itemTotal + addonsTotal;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ x: "100%" }} 
          animate={{ x: 0 }} 
          exit={{ x: "100%" }} 
          transition={{ type: "spring", damping: 25, stiffness: 200 }} 
          className="w-full max-w-md bg-gradient-to-br from-gray-50 to-white h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                <ShoppingBag size={20} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors hover:rotate-90 duration-300"
            >
              <X size={18}/>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag size={40} className="text-gray-300" />
                </div>
                <p className="font-bold text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some delicious items!</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <motion.div 
                  key={item.ci_id || Math.random()} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">{item.item_name}</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{item.variant_name}</p>
                      {item.addons && item.addons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.addons.map((a: any, i: number) => (
                            <span key={i} className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-500">
                              + {a.addon_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-black text-sm whitespace-nowrap ml-2 text-orange-600">
                      ₹{calculateItemTotal(item)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => {
                          if (item.ci_id) {
                            const newQty = (item.qty || 0) - 1;
                            if (newQty <= 0) {
                              removeItem(item.ci_id);
                            } else {
                              updateItemQty(item.ci_id, newQty);
                            }
                          }
                        }} 
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:shadow-md transition-all active:scale-95"
                      >
                        <Minus size={14}/>
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{item.qty || 0}</span>
                      <button 
                        onClick={() => item.ci_id && updateItemQty(item.ci_id, (item.qty || 0) + 1)} 
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-orange-600 hover:shadow-md transition-all active:scale-95"
                      >
                        <Plus size={14}/>
                      </button>
                    </div>
                    <button 
                      onClick={() => item.ci_id && removeItem(item.ci_id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0">
              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax & Charges</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">₹{cartTotal}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={clearCart}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={placingOrder || isSyncing || !cart || cart.items.length === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-black text-sm shadow-xl flex justify-center items-center gap-2 active:scale-95 transition-all hover:shadow-green-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Place Order
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}