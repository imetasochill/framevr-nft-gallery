// src/utils/fetchSolanaNFTs.js
export const fetchSolanaNFTs = async (walletAddress) => {
    const HELIUS_KEY = process.env.REACT_APP_HELIUS_API_KEY;
    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-fetch',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: false
          }
        }
      })
    });
  
    const { result } = await response.json();
    return result.items.map(item => ({
      name: item.content?.metadata?.name || 'Unnamed NFT',
      image: item.content?.files?.[0]?.uri || null
    }));
  };
  