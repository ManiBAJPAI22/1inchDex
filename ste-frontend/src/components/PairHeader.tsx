'use client';

import { useAppSelector } from '@/store/hooks';

export function PairHeader() {
  const selectedPair = useAppSelector((state) => state.trading?.selectedPair);

  if (!selectedPair) {
    return null;
  }

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, { gradient: string; icon: string }> = {
      BTC: { gradient: 'from-orange-400 to-red-500', icon: '₿' },
      ETH: { gradient: 'from-blue-400 to-purple-500', icon: 'Ξ' },
      USDT: { gradient: 'from-green-400 to-emerald-500', icon: '$' },
    };
    return icons[symbol] || { gradient: 'from-gray-400 to-gray-500', icon: symbol[0] };
  };

  const baseIcon = getCryptoIcon(selectedPair.baseToken.symbol);
  const quoteIcon = getCryptoIcon(selectedPair.quoteToken.symbol);

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-md rounded-xl lg:rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left - Trading Pair Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1">
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${baseIcon.gradient} rounded-lg flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xs sm:text-sm">{baseIcon.icon}</span>
            </div>
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${quoteIcon.gradient} rounded-lg flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xs sm:text-sm">{quoteIcon.icon}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
              {selectedPair.baseToken.symbol} / {selectedPair.quoteToken.symbol}
            </h1>
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              <span className="text-white font-bold text-xs">Live</span>
            </div>
          </div>
        </div>

        {/* Right - Market Data */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 w-full sm:w-auto overflow-x-auto">
          <div className="text-center bg-white rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-gray-300 shadow-sm min-w-fit">
            <div className="text-xs text-gray-600 font-medium whitespace-nowrap">Price</div>
            <div
              className={`text-sm sm:text-base lg:text-xl font-bold ${getPriceChangeColor(selectedPair.priceChange24h || 0)}`}
            >
              ${selectedPair.lastPrice?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="text-center bg-white rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-gray-300 shadow-sm min-w-fit">
            <div className="text-xs text-gray-600 font-medium whitespace-nowrap">24h Change</div>
            <div
              className={`text-sm sm:text-base lg:text-xl font-bold ${getPriceChangeColor(selectedPair.priceChange24h || 0)}`}
            >
              {selectedPair.priceChange24h >= 0 ? '+' : ''}
              {selectedPair.priceChange24h?.toFixed(2) || '0.00'}%
            </div>
          </div>
          <div className="text-center bg-white rounded-lg px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-gray-300 shadow-sm min-w-fit">
            <div className="text-xs text-gray-600 font-medium whitespace-nowrap">Volume</div>
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              {formatVolume(selectedPair.volume24h || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
