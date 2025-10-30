import axios from 'axios';
import ConstantProvider from '@/utils/constantProvider';
import { TradingPair, OrderBook, Trade, Order } from '@/types';

const API_BASE_URL = ConstantProvider.BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trading Pairs APIs
export const tradingPairsApi = {
  getAll: async (): Promise<TradingPair[]> => {
    const response = await api.get('/trading-pairs');
    return response.data.map((pair: any) => ({
      id: pair.pairId,
      baseToken: {
        symbol: pair.baseToken,
        name: pair.baseToken,
        address: pair.baseTokenAddress,
        decimals: pair.baseDecimals,
      },
      quoteToken: {
        symbol: pair.quoteToken,
        name: pair.quoteToken,
        address: pair.quoteTokenAddress,
        decimals: pair.quoteDecimals,
      },
      lastPrice: pair.lastPrice,
      change24h: pair.priceChange24h,
      priceChange24h: pair.priceChange24h,
      volume24h: pair.volume24h,
      high24h: pair.high24h,
      low24h: pair.low24h,
    }));
  },

  getByPairId: async (pairId: string): Promise<TradingPair | null> => {
    try {
      const response = await api.get(`/trading-pairs/${pairId}`);
      const pair = response.data;
      return {
        id: pair.pairId,
        baseToken: {
          symbol: pair.baseToken,
          name: pair.baseToken,
          address: pair.baseTokenAddress,
          decimals: pair.baseDecimals,
        },
        quoteToken: {
          symbol: pair.quoteToken,
          name: pair.quoteToken,
          address: pair.quoteTokenAddress,
          decimals: pair.quoteDecimals,
        },
        lastPrice: pair.lastPrice,
        change24h: pair.priceChange24h,
        priceChange24h: pair.priceChange24h,
        volume24h: pair.volume24h,
        high24h: pair.high24h,
        low24h: pair.low24h,
      };
    } catch (error) {
      console.error('Error fetching trading pair:', error);
      return null;
    }
  },
};

// Order Book APIs
export const orderBookApi = {
  get: async (pairId: string): Promise<OrderBook> => {
    try {
      const response = await api.get(`/orders/order-book/${pairId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order book:', error);
      return { bids: [], asks: [] };
    }
  },

  getOpenOrders: async (userAddress?: string, pairId?: string): Promise<Order[]> => {
    try {
      const params: any = {};
      if (userAddress) params.userAddress = userAddress;
      if (pairId) params.pairId = pairId;

      const response = await api.get('/orders/open-orders', { params });
      return response.data.map((order: any) => ({
        id: order.orderId,
        pair: order.pairId,
        baseToken: order.pairId.split('-')[0],
        quoteToken: order.pairId.split('-')[1],
        side: order.side,
        type: 'limit',
        price: order.price,
        amount: (order.size - order.filledSize).toString(),
        filled: order.filledSize,
        status: order.status,
        timestamp: new Date(order.createdAt).getTime(),
      }));
    } catch (error) {
      console.error('Error fetching open orders:', error);
      return [];
    }
  },

  getUserOrders: async (userAddress: string): Promise<Order[]> => {
    try {
      const response = await api.get(`/orders/user/${userAddress}`);
      return response.data.map((order: any) => ({
        id: order.orderId,
        pair: order.pairId,
        baseToken: order.pairId.split('-')[0],
        quoteToken: order.pairId.split('-')[1],
        side: order.side,
        type: 'limit',
        price: order.price,
        amount: order.size.toString(),
        filled: order.filledSize,
        status: order.status,
        timestamp: new Date(order.createdAt).getTime(),
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },
};

// Trades APIs
export const tradesApi = {
  getRecent: async (pairId?: string, limit: number = 50): Promise<Trade[]> => {
    try {
      const params: any = { limit };
      if (pairId) params.pairId = pairId;

      const response = await api.get('/trades/recent', { params });
      return response.data.map((trade: any) => ({
        id: trade.id,
        price: trade.price,
        amount: trade.amount,
        timestamp: new Date(trade.createdAt).getTime(),
        type: trade.side,
      }));
    } catch (error) {
      console.error('Error fetching recent trades:', error);
      return [];
    }
  },

  getByPair: async (pairId: string, limit: number = 50): Promise<Trade[]> => {
    try {
      const response = await api.get(`/trades/pair/${pairId}`, { params: { limit } });
      return response.data.map((trade: any) => ({
        id: trade.id,
        price: trade.price,
        amount: trade.amount,
        timestamp: new Date(trade.createdAt).getTime(),
        type: trade.side,
      }));
    } catch (error) {
      console.error('Error fetching pair trades:', error);
      return [];
    }
  },

  getUserTrades: async (userAddress: string, limit: number = 50): Promise<Trade[]> => {
    try {
      const response = await api.get(`/trades/user/${userAddress}`, { params: { limit } });
      return response.data.map((trade: any) => ({
        id: trade.id,
        price: trade.price,
        amount: trade.amount,
        timestamp: new Date(trade.createdAt).getTime(),
        type: trade.side,
      }));
    } catch (error) {
      console.error('Error fetching user trades:', error);
      return [];
    }
  },
};

export default {
  tradingPairs: tradingPairsApi,
  orderBook: orderBookApi,
  trades: tradesApi,
};
