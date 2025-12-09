import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import { useDashboard } from "../../hooks/useDashboard";

const chartConfig = {
  contacted: { label: "Contacted", color: "#a78bfa" },
  subscribed: { label: "Subscribed", color: "#fca5a5" },
};

export function ContactDistributionChart() {
  const allKeys = ["contacted", "subscribed"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };
  const { distData } = useDashboard();

  // Use backend monthly promotion trends - show total contacted and subscribed per month
  const monthly = distData?.promotionTrends?.monthly || [];
  const data = monthly.map((m) => ({
    name: String(m.month).charAt(0).toUpperCase() + String(m.month).slice(1),
    contacted: m.total_contacted || 0,
    subscribed: m.subscribed || 0,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart accessibilityLayer data={data} margin={{ top: 30, bottom: 5 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          // Y-axis description label
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent onItemClick={handleLegendClick} activeKeys={visibleKeys} />} />
        {visibleKeys.includes("contacted") && (
          <Area
            type="monotone"
            dataKey="contacted"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.3}
          />
        )}
        {visibleKeys.includes("subscribed") && (
          <Area
            type="monotone"
            dataKey="subscribed"
            stroke="#fca5a5"
            fill="#fca5a5"
            fillOpacity={0.3}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
