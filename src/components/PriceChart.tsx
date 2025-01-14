import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AssetHistory } from "@/services/api";

interface PriceChartProps {
  data: AssetHistory[];
}

export const PriceChart = ({ data }: PriceChartProps) => {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString(),
    price: parseFloat(item.priceUsd),
  }));

  return (
    <div className="h-[400px] w-full neo-brutal-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="time"
            stroke="#000000"
            tick={{ fill: "#000000" }}
          />
          <YAxis
            stroke="#000000"
            tick={{ fill: "#000000" }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #000000",
              borderRadius: "0px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};