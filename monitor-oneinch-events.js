const { ethers } = require('ethers');

const RPC_URL = 'https://testnet-rpc.monad.xyz';
const ONEINCH_CONTRACT = '0xB5538A77399b009dC036fe7FfD94798B5b3D6962';

async function monitorEvents() {
  console.log('\n👁️  Monitoring 1inch Contract Events\n');
  console.log('='.repeat(60));
  console.log(`Contract: ${ONEINCH_CONTRACT}`);
  console.log('Watching for OrderFilled events...\n');

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Complete ABI with events
  const abi = [
    'event OrderFilled(bytes32 indexed orderHash, uint256 remaining)',
    'event OrderCanceled(bytes32 indexed orderHash, uint256 makingAmount)',
  ];

  const contract = new ethers.Contract(ONEINCH_CONTRACT, abi, provider);

  // Query recent events
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, currentBlock - 100); // Last 100 blocks

  console.log(`📊 Checking blocks ${fromBlock} to ${currentBlock}...\n`);

  // Check OrderFilled events
  const filledFilter = contract.filters.OrderFilled();
  const filledEvents = await contract.queryFilter(filledFilter, fromBlock, currentBlock);

  if (filledEvents.length > 0) {
    console.log(`✅ Found ${filledEvents.length} OrderFilled event(s):\n`);
    for (const event of filledEvents) {
      console.log(`📍 Order Filled:`);
      console.log(`   Order Hash: ${event.args[0]}`);
      console.log(`   Remaining: ${event.args[1].toString()}`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   TX: ${event.transactionHash}`);
      console.log(`   Explorer: https://testnet.monad.xyz/tx/${event.transactionHash}\n`);
    }
  } else {
    console.log('ℹ️  No OrderFilled events in recent blocks');
    console.log('   This means no orders have been filled recently\n');
  }

  // Check OrderCanceled events
  const canceledFilter = contract.filters.OrderCanceled();
  const canceledEvents = await contract.queryFilter(canceledFilter, fromBlock, currentBlock);

  if (canceledEvents.length > 0) {
    console.log(`✅ Found ${canceledEvents.length} OrderCanceled event(s):\n`);
    for (const event of canceledEvents) {
      console.log(`📍 Order Canceled:`);
      console.log(`   Order Hash: ${event.args[0]}`);
      console.log(`   Block: ${event.blockNumber}`);
      console.log(`   TX: ${event.transactionHash}\n`);
    }
  }

  console.log('='.repeat(60));
  console.log('\n💡 To monitor in real-time, you can also:');
  console.log('   1. Watch https://testnet.monad.xyz/address/' + ONEINCH_CONTRACT);
  console.log('   2. Run this script periodically');
  console.log('   3. Check transaction hashes from your frontend logs\n');
}

monitorEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
