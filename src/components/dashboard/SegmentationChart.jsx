import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  priority: { label: "Priority", color: "#fbbf24" },
  nonPriority: { label: "Not Priority", color: "#2dd4bf" },
  others: { label: "Others", color: "#a78bfa" },
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

  // Hanya tampilkan jika persentasenya di atas 5% agar tidak menumpuk
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

export function SegmentationChart({ data, selectedName = null }) {
  const COLORS = ["#fbbf24", "#2dd4bf", "#a78bfa"];  

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
        className="w-[140px] h-[140px] xl:w-[170px] xl:h-[170px]"
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
              const { index, percent } = props;
              if (showingSelected) {
                if (index !== 0) return null;
              } else {
                if (percent < 0.05) return null;
              }
              return renderCustomizedLabel(props);
            }} // <--- shows label only for selected slice when filtered
            labelLine={false}
          >
            {chartData.map((entry, index) => {
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
