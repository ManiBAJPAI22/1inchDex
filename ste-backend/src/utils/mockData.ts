// Mock Tokens (from frontend mockData.ts)
export const mockTokens = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x687b4100Aa3790154fCE2532364f373368a0D1CE',
    decimals: 8,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x779F0BBff7823d74018B0C4DC8D3c3A681b3a265',
    decimals: 18,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    address: '0xc812C10b26ccf7D1942F0C2310b02D08A465cfF8',
    decimals: 6,
  },
};

export const mockTradingPairs = [
  {
    pairId: 'BTC-USDT',
    baseToken: 'BTC',
    quoteToken: 'USDT',
    baseTokenAddress: mockTokens.BTC.address,
    quoteTokenAddress: mockTokens.USDT.address,
    baseDecimals: mockTokens.BTC.decimals,
    quoteDecimals: mockTokens.USDT.decimals,
    lastPrice: 43250.5,
    priceChange24h: 2.45,
    volume24h: 622600,
    high24h: 43800.0,
    low24h: 42100.0,
  },
  {
    pairId: 'ETH-USDT',
    baseToken: 'ETH',
    quoteToken: 'USDT',
    baseTokenAddress: mockTokens.ETH.address,
    quoteTokenAddress: mockTokens.USDT.address,
    baseDecimals: mockTokens.ETH.decimals,
    quoteDecimals: mockTokens.USDT.decimals,
    lastPrice: 2650.75,
    priceChange24h: -1.23,
    volume24h: 345200,
    high24h: 2750.0,
    low24h: 2600.0,
  },
];
