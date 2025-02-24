
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AssetHistory } from "@/services/api";

interface PriceChartProps {
  data: AssetHistory[];
}

export const PriceChart = ({ data }: PriceChartProps) => {
  const chartData = data.map((item) => ({
    time: new Date(item.time).getHours() + ":00",
    price: parseFloat(item.priceUsd),
    fullDate: new Date(item.time).toLocaleDateString(),
  }));

  return (
    <div className="h-[400px] w-full neo-brutal-card p-6 bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <h3 className="text-xl font-bold mb-4 text-violet-900">Price History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickLine={{ stroke: "#9CA3AF" }}
            axisLine={{ stroke: "#D1D5DB" }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickLine={{ stroke: "#9CA3AF" }}
            axisLine={{ stroke: "#D1D5DB" }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #8B5CF6",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelFormatter={(label) => `${chartData.find(item => item.time === label)?.fullDate} ${label}`}
            labelStyle={{ color: "#4B5563", fontWeight: "bold" }}
            itemStyle={{ color: "#8B5CF6" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
            fill="url(#priceGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
