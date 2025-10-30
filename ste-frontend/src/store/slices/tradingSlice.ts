import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TradingPair, OrderBook, Trade } from '@/types';

interface TradingState {
  selectedPair: TradingPair | null;
  orderBook: OrderBook;
  recentTrades: Trade[];
  tradingPairs: TradingPair[];
}

const initialState: TradingState = {
  selectedPair: null,
  orderBook: {
    bids: [],
    asks: [],
  },
  recentTrades: [],
  tradingPairs: [],
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    setSelectedPair: (state, action: PayloadAction<TradingPair>) => {
      state.selectedPair = action.payload;
    },
    updateOrderBook: (state, action: PayloadAction<OrderBook>) => {
      state.orderBook = action.payload;
    },
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.recentTrades = [action.payload, ...state.recentTrades.slice(0, 49)];
    },
    setTradingPairs: (state, action: PayloadAction<TradingPair[]>) => {
      state.tradingPairs = action.payload;
    },
  },
});

export const { setSelectedPair, updateOrderBook, addTrade, setTradingPairs } = tradingSlice.actions;
export default tradingSlice.reducer;
