const constants = {
  // Network
  NETWORK_CHAIN_ID: Number(process.env.NEXT_PUBLIC_PROJECT_NETWORK_ID) as any,

  // Backend
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL as string,

  // 1inch Configuration
  ONEINCH_API_KEY: process.env.NEXT_PUBLIC_ONEINCH_API_KEY as string,
  ONEINCH_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ONEINCH_CONTRACT_ADDRESS as string,

  // Legacy 0x Configuration (will be removed)
  EXCHANGE_PROXY_ADDRESS: process.env.NEXT_PUBLIC_EXCHANGE_PROXY_ADDRESS as string,
};

// Debug logging
console.log('🔧 ConstantProvider loaded:', {
  ONEINCH_CONTRACT_ADDRESS: constants.ONEINCH_CONTRACT_ADDRESS,
  NETWORK_CHAIN_ID: constants.NETWORK_CHAIN_ID,
  BACKEND_URL: constants.BACKEND_URL,
  hasContractAddress: !!constants.ONEINCH_CONTRACT_ADDRESS
});

export default constants;
