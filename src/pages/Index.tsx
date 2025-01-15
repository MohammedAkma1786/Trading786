import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/api";
import { AssetCard } from "@/components/AssetCard";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { CryptoPerformanceTable } from "@/components/CryptoPerformanceTable";
import { useState } from "react";

const Index = () => {
  const [search, setSearch] = useState("");
  const { data: assets, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const filteredAssets = assets?.filter(
    (asset) =>
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="neo-brutal-card p-6 mx-4 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-xl font-bold dark:text-white">Loading assets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="neo-brutal-card p-6 mx-4 bg-red-100 dark:bg-red-900">
            <p className="text-xl font-bold dark:text-white">Error loading assets</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Navbar />
      <div className="container py-8 px-4 md:px-8">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center dark:text-white">Crypto Assets</h1>
          <Input
            type="search"
            placeholder="Search assets..."
            className="neo-brutal-card max-w-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <CryptoPerformanceTable />
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-6 dark:text-white">All Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAssets?.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;