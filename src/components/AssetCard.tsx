import { Asset } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const priceChange = parseFloat(asset.changePercent24Hr);
  const formattedPrice = formatCurrency(parseFloat(asset.priceUsd));
  const formattedMarketCap = formatCurrency(parseFloat(asset.marketCapUsd));

  return (
    <Link to={`/asset/${asset.id}`}>
      <div className="neo-brutal-card p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{asset.name}</h3>
            <p className="text-sm uppercase">{asset.symbol}</p>
          </div>
          <span className="text-sm font-bold">#{asset.rank}</span>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{formattedPrice}</p>
          <p className={priceChange >= 0 ? "price-up" : "price-down"}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </p>
          <p className="text-sm">
            Market Cap: {formattedMarketCap}
          </p>
        </div>
      </div>
    </Link>
  );
};