import React, { useState } from 'react';
import { fetchNFTs } from '../utils/fetchNFTs';

const NFTDisplay = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);

  const handleFetchNFTs = async () => {
    const ownedNfts = await fetchNFTs(walletAddress);
    setNfts(ownedNfts);
    setSelectedNFT(null); // 清除選擇
  };

  const getImageUrl = (nft) => {
    return nft?.media?.[0]?.gateway || nft?.raw?.metadata?.image || null;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>NFT Viewer</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          style={{ width: '400px', padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleFetchNFTs}>Fetch NFTs</button>
      </div>

      {/* 顯示選中的 NFT */}
      {selectedNFT && (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>🎯 Selected NFT</h2>
          <img
            src={getImageUrl(selectedNFT)}
            alt={selectedNFT.title}
            style={{ maxWidth: '300px', border: '2px solid #000', borderRadius: '10px' }}
          />
          <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
            {selectedNFT.title || selectedNFT.name || 'Unnamed NFT'}
          </p>
        </div>
      )}

      {/* NFT 清單 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {nfts.map((nft, index) => {
          const imageUrl = getImageUrl(nft);
          return (
            <div
              key={index}
              onClick={() => setSelectedNFT(nft)}
              style={{
                cursor: 'pointer',
                border: selectedNFT === nft ? '2px solid blue' : '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px',
                width: '200px',
                textAlign: 'center',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={nft.title}
                  width="180"
                  height="180"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ width: '180px', height: '180px', backgroundColor: '#eee', lineHeight: '180px' }}>
                  No Image
                </div>
              )}
              <p style={{ marginTop: '10px' }}>{nft.title || nft.name || 'Unnamed NFT'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTDisplay;
