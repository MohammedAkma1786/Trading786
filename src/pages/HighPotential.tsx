
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, Rocket } from "lucide-react";
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
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-8">
          <div className="neo-brutal-card p-6">
            <p className="text-xl font-bold">Loading top performing cryptos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold">Top Performing Cryptos</h1>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Displaying the top 20 cryptocurrencies with the highest 24-hour price gains.
          </p>
        </div>

        <div className="neo-brutal-card p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>7d Change</TableHead>
                <TableHead>Volume (24h)</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptos?.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell className="font-medium">{crypto.name}</TableCell>
                  <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                  <TableCell>
                    {formatCurrency(crypto.current_price || 0)}
                  </TableCell>
                  <TableCell
                    className={
                      (crypto.price_change_24h || 0) >= 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600"
                    }
                  >
                    +{crypto.price_change_24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={
                      (crypto.price_change_7d || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {crypto.price_change_7d?.toFixed(2)}%
                  </TableCell>
                  <TableCell>{formatCurrency(crypto.volume_24h || 0)}</TableCell>
                  <TableCell>
                    {(crypto.price_change_7d || 0) > 0 &&
                    (crypto.price_change_24h || 0) > 0 ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Strong Uptrend
                      </span>
                    ) : (crypto.price_change_7d || 0) < 0 &&
                      (crypto.price_change_24h || 0) < 0 ? (
                      <span className="text-red-600">Downtrend</span>
                    ) : (
                      <span className="text-yellow-600">Mixed</span>
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
