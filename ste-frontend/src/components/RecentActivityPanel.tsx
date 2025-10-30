'use client';

import { useAppSelector } from '@/store/hooks';

interface Activity {
  id: string;
  type: 'buy' | 'sell' | 'pending' | 'cancelled';
  pair: string;
  amount: string;
  price: number;
  total: number;
  status: string;
  timestamp: string;
}

export function RecentActivityPanel() {
  const orders = useAppSelector((state) => state.orders?.orders || []);

  // Convert recent orders to activities
  const activities: Activity[] = orders.slice(0, 4).map((order) => ({
    id: order.id,
    type: order.side as 'buy' | 'sell',
    pair: `${order.baseToken}/${order.quoteToken}`,
    amount: `${order.amount} ${order.baseToken}`,
    price: order.price,
    total: order.price * parseFloat(order.amount),
    status:
      order.status === 'filled' ? 'Filled' : order.status === 'open' ? 'Pending' : 'Cancelled',
    timestamp: new Date(order.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  const getActivityStyle = (type: string, status: string) => {
    if (status === 'Pending') {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-100',
        badge: 'bg-yellow-100 text-yellow-600',
      };
    }
    if (status === 'Cancelled') {
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100',
        badge: 'bg-gray-100 text-gray-600',
      };
    }
    return type === 'buy'
      ? {
          bg: 'bg-green-50',
          border: 'border-green-200',
          hover: 'hover:bg-green-100',
          badge: 'bg-green-100 text-green-600',
        }
      : {
          bg: 'bg-red-50',
          border: 'border-red-200',
          hover: 'hover:bg-red-100',
          badge: 'bg-red-100 text-red-600',
        };
  };

  const getTypeColor = (type: string) => {
    return type === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="flex-1 bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 sm:p-4 lg:p-6 h-full flex flex-col max-h-full">
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <h3 className="text-gray-800 font-bold text-base sm:text-lg lg:text-xl">
            Recent Activity
          </h3>
          <div className="bg-gradient-to-r from-orange-500 to-yellow-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            <span className="text-white font-bold text-xs">{activities.length} Today</span>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-scroll space-y-2 sm:space-y-3 pr-1 sm:pr-2 min-h-0">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
              No recent activity
            </div>
          ) : (
            activities.map((activity) => {
              const style = getActivityStyle(activity.type, activity.status);
              return (
                <div
                  key={activity.id}
                  className={`${style.bg} rounded-lg lg:rounded-xl p-2 sm:p-3 border ${style.border} ${style.hover} transition-colors`}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className={`font-bold text-xs sm:text-sm ${getTypeColor(activity.type)}`}>
                      {activity.type.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-800 text-xs sm:text-sm font-semibold truncate">
                        {activity.amount}
                      </div>
                      <div className="text-gray-600 text-xs">@ ${activity.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gray-800 font-bold text-xs sm:text-sm">
                        ${activity.total.toFixed(2)}
                      </div>
                      <div
                        className={`${style.badge} text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold`}
                      >
                        {activity.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All Button */}
        <button className="mt-2 sm:mt-3 lg:mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 border border-gray-200">
          View All Activity
        </button>
      </div>
    </div>
  );
}
