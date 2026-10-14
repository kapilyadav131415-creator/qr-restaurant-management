import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Utensils, AlertTriangle, Loader2, CheckCircle2, BellRing, Check, Receipt, Eye, X } from 'lucide-react';
import { useKitchenOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import type { KitchenOrder } from '../types';

// Utility to Decode JWT Token to get role_id
const getRoleIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role_id || payload.um_role_id || null;
  } catch (e) {
    console.error("Invalid token format");
    return null;
  }
};

const timeAgo = (dateString: string) => {
  const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  return `${diff} min ago`;
};

export default function LiveOrdersPage() {
  const { primaryColor, isDark } = useOutletContext<any>();
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isFetching } = useKitchenOrders();
  const updateStatus = useUpdateOrderStatus();
  
  const roleId = getRoleIdFromToken();

  // Re-render every minute for live time updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);

  // ==========================================
  // ROLE-BASED FILTERING LOGIC
  // ==========================================
  const displayOrders = useMemo(() => {
    if (!roleId) return [];

    // Admins (1,2) & Managers (3) see EVERYTHING
    if (roleId === "1" || roleId === "2" || roleId === "3") {
      return orders;
    }
    // Chefs (4) see only Kitchen queue
    if (roleId === "4") {
      return orders.filter(o => o.om_status === 'received' || o.om_status === 'preparing');
    }
    // Waiters (5) see Food Ready and Served queues
    if (roleId === "5") {
      return orders.filter(o => o.om_status === 'food_ready' || o.om_status === 'served');
    }
    return [];
  }, [orders, roleId]);

  // ==========================================
  // ROLE-BASED ACTION BUTTONS
  // ==========================================
  const handleStatusChange = (orderId: number, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let nextStatus = '';
    if (currentStatus === 'received') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'food_ready';
    else if (currentStatus === 'food_ready') nextStatus = 'served';
    
    if (nextStatus) {
      updateStatus.mutate({ orderId, status: nextStatus });
    }
  };

  const renderActionButton = (order: KitchenOrder) => {
    // Waiter logic
    if (roleId === "5") {
      return (
        <button 
          onClick={(e) => handleStatusChange(order.om_id, order.om_status, e)}
          disabled={updateStatus.isPending}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-transform disabled:opacity-70"
        >
          {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16}/> Mark as Served</>}
        </button>
      );
    }

    // Chef logic
    if (order.om_status === 'received') {
      return (
        <button 
          onClick={(e) => handleStatusChange(order.om_id, order.om_status, e)}
          disabled={updateStatus.isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform disabled:opacity-70"
        >
          {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Utensils size={16}/> Start Cooking</>}
        </button>
      );
    }

    if (order.om_status === 'preparing') {
      return (
        <button 
          onClick={(e) => handleStatusChange(order.om_id, order.om_status, e)}
          disabled={updateStatus.isPending}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-md shadow-green-500/20 flex items-center justify-center gap-2 transition-transform disabled:opacity-70"
        >
          {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16}/> Food Ready</>}
        </button>
      );
    }

    // Admin viewing ready order
    if (order.om_status === 'food_ready' && (roleId === '1' || roleId === "2" || roleId === "3")) {
      return (
        <button 
          onClick={(e) => handleStatusChange(order.om_id, order.om_status, e)}
          disabled={updateStatus.isPending}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-transform disabled:opacity-70"
        >
          {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16}/> Mark as Served</>}
        </button>
      );
    }

    // Billing / Payment for served orders (Admin, Manager, Waiter)
    if (order.om_status === 'served' && (roleId === '1' || roleId === "2" || roleId === "3" || roleId === "5")) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/billing/${order.om_id}`); }}
          className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform"
        >
          <Receipt size={16}/> Generate Bill
        </button>
      );
    }

    return null;
  };

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const getHeaderInfo = () => {
    if (roleId === '5') return { icon: <BellRing size={32} className="text-purple-500"/>, title: "Service Dashboard", desc: "Orders ready to be served to customers." };
    if (roleId === "4") return { icon: <ChefHat size={32} className="text-blue-500"/>, title: "Kitchen Display", desc: "Live cooking queue." };
    return { icon: <ChefHat size={32} style={{ color: primaryColor?.value || '#2563eb' }}/>, title: "Live Order Manager", desc: "Master view of kitchen & service." };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="max-w-[1600px] mx-auto pb-10 relative px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${textMain}`}>
            {headerInfo.icon}
            {headerInfo.title}
          </h1>
          <p className={`font-medium mt-1 flex items-center gap-2 ${textMuted}`}>
            {headerInfo.desc} Auto-refreshes every minute.
            {isFetching && <Loader2 size={12} className="animate-spin" />}
          </p>
        </div>
        
        {/* Dynamic Counters based on role */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {(roleId === "1" || roleId === "2" || roleId === "3" || roleId === "4") && (
            <>
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap shadow-sm ${cardBg} ${borderColor} ${textMain}`}>
                New Queue: <span className="text-blue-600">{displayOrders.filter(o => o.om_status === 'received').length}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap shadow-sm ${cardBg} ${borderColor} ${textMain}`}>
                Cooking: <span className="text-green-600">{displayOrders.filter(o => o.om_status === 'preparing').length}</span>
              </div>
            </>
          )}
          {(roleId === "1" || roleId ==="2" || roleId === "3" || roleId === "5") && (
            <>
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap shadow-sm ${cardBg} ${borderColor} ${textMain}`}>
                Ready to Serve: <span className="text-purple-600">{displayOrders.filter(o => o.om_status === 'food_ready').length}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-xl border font-bold text-sm whitespace-nowrap shadow-sm ${cardBg} ${borderColor} ${textMain}`}>
                Served: <span className="text-gray-600">{displayOrders.filter(o => o.om_status === 'served').length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* TICKETS GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin w-12 h-12 mb-4 text-blue-500" />
          <p className={textMuted}>Syncing live orders...</p>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className={`border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center py-32 ${borderColor} ${cardBg}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-900' : 'bg-green-50'}`}>
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h2 className={`text-2xl font-black ${textMain}`}>All Caught Up!</h2>
          <p className={textMuted}>No pending tickets in your queue right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {displayOrders.map((order) => {
              const isPreparing = order.om_status === 'preparing';
              const isReady = order.om_status === 'food_ready';
              const isServed = order.om_status === 'served';
              const timeDiff = Math.floor((new Date().getTime() - new Date(order.om_created_at).getTime()) / 60000);
              const isDelayed = timeDiff > 15;

              // Border colors based on status
              let cardBorder = borderColor;
              let topAccent = 'bg-blue-500';
              if (isPreparing) {
                cardBorder = isDark ? 'border-green-900/50' : 'border-green-200';
                topAccent = 'bg-green-500';
              } else if (isReady) {
                cardBorder = isDark ? 'border-purple-900/50' : 'border-purple-200';
                topAccent = 'bg-purple-500';
              } else if (isServed) {
                cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
                topAccent = 'bg-gray-400';
              }

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  key={order.om_id} 
                  className={`flex flex-col rounded-2xl border shadow-sm overflow-hidden ${cardBg} ${cardBorder} hover:shadow-md transition-shadow relative cursor-pointer group`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${topAccent}`} />
                  
                  {/* TICKET HEADER */}
                  <div className={`p-5 pb-4 flex justify-between items-start`}>
                    <div>
                      <h3 className={`text-lg font-black ${textMain}`}>{order.order_no || `ORD-${order.om_id}`}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${order.om_order_type === 'dinein' ? 'bg-orange-100 text-orange-700' : 'bg-pink-100 text-pink-700'}`}>
                          {order.om_order_type === 'dinein' ? `Table ${order.om_table_id}` : order.om_order_type}
                        </span>
                        {isReady && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-md">Ready</span>}
                        {isServed && <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-md">Served</span>}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${isDelayed && !isReady && !isServed ? 'bg-red-100 text-red-700' : (isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
                      <Clock size={12} /> {timeAgo(order.om_created_at)}
                    </div>
                  </div>

                  {/* SUMMARY INFO */}
                  <div className="px-5 pb-5">
                    <p className={`text-sm font-medium ${textMuted} flex items-center justify-between`}>
                      <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} ordered</span>
                      <span className="flex items-center gap-1 text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Eye size={14}/> Details
                      </span>
                    </p>
                    
                    {order.om_notes && (
                      <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-2.5 rounded-lg flex gap-2">
                        <AlertTriangle size={14} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400 truncate">Note: {order.om_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* DYNAMIC ACTION BUTTON */}
                  <div className="p-4 pt-0 mt-auto">
                    {renderActionButton(order)}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL FOR ORDER DETAILS */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                <div>
                  <h2 className={`text-2xl font-black ${textMain}`}>{selectedOrder.order_no || `ORD-${selectedOrder.om_id}`}</h2>
                  <p className={`text-sm font-medium mt-1 ${textMuted}`}>Table {selectedOrder.om_table_id} • {timeAgo(selectedOrder.om_created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <X size={20} className={textMain} />
                </button>
              </div>

              {/* Modal Body: Items List */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                {selectedOrder.om_notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-xl flex gap-3 mb-6">
                    <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Order Note</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-0.5">{selectedOrder.om_notes}</p>
                    </div>
                  </div>
                )}

                <h4 className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-2`}>Order Items</h4>
                
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-800/30' : 'border-gray-100 bg-white shadow-sm'}`}>
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shrink-0 ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-700'}`}>
                          {item.qty}x
                        </div>
                        <div className="flex-1 pt-0.5">
                          <h4 className={`text-base font-bold flex flex-wrap gap-2 items-center ${textMain}`}>
                            {item.name}
                            {item.variant && (
                              <span className="text-[10px] bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                {item.variant}
                              </span>
                            )}
                          </h4>
                          
                          {item.addons && item.addons.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-bold text-gray-400 mb-1">Addons:</p>
                              <ul className="space-y-1 flex flex-wrap gap-2">
                                {item.addons.reduce((acc, curr) => {
                                  const existing = acc.find(a => a.name === curr.name);
                                  if (existing) existing.qty += curr.qty;
                                  else acc.push({ ...curr });
                                  return acc;
                                }, [] as typeof item.addons).map((addon, aIdx) => (
                                  <li key={aIdx} className={`text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md flex items-center gap-1.5`}>
                                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                                    {addon.name} {addon.qty > 1 && <span className="text-blue-500 bg-blue-50 dark:bg-blue-900/40 px-1 rounded">x{addon.qty}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {item.note && (
                            <p className="text-xs font-bold text-red-600 mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                              * {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-4 border-t flex justify-end ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
                {renderActionButton(selectedOrder) ? (
                   <div className="w-full sm:w-auto">
                     {renderActionButton(selectedOrder)}
                   </div>
                ) : (
                  <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Close Details
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}