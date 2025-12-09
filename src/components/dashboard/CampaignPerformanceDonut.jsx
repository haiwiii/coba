import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  completed: { label: "Completed", color: "#a855f7" },
  remaining: { label: "Remaining", color: "#64748b" },
};

// Custom tooltip to prevent overlap - positioned to the left
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white shadow-lg z-50 pointer-events-none">
      <p className="font-semibold">{data.name}</p>
      <p className="text-slate-300">{data.value}</p>
    </div>
  );
};

export const CampaignPerformanceDonut = ({ data = {} }) => {
  // Hooks must be called unconditionally at the top of the component
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'weekly' | 'month'

  // determine completed based on viewMode. Compute weekly/monthly inside the memo
  const completed = useMemo(() => {
    const weekly = data.weekly || [];
    const monthly = data.monthly || [];

    if (viewMode === 'month') {
      return monthly.reduce((s, m) => s + (Number(m.count || 0)), 0);
    }

    if (viewMode === 'weekly') {
      return weekly.reduce((s, w) => s + (Number(w.count || 0)), 0);
    }

    // today: try to find today's entry by weekday name, fallback to last weekly value
    const todayName = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const found = weekly.find((w) => (w.day && String(w.day).toLowerCase() === todayName) || (w.name && String(w.name).toLowerCase() === todayName));
    if (found) return Number(found.count || 0);
    if (weekly.length > 0) return Number(weekly[weekly.length - 1].count || 0);
    return 0;
  }, [viewMode, data.weekly, data.monthly]);

  const defaultTarget = data.performance?.taskTarget || 100;
  const [taskTarget, setTaskTarget] = useState(defaultTarget);

  const target = Number(taskTarget) || 0;
  const remaining = Math.max(target - completed, 0);
  const rawPercentage = target > 0 ? Math.round((completed / target) * 100) : 0;
  const performancePercentage = Math.min(100, rawPercentage);

  const chartData = [
    { name: 'Completed', value: completed, fill: '#a855f7' },
    { name: 'Remaining', value: remaining, fill: '#64748b' },
  ];

  const filteredData = chartData.filter((i) => i.value > 0);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-end gap-3 mb-2">
        <button
          onClick={() => setViewMode('today')}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'today' ? 'bg-purple-600 text-white border-b-2 border-purple-400 font-semibold' : 'bg-gray-600/40 text-gray-300 hover:bg-gray-600/60'}`}>
          Daily
        </button>
        <button
          onClick={() => setViewMode('weekly')}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'weekly' ? 'bg-purple-600 text-white border-b-2 border-purple-400 font-semibold' : 'bg-gray-600/40 text-gray-300 hover:bg-gray-600/60'}`}>
          Weekly
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${viewMode === 'month' ? 'bg-purple-600 text-white border-b-2 border-purple-400 font-semibold' : 'bg-gray-600/40 text-gray-300 hover:bg-gray-600/60'}`}>
          Monthly
        </button>
      </div>

      <div className="relative">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={filteredData.length > 0 ? filteredData : chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {(filteredData.length > 0 ? filteredData : chartData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl font-bold text-purple-500">{performancePercentage}%</div>
          <div className="text-xs text-gray-400 mt-1">Performance Rate</div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a855f7' }} />
          <span className="text-sm text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#64748b' }} />
          <span className="text-sm text-gray-400">Remaining</span>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md">
        <div className="grid grid-cols-2 gap-8 items-stretch">
          <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center justify-center h-24">
            <div className="text-3xl font-bold text-white mb-3">{completed}</div>
            <div className="text-xs text-gray-400">Campaigns Done</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 flex flex-col items-center justify-center h-24">
            <input
              type="number"
              min="1"
              value={taskTarget}
              onChange={(e) => setTaskTarget(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-20 text-black rounded px-2 py-2 text-center text-sm mb-3"
              aria-label="Set campaign target"
            />
            <div className="text-xs text-gray-400">Target Campaign (input)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPerformanceDonut;