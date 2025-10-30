'use client';

import { useAppSelector } from '@/store/hooks';

export function OpenOrdersTable() {
  const orders = useAppSelector((state) => state.orders?.orders || []);
  const openOrders = orders.filter((order) => order.status === 'open');

  return (
    <div className="h-64 sm:h-80 lg:h-96 bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 sm:p-4 lg:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <h3 className="text-gray-800 font-bold text-base sm:text-lg lg:text-xl">Open Orders</h3>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            <span className="text-white font-bold text-xs sm:text-sm">
              {openOrders.length} Active
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-auto">
          {openOrders.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
              No open orders
            </div>
          ) : (
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-5 text-xs text-gray-600 font-bold pb-2 sm:pb-3 border-b border-gray-200 uppercase tracking-wider sticky top-0 bg-white">
                <div>Pair</div>
                <div className="hidden sm:block">Type</div>
                <div>Side</div>
                <div>Amount</div>
                <div>Price</div>
              </div>

              {/* Orders */}
              <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-3">
                {openOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-5 text-xs sm:text-sm py-1.5 sm:py-2 hover:bg-gray-50 rounded-lg px-1 sm:px-2 transition-colors"
                  >
                    <div className="text-gray-800 font-semibold truncate">
                      {order.baseToken}/{order.quoteToken}
                    </div>
                    <div className="text-gray-600 capitalize hidden sm:block">{order.type}</div>
                    <div
                      className={`font-semibold ${
                        order.side === 'buy' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {order.side.toUpperCase()}
                    </div>
                    <div className="text-gray-800 font-mono truncate">{order.amount}</div>
                    <div className="text-gray-800 font-mono truncate">
                      ${order.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
