import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AssetCard } from "@/components/AssetCard";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface FavoriteAsset {
  assets: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    volume_24h: number;
    price_change_24h: number;
  };
}

const Favorites = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = '/profile';
        return;
      }
      setUserId(session.user.id);
    };
    checkUser();
  }, []);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('watchlists')
        .select(`
          assets (
            id,
            symbol,
            name,
            current_price,
            market_cap,
            volume_24h,
            price_change_24h
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as FavoriteAsset[];
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="neo-brutal-card p-6 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-xl font-bold dark:text-white">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Star className="h-8 w-8 text-yellow-400" />
          <h1 className="text-4xl font-bold dark:text-white">Your Favorites</h1>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              if (!favorite.assets) return null;
              return (
                <AssetCard
                  key={favorite.assets.id}
                  asset={{
                    id: favorite.assets.id,
                    symbol: favorite.assets.symbol,
                    name: favorite.assets.name,
                    priceUsd: favorite.assets.current_price.toString(),
                    marketCapUsd: favorite.assets.market_cap.toString(),
                    volumeUsd24Hr: favorite.assets.volume_24h.toString(),
                    changePercent24Hr: favorite.assets.price_change_24h.toString(),
                    rank: "N/A",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="neo-brutal-card p-6 text-center dark:bg-gray-800 dark:border-gray-700">
            <p className="text-xl dark:text-white">No favorites yet! Start adding some cryptocurrencies to your watchlist.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;