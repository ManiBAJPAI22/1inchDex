'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedPair } from '@/store/slices/tradingSlice';
import { TradingPair } from '@/types';

export function MarketsList() {
  const dispatch = useAppDispatch();
  const tradingPairs = useAppSelector((state) => state.trading?.tradingPairs || []);
  const selectedPair = useAppSelector((state) => state.trading?.selectedPair);

  const handleSelectPair = (pair: TradingPair) => {
    dispatch(setSelectedPair(pair));
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, { gradient: string; icon: string }> = {
      BTC: { gradient: 'from-orange-400 to-red-500', icon: '₿' },
      ETH: { gradient: 'from-blue-400 to-purple-500', icon: 'Ξ' },
      USDT: { gradient: 'from-green-400 to-emerald-500', icon: '$' },
    };
    return icons[symbol] || { gradient: 'from-gray-400 to-gray-500', icon: symbol[0] };
  };

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 shadow-lg">
      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-gray-800 font-bold text-xs sm:text-sm">Markets</h3>
      </div>

      {/* Search */}
      <div className="relative mb-2 sm:mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs sm:text-sm"
        />
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Trading Pairs */}
      <div className="space-y-1">
        {tradingPairs.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
            No trading pairs available
          </div>
        ) : (
          tradingPairs.map((pair) => {
            const baseIcon = getCryptoIcon(pair.baseToken.symbol);
            const quoteIcon = getCryptoIcon(pair.quoteToken.symbol);
            const isSelected = selectedPair?.id === pair.id;

            return (
              <div
                key={pair.id}
                onClick={() => handleSelectPair(pair)}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-4 h-4 bg-gradient-to-r ${baseIcon.gradient} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xs">{baseIcon.icon}</span>
                    </div>
                    <div
                      className={`w-4 h-4 bg-gradient-to-r ${quoteIcon.gradient} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xs">{quoteIcon.icon}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-800 font-semibold text-xs">
                      {pair.baseToken.symbol}
                    </div>
                    <div className="text-gray-600 text-xs">
                      ${pair.lastPrice?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold ${getChangeColor(pair.priceChange24h || 0)}`}
                >
                  {formatChange(pair.priceChange24h || 0)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
