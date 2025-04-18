import React, { useState, useRef } from 'react';
import { fetchNFTs } from '../utils/fetchNFTs';
import { fetchSolanaNFTs } from '../utils/fetchSolanaNFTs';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

// fallback image for broken or missing URLs
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="%23f5f5f5"/><text x="80" y="90" font-size="14" fill="%23999" text-anchor="middle">No Image</text></svg>';

const DEFAULT_ADDRESSES = {
  ethereum: '0xefadd0aC42CBd1e2D09a8A8916086946e53c3c4f',
  solana: 'GGPbHUSt3BHKbGHssAC1Q492ce4J56eKwRqpaCyHCyZW',
};

const NFTDisplay = () => {
  const [chain, setChain] = useState('ethereum');
  const [walletAddress, setWalletAddress] = useState(DEFAULT_ADDRESSES.ethereum);
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);

  const handleFetchNFTs = async () => {
    const ownedNfts = chain === 'ethereum'
      ? await fetchNFTs(walletAddress)
      : await fetchSolanaNFTs(walletAddress);
    setNfts(ownedNfts);
    setSelectedNFT(null);
  };

  const normalizeUrl = url => {
    if (!url) return null;
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return url;
  };

  const getImageUrl = nft => {
    const raw =
      nft?.media?.[0]?.gateway ||
      nft?.raw?.metadata?.image ||
      nft?.image ||
      null;
    return normalizeUrl(raw);
  };

  const onKeyboardChange = input => setWalletAddress(input);
  const toggleKeyboard = () => {
    setShowKeyboard(prev => !prev);
    if (!showKeyboard) setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{ padding: '20px', maxHeight: '100vh', overflowY: 'auto', position: 'relative' }}>
      {/* 標題 */}
      <h1
        style={{
          textAlign: 'left',       // 文字靠左
          margin: '0 0 20px 0',     // 上右下左
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #7928ca, #ff0080)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        NFT Viewer
      </h1>

      {/* 錢包與鏈選擇區 */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="chainSelect" style={{ whiteSpace: 'nowrap' }}>
          選擇鏈：
        </label>
        <select
          id="chainSelect"
          value={chain}
          onChange={e => {
            const sel = e.target.value;
            setChain(sel);
            const addr = DEFAULT_ADDRESSES[sel];
            setWalletAddress(addr);
            keyboardRef.current?.setInput(addr);
          }}
        >
          <option value="ethereum">Ethereum</option>
          <option value="solana">Solana</option>
        </select>

        <input
          ref={inputRef}
          value={walletAddress}
          onChange={e => {
            setWalletAddress(e.target.value);
            keyboardRef.current?.setInput(e.target.value);
          }}
          placeholder="輸入錢包地址..."
          style={{ flex: 1, padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <button
          onClick={handleFetchNFTs}
          style={{ padding: '10px 16px', fontSize: '14px', cursor: 'pointer', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}
        >
          查詢 NFT
        </button>
      </div>

      {/* 已選 NFT 放大顯示 */}
      {selectedNFT && (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>🎯 Selected NFT</h2>
          <img
            src={getImageUrl(selectedNFT) || FALLBACK_IMAGE}
            alt={selectedNFT.title}
            onError={e => { e.currentTarget.src = FALLBACK_IMAGE; }}
            style={{ width: '80%', maxWidth: '600px', borderRadius: '12px' }}
          />
          <p style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>
            {selectedNFT.title || selectedNFT.name || 'Unnamed NFT'}
          </p>
        </div>
      )}

      {/* NFT 清單 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {nfts.map((nft, idx) => {
          const url = getImageUrl(nft);
          return (
            <div
              key={idx}
              onClick={() => setSelectedNFT(nft)}
              style={{ cursor: 'pointer', border: selectedNFT === nft ? '2px solid #007bff' : '1px solid #ddd', borderRadius: '8px', padding: '8px', width: '180px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              <img
                src={url || FALLBACK_IMAGE}
                alt={nft.title}
                onError={e => { e.currentTarget.src = FALLBACK_IMAGE; }}
                width="160"
                height="160"
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
              <p style={{ marginTop: '8px', fontSize: '14px' }}>{nft.title || nft.name || 'Unnamed NFT'}</p>
            </div>
          );
        })}
      </div>

      {/* 浮動鍵盤切換按鈕 */}
      <button
        onClick={toggleKeyboard}
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #6e84f7, #9b9bff)', border: 'none', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontSize: '24px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title={showKeyboard ? '收起鍵盤' : '開啟鍵盤'}
      >
        ⌨️
      </button>

      {/* 虛擬鍵盤 */}
      {showKeyboard && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', maxWidth: '90vw', width: '320px', boxSizing: 'border-box' }}>
          <Keyboard keyboardRef={r => (keyboardRef.current = r)} layoutName="default" onChange={onKeyboardChange} />
        </div>
      )}
    </div>
  );
};

export default NFTDisplay;
