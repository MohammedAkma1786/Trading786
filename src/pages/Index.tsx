import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/api";
import { AssetCard } from "@/components/AssetCard";

const Index = () => {
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-brutal-card p-6">
          <p className="text-xl font-bold">Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-brutal-card p-6 bg-red-100">
          <p className="text-xl font-bold">Error loading assets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Crypto Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default Index;