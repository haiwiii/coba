import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  daily: {
    label: "Weekly",
    color: "#fcd34d",
  },
  monthly: {
    label: "Monthly",
    color: "#2dd4bf",
  },
};

function AlwaysVisibleLegend({ active, onClick }) {
  const items = [
    { key: "daily", label: "Weekly", color: "#fcd34d" },
    { key: "monthly", label: "Monthly", color: "#2dd4bf" },
  ];

  return (
    <div className="flex justify-center gap-8 mt-2">
      {items.map((item) => (
        <div
          key={item.key}
          className={`flex items-center gap-2 cursor-pointer transition-opacity select-none ${
            active === item.key ? "opacity-100" : "opacity-40"
          }`}
          onClick={() => onClick(item.key)}
        >
          {/* Color indicator square */}
          <span
            className="inline-block w-3 h-3 rounded-sm shadow-sm"
            style={{ backgroundColor: item.color }}
          />

          {/* Label */}
          <span className="text-sm text-white">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data }) {
  const allKeys = ["daily", "monthly"];
  const [visibleKeys, setVisibleKeys] = useState(allKeys[0]);

  const handleLegendClick = (key) => {
    // toggle: if clicked key is already visible, show the other; else show clicked
    setVisibleKeys((prev) => (prev === key ? allKeys.find((k) => k !== key) : key));
  };

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <LineChart
        accessibilityLayer
        data={visibleKeys === "daily" ? data.daily : data.monthly}
        margin={{ left: 12, right: 12, top: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" />
        {visibleKeys === "daily" && (
          <XAxis
          dataKey="dayName"
          tickLine={false}
          axisLine={false}
          tickMargin={15}
          tick={{ fill: "#9ca3af" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />)}
        {visibleKeys === "monthly" && (
          <XAxis
          dataKey="monthName"
          tickLine={false}
          axisLine={false}
          tickMargin={15}
          tick={{ fill: "#9ca3af" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />)}
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9ca3af" }}
          width={40}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        {visibleKeys === "daily" && (
          <Line
            dataKey="daily"
            type="monotone"
            stroke="var(--color-daily)"
            strokeWidth={3}
            dot={false}
          />
        )}
        {visibleKeys === "monthly" && (
          <Line
            dataKey="monthly"
            type="monotone"
            stroke="var(--color-monthly)"
            strokeWidth={3}
            dot={false}
          />
        )}

        <ChartLegend
          content={
            <AlwaysVisibleLegend
              active={visibleKeys}
              onClick={handleLegendClick}
            />
          }
          className="text-white mt-4"
        />
      </LineChart>
    </ChartContainer>
  );
}
