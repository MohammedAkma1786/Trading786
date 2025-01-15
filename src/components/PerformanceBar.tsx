interface PerformanceBarProps {
  value: number;
  color: "violet" | "emerald";
}

export const PerformanceBar = ({ value, color }: PerformanceBarProps) => {
  const colorClass = color === "violet" ? "bg-violet-600" : "bg-emerald-500";
  
  return (
    <div className="flex items-center">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className="ml-2">{value}%</span>
    </div>
  );
};