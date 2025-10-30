'use client';

import { Wallet, ChevronDown, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { shortenAddress, formatNumber } from '@/lib/utils';
import { useState } from 'react';

export function Header() {
  const { isConnected, address, balance, connectors, connect, disconnect } = useWalletConnection();
  const { chainId } = useAppSelector((state) => state.wallet);
  const [showConnectors, setShowConnectors] = useState(false);

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setShowConnectors(false);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-30 shadow-lg">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl shadow-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">SkyTrade</span>
            </div>

            {/* Navigation - Hidden on small screens */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <a
                href="#"
                className="text-sm lg:text-base text-gray-800 font-semibold hover:text-blue-500 transition-all duration-200 border-b-2 border-blue-500 pb-1"
              >
                Trade
              </a>
              <a
                href="#"
                className="text-sm lg:text-base text-gray-600 font-medium hover:text-gray-800 transition-all duration-200"
              >
                Markets
              </a>
              <a
                href="#"
                className="text-sm lg:text-base text-gray-600 font-medium hover:text-gray-800 transition-all duration-200"
              >
                Portfolio
              </a>
            </nav>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {isConnected ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Balance Display - Desktop Only */}
                {balance && (
                  <div className="hidden xl:flex items-center bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl">
                    <span className="text-xs md:text-sm text-gray-600 mr-2 font-medium">
                      Balance:
                    </span>
                    <span className="text-sm text-gray-800 font-bold font-mono">
                      {formatNumber(parseFloat(balance.formatted), 2)} {balance.symbol}
                    </span>
                  </div>
                )}

                {/* Network Badge */}
                <div className="flex items-center space-x-2 bg-gray-100 border border-gray-200 px-3 md:px-4 py-2.5 rounded-xl shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm text-gray-800 font-semibold">
                    {shortenAddress(address || '', 3)}
                  </span>
                </div>

                <button
                  onClick={() => disconnect()}
                  className="px-3 md:px-4 py-2.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800 rounded-xl transition-all duration-200 text-xs md:text-sm font-medium shadow-sm"
                >
                  <span className="hidden sm:inline">Disconnect</span>
                  <span className="sm:hidden">✕</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowConnectors(!showConnectors)}
                  className="flex items-center space-x-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-sm md:text-base font-semibold shadow-md hover:shadow-lg"
                >
                  <Wallet size={18} />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                  <ChevronDown size={16} />
                </button>

                {/* Connector Dropdown */}
                {showConnectors && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
                    <div className="p-3">
                      <div className="text-xs text-gray-600 uppercase font-bold px-3 py-2 tracking-wider">
                        Select Wallet
                      </div>
                      {connectors.map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => handleConnect(connector.id)}
                          className="w-full flex items-center space-x-3 px-3 py-3.5 hover:bg-gray-100 rounded-xl transition-all duration-200 text-left group"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                            <Wallet size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="text-gray-800 font-semibold group-hover:text-blue-500 transition-colors">
                              {connector.name}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showConnectors && (
        <div className="fixed inset-0 z-40" onClick={() => setShowConnectors(false)} />
      )}
    </header>
  );
}
