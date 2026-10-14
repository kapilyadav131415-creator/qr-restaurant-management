import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Calendar, Filter, Loader2, IndianRupee, RefreshCw, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { reportsApi } from '../api';
import type { ReportFilters, OrderReportItem, BillingReportItem, PaymentReportItem } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

type TabType = 'orders' | 'billing' | 'payments';

export default function ReportsPage() {
  const { primaryColor, isDark } = useOutletContext<any>();
  
  // Theme Helpers
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 focus:bg-gray-600' : 'bg-gray-50 border-gray-200 focus:bg-white';
  const hoverBg = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  const [activeTab, setActiveTab] = useState<TabType>('orders');
  
  // Filters state
  const [filters, setFilters] = useState<ReportFilters>({
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    status: '',
    page: 1,
    limit: 10
  });
  
  const [totalRecords, setTotalRecords] = useState(0);

  // Data states
  const [orders, setOrders] = useState<OrderReportItem[]>([]);
  const [bills, setBills] = useState<BillingReportItem[]>([]);
  const [payments, setPayments] = useState<PaymentReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [selectedDetails, setSelectedDetails] = useState<any>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const { data, total } = await reportsApi.getOrders(filters);
        setOrders(data);
        setTotalRecords(total);
      } else if (activeTab === 'billing') {
        const { data, total } = await reportsApi.getBilling(filters);
        setBills(data);
        setTotalRecords(total);
      } else if (activeTab === 'payments') {
        const { data, total } = await reportsApi.getPayments(filters);
        setPayments(data);
        setTotalRecords(total);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 when changing tabs
    setFilters(prev => ({ ...prev, page: 1, status: '' }));
  }, [activeTab]);

  useEffect(() => {
    fetchReport();
  }, [activeTab, filters.page, filters.limit]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.page !== 1) {
      setFilters(prev => ({ ...prev, page: 1 }));
    } else {
      fetchReport();
    }
  };

  // Helper function to render status badges
  const renderStatus = (status: string) => {
    const s = status?.toLowerCase() || '';
    let bg = 'bg-gray-100 text-gray-700';
    if (s === 'paid' || s === 'completed' || s === 'closed') bg = 'bg-green-100 text-green-700';
    if (s === 'pending' || s === 'preparing' || s === 'received') bg = 'bg-yellow-100 text-yellow-700';
    if (s === 'cancelled' || s === 'failed') bg = 'bg-red-100 text-red-700';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${bg}`}>
        {status || 'Unknown'}
      </span>
    );
  };
  
  const totalPages = Math.ceil(totalRecords / (filters.limit || 10));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <Toaster />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h1 className={`text-3xl font-black ${textMain} tracking-tight flex items-center gap-3`}>
            <FileText size={28} style={{ color: primaryColor.value }} />
            Reports
          </h1>
          <p className={`${textMuted} font-medium mt-1`}>View detailed order, billing, and payment history.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-6 mb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-1 text-sm font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'orders' ? 'text-gray-900 dark:text-white' : `${textMuted} hover:${textMain} border-transparent`}`}
          style={activeTab === 'orders' ? { borderColor: primaryColor.value, color: primaryColor.value } : {}}
        >
          Order History
        </button>
        <button 
          onClick={() => setActiveTab('billing')}
          className={`pb-4 px-1 text-sm font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'billing' ? 'text-gray-900 dark:text-white' : `${textMuted} hover:${textMain} border-transparent`}`}
          style={activeTab === 'billing' ? { borderColor: primaryColor.value, color: primaryColor.value } : {}}
        >
          Billing History
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`pb-4 px-1 text-sm font-bold tracking-widest uppercase transition-colors border-b-2 ${activeTab === 'payments' ? 'text-gray-900 dark:text-white' : `${textMuted} hover:${textMain} border-transparent`}`}
          style={activeTab === 'payments' ? { borderColor: primaryColor.value, color: primaryColor.value } : {}}
        >
          Payment History
        </button>
      </div>

      {/* Secure Filter Form */}
      <form onSubmit={handleFilterSubmit} className={`p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border ${cardBg} mb-6 flex flex-wrap items-end gap-5`}>
        <div className="flex-1 min-w-[200px]">
          <label className={`text-xs font-bold ${textMuted} uppercase tracking-widest mb-2 flex items-center gap-1.5`}>
            <Calendar size={14} /> Start Date
          </label>
          <input 
            type="date" 
            value={filters.start_date || ''}
            onChange={(e) => setFilters({...filters, start_date: e.target.value})}
            className={`w-full p-3.5 rounded-xl border outline-none transition-all text-sm font-bold ${inputBg} ${textMain}`}
            style={{ focusRingColor: primaryColor.value }}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className={`text-xs font-bold ${textMuted} uppercase tracking-widest mb-2 flex items-center gap-1.5`}>
            <Calendar size={14} /> End Date
          </label>
          <input 
            type="date" 
            value={filters.end_date || ''}
            onChange={(e) => setFilters({...filters, end_date: e.target.value})}
            className={`w-full p-3.5 rounded-xl border outline-none transition-all text-sm font-bold ${inputBg} ${textMain}`}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className={`text-xs font-bold ${textMuted} uppercase tracking-widest mb-2 flex items-center gap-1.5`}>
            <Filter size={14} /> Status
          </label>
          <select 
            value={filters.status || ''}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className={`w-full p-3.5 rounded-xl border outline-none transition-all text-sm font-bold ${inputBg} ${textMain}`}
          >
            <option value="">All Statuses</option>
            {activeTab === 'orders' && (
              <>
                <option value="received">Received</option>
                <option value="preparing">Preparing</option>
                <option value="served">Served</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </>
            )}
            {activeTab === 'billing' && (
              <>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Cancelled">Cancelled</option>
              </>
            )}
            {activeTab === 'payments' && (
              <>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </>
            )}
          </select>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="ml-auto text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase shadow-md transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ backgroundColor: primaryColor.value }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Load Report
        </button>
      </form>

      {/* Data Table */}
      <div className={`rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border ${cardBg} overflow-hidden flex flex-col`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: primaryColor.value }} />
            <p className={`font-medium ${textMuted}`}>Fetching records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDark ? 'bg-gray-800/20' : 'bg-[#FAFAFA]'}>
                  <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Date / Time</th>
                  
                  {activeTab === 'orders' && (
                    <>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Order ID</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Customer</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Table / Type</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Status</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted} text-right`}>Amount</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted} text-right`}>Action</th>
                    </>
                  )}
                  
                  {activeTab === 'billing' && (
                    <>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Bill #</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Table</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Status</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted} text-right`}>Grand Total</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted} text-right`}>Action</th>
                    </>
                  )}
                  
                  {activeTab === 'payments' && (
                    <>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Transaction ID</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Bill #</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Mode</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>Status</th>
                      <th className={`p-5 text-xs font-bold uppercase tracking-widest ${textMuted} text-right`}>Amount</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {activeTab === 'orders' && orders.map(order => (
                  <tr key={order.om_id} className={`transition-colors cursor-pointer group ${hoverBg}`}>
                    <td className={`p-5 text-sm font-medium ${textMuted}`}>{format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}</td>
                    <td className={`p-5 text-sm font-bold ${textMain}`}>#{order.om_id}</td>
                    <td className={`p-5 text-sm font-medium ${textMuted}`}>{order.customer_name || 'Guest'}</td>
                    <td className="p-5">
                      <div className={`text-sm font-bold ${textMain}`}>Table {order.table_id || 'N/A'}</div>
                      <div className={`text-xs uppercase ${textMuted}`}>{order.order_type}</div>
                    </td>
                    <td className="p-5">{renderStatus(order.om_status)}</td>
                    <td className={`p-5 text-sm font-black text-right ${textMain}`}>₹{order.total_amount || 0}</td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedDetails({ type: 'order', data: order })} 
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'billing' && bills.map(bill => (
                  <tr key={bill.bill_id} className={`transition-colors cursor-pointer group ${hoverBg}`}>
                    <td className={`p-5 text-sm font-medium ${textMuted}`}>{format(new Date(bill.created_at), 'dd MMM yyyy, hh:mm a')}</td>
                    <td className={`p-5 text-sm font-bold ${textMain}`}>{bill.bill_number}</td>
                    <td className={`p-5 text-sm font-bold ${textMain}`}>Table {bill.table_id || 'N/A'}</td>
                    <td className="p-5">{renderStatus(bill.bill_status)}</td>
                    <td className={`p-5 text-sm font-black text-right ${textMain}`}>₹{bill.grand_total || 0}</td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedDetails({ type: 'billing', data: bill })} 
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'}`}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'payments' && payments.map(payment => (
                  <tr key={payment.payment_id} className={`transition-colors cursor-pointer group ${hoverBg}`}>
                    <td className={`p-5 text-sm font-medium ${textMuted}`}>{format(new Date(payment.created_at), 'dd MMM yyyy, hh:mm a')}</td>
                    <td className={`p-5 text-sm font-bold ${textMain}`}>#{payment.transaction_id || payment.payment_id}</td>
                    <td className={`p-5 text-sm font-bold ${textMain}`}>{payment.bill_number}</td>
                    <td className="p-5">
                      <div className={`flex items-center gap-1 text-sm font-bold ${textMuted}`}>
                        <IndianRupee size={14} /> {payment.payment_mode}
                      </div>
                    </td>
                    <td className="p-5">{renderStatus(payment.payment_status)}</td>
                    <td className={`p-5 text-sm font-black text-right ${textMain}`}>₹{payment.amount || 0}</td>
                  </tr>
                ))}

                {/* Empty states */}
                {activeTab === 'orders' && orders.length === 0 && (
                  <tr><td colSpan={7} className={`p-12 text-center ${textMuted} font-medium`}>No order records found for this filter.</td></tr>
                )}
                {activeTab === 'billing' && bills.length === 0 && (
                  <tr><td colSpan={6} className={`p-12 text-center ${textMuted} font-medium`}>No billing records found for this filter.</td></tr>
                )}
                {activeTab === 'payments' && payments.length === 0 && (
                  <tr><td colSpan={6} className={`p-12 text-center ${textMuted} font-medium`}>No payment records found for this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Footer */}
        <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-[#FAFAFA]'} p-4 flex items-center justify-between mt-auto`}>
          <div className={`text-sm ${textMuted} font-medium`}>
            Showing <span className={`font-bold ${textMain}`}>{totalRecords > 0 ? ((filters.page || 1) - 1) * (filters.limit || 10) + 1 : 0}</span> to <span className={`font-bold ${textMain}`}>{Math.min((filters.page || 1) * (filters.limit || 10), totalRecords)}</span> of <span className={`font-bold ${textMain}`}>{totalRecords}</span> records
          </div>
          <div className="flex gap-2">
            <button 
              disabled={filters.page === 1 || loading}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              className={`p-2 border rounded-lg transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-white' : 'border-gray-200 hover:bg-white disabled:opacity-50 text-gray-900'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={filters.page === totalPages || totalPages === 0 || loading}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              className={`p-2 border rounded-lg transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-white' : 'border-gray-200 hover:bg-white disabled:opacity-50 text-gray-900'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-[2rem] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${cardBg}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-[#FAFAFA]'}`}>
              <h3 className={`text-xl font-black ${textMain} tracking-tight flex items-center gap-2`}>
                <FileText size={22} style={{ color: primaryColor.value }} />
                {selectedDetails.type === 'order' ? `Order Details (#${selectedDetails.data.om_id})` : `Bill Details (${selectedDetails.data.bill_number})`}
              </h3>
              <button 
                onClick={() => setSelectedDetails(null)} 
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className={`p-6 overflow-y-auto custom-scrollbar ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2 ${textMuted}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Items Summary
              </h4>
              
              {selectedDetails.data.items && selectedDetails.data.items.length > 0 ? (
                <div className="space-y-4">
                  {selectedDetails.data.items.map((item: any, idx: number) => (
                    <div key={idx} className={`border rounded-2xl p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-[#FAFAFA] border-gray-100'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`font-bold ${textMain}`}>{item.item_name}</div>
                          <div className={`text-sm mt-1 font-medium ${textMuted}`}>
                            {item.qty} x ₹{item.price}
                          </div>
                        </div>
                        <div className={`font-black text-lg ${textMain}`}>
                          ₹{item.total || (Number(item.qty) * Number(item.price))}
                        </div>
                      </div>
                      
                      {/* Addons display if available */}
                      {item.addons && item.addons.length > 0 && (
                        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200/60'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Addons Included</div>
                          <div className="space-y-1.5">
                            {item.addons.map((addon: any, aIdx: number) => (
                              <div key={aIdx} className="flex justify-between text-sm">
                                <span className={textMuted}>{addon.name} (x{addon.qty})</span>
                                <span className={`font-bold ${textMain}`}>+₹{addon.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center p-12 rounded-2xl font-medium ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                  No items found.
                </div>
              )}
            </div>
            
            <div className={`p-6 border-t flex items-center justify-between ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-[#FAFAFA]'}`}>
              <div className={`font-bold uppercase tracking-widest text-sm ${textMuted}`}>Grand Total</div>
              <div className="text-3xl font-black" style={{ color: primaryColor.value }}>
                ₹{selectedDetails.type === 'order' ? selectedDetails.data.total_amount : selectedDetails.data.grand_total}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
