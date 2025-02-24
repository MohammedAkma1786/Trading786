
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getAsset, getAssetHistory } from "@/services/api";
import { PriceChart } from "@/components/PriceChart";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id!),
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistory(id!),
  });

  if (assetLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="neo-brutal-card p-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43]">
            <p className="text-xl font-bold text-[#333333] dark:text-[#F1F0FB]">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset || !history) return null;

  const priceChange = parseFloat(asset.changePercent24Hr);
  const formattedPrice = formatCurrency(parseFloat(asset.priceUsd));
  const formattedMarketCap = formatCurrency(parseFloat(asset.marketCapUsd));
  const formattedVolume = formatCurrency(parseFloat(asset.volumeUsd24Hr));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EFE6] to-[#D4C9B9] dark:bg-[#1A1F2C]">
      <Navbar />
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 mb-8 neo-brutal-card px-4 py-2 text-[#333333] hover:text-[#6E59A5] dark:text-[#F1F0FB] dark:hover:text-[#1EAEDB]"
        >
          <ArrowLeft size={20} />
          <span>Back to Assets</span>
        </Link>

        <div className="space-y-8">
          <div className="neo-brutal-card p-6 bg-white/90 border-[#6E59A5] dark:bg-[#221F26] dark:border-[#403E43] backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6E59A5] to-[#7E69AB] dark:from-[#1EAEDB] dark:to-[#0EA5E9] bg-clip-text text-transparent">{asset.name}</h1>
                <p className="text-xl uppercase text-[#6E59A5] dark:text-[#1EAEDB]">{asset.symbol}</p>
              </div>
              <span className="text-xl font-bold text-[#333333] dark:text-[#F1F0FB] bg-[#E8EFE6] dark:bg-[#403E43] px-3 py-1 rounded-full">
                #{asset.rank}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-white/90 dark:bg-[#403E43]/50 rounded-lg backdrop-blur-sm border border-[#6E59A5] dark:border-[#403E43]">
                <p className="text-sm uppercase text-[#6E59A5] dark:text-[#1EAEDB]">Price</p>
                <p className="text-2xl font-bold text-[#333333] dark:text-[#F1F0FB]">{formattedPrice}</p>
              </div>
              <div className="p-4 bg-white/90 dark:bg-[#403E43]/50 rounded-lg backdrop-blur-sm border border-[#6E59A5] dark:border-[#403E43]">
                <p className="text-sm uppercase text-[#6E59A5] dark:text-[#1EAEDB]">24h Change</p>
                <p className={`text-2xl font-bold ${priceChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-white/90 dark:bg-[#403E43]/50 rounded-lg backdrop-blur-sm border border-[#6E59A5] dark:border-[#403E43]">
                <p className="text-sm uppercase text-[#6E59A5] dark:text-[#1EAEDB]">Market Cap</p>
                <p className="text-2xl font-bold text-[#333333] dark:text-[#F1F0FB]">{formattedMarketCap}</p>
              </div>
              <div className="p-4 bg-white/90 dark:bg-[#403E43]/50 rounded-lg backdrop-blur-sm border border-[#6E59A5] dark:border-[#403E43]">
                <p className="text-sm uppercase text-[#6E59A5] dark:text-[#1EAEDB]">24h Volume</p>
                <p className="text-2xl font-bold text-[#333333] dark:text-[#F1F0FB]">{formattedVolume}</p>
              </div>
            </div>
          </div>

          <PriceChart data={history} />
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
