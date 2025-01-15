import { Asset } from "@/services/api";
import { Link } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton";
import { PriceDisplay } from "./PriceDisplay";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const priceChange = parseFloat(asset.changePercent24Hr);
  const price = parseFloat(asset.priceUsd);
  const marketCap = parseFloat(asset.marketCapUsd);
  const volume24h = parseFloat(asset.volumeUsd24Hr);

  return (
    <Link to={`/asset/${asset.id}`}>
      <div className="neo-brutal-card p-4 md:p-6 cursor-pointer relative dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-between items-start w-full">
            <div>
              <h3 className="text-lg md:text-xl font-bold truncate dark:text-white">{asset.name}</h3>
              <p className="text-sm uppercase dark:text-gray-300">{asset.symbol}</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-sm font-bold dark:text-gray-300">#{asset.rank}</span>
              <FavoriteButton
                assetId={asset.id}
                assetName={asset.name}
                assetSymbol={asset.symbol}
                currentPrice={price}
                marketCap={marketCap}
                volume24h={volume24h}
                priceChange24h={priceChange}
              />
            </div>
          </div>
        </div>
        <PriceDisplay
          price={price}
          priceChange={priceChange}
          marketCap={marketCap}
        />
      </div>
    </Link>
  );
};