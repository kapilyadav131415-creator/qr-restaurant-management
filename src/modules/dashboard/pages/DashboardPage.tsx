import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, ArrowRight, Activity, DollarSign, ShoppingBag, Grid } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

const DashboardPage = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState('Today');
  const [stats, setStats] = useState<any>(null);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme constants
  const cardBg = isDark ? 'bg-gray-800 border-gray-700/50 shadow-gray-900/50' : 'bg-white border-gray-100 shadow-gray-200/50';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  
  // Chart Colors (Premium palette)
  const COLORS = [primaryColor.value, '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      let start = startOfDay(now);
      let end = endOfDay(now);

      if (timeFilter === 'This Week') {
        start = startOfWeek(now);
        end = endOfWeek(now);
      } else if (timeFilter === 'This Month') {
        start = startOfMonth(now);
        end = endOfMonth(now);
      }

      const sDate = format(start, 'yyyy-MM-dd');
      const eDate = format(end, 'yyyy-MM-dd');

      const [statsData, trendData, itemsData, categoryData, ordersData] = await Promise.all([
        dashboardApi.getStats(sDate, eDate),
        dashboardApi.getSalesTrend(sDate, eDate),
        dashboardApi.getTopItems(sDate, eDate),
        dashboardApi.getCategoryDistribution(sDate, eDate),
        dashboardApi.getRecentOrders()
      ]);

      setStats(statsData);
      setSalesTrend(trendData);
      setTopItems(itemsData);
      setCategoryDistribution(categoryData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) {
      if (current === 0) return { percent: '0%', isUp: true };
      return { percent: '+100%', isUp: true };
    }
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    return {
      percent: `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`,
      isUp: percent >= 0
    };
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: primaryColor.value }} />
      </div>
    );
  }

  const revTrend = stats ? calculateTrend(stats.revenue, stats.prev_revenue) : { percent: '0%', isUp: true };
  const ordTrend = stats ? calculateTrend(stats.orders, stats.prev_orders) : { percent: '0%', isUp: true };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl border shadow-xl ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
          <p className="font-bold mb-2">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || p.payload.fill || primaryColor.value }}></span>
              {p.name}: <span className="font-black">{p.name.toLowerCase().includes('revenue') ? '₹' : ''}{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className={`text-4xl font-black ${textMain} tracking-tight`}>Dashboard</h1>
          <p className={`${textMuted} font-medium mt-1 text-lg`}>Welcome back, here's your business overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border ${cardBg} outline-none cursor-pointer focus:ring-2 transition-all hover:-translate-y-0.5`}
            style={{ focusRingColor: primaryColor.value }}
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button 
            onClick={() => navigate('/reports')}
            className="px-6 py-2.5 text-white rounded-xl text-sm font-bold shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            style={{ backgroundColor: primaryColor.value }}
          >
            Full Reports <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.revenue.toLocaleString()}`} 
            trend={revTrend} 
            icon={<DollarSign size={24} />} 
            color={primaryColor.value} 
            isDark={isDark} 
          />
          <StatCard 
            title="Total Orders" 
            value={stats.orders} 
            trend={ordTrend} 
            icon={<ShoppingBag size={24} />} 
            color="#3B82F6" 
            isDark={isDark} 
          />
          <StatCard 
            title="Active Tables" 
            value={`${stats.active_tables} / ${stats.total_tables}`} 
            subtitle={stats.active_tables / (stats.total_tables || 1) > 0.8 ? 'High Load' : 'Normal'}
            subtitleColor={stats.active_tables / (stats.total_tables || 1) > 0.8 ? 'text-orange-500' : 'text-blue-500'}
            icon={<Grid size={24} />} 
            color="#F59E0B" 
            isDark={isDark} 
          />
          <StatCard 
            title="Avg Order Value" 
            value={`₹${stats.orders > 0 ? Math.round(stats.revenue / stats.orders) : 0}`} 
            subtitle="Per Order"
            subtitleColor="text-purple-500"
            icon={<Activity size={24} />} 
            color="#8B5CF6" 
            isDark={isDark} 
          />
        </div>
      )}

      {/* Charts Section 1: Revenue Trend (Wide) */}
      <div className={`p-8 rounded-[2rem] border shadow-xl ${cardBg} transition-all hover:shadow-2xl`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-xl font-bold ${textMain} tracking-tight`}>Revenue & Orders Trend</h3>
        </div>
        <div className="h-[350px] w-full">
          {salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor.value} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={primaryColor.value} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 13, fontWeight: 600 }} 
                  dy={15}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return format(d, timeFilter === 'This Month' ? 'dd MMM' : 'EEE');
                  }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 13, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={primaryColor.value} strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className={`text-lg font-medium ${textMuted}`}>No sales data available for {timeFilter.toLowerCase()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section 2: Distribution & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Distribution (Pie Chart) */}
        <div className={`p-8 rounded-[2rem] border shadow-xl ${cardBg} transition-all hover:shadow-2xl`}>
          <h3 className={`text-xl font-bold ${textMain} tracking-tight mb-8`}>Category Sales Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-lg font-medium ${textMuted}`}>No category data available</p>
            )}
          </div>
          {/* Custom Legend */}
          {categoryDistribution.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className={`text-sm font-bold ${textMain}`}>{entry.name} <span className={textMuted}>({entry.value})</span></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Items (Bar Chart) */}
        <div className={`p-8 rounded-[2rem] border shadow-xl ${cardBg} transition-all hover:shadow-2xl`}>
          <h3 className={`text-xl font-bold ${textMain} tracking-tight mb-8`}>Top Selling Items</h3>
          <div className="h-[300px] w-full">
            {topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItems} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDark ? '#f3f4f6' : '#111827', fontSize: 13, fontWeight: 700 }} 
                    width={120}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{fill: isDark ? '#374151' : '#f3f4f6'}} />
                  <Bar dataKey="sales" name="Items Sold" radius={[0, 8, 8, 0]} barSize={24}>
                    {topItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className={`text-lg font-medium ${textMuted}`}>No items sold yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Orders Section */}
      <div className={`p-8 rounded-[2rem] border shadow-xl ${cardBg} overflow-hidden flex flex-col transition-all hover:shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textMain} tracking-tight flex items-center gap-2`}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: primaryColor.value }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: primaryColor.value }}></span>
            </span>
            Live Orders
          </h3>
          <button 
            onClick={() => navigate('/live-orders')} 
            className="text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl" 
            style={{ color: primaryColor.value }}
          >
            View Live Screen <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
                <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted} rounded-tl-xl rounded-bl-xl`}>Order ID</th>
                <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted}`}>Customer</th>
                <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted}`}>Items</th>
                <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted}`}>Total</th>
                <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted} rounded-tr-xl rounded-br-xl`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                <tr key={i} className={`hover:${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors group cursor-pointer`}>
                  <td className={`py-5 px-6 text-sm font-black ${textMain}`}>{order.id}</td>
                  <td className="py-5 px-6 text-sm">
                    <p className={`font-bold ${textMain} text-base`}>{order.customer}</p>
                    <p className={`text-xs font-medium ${textMuted} mt-1`}>{format(new Date(order.time), 'hh:mm a')}</p>
                  </td>
                  <td className={`py-5 px-6 text-sm font-bold ${textMuted}`}>{order.items} items</td>
                  <td className={`py-5 px-6 text-base font-black ${textMain}`}>₹{order.total}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider
                      ${order.status === 'served' || order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        order.status === 'received' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className={`py-16 text-center text-base font-bold ${textMuted}`}>No recent orders right now.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// Extracted Component for Stats Card to keep code clean
const StatCard = ({ title, value, trend, icon, color, subtitle, subtitleColor, isDark }: any) => {
  const cardBg = isDark ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`p-6 rounded-[2rem] border shadow-xl ${cardBg} relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" style={{ color }}>
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>{title}</h3>
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between mt-2 relative z-10">
        <p className={`text-4xl font-black ${textMain} tracking-tight`}>{value}</p>
        
        {trend ? (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1.5 rounded-lg backdrop-blur-sm
            ${trend.isUp ? 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {trend.isUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {trend.percent}
          </span>
        ) : subtitle ? (
          <span className={`text-xs font-bold px-2 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 ${subtitleColor}`}>
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardPage;