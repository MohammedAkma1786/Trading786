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
      .single();

    setIsFavorited(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
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
        // Remove from favorites
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
        // Add to favorites
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
      <div className="neo-brutal-card p-6 cursor-pointer relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Star
            className={`h-5 w-5 ${
              isFavorited ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          />
        </Button>
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
          <p className="text-sm">Market Cap: {formattedMarketCap}</p>
        </div>
      </div>
    </Link>
  );
};