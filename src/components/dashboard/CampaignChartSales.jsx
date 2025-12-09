import React, { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CampaignChartSales = ({ data }) => {
  const [viewMode, setViewMode] = useState('weekly')

  if (!data) return null

  const chartData = viewMode === 'weekly' ? data.weekly || [] : data.monthly || []

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p>No campaign data available</p>
      </div>
    )
  }

  const formattedData = chartData.map((item) => ({
    name: item.day || item.month,
    campaigns: item.count || 0,
  }))

  const isWeekly = viewMode === 'weekly'

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col px-4 pt-4 pb-4">
        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            {isWeekly ? (
              <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '11px' }} 
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '11px' }} 
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }} 
                  labelStyle={{ color: '#fff' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="campaigns" 
                  stroke="#ec4899" 
                  dot={false}
                  strokeWidth={2} 
                  name="Campaigns"
                />
              </LineChart>
            ) : (
              <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '11px' }} 
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  style={{ fontSize: '11px' }} 
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }} 
                  labelStyle={{ color: '#fff' }} 
                />
                <Line 
                  type="monotone"
                  dataKey="campaigns"
                  stroke="#a855f7"
                  dot={false}
                  strokeWidth={2}
                  name="Campaigns"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Clickable Legend Labels - Inside section, below chart */}
        <div className="flex items-center justify-center gap-8 py-10">
          <button
            onClick={() => setViewMode('weekly')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className={`w-3 h-3 rounded-sm ${isWeekly ? 'bg-pink-500' : 'bg-gray-600'}`}></div>
            <span className={`text-sm ${isWeekly ? 'text-gray-300' : 'text-gray-500'}`}>Weekly</span>
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className={`w-3 h-3 rounded-sm ${!isWeekly ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
            <span className={`text-sm ${!isWeekly ? 'text-gray-300' : 'text-gray-500'}`}>Monthly</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CampaignChartSales
export { CampaignChartSales }