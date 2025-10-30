const hre = require("hardhat");

async function main() {
  const tokens = {
    MBTC: "0xbFf4bfF3ef603ef102c1db5634353691EBe5948E",
    MUSDT: "0x3CDF19aD4e2656269aAE1b8AC8E932D66cDd0443",
    MUSDC: "0x9f19b6B8cB0378592C6173F9FC794401274DBb6a"
  };

  // Get user address from command line or use default
  const userAddress = process.env.USER_ADDRESS || "0x3A6CD11af94ea6e36cB0a60bde7bb65F718dCAcA";

  console.log("\n🪙 Minting test tokens to:", userAddress);
  console.log("");

  // Mint MBTC
  const mbtc = await hre.ethers.getContractAt("TestToken", tokens.MBTC);
  console.log("Minting 100 MBTC...");
  const tx1 = await mbtc.mint(userAddress, hre.ethers.parseUnits("100", 18));
  await tx1.wait();
  console.log("✅ Minted 100 MBTC");

  // Mint MUSDT
  const musdt = await hre.ethers.getContractAt("TestToken", tokens.MUSDT);
  console.log("Minting 100,000 MUSDT...");
  const tx2 = await musdt.mint(userAddress, hre.ethers.parseUnits("100000", 6));
  await tx2.wait();
  console.log("✅ Minted 100,000 MUSDT");

  // Mint MUSDC
  const musdc = await hre.ethers.getContractAt("TestToken", tokens.MUSDC);
  console.log("Minting 100,000 MUSDC...");
  const tx3 = await musdc.mint(userAddress, hre.ethers.parseUnits("100000", 6));
  await tx3.wait();
  console.log("✅ Minted 100,000 MUSDC");

  console.log("\n✅ All tokens minted successfully!");
  console.log("\n📊 New Balances:");

  const mbtcBalance = await mbtc.balanceOf(userAddress);
  const musdtBalance = await musdt.balanceOf(userAddress);
  const musdcBalance = await musdc.balanceOf(userAddress);

  console.log("MBTC:", hre.ethers.formatUnits(mbtcBalance, 18));
  console.log("MUSDT:", hre.ethers.formatUnits(musdtBalance, 6));
  console.log("MUSDC:", hre.ethers.formatUnits(musdcBalance, 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
