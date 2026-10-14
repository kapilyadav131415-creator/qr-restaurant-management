import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { feedbackApi } from '../api';
import { Star, MessageSquare, Utensils, User, Clock, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FeedbackPage = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const [stats, setStats] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const cardBg = isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, feedbackRes] = await Promise.all([
        feedbackApi.getFeedbackStats(),
        feedbackApi.getFeedback({ page, limit })
      ]);
      setStats(statsData);
      setFeedbacks(feedbackRes.data);
      setTotalPages(Math.ceil(feedbackRes.total / limit));
    } catch (error) {
      console.error("Failed to fetch feedback", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? "fill-current text-yellow-400" : "text-gray-200 dark:text-gray-700"} 
      />
    ));
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 className="w-12 h-12" style={{ color: primaryColor.value }} />
        </motion.div>
        <p className={`mt-4 font-bold ${textMuted} uppercase tracking-widest text-xs`}>Loading Insights...</p>
      </div>
    );
  }

  // Data for Chart
  const chartData = stats ? [
    { name: '5 Stars', count: parseInt(stats.rating_5) || 0, color: '#10B981' },
    { name: '4 Stars', count: parseInt(stats.rating_4) || 0, color: '#3B82F6' },
    { name: '3 Stars', count: parseInt(stats.rating_3) || 0, color: '#F59E0B' },
    { name: '2 Stars', count: parseInt(stats.rating_2) || 0, color: '#F97316' },
    { name: '1 Star', count: parseInt(stats.rating_1) || 0, color: '#EF4444' },
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 rounded-xl border shadow-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`font-bold text-sm ${textMain}`}>{label}</p>
          <p className="text-lg font-black" style={{ color: payload[0].payload.color }}>
            {payload[0].value} Reviews
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 p-2 rounded-xl">
              <Sparkles size={20} />
            </span>
            <h1 className={`text-3xl lg:text-4xl font-black ${textMain} tracking-tight`}>Customer Feedback</h1>
          </div>
          <p className={`${textMuted} font-medium text-sm lg:text-base max-w-xl`}>
            Track your restaurant's performance through customer ratings and reviews.
          </p>
        </div>
        
        {stats && (
          <div className={`px-6 py-4 rounded-2xl flex flex-col items-end border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-1`}>Overall Rating</span>
            <div className="flex items-center gap-3">
              <span className={`text-4xl font-black ${textMain}`}>{stats.avg_overall || '0.0'}</span>
              <Star className="fill-current text-yellow-400 w-8 h-8 drop-shadow-sm" />
            </div>
            <span className={`text-xs font-bold mt-1 ${textMuted}`}>Based on {stats.total_reviews} reviews</span>
          </div>
        )}
      </div>

      {stats && stats.total_reviews > 0 ? (
        <>
          {/* STATS & CHART GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SUB-RATINGS */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className={`text-sm font-bold uppercase tracking-widest ${textMuted} ml-2`}>Category Performance</h3>
              
              <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-5 ${cardBg} hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Utensils size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-bold ${textMain}`}>Food Quality</p>
                    <span className="font-black text-lg">{stats.avg_food || '0.0'}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${((stats.avg_food || 0) / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-5 ${cardBg} hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-bold ${textMain}`}>Service & Staff</p>
                    <span className="font-black text-lg">{stats.avg_service || '0.0'}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((stats.avg_service || 0) / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-3xl border shadow-sm flex items-center gap-5 ${cardBg} hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-bold ${textMain}`}>Ambiance</p>
                    <span className="font-black text-lg">{stats.avg_ambiance || '0.0'}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${((stats.avg_ambiance || 0) / 5) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className={`lg:col-span-2 p-6 md:p-8 rounded-[2rem] border shadow-sm ${cardBg} flex flex-col`}>
              <div className="flex justify-between items-center mb-8">
                <h3 className={`text-lg font-black ${textMain}`}>Rating Distribution</h3>
                <span className={`text-xs font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg ${textMuted}`}>
                  {stats.total_reviews} Total Reviews
                </span>
              </div>
              
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12, fontWeight: 700 }} width={60} />
                    <Tooltip cursor={{ fill: isDark ? '#374151' : '#F3F4F6' }} content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1500}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* REVIEWS LIST - MASONRY/GRID STYLE */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className={`text-xl font-black ${textMain}`}>Recent Feedback</h3>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  Page {page} of {totalPages}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {feedbacks.map((fb, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={fb.feedback_id || i} 
                    className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-lg transition-all ${cardBg} flex flex-col`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-black text-xl text-gray-500 dark:text-gray-300 shadow-inner">
                          {(fb.customer_name || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className={`font-black text-base ${textMain}`}>{fb.customer_name || 'Anonymous'}</h4>
                          <p className={`text-xs font-bold ${textMuted} flex items-center gap-1 mt-0.5`}>
                            <Clock size={12} /> {format(new Date(fb.created_at), 'MMM dd, yyyy • hh:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex items-center gap-1.5 shadow-sm">
                        <span className="font-black text-yellow-600 dark:text-yellow-500">{fb.rating_overall}.0</span>
                        <Star size={14} className="fill-current text-yellow-500" />
                      </div>
                    </div>
                    
                    {fb.comments ? (
                      <div className="flex-1 mt-2 mb-5">
                        <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          "{fb.comments}"
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 mt-2 mb-5 flex items-center">
                        <p className={`text-sm italic font-medium opacity-50 ${textMuted}`}>No comments provided.</p>
                      </div>
                    )}
                    
                    <div className={`mt-auto pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-100'} grid grid-cols-3 gap-2`}>
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1`}>Food</span>
                        <div className="flex">{renderStars(fb.rating_food || fb.rating_overall)}</div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1`}>Service</span>
                        <div className="flex">{renderStars(fb.rating_service || fb.rating_overall)}</div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1`}>Ambiance</span>
                        <div className="flex">{renderStars(fb.rating_ambiance || fb.rating_overall)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-sm ${
                    page === 1 
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed border-none' 
                      : `bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all shadow-sm ${
                        page === i + 1 
                          ? 'text-white' 
                          : `bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`
                      }`}
                      style={page === i + 1 ? { backgroundColor: primaryColor.value } : {}}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-sm ${
                    page === totalPages 
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed border-none' 
                      : `bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* EMPTY STATE */
        <div className={`mt-8 p-12 rounded-[2rem] border border-dashed text-center flex flex-col items-center justify-center min-h-[400px] ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className={`text-xl font-black ${textMain} mb-2`}>No Feedback Yet</h3>
          <p className={`${textMuted} max-w-sm font-medium`}>
            When customers leave feedback and ratings, they will appear here along with analytics and trends.
          </p>
        </div>
      )}

    </div>
  );
};

export default FeedbackPage;
