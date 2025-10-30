const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying Test ERC20 Tokens to Monad Testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MON\n");

  // Deploy MockBTC (18 decimals, 1000 BTC initial supply)
  console.log("📝 Deploying MockBTC...");
  const MockBTC = await hre.ethers.getContractFactory("TestToken");
  const mockBTC = await MockBTC.deploy(
    "Mock Bitcoin",
    "MBTC",
    18,
    hre.ethers.parseUnits("1000", 18) // 1000 BTC
  );
  await mockBTC.waitForDeployment();
  const btcAddress = await mockBTC.getAddress();
  console.log("✅ MockBTC deployed to:", btcAddress);

  // Deploy MockUSDT (6 decimals, 1,000,000 USDT initial supply)
  console.log("\n📝 Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("TestToken");
  const mockUSDT = await MockUSDT.deploy(
    "Mock Tether USD",
    "MUSDT",
    6,
    hre.ethers.parseUnits("1000000", 6) // 1,000,000 USDT
  );
  await mockUSDT.waitForDeployment();
  const usdtAddress = await mockUSDT.getAddress();
  console.log("✅ MockUSDT deployed to:", usdtAddress);

  // Deploy MockUSDC (6 decimals, 1,000,000 USDC initial supply)
  console.log("\n📝 Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("TestToken");
  const mockUSDC = await MockUSDC.deploy(
    "Mock USD Coin",
    "MUSDC",
    6,
    hre.ethers.parseUnits("1000000", 6) // 1,000,000 USDC
  );
  await mockUSDC.waitForDeployment();
  const usdcAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", usdcAddress);

  // Check balances
  console.log("\n📊 Token Balances:");
  const btcBalance = await mockBTC.balanceOf(deployer.address);
  const usdtBalance = await mockUSDT.balanceOf(deployer.address);
  const usdcBalance = await mockUSDC.balanceOf(deployer.address);

  console.log("MBTC:", hre.ethers.formatUnits(btcBalance, 18));
  console.log("MUSDT:", hre.ethers.formatUnits(usdtBalance, 6));
  console.log("MUSDC:", hre.ethers.formatUnits(usdcBalance, 6));

  console.log("\n✅ All tokens deployed successfully!");
  console.log("\n📋 Token Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("MockBTC (MBTC):", btcAddress);
  console.log("MockUSDT (MUSDT):", usdtAddress);
  console.log("MockUSDC (MUSDC):", usdcAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("💡 Save these addresses to update your database trading pairs!");
  console.log("\n🔗 View on Monad Explorer:");
  console.log(`https://testnet.monadexplorer.com/address/${btcAddress}`);
  console.log(`https://testnet.monadexplorer.com/address/${usdtAddress}`);
  console.log(`https://testnet.monadexplorer.com/address/${usdcAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
