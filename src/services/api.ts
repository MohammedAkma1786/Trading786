import axios from "axios";

const COINCAP_API = "https://api.coincap.io/v2";

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
}

export const getAssets = async (): Promise<Asset[]> => {
  const response = await axios.get(`${COINCAP_API}/assets`);
  return response.data.data;
};

export const getAsset = async (id: string): Promise<Asset> => {
  const response = await axios.get(`${COINCAP_API}/assets/${id}`);
  return response.data.data;
};

export const getAssetHistory = async (id: string): Promise<AssetHistory[]> => {
  const response = await axios.get(
    `${COINCAP_API}/assets/${id}/history?interval=h1`
  );
  return response.data.data;
};