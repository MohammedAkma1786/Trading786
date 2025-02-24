
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="neo-brutal-card p-6 bg-white/90 backdrop-blur-sm">
            <p className="text-xl font-bold text-violet-900">Loading asset details...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 mb-8 neo-brutal-card px-4 py-2 text-violet-900 hover:text-violet-700"
        >
          <ArrowLeft size={20} />
          <span>Back to Assets</span>
        </Link>

        <div className="space-y-8">
          <div className="neo-brutal-card p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold gradient-text">{asset.name}</h1>
                <p className="text-xl uppercase text-violet-700">{asset.symbol}</p>
              </div>
              <span className="text-xl font-bold text-violet-900 bg-violet-100 px-3 py-1 rounded-full">
                #{asset.rank}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm border border-violet-100">
                <p className="text-sm uppercase text-violet-700">Price</p>
                <p className="text-2xl font-bold text-violet-900">{formattedPrice}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm border border-violet-100">
                <p className="text-sm uppercase text-violet-700">24h Change</p>
                <p className={`text-2xl font-bold ${priceChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm border border-violet-100">
                <p className="text-sm uppercase text-violet-700">Market Cap</p>
                <p className="text-2xl font-bold text-violet-900">{formattedMarketCap}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg backdrop-blur-sm border border-violet-100">
                <p className="text-sm uppercase text-violet-700">24h Volume</p>
                <p className="text-2xl font-bold text-violet-900">{formattedVolume}</p>
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
