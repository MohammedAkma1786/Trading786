
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/api";
import { AssetCard } from "@/components/AssetCard";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

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
      
      {/* Hero Section */}
      <div className="container py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Trade Crypto with Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Access real-time cryptocurrency data and market insights to make informed trading decisions
          </p>
          <Link
            to="/high-potential"
            className="inline-flex items-center space-x-2 neo-brutal-card px-8 py-4 text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
          >
            <span>Explore Top Performers</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="neo-brutal-card p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <TrendingUp className="w-12 h-12 text-violet-600 mb-4" />
            <h3 className="text-xl font-bold text-violet-900 mb-2">Real-Time Data</h3>
            <p className="text-gray-600">
              Access live cryptocurrency prices and market data for informed trading decisions
            </p>
          </div>
          <div className="neo-brutal-card p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <Shield className="w-12 h-12 text-violet-600 mb-4" />
            <h3 className="text-xl font-bold text-violet-900 mb-2">Secure Trading</h3>
            <p className="text-gray-600">
              Trade with confidence using our secure and reliable platform
            </p>
          </div>
          <div className="neo-brutal-card p-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <Zap className="w-12 h-12 text-violet-600 mb-4" />
            <h3 className="text-xl font-bold text-violet-900 mb-2">Market Insights</h3>
            <p className="text-gray-600">
              Get valuable insights and analytics to optimize your trading strategy
            </p>
          </div>
        </div>

        {/* Assets Section */}
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold text-center text-violet-900">Available Assets</h2>
            <Input
              type="search"
              placeholder="Search assets..."
              className="neo-brutal-card max-w-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAssets?.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
