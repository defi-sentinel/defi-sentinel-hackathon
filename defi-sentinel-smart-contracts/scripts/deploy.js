const hre = require("hardhat");

/**
 * Deploy BadgeNFT, MockERC20 (if on testnet), and PaymentContract
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network <network>
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const networkName = hre.network.name;

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Network:", networkName);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  let usdcAddress = process.env.USDC_ADDRESS;
  const isTestnet = networkName === "sepolia" || networkName === "goerli" || networkName === "localhost" || networkName === "hardhat";

  // 1. Deploy MockERC20 if on testnet and no USDC_ADDRESS is provided
  if (isTestnet && !usdcAddress) {
    console.log("\nDeploying MockERC20 (Mock USDC)...");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    // Mint 1,000,000 initial supply to deployer
    const mockUSDC = await MockERC20.deploy("Mock USDC", "mUSDC", 6, hre.ethers.parseUnits("1000000", 6));
    await mockUSDC.waitForDeployment();
    usdcAddress = await mockUSDC.getAddress();
    console.log("MockERC20 deployed to:", usdcAddress);

    // Mint 10k additional as requested (though initial supply already enough, following instructions)
    console.log("Minting 10,000 mUSDC to deployer...");
    const mintTx = await mockUSDC.mint(deployer.address, hre.ethers.parseUnits("10000", 6));
    await mintTx.wait();
    console.log("Minted 10,000 mUSDC successfully.");
  } else if (!usdcAddress) {
    throw new Error("USDC_ADDRESS not provided and not on a recognized testnet.");
  }

  const monthlyFee = process.env.MONTHLY_FEE || hre.ethers.parseUnits("9.9", 6); // 9.9 USDC
  const yearlyFee = process.env.YEARLY_FEE || hre.ethers.parseUnits("99.9", 6); // 99.9 USDC

  console.log("\n=== Deployment Configuration ===");
  console.log("USDC Address:", usdcAddress);
  console.log("Monthly Fee:", monthlyFee.toString());
  console.log("Yearly Fee:", yearlyFee.toString());
  console.log("===============================\n");

  // 2. Deploy BadgeNFT
  console.log("Deploying BadgeNFT...");
  const BadgeNFT = await hre.ethers.getContractFactory("BadgeNFT");
  const badgeNFT = await BadgeNFT.deploy(deployer.address);
  await badgeNFT.waitForDeployment();
  const badgeNFTAddress = await badgeNFT.getAddress();
  console.log("BadgeNFT deployed to:", badgeNFTAddress);

  // 3. Deploy PaymentContract
  console.log("\nDeploying PaymentContract...");
  const PaymentContract = await hre.ethers.getContractFactory("PaymentContract");
  const paymentContract = await PaymentContract.deploy(
    deployer.address,
    usdcAddress,
    badgeNFTAddress,
    monthlyFee,
    yearlyFee
  );
  await paymentContract.waitForDeployment();
  const paymentContractAddress = await paymentContract.getAddress();
  console.log("PaymentContract deployed to:", paymentContractAddress);

  // 4. Set PaymentContract in BadgeNFT
  console.log("\nSetting PaymentContract in BadgeNFT...");
  const setTx = await badgeNFT.setPaymentContract(paymentContractAddress);
  await setTx.wait();
  console.log("PaymentContract set in BadgeNFT");

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("MockUSDC:       ", usdcAddress);
  console.log("BadgeNFT:       ", badgeNFTAddress);
  console.log("PaymentContract:", paymentContractAddress);
  console.log("Owner:          ", deployer.address);
  console.log("========================\n");

  // 5. Save and Mint to extra addresses from address.txt
  console.log("\n=== Saving Addresses & Minting to Test Accounts ===");
  const fs = require("fs");
  const path = require("path");
  const addressFilePath = path.join(__dirname, "..", "address.txt");

  let addressContent = "";
  if (fs.existsSync(addressFilePath)) {
    addressContent = fs.readFileSync(addressFilePath, "utf8");
  }

  // Update contract addresses in the file content
  const newLines = [
    `BadgeNFT = ${badgeNFTAddress}`,
    `PaymentContract = ${paymentContractAddress}`,
    `USDC = ${usdcAddress}`
  ];

  // Append or prepend? Let's keep existing content and add/update our specific ones
  let lines = addressContent.split("\n").filter(l => l.trim() !== "");

  // Remove existing entries for these specific labels to avoid duplicates
  const labelsToUpdate = ["BadgeNFT", "PaymentContract", "USDC"];
  lines = lines.filter(line => !labelsToUpdate.some(label => line.startsWith(label)));

  // Add new ones
  lines.push(...newLines);
  fs.writeFileSync(addressFilePath, lines.join("\n") + "\n");
  console.log("Addresses saved to address.txt");

  // Read the file again to find ALL addresses to mint to (e.g., test1 = 0x...)
  const testAddresses = [];
  lines.forEach(line => {
    const match = line.match(/0x[a-fA-F0-9]{40}/);
    if (match) {
      const addr = match[0];
      // Don't mint to the contract addresses themselves or the deployer (already has supply)
      if (addr !== badgeNFTAddress && addr !== paymentContractAddress && addr !== usdcAddress && addr !== deployer.address) {
        testAddresses.push(addr);
      }
    }
  });

  if (testAddresses.length > 0) {
    console.log(`Found ${testAddresses.length} test addresses in address.txt. Minting 1000 mUSDC to each...`);
    const mockUSDC = await hre.ethers.getContractAt("MockERC20", usdcAddress);
    const mintAmount = hre.ethers.parseUnits("1000", 6);

    for (const addr of testAddresses) {
      try {
        console.log(`Minting for: ${addr}`);
        const tx = await mockUSDC.mint(addr, mintAmount);
        await tx.wait();
      } catch (e) {
        console.error(`Failed to mint for ${addr}:`, e.message);
      }
    }
    console.log("Bulk minting completed.");
  }

  // Output format for easy copy-paste to constants.ts
  console.log("\nUpdate your frontend constants.ts with:");
  console.log(`BadgeNFT: "${badgeNFTAddress}"`);
  console.log(`PaymentContract: "${paymentContractAddress}"`);
  console.log(`USDC: "${usdcAddress}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
