import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { AnalysisResult } from '@/lib/data-utils';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart3, PieChart as PieIcon, LayoutGrid, Database } from 'lucide-react';

interface IntelligenceDashboardProps {
  data: AnalysisResult;
}

const COLORS = ['#7C3AED', '#0891B2', '#F59E0B', '#10B981', '#F43F5E', '#8B5CF6'];

export const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({ data }) => {
  const numericHeaders = Object.keys(data.summary.columnStats).filter(h => data.summary.columnStats[h].type === 'numeric');
  const categoricalHeaders = Object.keys(data.summary.columnStats).filter(h => data.summary.columnStats[h].type === 'categorical');

  const renderChart = (type: string, index: number) => {
    switch (type) {
      case 'BarChart':
        if (categoricalHeaders.length && numericHeaders.length) {
          const chartData = data.rows.slice(0, 10);
          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey={categoricalHeaders[0]} stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey={numericHeaders[0]} fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case 'LineChart':
        if (numericHeaders.length) {
          const chartData = data.rows.slice(0, 20);
          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey={categoricalHeaders[0] || ''} stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey={numericHeaders[0]} stroke="#0891B2" strokeWidth={2} dot={false} />
                {numericHeaders[1] && <Line type="monotone" dataKey={numericHeaders[1]} stroke="#7C3AED" strokeWidth={2} dot={false} />}
              </LineChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case 'AreaChart':
        if (numericHeaders.length) {
          const chartData = data.rows.slice(0, 20);
          return (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey={categoricalHeaders[0] || ''} stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey={numericHeaders[0]} stroke="#7C3AED" fillOpacity={1} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case 'PieChart':
        if (categoricalHeaders.length) {
          const counts: Record<string, number> = {};
          data.rows.forEach(r => {
            const val = String(r[categoricalHeaders[0]]);
            counts[val] = (counts[val] || 0) + 1;
          });
          const chartData = Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 6);
          return (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Records" value={data.summary.totalRows.toLocaleString()} icon={<Database className="w-5 h-5 text-purple-400" />} />
        <MetricCard label="Dimensions" value={data.headers.length.toString()} icon={<LayoutGrid className="w-5 h-5 text-cyan-400" />} />
        <MetricCard label="Numeric Fields" value={numericHeaders.length.toString()} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
        <MetricCard label="Categorical Fields" value={categoricalHeaders.length.toString()} icon={<PieIcon className="w-5 h-5 text-amber-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.suggestedCharts.map((chartType, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-zinc-900/40 border-zinc-800 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  {chartType} Insight
                </h3>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Auto-Generated</div>
              </div>
              {renderChart(chartType, idx)}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <Card className="bg-zinc-900/40 border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
    <div className="p-3 bg-zinc-800/50 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </Card>
);
