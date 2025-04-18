const { Alchemy, Network } = require("alchemy-sdk");

const settings = {
  apiKey: "T-SXsNNQIwqTgYIfPXhwGDrPqydbCArH", // ⬅️ 你的 Alchemy API KEY
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// 測試地址（這個有 NFT）
const address = "0x495f947276749Ce646f68AC8c248420045cb7b5e";

async function fetchNFTs() {
  try {
    const response = await alchemy.nft.getNftsForOwner(address);
    console.log("✅ NFT 數量:", response.totalCount);
    console.log("📦 NFT 資料：", response.ownedNfts);
  } catch (err) {
    console.error("❌ 發生錯誤：", err);
  }
}

fetchNFTs();
