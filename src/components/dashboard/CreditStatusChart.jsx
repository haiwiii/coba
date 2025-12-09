import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  macet: { label: "Delinquent (Default)", color: "#F4CF3B" },
  lancar: { label: "Performing", color: "#8b5cf6" },
};

import { useDashboard } from "../../hooks/useDashboard";

export function CreditStatusChart() {
  const allKeys = ["macet", "lancar"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };
  const { distData } = useDashboard();

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={distData?.creditStatusDistribution || []} barGap={5} margin={{ top: 30, bottom: 10 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          // Show unit label for Y axis
          label={{ value: 'person', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        {/* Render legend with X-axis description placed above the legend items */}
        {(() => {
          const LegendWithLabel = (props) => (
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Balance range</div>
              <ChartLegendContent {...props} />
            </div>
          );
          return <ChartLegend content={<LegendWithLabel onItemClick={handleLegendClick} activeKeys={visibleKeys} />} />;
        })()}

        {/* Bar untuk Macet */}
        {visibleKeys.includes("macet") && (
          <Bar
            dataKey="macet"
            fill="#F4CF3B"
            radius={[0, 0, 0, 0]}
            barSize={40}
          >
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
        
        {/* Bar untuk Lancar */}
        {visibleKeys.includes("lancar") && (
          <Bar
            dataKey="lancar"
            fill="#8b5cf6"
            radius={[0, 0, 0, 0]}
            barSize={40}
          >
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
      </BarChart>
    </ChartContainer>
  );
}
