export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
}

export interface TradingPair {
  id: string;
  baseToken: Token;
  quoteToken: Token;
  lastPrice: number;
  change24h: number;
  priceChange24h: number; // percentage change
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  timestamp: number;
  type: 'buy' | 'sell';
}

export interface Order {
  id: string;
  pair: string;
  baseToken: string;
  quoteToken: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price: number;
  amount: string;
  filled: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
}

export interface UserBalance {
  token: string;
  available: number;
  locked: number;
  total: number;
}
