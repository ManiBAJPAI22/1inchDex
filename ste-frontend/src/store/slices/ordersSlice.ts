import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], status: 'cancelled' as const };
      }
    },
  },
});

export const { setOrders, addOrder, updateOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
