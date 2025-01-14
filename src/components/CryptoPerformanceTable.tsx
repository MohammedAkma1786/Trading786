import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface CryptoPerformance {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_7d: number;
  market_cap: number;
  volume_24h: number;
  performance_score: number;
  future_potential_score: number;
}

export const CryptoPerformanceTable = () => {
  const { data: cryptoPerformance, isLoading } = useQuery({
    queryKey: ["cryptoPerformance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crypto_performance")
        .select("*")
        .order("performance_score", { ascending: false });

      if (error) throw error;
      return data as CryptoPerformance[];
    },
  });

  if (isLoading) {
    return (
      <div className="neo-brutal-card p-6">
        <p className="text-xl font-bold">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="neo-brutal-card p-4">
      <h2 className="text-2xl font-bold mb-4">Crypto Performance Analysis</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>7d Change</TableHead>
              <TableHead>Performance Score</TableHead>
              <TableHead>Future Potential</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoPerformance?.map((crypto) => (
              <TableRow key={crypto.id}>
                <TableCell className="font-medium">
                  {crypto.name} ({crypto.symbol})
                </TableCell>
                <TableCell>{formatCurrency(crypto.current_price)}</TableCell>
                <TableCell
                  className={
                    crypto.price_change_24h >= 0 ? "price-up" : "price-down"
                  }
                >
                  {crypto.price_change_24h >= 0 ? "+" : ""}
                  {crypto.price_change_24h.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={
                    crypto.price_change_7d >= 0 ? "price-up" : "price-down"
                  }
                >
                  {crypto.price_change_7d >= 0 ? "+" : ""}
                  {crypto.price_change_7d.toFixed(2)}%
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-violet-600 h-2.5 rounded-full"
                        style={{ width: `${crypto.performance_score}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{crypto.performance_score}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full"
                        style={{ width: `${crypto.future_potential_score}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{crypto.future_potential_score}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};