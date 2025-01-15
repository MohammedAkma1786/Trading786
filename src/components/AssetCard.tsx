import { Asset } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const priceChange = parseFloat(asset.changePercent24Hr);
  const formattedPrice = formatCurrency(parseFloat(asset.priceUsd));
  const formattedMarketCap = formatCurrency(parseFloat(asset.marketCapUsd));

  useEffect(() => {
    checkIfFavorited();
  }, []);

  const checkIfFavorited = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data } = await supabase
      .from("watchlists")
      .select("*")
      .eq("asset_id", asset.id)
      .maybeSingle();

    setIsFavorited(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add favorites",
          variant: "destructive",
        });
        return;
      }

      if (isFavorited) {
        await supabase
          .from("watchlists")
          .delete()
          .eq("asset_id", asset.id)
          .eq("user_id", session.session.user.id);
        
        toast({
          title: "Removed from favorites",
          description: `${asset.name} has been removed from your favorites`,
        });
      } else {
        // First ensure the asset exists in the assets table
        const { data: assetData, error: assetError } = await supabase
          .rpc('ensure_asset_exists', {
            p_asset_id: asset.id,
            p_symbol: asset.symbol,
            p_name: asset.name,
            p_current_price: parseFloat(asset.priceUsd),
            p_market_cap: parseFloat(asset.marketCapUsd),
            p_volume_24h: parseFloat(asset.volumeUsd24Hr),
            p_price_change_24h: parseFloat(asset.changePercent24Hr)
          });

        if (assetError) {
          throw assetError;
        }

        // Then add to watchlist
        await supabase.from("watchlists").insert({
          asset_id: asset.id,
          user_id: session.session.user.id,
        });

        toast({
          title: "Added to favorites",
          description: `${asset.name} has been added to your favorites`,
        });
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/asset/${asset.id}`}>
      <div className="neo-brutal-card p-6 cursor-pointer relative dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-between items-start w-full">
            <div>
              <h3 className="text-xl font-bold dark:text-white">{asset.name}</h3>
              <p className="text-sm uppercase dark:text-gray-300">{asset.symbol}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold dark:text-gray-300">#{asset.rank}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                disabled={isLoading}
                className="dark:hover:bg-gray-700"
              >
                <Star
                  className={`h-5 w-5 ${
                    isFavorited ? "fill-yellow-400 text-yellow-400" : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold dark:text-white">{formattedPrice}</p>
          <p className={priceChange >= 0 ? "price-up" : "price-down"}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </p>
          <p className="text-sm dark:text-gray-300">Market Cap: {formattedMarketCap}</p>
        </div>
      </div>
    </Link>
  );
};