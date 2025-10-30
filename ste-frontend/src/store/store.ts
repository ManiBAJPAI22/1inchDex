import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import walletReducer from './slices/walletSlice';
import tradingReducer from './slices/tradingSlice';
import ordersReducer from './slices/ordersSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wallet', 'trading'], // Only persist wallet and trading state
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  trading: tradingReducer,
  orders: ordersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Use the rootReducer type directly to avoid redux-persist type issues
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
