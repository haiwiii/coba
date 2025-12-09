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
  jumlah: { label: "Total", color: "#3b82f6" },
};

export function ContactTypeChart() {
  const { distData } = useDashboard();

  // map backend contactDistribution -> { name, jumlah }
  const data = (distData?.contactDistribution || []).map((item) => ({
    name: item.contact ? String(item.contact).charAt(0).toUpperCase() + String(item.contact).slice(1) : item.contact,
    jumlah: item.total_contacted || 0,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data} barSize={80} margin={{ top: 30, bottom: 5 }}>
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
          // Y-axis description moved outside to avoid clipping
          label={{ value: 'Frequency', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="jumlah" fill="#3b82f6" radius={[0, 0, 0, 0]}>
          <LabelList position="top" offset={12} style={{ fill: '#374151', fontSize: 12 }} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
