'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useTrade, OrderType } from '@/hooks/useTrade';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import axios from 'axios';
import ConstantProvider from '@/utils/constantProvider';
import toast from 'react-hot-toast';
import { TransactionModal } from './TransactionModal';
import helperProvider from '@/utils/helperProvider';

export interface CreateOrderI {
  side: 'sell' | 'buy';
  orderId: string;
  size: number;
  price: number;
  metadata: string;
  pairId: string;
  userAddress: string;
}

export function QuickTradePanel() {
  const { address, chainId, chain } = useAccount();
  const { isConnected } = useAppSelector((state) => state.wallet);
  const selectedPair = useAppSelector((state) => state.trading?.selectedPair);

  const { createOrder, approveToken, checkAllowance, fillOrder, reconstructOrder, serializeOrder } =
    useTrade();

  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    executedTrades: number;
    failedTrades: number;
    transactionHashes: string[];
  }>({ executedTrades: 0, failedTrades: 0, transactionHashes: [] });

  const formatTotal = (tokenAmt: number, usdAmt: number, decimals?: number) => {
    if (!tokenAmt || !usdAmt || !decimals) {
      return '0.00';
    }
    // Amount is always in base token (e.g., BTC)
    // Price is always in quote token (e.g., USDT)
    // Total = amount * price (e.g., BTC * USDT/BTC = USDT)
    return helperProvider.addCommasToNumber((tokenAmt * usdAmt).toFixed(decimals));
  };

  const handleExecute = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (Number(chainId) !== Number(ConstantProvider.NETWORK_CHAIN_ID)) {
      toast.error(
        `Please switch to the correct network. Current: ${chain?.name || `Chain ${chainId}`}, Required: Chain ${ConstantProvider.NETWORK_CHAIN_ID}`
      );
      return;
    }

    if (!selectedPair) {
      toast.error('Please select a trading pair');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Processing your order...');

    try {
      // Extract token addresses from selected pair (nested structure)
      const baseTokenAddress = selectedPair.baseToken?.address;
      const quoteTokenAddress = selectedPair.quoteToken?.address;
      const baseTokenDecimals = selectedPair.baseToken?.decimals;
      const quoteTokenDecimals = selectedPair.quoteToken?.decimals;

      console.log('✅ Token info extracted:', {
        baseTokenAddress,
        quoteTokenAddress,
        baseTokenDecimals,
        quoteTokenDecimals
      });

      // Determine maker and taker tokens based on order side
      const makerToken = side === 'sell' ? baseTokenAddress : quoteTokenAddress;
      const takerToken = side === 'sell' ? quoteTokenAddress : baseTokenAddress;
      const makerTokenDecimals = side === 'sell' ? baseTokenDecimals : quoteTokenDecimals;
      const takerTokenDecimals = side === 'sell' ? quoteTokenDecimals : baseTokenDecimals;

      // Step 1: Calculate order amounts
      let takerAmount = 0;
      let makerAmount = 0;

      if (side === 'sell') {
        // Selling BTC for USDT
        makerAmount = Number(amount); // BTC you're selling
        takerAmount = Number(price) * Number(amount); // USDT you're receiving
      } else {
        // Buying BTC with USDT
        makerAmount = Number(amount) * Number(price); // USDT you're paying
        takerAmount = Number(amount); // BTC you're buying
      }

      // Convert to BigInt for accurate comparison
      const makerAmountBigInt = ethers.parseUnits(makerAmount.toString(), makerTokenDecimals);
      const takerAmountBigInt = ethers.parseUnits(takerAmount.toString(), takerTokenDecimals);

      // Step 2: Check and approve BOTH tokens (for atomic settlement)
      // Both base and quote tokens need approval for the 1inch contract to execute trades
      console.log('Checking token allowances for 1inch...');
      toast.loading('Checking token approvals...', { id: loadingToast });

      // Check and approve BASE token
      console.log(`Checking ${selectedPair.baseToken.symbol} allowance...`, {
        tokenAddress: baseTokenAddress,
        amount: side === 'sell' ? makerAmount : takerAmount,
      });

      const baseAllowance = await checkAllowance({
        tokenAddress: baseTokenAddress,
        owner: address,
        spender: ConstantProvider.ONEINCH_CONTRACT_ADDRESS,
      });

      const requiredBaseAmount = side === 'sell' ? makerAmountBigInt : takerAmountBigInt;
      console.log(`${selectedPair.baseToken.symbol} allowance:`, {
        allowance: baseAllowance.toString(),
        allowanceFormatted: ethers.formatUnits(baseAllowance, baseTokenDecimals),
        requiredAmount: side === 'sell' ? makerAmount : takerAmount,
        needsApproval: baseAllowance < requiredBaseAmount,
      });

      if (baseAllowance < requiredBaseAmount) {
        console.log(`⚠️ Insufficient ${selectedPair.baseToken.symbol} allowance - requesting approval...`);
        toast.loading(`Approving ${selectedPair.baseToken.symbol} for 1inch...`, { id: loadingToast });

        await approveToken({
          tokenAddress: baseTokenAddress,
          spender: ConstantProvider.ONEINCH_CONTRACT_ADDRESS,
        });

        toast.success(`${selectedPair.baseToken.symbol} approved for 1inch!`, { id: loadingToast });
        console.log(`✅ ${selectedPair.baseToken.symbol} approval confirmed`);
      } else {
        console.log(`✅ ${selectedPair.baseToken.symbol} already approved for 1inch`);
      }

      // Check and approve QUOTE token
      console.log(`Checking ${selectedPair.quoteToken.symbol} allowance...`, {
        tokenAddress: quoteTokenAddress,
        amount: side === 'buy' ? makerAmount : takerAmount,
      });

      const quoteAllowance = await checkAllowance({
        tokenAddress: quoteTokenAddress,
        owner: address,
        spender: ConstantProvider.ONEINCH_CONTRACT_ADDRESS,
      });

      const requiredQuoteAmount = side === 'buy' ? makerAmountBigInt : takerAmountBigInt;
      console.log(`${selectedPair.quoteToken.symbol} allowance:`, {
        allowance: quoteAllowance.toString(),
        allowanceFormatted: ethers.formatUnits(quoteAllowance, quoteTokenDecimals),
        requiredAmount: side === 'buy' ? makerAmount : takerAmount,
        needsApproval: quoteAllowance < requiredQuoteAmount,
      });

      if (quoteAllowance < requiredQuoteAmount) {
        console.log(`⚠️ Insufficient ${selectedPair.quoteToken.symbol} allowance - requesting approval...`);
        toast.loading(`Approving ${selectedPair.quoteToken.symbol} for 1inch...`, { id: loadingToast });

        await approveToken({
          tokenAddress: quoteTokenAddress,
          spender: ConstantProvider.ONEINCH_CONTRACT_ADDRESS,
        });

        toast.success(`${selectedPair.quoteToken.symbol} approved for 1inch!`, { id: loadingToast });
        console.log(`✅ ${selectedPair.quoteToken.symbol} approval confirmed`);
      } else {
        console.log(`✅ ${selectedPair.quoteToken.symbol} already approved for 1inch`);
      }

      console.log('✅ All token approvals confirmed');

      // Step 3: Create and sign 1inch limit order
      console.log('Creating 1inch limit order...');
      toast.loading('Creating and signing 1inch order...', { id: loadingToast });
      const { order, signature, orderHash } = await createOrder({
        maker: address,
        taker: ethers.ZeroAddress, // Anyone can fill
        makerToken: makerToken,
        takerToken: takerToken,
        makerAssetAmount: ethers.parseUnits(makerAmount.toString(), makerTokenDecimals),
        takerAssetAmount: ethers.parseUnits(takerAmount.toString(), takerTokenDecimals),
        expiryUnixTimestamp: BigInt(Math.floor(new Date().getTime() / 1000) + 3600), // 1 hour expiry
      });

      console.log('1inch order created and signed:', { order, orderHash });

      // Step 4: Submit 1inch order to backend
      const data: CreateOrderI = {
        orderId: orderHash, // Use 1inch order hash as orderId
        size: side === 'sell' ? Number(makerAmount) : Number(takerAmount),
        price: Number(price),
        side,
        pairId: selectedPair.id,
        userAddress: address,
        metadata: serializeOrder(order, signature.signature), // Serialize 1inch order
      };

      console.log('Submitting order to backend...');
      toast.loading('Submitting to matching engine...', { id: loadingToast });
      const response = await axios.post(
        `${ConstantProvider.BACKEND_URL}/orders/create-order`,
        data
      );
      console.log('Order submitted successfully:', response.data);

      // Handle matching engine response
      const matchResult = response.data;
      let executedTrades = 0;
      let failedTrades = 0;
      const transactionHashes: string[] = [];

      console.log(matchResult, 'matchResult');

      // Execute matched orders on-chain
      if (matchResult.matchedOrders && matchResult.matchedOrders.length > 0) {
        console.log('Orders matched! Executing trades on-chain...');

        for (let i = 0; i < matchResult.matchedOrders.length; i++) {
          const matchedOrder = matchResult.matchedOrders[i];

          // Add delay between processing multiple orders to avoid RPC rate limits
          if (i > 0) {
            console.log('Waiting 2 seconds to avoid RPC rate limit...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          try {
            console.log('═══════════════════════════════════════════════════════');
            console.log(`Processing matched order ${i + 1}/${matchResult.matchedOrders.length}`);
            console.log('Matched order details:', matchedOrder);

            // Reconstruct the 1inch order from metadata
            const { order: reconstructedOrder, signature: orderSignature } = reconstructOrder(
              matchedOrder.metadata
            );

            console.log('Reconstructed order:', reconstructedOrder);
            console.log('Order maker (uint256):', reconstructedOrder.maker);
            console.log('Current user:', address);

            // CRITICAL: Determine if we're the maker by comparing addresses
            // We should only fill orders where WE ARE THE TAKER (not the maker)
            // Note: maker is stored as uint256 in the new 1inch V4 format, so we need to convert it
            const orderMaker = ethers.getAddress('0x' + BigInt(reconstructedOrder.maker).toString(16).padStart(40, '0')).toLowerCase();
            const currentUser = address.toLowerCase();
            const isCurrentUserMaker = orderMaker === currentUser;

            console.log('Role check:', {
              orderMaker,
              currentUser,
              isCurrentUserMaker,
              shouldFillOrder: !isCurrentUserMaker,
            });

            if (isCurrentUserMaker) {
              // We are the MAKER of this order
              // Skip - the counterparty (taker) will fill this order
              console.log('⏭️  SKIPPING: We are the maker of this order. Counterparty will fill it.');
              console.log('═══════════════════════════════════════════════════════\n');
              executedTrades++;
              continue;
            }

            // We are the TAKER - we need to fill this order
            console.log('✅ FILLING: We are the taker. Filling counterparty\'s order...');

            // Verify we're not trying to fill our own order (double check)
            if (orderMaker === currentUser) {
              console.error('❌ ERROR: Attempting to fill own order! Skipping.');
              console.log('═══════════════════════════════════════════════════════\n');
              failedTrades++;
              continue;
            }

            // Calculate fill amount - the takerAmount for 1inch fillOrder
            // This must be in the maker's takerAsset (what maker wants to receive)
            let fillAmount;
            let fillDecimals;
            let fillTokenSymbol;

            if (matchedOrder.side === 'sell') {
              // Maker is selling base for quote
              // takerAsset = quote token, so amount = size * price (in quote)
              const quoteAmount = matchedOrder.size * matchedOrder.price;
              fillAmount = ethers.parseUnits(quoteAmount.toString(), quoteTokenDecimals);
              fillDecimals = quoteTokenDecimals;
              fillTokenSymbol = selectedPair.quoteToken.symbol;
              console.log(`📊 Maker selling ${matchedOrder.size} ${selectedPair.baseToken.symbol} for ${quoteAmount} ${fillTokenSymbol}`);
              console.log(`   We (taker) will provide: ${quoteAmount} ${fillTokenSymbol} (${fillAmount.toString()} wei)`);
            } else {
              // Maker is buying base with quote
              // takerAsset = base token, so amount = size (in base)
              fillAmount = ethers.parseUnits(matchedOrder.size.toString(), baseTokenDecimals);
              fillDecimals = baseTokenDecimals;
              fillTokenSymbol = selectedPair.baseToken.symbol;
              console.log(`📊 Maker buying ${matchedOrder.size} ${selectedPair.baseToken.symbol} with ${matchedOrder.size * matchedOrder.price} ${selectedPair.quoteToken.symbol}`);
              console.log(`   We (taker) will provide: ${matchedOrder.size} ${fillTokenSymbol} (${fillAmount.toString()} wei)`);
            }

            console.log('\n📞 Calling fillOrder on 1inch contract...');
            console.log('   Contract:', reconstructedOrder.makerAsset, '→', reconstructedOrder.takerAsset);
            console.log('   Fill amount:', fillAmount.toString(), fillTokenSymbol);

            const receipt = await fillOrder({
              order: reconstructedOrder,
              signature: orderSignature,
              takerAmount: fillAmount,
            });

            console.log('✅ fillOrder SUCCESS!');
            console.log('   Transaction receipt:', receipt);

            // Capture transaction hash
            const txHash = receipt?.hash || receipt?.transactionHash;
            if (txHash) {
              transactionHashes.push(txHash);
              console.log('   Transaction hash:', txHash);
            }

            console.log('═══════════════════════════════════════════════════════\n');
            executedTrades++;
          } catch (execError: any) {
            console.error('═══════════════════════════════════════════════════════');
            console.error('❌ ERROR executing matched 1inch order');
            console.error('Error message:', execError?.message);
            console.error('Error code:', execError?.code);
            console.error('Error reason:', execError?.reason);
            if (execError?.data) {
              console.error('Error data:', execError.data);
            }
            console.error('Full error:', execError);
            console.error('═══════════════════════════════════════════════════════\n');
            failedTrades++;
          }
        }

        console.log('\n🏁 Order execution complete!');
        console.log(`   Total matched orders: ${matchResult.matchedOrders.length}`);
        console.log(`   Successfully executed: ${executedTrades}`);
        console.log(`   Failed: ${failedTrades}`);
        console.log(`   Transaction hashes: ${transactionHashes.length}`);

        if (executedTrades > 0) {
          // Determine the appropriate message based on whether we filled any orders
          const wasTaker = transactionHashes.length > 0;
          const roleMessage = wasTaker
            ? 'You filled your counterparty\'s order(s)'
            : 'Your order was filled by your counterparty';

          toast.success(
            `${side.toUpperCase()} order matched! ${roleMessage}. ${executedTrades} trade(s) completed${failedTrades > 0 ? `, ${failedTrades} failed` : ''}`,
            { id: loadingToast, duration: 6000 }
          );

          // Show transaction modal if we were the taker (we have transaction hashes)
          if (wasTaker) {
            console.log('📋 Showing transaction modal with', transactionHashes.length, 'transaction(s)');

            setTransactionData({
              executedTrades,
              failedTrades,
              transactionHashes,
            });
            setShowTransactionModal(true);
          } else {
            console.log('ℹ️  Not showing transaction modal - we were the maker, counterparty executed the fill');
          }
        }
      }
      if (matchResult.partial) {
        // Order partially matched
        const partial = matchResult.partial;
        const filled = matchResult.partialQuantityProcessed || 0;
        const remaining = partial.size || 0;

        toast.success(
          `${side.toUpperCase()} order partially filled! Filled: ${filled}, Remaining: ${remaining}`,
          { id: loadingToast, duration: 3000 }
        );

        // Only show modal if there are transaction hashes
        if (transactionHashes.length > 0) {
          setTransactionData({
            executedTrades: filled,
            failedTrades: 0,
            transactionHashes,
          });
          setShowTransactionModal(true);
        }
      } else {
        // Order added to book, no immediate match
        toast.success(`${side.toUpperCase()} order placed successfully and added to order book!`, {
          id: loadingToast,
        });
      }

      // Reset form
      setAmount('');
      setPrice('');
    } catch (error) {
      console.error('Error executing trade:', error);
      toast.error(
        `Failed to ${side} order. ${error instanceof Error ? error.message : 'Please try again.'}`,
        { id: loadingToast, duration: 6000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg">
      <div className="p-3 sm:p-4 lg:p-6 flex flex-col">
        <h3 className="text-gray-800 font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 lg:mb-6">
          Quick Trade
        </h3>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => setSide('buy')}
              className={`py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 ${
                side === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => setSide('sell')}
              className={`py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 ${
                side === 'sell'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Price Input */}
          <div>
            <label className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder={selectedPair?.lastPrice?.toFixed(2) || '0.00'}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white"
              />
              <span className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-bold">
                {selectedPair?.quoteToken.symbol}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white"
              />
              <span className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-bold">
                {selectedPair?.baseToken.symbol}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs sm:text-sm">Order Value</span>
              <span className="text-gray-800 font-bold text-base sm:text-lg">
                $
                {formatTotal(
                  Number(amount),
                  Number(price),
                  selectedPair?.quoteToken.decimals
                )}{' '}
                {` `}
                {selectedPair?.quoteToken.symbol}
              </span>
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={isLoading || !isConnected}
            className={`w-full py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 ${
              isLoading || !isConnected
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : side === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/25'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/25'
            } text-white`}
          >
            {isLoading
              ? 'Processing...'
              : !isConnected
                ? 'Connect Wallet to Trade'
                : side === 'buy'
                  ? 'Execute Buy Order'
                  : 'Execute Sell Order'}
          </button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        side={side}
        executedTrades={transactionData.executedTrades}
        failedTrades={transactionData.failedTrades}
        transactionHashes={transactionData.transactionHashes}
        chainName={chain?.name}
      />
    </div>
  );
}
