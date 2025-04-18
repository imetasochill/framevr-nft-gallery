import React, { useState, useRef } from 'react';
import { fetchNFTs } from '../utils/fetchNFTs';
import { fetchSolanaNFTs } from '../utils/fetchSolanaNFTs';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const DEFAULT_ADDRESSES = {
  ethereum: '0xefadd0aC42CBd1e2D09a8A8916086946e53c3c4f',
  solana: 'GGPbHUSt3BHKbGHssAC1Q492ce4J56eKwRqpaCyHCyZW',
};

const NFTDisplay = () => {
  const [chain, setChain] = useState('ethereum');
  const [walletAddress, setWalletAddress] = useState(DEFAULT_ADDRESSES.ethereum);
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  const handleFetchNFTs = async () => {
    let ownedNfts = [];
    if (chain === 'ethereum') {
      ownedNfts = await fetchNFTs(walletAddress);
    } else if (chain === 'solana') {
      ownedNfts = await fetchSolanaNFTs(walletAddress);
    }
    setNfts(ownedNfts);
    setSelectedNFT(null);
  };

  const getImageUrl = (nft) => {
    return (
      nft?.media?.[0]?.gateway ||
      nft?.raw?.metadata?.image ||
      nft?.image ||
      null
    );
  };

  const onKeyboardChange = (input) => {
    setWalletAddress(input);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>NFT Viewer</h1>

      {/* 選擇鏈 */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="chainSelect" style={{ marginRight: '10px' }}>
          選擇鏈：
        </label>
        <select
          id="chainSelect"
          value={chain}
          onChange={(e) => {
            const selected = e.target.value;
            setChain(selected);
            const newAddr = DEFAULT_ADDRESSES[selected];
            setWalletAddress(newAddr);
            if (keyboardRef.current) {
              keyboardRef.current.setInput(newAddr);
            }
          }}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="ethereum">Ethereum</option>
          <option value="solana">Solana</option>
        </select>
      </div>

      {/* 輸入錢包地址 */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="walletInput" style={{ display: 'block', marginBottom: '6px' }}>
          請輸入錢包地址
        </label>
        <input
          id="walletInput"
          type="text"
          inputMode="text"
          ref={inputRef}
          value={walletAddress}
          onChange={(e) => {
            setWalletAddress(e.target.value);
            if (keyboardRef.current) {
              keyboardRef.current.setInput(e.target.value);
            }
          }}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '4px'
          }}
        />

        {/* 預設地址淡化顯示 */}
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          預設地址（{chain}）：{DEFAULT_ADDRESSES[chain]}
        </p>

        {/* 虛擬鍵盤 */}
        <div style={{ maxWidth: '420px', marginTop: '10px' }}>
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layoutName="default"
            onChange={onKeyboardChange}
          />
        </div>

        {/* 查詢按鈕 */}
        <button
          onClick={handleFetchNFTs}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '6px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none'
          }}
        >
          Fetch NFTs
        </button>
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
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    backgroundColor: '#eee',
                    lineHeight: '180px',
                  }}
                >
                  No Image
                </div>
              )}
              <p style={{ marginTop: '10px' }}>
                {nft.title || nft.name || 'Unnamed NFT'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTDisplay;
