import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '@/types';

const initialState: WalletState = {
  address: null,
  isConnected: false,
  balance: '0',
  chainId: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string; chainId: number }>) => {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.isConnected = true;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.isConnected = false;
      state.balance = '0';
      state.chainId = null;
    },
    updateBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
  },
});

export const { connectWallet, disconnectWallet, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
