const hre = require("hardhat");

async function main() {
  console.log("Deploying Solo Jackpot Leaderboard to Celo...");

  // Get the contract factory
  const SoloJackpotLeaderboard = await hre.ethers.getContractFactory("SoloJackpotLeaderboard");

  // Deploy the contract
  console.log("Deploying contract...");
  const leaderboard = await SoloJackpotLeaderboard.deploy();

  await leaderboard.waitForDeployment();

  const address = await leaderboard.getAddress();

  console.log("✅ SoloJackpotLeaderboard deployed to:", address);
  console.log("\nNext steps:");
  console.log("1. Update your frontend with the contract address");
  console.log("2. Verify the contract on Celoscan (if on mainnet):");
  console.log(`   npx hardhat verify --network celo ${address}`);
  console.log("\n3. Add the contract address to your .env file:");
  console.log(`   NEXT_PUBLIC_LEADERBOARD_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
