import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Filter, Receipt, Eye, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { billingApi } from '../api';

export default function BillingHistoryPage() {
  const { primaryColor, isDark } = useOutletContext<any>();
  const navigate = useNavigate();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billingApi.getAllBills();
      setBills(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(bill.order_id).includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || bill.bill_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const bgCard = isDark ? 'bg-gray-800' : 'bg-white';
  const borderCol = isDark ? 'border-gray-700' : 'border-gray-200';

  const getStatusBadge = (status: string) => {
    if (status === 'Closed') return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 w-fit"><CheckCircle2 size={14}/> Paid</span>;
    if (status === 'Open') return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 w-fit"><Clock size={14}/> Open</span>;
    if (status === 'Cancelled') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 w-fit"><XCircle size={14}/> Cancelled</span>;
    return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-black uppercase tracking-widest w-fit">{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 relative px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${textMain}`}>
            <Receipt size={32} style={{ color: primaryColor?.value || '#2563eb' }}/>
            Billing History
          </h1>
          <p className={`font-medium mt-1 ${textMuted}`}>View and manage all restaurant bills and receipts.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Bill or Order #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border font-medium focus:ring-2 outline-none transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-600' : 'bg-white border-gray-200 focus:ring-indigo-500'}`}
            />
          </div>
          {/* Filter */}
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border font-bold appearance-none outline-none focus:ring-2 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-600' : 'bg-white border-gray-200 focus:ring-indigo-500'}`}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Paid (Closed)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${bgCard} border ${borderCol} rounded-[2rem] shadow-sm overflow-hidden`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin w-12 h-12 mb-4 text-indigo-500" />
            <p className={`font-bold ${textMuted}`}>Loading bills...</p>
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Receipt size={36} className="text-gray-400" />
            </div>
            <h2 className={`text-2xl font-black ${textMain}`}>No Bills Found</h2>
            <p className={`font-medium ${textMuted} mt-2`}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderCol} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted}`}>Bill No</th>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted}`}>Date</th>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted}`}>Order / Table</th>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted}`}>Total</th>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted}`}>Status</th>
                  <th className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${textMuted} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filteredBills.map((bill) => (
                    <motion.tr 
                      key={bill.bill_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:${isDark ? 'bg-gray-800/80' : 'bg-gray-50'} transition-colors group cursor-pointer`}
                      onClick={() => navigate(`/billing/${bill.order_id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className={`font-black ${textMain}`}>{bill.bill_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${textMuted}`}>{new Date(bill.created_at).toLocaleDateString()}</span>
                        <span className={`block text-xs font-medium ${textMuted}`}>{new Date(bill.created_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${textMain}`}>Ord #{bill.order_id}</span>
                        {bill.table_id && <span className={`block text-xs font-medium ${textMuted}`}>Table {bill.table_id}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-black text-lg text-indigo-600 dark:text-indigo-400`}>₹{bill.grand_total}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(bill.bill_status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white shadow-sm hover:bg-indigo-50 hover:text-indigo-600'}`}
                          title="View Bill"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
