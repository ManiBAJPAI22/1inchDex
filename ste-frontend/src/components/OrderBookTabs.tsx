'use client';

import { useState } from 'react';
import { OrderBook } from './OrderBook';
import { RecentTrades } from './RecentTrades';

export function OrderBookTabs() {
  const [activeTab, setActiveTab] = useState<'book' | 'trades'>('book');

  return (
    <div className="w-full lg:w-3/4 bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 overflow-hidden shadow-lg h-64 sm:h-80 lg:h-auto">
      <div className="h-full flex flex-col">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex p-1">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'book'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="hidden sm:inline">Order Book</span>
              <span className="sm:hidden">Book</span>
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'trades'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="hidden sm:inline">Recent Trades</span>
              <span className="sm:hidden">Trades</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-2 sm:p-3">
          {activeTab === 'book' ? (
            <div className="h-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-800 font-bold text-xs sm:text-sm">Order Book</h3>
                <div className="flex space-x-1">
                  <button className="bg-blue-100 text-blue-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs border border-blue-200">
                    0.01
                  </button>
                  <button className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                    0.1
                  </button>
                  <button className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                    1.0
                  </button>
                </div>
              </div>
              <OrderBook />
            </div>
          ) : (
            <div className="h-full">
              <h3 className="text-gray-800 font-bold text-xs sm:text-sm mb-2">Recent Trades</h3>
              <RecentTrades />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
