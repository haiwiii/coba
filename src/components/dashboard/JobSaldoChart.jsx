import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  saldo: { label: "Average Saldo", color: "#fcd34d" },
};

export function JobSaldoChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-[600px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 40 }}
      >
        <CartesianGrid
          horizontal={true}
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis type="number" hide />
        <YAxis
          dataKey="job"
          type="category"
          tickLine={false}
          axisLine={false}
          width={100}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="saldo" fill="#fcd34d" radius={[0, 0, 0, 0]} barSize={60}>
          <LabelList
            dataKey="saldo"
            position="right"
            className="fill-gray-600"
            fontSize={12}
            formatter={(value) => value.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
