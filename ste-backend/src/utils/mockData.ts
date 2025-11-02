// Mock Tokens (Deployed on Monad Testnet)
export const mockTokens = {
  MBTC: {
    symbol: 'MBTC',
    name: 'Mock Bitcoin',
    address: '0xbFf4bfF3ef603ef102c1db5634353691EBe5948E',
    decimals: 18,
  },
  MUSDT: {
    symbol: 'MUSDT',
    name: 'Mock USDT',
    address: '0x3CDF19aD4e2656269aAE1b8AC8E932D66cDd0443',
    decimals: 6,
  },
  MUSDC: {
    symbol: 'MUSDC',
    name: 'Mock USDC',
    address: '0x9f19b6B8cB0378592C6173F9FC794401274DBb6a',
    decimals: 6,
  },
};

export const mockTradingPairs = [
  {
    pairId: 'MBTC-MUSDT',
    baseToken: 'MBTC',
    quoteToken: 'MUSDT',
    baseTokenAddress: mockTokens.MBTC.address,
    quoteTokenAddress: mockTokens.MUSDT.address,
    baseDecimals: mockTokens.MBTC.decimals,
    quoteDecimals: mockTokens.MUSDT.decimals,
    lastPrice: 43250.5,
    priceChange24h: 2.45,
    volume24h: 622600,
    high24h: 43800.0,
    low24h: 42100.0,
  },
  {
    pairId: 'MUSDC-MUSDT',
    baseToken: 'MUSDC',
    quoteToken: 'MUSDT',
    baseTokenAddress: mockTokens.MUSDC.address,
    quoteTokenAddress: mockTokens.MUSDT.address,
    baseDecimals: mockTokens.MUSDC.decimals,
    quoteDecimals: mockTokens.MUSDT.decimals,
    lastPrice: 1.0,
    priceChange24h: 0.05,
    volume24h: 245000,
    high24h: 1.01,
    low24h: 0.99,
  },
];
