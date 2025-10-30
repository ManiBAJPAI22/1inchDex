'use client';

import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export function ChartPlaceholder() {
  return (
    <div className="h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm rounded-xl border border-gray-200">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
            <BarChart3 className="text-white" size={36} />
          </div>
          <div
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float"
            style={{ animationDelay: '0.5s' }}
          >
            <TrendingUp className="text-white" size={36} />
          </div>
          <div
            className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float"
            style={{ animationDelay: '1s' }}
          >
            <Activity className="text-white" size={36} />
          </div>
        </div>

        <h3 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Advanced Trading Charts
        </h3>
        <p className="text-gray-600 text-lg mb-10 max-w-lg font-medium">
          Real-time market analysis with professional tools
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-2xl p-6 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 transition-all duration-500 cursor-pointer group backdrop-blur-sm">
            <div className="text-blue-600 text-lg font-bold group-hover:scale-110 transition-transform mb-2">
              TradingView
            </div>
            <div className="text-gray-600 text-sm">Professional charts</div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-2xl p-6 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-500 cursor-pointer group backdrop-blur-sm">
            <div className="text-purple-600 text-lg font-bold group-hover:scale-110 transition-transform mb-2">
              Lightweight
            </div>
            <div className="text-gray-600 text-sm">Fast & responsive</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-2xl p-6 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/25 hover:-translate-y-2 transition-all duration-500 cursor-pointer group backdrop-blur-sm">
            <div className="text-green-600 text-lg font-bold group-hover:scale-110 transition-transform mb-2">
              Custom
            </div>
            <div className="text-gray-600 text-sm">Your own style</div>
          </div>
        </div>
      </div>
    </div>
  );
}
