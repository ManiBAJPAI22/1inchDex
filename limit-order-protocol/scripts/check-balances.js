const hre = require("hardhat");

async function main() {
  const account = "0x3A6CD11af94ea6e36cB0a60bde7bb65F718dCAcA";

  const tokens = {
    MBTC: "0xbFf4bfF3ef603ef102c1db5634353691EBe5948E",
    MUSDT: "0x3CDF19aD4e2656269aAE1b8AC8E932D66cDd0443",
    MUSDC: "0x9f19b6B8cB0378592C6173F9FC794401274DBb6a"
  };

  console.log("\n📊 Checking Actual On-Chain Balances...\n");
  console.log("Account:", account);
  console.log("");

  for (const [name, address] of Object.entries(tokens)) {
    const token = await hre.ethers.getContractAt("TestToken", address);
    const balance = await token.balanceOf(account);
    const decimals = await token.decimals();
    const symbol = await token.symbol();
    const tokenName = await token.name();

    console.log(`${name} (${symbol}):`);
    console.log(`  Name: ${tokenName}`);
    console.log(`  Contract: ${address}`);
    console.log(`  Raw balance: ${balance.toString()}`);
    console.log(`  Decimals: ${decimals}`);
    console.log(`  Formatted: ${hre.ethers.formatUnits(balance, decimals)}`);
    console.log("");
  }

  // Check MON balance
  const monBalance = await hre.ethers.provider.getBalance(account);
  console.log("MON (Native Token):");
  console.log(`  Raw balance: ${monBalance.toString()}`);
  console.log(`  Formatted: ${hre.ethers.formatEther(monBalance)} MON`);

  console.log("\n✅ Balance check complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
