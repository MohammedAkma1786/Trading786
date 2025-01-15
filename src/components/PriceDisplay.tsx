import { formatCurrency } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  priceChange: number;
  marketCap: number;
}

export const PriceDisplay = ({ price, priceChange, marketCap }: PriceDisplayProps) => {
  const formattedPrice = formatCurrency(price);
  const formattedMarketCap = formatCurrency(marketCap);

  return (
    <div className="space-y-2">
      <p className="text-2xl font-bold dark:text-white">{formattedPrice}</p>
      <p className={priceChange >= 0 ? "price-up" : "price-down"}>
        {priceChange >= 0 ? "+" : ""}
        {priceChange.toFixed(2)}%
      </p>
      <p className="text-sm dark:text-gray-300">Market Cap: {formattedMarketCap}</p>
    </div>
  );
};