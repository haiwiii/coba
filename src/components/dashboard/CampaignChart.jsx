import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  success: { label: "Success", color: "#10b981" },
  failure: { label: "Failure", color: "#ef4444" },
  others: { label: "Others", color: "#6366f1" },
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function CampaignChart({ data, selectedName = null }) {
  const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#64748b"];

  const total = data.reduce((s, d) => s + (d?.value || 0), 0);
  const selectedEntry = selectedName ? data.find((d) => d.name === selectedName) : null;
  const showingSelected = Boolean(selectedEntry && total > 0);
  const chartData = showingSelected
    ? [
        { name: selectedEntry.name, value: selectedEntry.value },
        { name: "Other", value: Math.max(0, total - selectedEntry.value), isRemainder: true },
      ]
    : data;

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[160px]">
      <ChartContainer
        config={chartConfig}
        className="w-[140px] h-[140px] xl:w-[180px] xl:h-[180px]"
      >
        <PieChart margin={{ top: 20, bottom: 5 }}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={0}
            outerRadius="100%"
            strokeWidth={0}
            label={(props) => {
              // when showing selected-only mode, only label the selected slice (index 0)
              const { index, percent } = props;
              if (showingSelected) {
                if (index !== 0) return null;
              } else {
                if (percent < 0.05) return null;
              }
              return renderCustomizedLabel(props);
            }}
            labelLine={false}
          >
            {chartData.map((entry, index) => {
              // ensure the original color is preserved for the selected item
              const originalIndex = data.findIndex((d) => d.name === entry.name);
              const fill = entry.isRemainder
                ? "#e6e6e6"
                : originalIndex >= 0
                ? COLORS[originalIndex % COLORS.length]
                : COLORS[index % COLORS.length];

              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
