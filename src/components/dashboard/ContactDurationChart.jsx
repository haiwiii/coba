import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  cellular: { label: "Cellular", color: "#a78bfa" },
  telephone: { label: "Telephone", color: "#a3e635" },
};

import { useDashboard } from "../../hooks/useDashboard";

export function ContactDurationChart() {
  const allKeys = ["cellular", "telephone"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) setVisibleKeys(allKeys);
    else setVisibleKeys([key]);
  };
  
  const { distData } = useDashboard();
  
  const data = Object.values(
    distData?.contactDuration.reduce((acc, { duration_bucket, contact_type, avg_duration }) => {
      if (!acc[duration_bucket]) acc[duration_bucket] = { name: duration_bucket, cellular: 0, telephone: 0 };

      if (contact_type === "cellular") acc[duration_bucket].cellular = avg_duration;
      else if (contact_type === "telephone") acc[duration_bucket].telephone = avg_duration;

      return acc;
    }, {})
  );

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barGap={2} barSize={13} margin={{ top: 30, bottom: 7 }}>
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
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {(() => {
          const LegendWithDuration = (props) => (
            <div className="flex flex-col items-center mt-2">
              <div className="text-xs text-gray-500 mb-2">Duration</div>
              <ChartLegendContent {...props} onItemClick={handleLegendClick} activeKeys={visibleKeys} />
            </div>
          );

          return <ChartLegend content={<LegendWithDuration />} />;
        })()}
        {visibleKeys.includes("cellular") && (
          <Bar dataKey="cellular" fill="#a78bfa" radius={[0, 0, 0, 0]} />
        )}
        {visibleKeys.includes("telephone") && (
          <Bar dataKey="telephone" fill="#a3e635" radius={[0, 0, 0, 0]} />
        )}
      </BarChart>
    </ChartContainer>
  );
}
