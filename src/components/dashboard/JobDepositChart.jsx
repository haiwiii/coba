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
  deposit: { label: "Total Deposit", color: "#5FCBE3" }, // Cyan
};

export function JobDepositChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 30, bottom: 5 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="name" // Pastikan data yang dikirim punya key 'name'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          // X-axis description
          label={{ value: 'Job', position: 'bottom', dy: 18, fill: '#6b7280', style: { fontSize: 12 } }}
          tickFormatter={(value) =>
            value.length > 10 ? `${value.slice(0, 10)}...` : value
          }
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          // Show unit label for Y axis
          label={{ value: 'person', angle: -90, position: 'insideLeft', dx: 0, fill: '#6b7280', style: { fontSize: 12 } }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="deposit"
          fill="#5FCBE3"
          radius={[0, 0, 0, 0]}
          barSize={60}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-gray-600 text-xs"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
