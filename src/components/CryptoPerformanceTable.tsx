
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CryptoTableRow } from "./CryptoTableRow";
import { TrendingUp } from "lucide-react";

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
        .order("price_change_24h", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as CryptoPerformance[];
    },
  });

  if (isLoading) {
    return (
      <div className="neo-brutal-card p-4 md:p-6 bg-gradient-to-br from-violet-50 to-purple-100">
        <p className="text-xl font-bold text-violet-900">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="neo-brutal-card p-4 bg-gradient-to-br from-violet-50 to-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-violet-600" />
        <h2 className="text-xl md:text-2xl font-bold text-violet-900">
          Top Performing Cryptocurrencies
        </h2>
      </div>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[800px] md:w-full">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-violet-200">
                <TableHead className="text-violet-900">Name</TableHead>
                <TableHead className="hidden md:table-cell text-violet-900">Current Price</TableHead>
                <TableHead className="text-violet-900">24h Change</TableHead>
                <TableHead className="hidden md:table-cell text-violet-900">7d Change</TableHead>
                <TableHead className="text-violet-900">Performance Score</TableHead>
                <TableHead className="hidden md:table-cell text-violet-900">Future Potential</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptoPerformance?.map((crypto) => (
                <CryptoTableRow key={crypto.id} crypto={crypto} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
