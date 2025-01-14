import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getAsset, getAssetHistory } from "@/services/api";
import { PriceChart } from "@/components/PriceChart";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-brutal-card p-6">
          <p className="text-xl font-bold">Loading asset details...</p>
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
    <div className="container py-8 min-h-screen">
      <Link to="/" className="inline-flex items-center space-x-2 mb-8 neo-brutal-card px-4 py-2">
        <ArrowLeft size={20} />
        <span>Back to Assets</span>
      </Link>

      <div className="space-y-8">
        <div className="neo-brutal-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold">{asset.name}</h1>
              <p className="text-xl uppercase">{asset.symbol}</p>
            </div>
            <span className="text-xl font-bold">#{asset.rank}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm uppercase">Price</p>
              <p className="text-2xl font-bold">{formattedPrice}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase">24h Change</p>
              <p className={`text-2xl font-bold ${priceChange >= 0 ? "price-up" : "price-down"}`}>
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase">Market Cap</p>
              <p className="text-2xl font-bold">{formattedMarketCap}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase">24h Volume</p>
              <p className="text-2xl font-bold">{formattedVolume}</p>
            </div>
          </div>
        </div>

        <PriceChart data={history} />
      </div>
    </div>
  );
};

export default AssetDetail;