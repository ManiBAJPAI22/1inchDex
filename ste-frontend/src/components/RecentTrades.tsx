'use client';

import { useAppSelector } from '@/store/hooks';
import { formatPrice, formatAmount, formatTimestamp } from '@/lib/utils';

export function RecentTrades() {
  const { recentTrades } = useAppSelector((state) => state.trading);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs text-gray-600 font-bold pb-3 border-b border-gray-200 uppercase tracking-wider">
          <div>Price (USDT)</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Time</div>
        </div>

        {/* Trades - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1">
          {recentTrades.map((trade, idx) => (
            <div
              key={trade.id}
              className={`grid grid-cols-3 text-sm py-3 px-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                trade.type === 'buy'
                  ? 'hover:bg-success/10 hover:shadow-md'
                  : 'hover:bg-danger/10 hover:shadow-md'
              }`}
            >
              <div
                className={`font-mono font-bold text-base ${trade.type === 'buy' ? 'text-success-dark' : 'text-danger-dark'}`}
              >
                {formatPrice(trade.price)}
              </div>
              <div className="text-gray-700 text-right font-mono font-semibold">
                {formatAmount(trade.amount)}
              </div>
              <div className="text-gray-500 text-right text-xs font-mono">
                {formatTimestamp(trade.timestamp)}
              </div>
            </div>
          ))}
        </div>

        {recentTrades.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-pulse-glow">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <div className="text-3xl">📊</div>
              </div>
              <p className="text-gray-500 font-semibold">No recent trades</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
