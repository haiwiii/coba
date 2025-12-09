import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

import { useDashboard } from "../../hooks/useDashboard";

const chartConfig = {
  success: { label: "Success", color: "#a78bfa" },
  failure: { label: "Failure", color: "#C21111" },
  other: { label: "Other", color: "#C4C4C4" },
};

export function ContactEfectivityChart() {
  const { distData } = useDashboard();

  // distData.contactEffectivity contains entries grouped by contact + poutcome
  // we'll transform this into per-contact totals for success/failure/other
  const raw = distData?.contactEffectivity || [];
  const grouped = {};

  raw.forEach((item) => {
    const contact = item.contact || 'Unknown';
    if (!grouped[contact]) grouped[contact] = { name: String(contact).charAt(0).toUpperCase() + String(contact).slice(1), success: 0, failure: 0, other: 0 };

    const count = item.total_nasabah || 0;
    if (item.poutcome === 'success') grouped[contact].success += count;
    else if (item.poutcome === 'failure') grouped[contact].failure += count;
    else grouped[contact].other += count;
  });

  const data = Object.values(grouped);

  const allKeys = ["success", "failure", "other"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys);

  const handleLegendClick = (key) => {
    if (visibleKeys.length === 1 && visibleKeys[0] === key) {
      setVisibleKeys(allKeys); // restore all
    } else {
      setVisibleKeys([key]);
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barSize={50} margin={{ top: 30, bottom: 5 }}>
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
          // Y-axis description label moved outside to avoid clipping
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent onItemClick={handleLegendClick} activeKeys={visibleKeys} />} />
        {visibleKeys.includes("success") && (
          <Bar dataKey="success" fill="#a78bfa" radius={[0, 0, 0, 0]}>
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
        {visibleKeys.includes("failure") && (
          <Bar dataKey="failure" fill="#C21111" radius={[0, 0, 0, 0]}>
            <LabelList position="top" offset={8} className="fill-gray-600 text-xs" />
          </Bar>
        )}
      </BarChart>
    </ChartContainer>
  );
}
