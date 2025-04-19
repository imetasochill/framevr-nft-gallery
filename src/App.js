// src/App.js
import React from 'react';
import NFTDisplay from './components/NFTDisplay';

function App() {
  return (
    <div className="App">
      {/* 刪除多餘的標題，僅保留組件 */}
      <NFTDisplay />
    </div>
  );
}

export default App;
