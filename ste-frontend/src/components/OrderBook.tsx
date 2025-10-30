'use client';

import { useAppSelector } from '@/store/hooks';
import { formatPrice, formatAmount } from '@/lib/utils';
import { OrderBookEntry } from '@/types';

export function OrderBook() {
  const orderBook = useAppSelector((state) => state.trading?.orderBook || { bids: [], asks: [] });

  return (
    <div className="h-full flex flex-col">
      {/* Header is now handled by parent */}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs text-gray-600 font-bold px-4 py-2 border-b border-gray-200 uppercase tracking-wider">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Asks (Sell Orders) */}
          <div className="space-y-0">
            {orderBook.asks
              .slice()
              .reverse()
              .map((ask: OrderBookEntry, index: number) => (
                <div
                  key={`ask-${index}`}
                  className="grid grid-cols-3 text-sm relative overflow-hidden hover:bg-red-900/20 py-2 px-4 transition-all duration-200 cursor-pointer group"
                >
                  <div
                    className="absolute right-0 top-0 h-full bg-red-500/10 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ width: `${(ask.amount / 3) * 100}%` }}
                  />
                  <div className="text-red-500 relative z-10 font-mono font-bold">
                    {formatPrice(ask.price)}
                  </div>
                  <div className="text-gray-800 text-right relative z-10 font-mono">
                    {formatAmount(ask.amount)}
                  </div>
                  <div className="text-gray-600 text-right relative z-10 font-mono">
                    {formatPrice(ask.total)}
                  </div>
                </div>
              ))}
          </div>

          {/* Spread */}
          <div className="py-3 border-y border-gray-200 bg-gray-50">
            <div className="text-center">
              <span className="text-xl font-bold text-gray-800 font-mono">
                {orderBook.asks.length > 0 && orderBook.bids.length > 0
                  ? formatPrice(orderBook.asks[0].price)
                  : '---'}
              </span>
              <p className="text-xs text-gray-600 mt-1 font-bold uppercase tracking-wide">
                Spread:{' '}
                <span className="text-blue-500">
                  {orderBook.asks.length > 0 && orderBook.bids.length > 0
                    ? formatPrice(orderBook.asks[0].price - orderBook.bids[0].price)
                    : '---'}
                </span>
              </p>
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="space-y-0">
            {orderBook.bids.map((bid: OrderBookEntry, index: number) => (
              <div
                key={`bid-${index}`}
                className="grid grid-cols-3 text-sm relative overflow-hidden hover:bg-green-900/20 py-2 px-4 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className="absolute right-0 top-0 h-full bg-green-500/10 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ width: `${(bid.amount / 3) * 100}%` }}
                />
                <div className="text-green-500 relative z-10 font-mono font-bold">
                  {formatPrice(bid.price)}
                </div>
                <div className="text-gray-800 text-right relative z-10 font-mono">
                  {formatAmount(bid.amount)}
                </div>
                <div className="text-gray-600 text-right relative z-10 font-mono">
                  {formatPrice(bid.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
