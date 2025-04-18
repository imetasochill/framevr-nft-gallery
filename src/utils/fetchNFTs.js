import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export const fetchNFTs = async (walletAddress) => {
  if (!walletAddress) return [];

  try {
    const response = await alchemy.nft.getNftsForOwner(walletAddress);
    return response.ownedNfts;
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    return [];
  }
};
