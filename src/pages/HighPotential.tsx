
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HighPotential = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ["high-potential-cryptos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crypto_performance")
        .select("*")
        .order("price_change_24h", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
        <Navbar />
        <div className="container py-8">
          <div className="neo-brutal-card p-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
            <p className="text-xl font-bold text-[#333333] dark:text-[#F1F0FB]">Loading top performing cryptos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-8 h-8 text-[#6E59A5] dark:text-[#1EAEDB]" />
          <h1 className="text-4xl font-bold text-[#333333] dark:text-[#F1F0FB]">Top Performing Cryptos</h1>
        </div>

        <div className="mb-6">
          <p className="text-lg text-[#555555] dark:text-[#8E9196]">
            Displaying the top 20 cryptocurrencies with the highest 24-hour price gains.
          </p>
        </div>

        <div className="neo-brutal-card p-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#6E59A5] dark:border-[#403E43]">
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">Name</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">Symbol</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">Current Price</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">24h Change</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">7d Change</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">Volume (24h)</TableHead>
                <TableHead className="text-[#333333] dark:text-[#F1F0FB]">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptos?.map((crypto) => (
                <TableRow key={crypto.id} className="border-[#6E59A5] dark:border-[#403E43]">
                  <TableCell className="font-medium text-[#333333] dark:text-[#F1F0FB]">{crypto.name}</TableCell>
                  <TableCell className="text-[#333333] dark:text-[#F1F0FB]">{crypto.symbol.toUpperCase()}</TableCell>
                  <TableCell className="text-[#333333] dark:text-[#F1F0FB]">
                    {formatCurrency(crypto.current_price || 0)}
                  </TableCell>
                  <TableCell
                    className={
                      (crypto.price_change_24h || 0) >= 0
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    +{crypto.price_change_24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={
                      (crypto.price_change_7d || 0) >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {crypto.price_change_7d?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-[#333333] dark:text-[#F1F0FB]">{formatCurrency(crypto.volume_24h || 0)}</TableCell>
                  <TableCell>
                    {(crypto.price_change_7d || 0) > 0 &&
                    (crypto.price_change_24h || 0) > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Strong Uptrend
                      </span>
                    ) : (crypto.price_change_7d || 0) < 0 &&
                      (crypto.price_change_24h || 0) < 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">Downtrend</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">Mixed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HighPotential;
