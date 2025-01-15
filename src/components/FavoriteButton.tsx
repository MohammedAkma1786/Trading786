import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  assetId: string;
  assetName: string;
  assetSymbol: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
}

export const FavoriteButton = ({
  assetId,
  assetName,
  assetSymbol,
  currentPrice,
  marketCap,
  volume24h,
  priceChange24h,
}: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfFavorited();
  }, []);

  const checkIfFavorited = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data } = await supabase
      .from("watchlists")
      .select("*")
      .eq("asset_id", assetId)
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
          .eq("asset_id", assetId)
          .eq("user_id", session.session.user.id);
        
        toast({
          title: "Removed from favorites",
          description: `${assetName} has been removed from your favorites`,
        });
      } else {
        const { data: assetData, error: assetError } = await supabase
          .rpc('ensure_asset_exists', {
            p_asset_id: assetId,
            p_symbol: assetSymbol,
            p_name: assetName,
            p_current_price: currentPrice,
            p_market_cap: marketCap,
            p_volume_24h: volume24h,
            p_price_change_24h: priceChange24h
          });

        if (assetError) {
          throw assetError;
        }

        await supabase.from("watchlists").insert({
          asset_id: assetId,
          user_id: session.session.user.id,
        });

        toast({
          title: "Added to favorites",
          description: `${assetName} has been added to your favorites`,
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
  );
};