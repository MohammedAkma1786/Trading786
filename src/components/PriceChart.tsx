
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  ReferenceLine,
} from "recharts";
import { AssetHistory } from "@/services/api";
import { useState } from "react";

interface PriceChartProps {
  data: AssetHistory[];
}

export const PriceChart = ({ data }: PriceChartProps) => {
  const [startIndex, setStartIndex] = useState<number | undefined>();
  const [endIndex, setEndIndex] = useState<number | undefined>();

  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString(),
    price: parseFloat(item.priceUsd),
    fullDate: new Date(item.time).toLocaleDateString(),
  }));

  const handleBrushChange = (data: any) => {
    if (data.startIndex !== undefined && data.endIndex !== undefined) {
      setStartIndex(data.startIndex);
      setEndIndex(data.endIndex);
    }
  };

  // Calculate min and max values for the visible data range
  const visibleData = startIndex !== undefined && endIndex !== undefined
    ? chartData.slice(startIndex, endIndex + 1)
    : chartData;

  const minPrice = Math.min(...visibleData.map(item => item.price));
  const maxPrice = Math.max(...visibleData.map(item => item.price));
  const priceRange = maxPrice - minPrice;
  const yAxisDomain = [
    minPrice - (priceRange * 0.05), // Add 5% padding
    maxPrice + (priceRange * 0.05)
  ];

  return (
    <div className="h-[500px] w-full neo-brutal-card p-6 bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-violet-900">Price History</h3>
        <div className="text-sm text-violet-700">
          Drag the slider below to zoom
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            vertical={false}
          />
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
            domain={yAxisDomain}
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
            labelFormatter={(label) => {
              const dataPoint = chartData.find(item => item.time === label);
              return dataPoint ? `${dataPoint.fullDate} ${dataPoint.time}` : label;
            }}
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
          <Brush
            dataKey="time"
            height={40}
            stroke="#8B5CF6"
            fill="#f5f3ff"
            onChange={handleBrushChange}
            tickFormatter={(tick) => {
              const date = chartData.find(item => item.time === tick)?.fullDate;
              return date || tick;
            }}
          >
            <LineChart>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8B5CF6"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
