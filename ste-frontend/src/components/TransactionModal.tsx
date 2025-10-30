'use client';

import { useState } from 'react';
import { X, ExternalLink, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'buy' | 'sell';
  executedTrades: number;
  failedTrades: number;
  transactionHashes: string[];
  chainName?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  side,
  executedTrades,
  failedTrades,
  transactionHashes,
  chainName,
}: TransactionModalProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { chain } = useAccount();

  const copyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      toast.success('Transaction hash copied!');
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      toast.error('Failed to copy transaction hash');
    }
  };

  const getExplorerUrl = (hash: string) => {
    return `${chain?.blockExplorers?.default.url}/tx/${hash}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{side.toUpperCase()} Order Executed</h2>
            <p className="text-sm text-gray-600 mt-1">
              {executedTrades} trade(s) executed
              {failedTrades > 0 && `, ${failedTrades} failed`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {transactionHashes.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction{transactionHashes.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {transactionHashes.map((hash, index) => (
                  <div key={hash} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-gray-600 break-all">{hash}</p>
                        <p className="text-xs text-gray-500 mt-1">Transaction #{index + 1}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(hash)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Copy transaction hash"
                        >
                          {copiedHash === hash ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} className="text-gray-500" />
                          )}
                        </button>
                        <a
                          href={getExplorerUrl(hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="View on explorer"
                        >
                          <ExternalLink size={16} className="text-blue-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No transaction hashes available</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
