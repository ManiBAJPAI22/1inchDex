'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { MarketsList } from '@/components/MarketsList';
import { PairHeader } from '@/components/PairHeader';
import { OrderBookTabs } from '@/components/OrderBookTabs';
import { ChartPlaceholder } from '@/components/ChartPlaceholder';
import { QuickTradePanel } from '@/components/QuickTradePanel';
import { OpenOrdersTable } from '@/components/OpenOrdersTable';
import { RecentActivityPanel } from '@/components/RecentActivityPanel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setTradingPairs,
  setSelectedPair,
  updateOrderBook,
  addTrade,
} from '@/store/slices/tradingSlice';
import { setOrders } from '@/store/slices/ordersSlice';
import { useAccount } from 'wagmi';
import api from '@/services/api';

export default function Home() {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const selectedPair = useAppSelector((state) => state.trading?.selectedPair);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trading pairs
  useEffect(() => {
    const fetchTradingPairs = async () => {
      try {
        const pairs = await api.tradingPairs.getAll();

        if (pairs.length > 0) {
          dispatch(setTradingPairs(pairs));
          if (pairs.length > 0) {
            dispatch(setSelectedPair(pairs[0]));
          }
        }
      } catch (error) {
        console.error('Error fetching trading pairs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradingPairs();
  }, [dispatch]);

  // Fetch order book when selected pair changes
  useEffect(() => {
    const fetchOrderBook = async () => {
      if (!selectedPair) return;

      try {
        const orderBook = await api.orderBook.get(selectedPair.id);
        dispatch(updateOrderBook(orderBook));
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchOrderBook();

    // Poll order book every 5 seconds
    const interval = setInterval(fetchOrderBook, 5000);
    return () => clearInterval(interval);
  }, [selectedPair, dispatch]);

  // Fetch recent trades
  useEffect(() => {
    const fetchTrades = async () => {
      if (!selectedPair) return;

      try {
        const trades = await api.trades.getByPair(selectedPair.id, 50);
        // Clear existing trades and add new ones
        trades.forEach((trade) => {
          dispatch(addTrade(trade));
        });
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();

    // Poll trades every 10 seconds
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, [selectedPair, dispatch]);

  // Fetch open orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!address) return;

      try {
        const orders = await api.orderBook.getUserOrders(address);
        dispatch(setOrders(orders));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    // Poll orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [address, dispatch]);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
        <div
          className="absolute top-40 left-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-40 right-40 w-5 h-5 bg-pink-400 rounded-full animate-bounce opacity-60"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <Header />

      <main className="flex-1 overflow-hidden relative">
        {/* Main Dashboard Layout */}
        <div className="p-2 sm:p-4 lg:p-6 h-full flex flex-col gap-2 sm:gap-3 lg:gap-4">
          {/* Mobile: Pair Header First */}
          <div className="lg:hidden">
            <PairHeader />
          </div>

          {/* Top Row - Markets and Order Book */}
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 lg:h-96">
            <MarketsList />
            <OrderBookTabs />
          </div>

          {/* Middle Row - Chart and Trading */}
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4">
            {/* Left Column - Chart and Open Orders */}
            <div className="w-full lg:w-2/3 flex flex-col gap-2 sm:gap-3 lg:gap-4">
              {/* Desktop: Pair Header */}
              <div className="hidden lg:block">
                <PairHeader />
              </div>

              {/* Main Trading Chart */}
              <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 overflow-hidden shadow-lg h-64 sm:h-80 lg:flex-1">
                <div className="p-3 sm:p-4 lg:p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                    <h3 className="text-gray-800 font-bold text-base sm:text-lg lg:text-xl">
                      Trading Chart
                    </h3>
                    <div className="flex space-x-1 sm:space-x-2">
                      <button className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm border border-blue-200">
                        1H
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                        4H
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                        1D
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ChartPlaceholder />
                  </div>
                </div>
              </div>

              <OpenOrdersTable />
            </div>

            {/* Right Column - Quick Trade and Recent Activity */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 sm:gap-3 lg:gap-4">
              <QuickTradePanel />
              <RecentActivityPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto relative">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-600 text-sm font-medium">
              © 2025{' '}
              <span className="text-blue-600 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                SkyTrade Exchange
              </span>
              . Built on Monad Network.
            </div>
            <div className="flex space-x-8 text-sm text-gray-500 font-medium">
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-300 hover:scale-105 transform"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-purple-500 transition-colors duration-300 hover:scale-105 transform"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-pink-500 transition-colors duration-300 hover:scale-105 transform"
              >
                Support
              </a>
              <a
                href="#"
                className="hover:text-green-500 transition-colors duration-300 hover:scale-105 transform"
              >
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
