import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { PerformanceBar } from "./PerformanceBar";

interface CryptoTableRowProps {
  crypto: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_24h: number;
    price_change_7d: number;
    performance_score: number;
    future_potential_score: number;
  };
}

export const CryptoTableRow = ({ crypto }: CryptoTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {crypto.name} ({crypto.symbol})
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatCurrency(crypto.current_price)}
      </TableCell>
      <TableCell
        className={crypto.price_change_24h >= 0 ? "price-up" : "price-down"}
      >
        {crypto.price_change_24h >= 0 ? "+" : ""}
        {crypto.price_change_24h.toFixed(2)}%
      </TableCell>
      <TableCell
        className={`hidden md:table-cell ${
          crypto.price_change_7d >= 0 ? "price-up" : "price-down"
        }`}
      >
        {crypto.price_change_7d >= 0 ? "+" : ""}
        {crypto.price_change_7d.toFixed(2)}%
      </TableCell>
      <TableCell>
        <PerformanceBar value={crypto.performance_score} color="violet" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <PerformanceBar value={crypto.future_potential_score} color="emerald" />
      </TableCell>
    </TableRow>
  );
};