const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Withdrawing funds with account:", deployer.address);

    // 1. Get PaymentContract address from address.txt
    const addressFilePath = path.join(__dirname, "..", "address.txt");
    if (!fs.existsSync(addressFilePath)) {
        throw new Error("address.txt not found. Please deploy contracts first.");
    }

    const addressContent = fs.readFileSync(addressFilePath, "utf8");
    const lines = addressContent.split("\n");
    let paymentContractAddress = "";

    for (const line of lines) {
        if (line.includes("PaymentContract = ")) {
            paymentContractAddress = line.split("PaymentContract = ")[1].trim();
            break;
        }
    }

    if (!paymentContractAddress || !hre.ethers.isAddress(paymentContractAddress)) {
        throw new Error("PaymentContract address not found in address.txt");
    }

    console.log("PaymentContract address:", paymentContractAddress);

    // 1b. Get BadgeNFT address from address.txt
    let badgeNFTAddress = "";
    for (const line of lines) {
        if (line.includes("BadgeNFT = ")) {
            badgeNFTAddress = line.split("BadgeNFT = ")[1].trim();
            break;
        }
    }

    if (!badgeNFTAddress || !hre.ethers.isAddress(badgeNFTAddress)) {
        throw new Error("BadgeNFT address not found in address.txt");
    }
    console.log("BadgeNFT address:", badgeNFTAddress);


    // 2. Connect to contracts
    const PaymentContract = await hre.ethers.getContractFactory("PaymentContract");
    const paymentContract = PaymentContract.attach(paymentContractAddress);

    const BadgeNFT = await hre.ethers.getContractFactory("BadgeNFT");
    const badgeNFT = BadgeNFT.attach(badgeNFTAddress);

    let recipient = deployer.address;
    console.log(`Withdrawing to: ${recipient} (or contract owner where specified)`);

    // 4. Withdraw ETH from BadgeNFT
    try {
        const ethBalance = await hre.ethers.provider.getBalance(badgeNFTAddress);
        if (ethBalance > 0n) {
            console.log(`Found ${hre.ethers.formatEther(ethBalance)} ETH in BadgeNFT. Withdrawing...`);
            // BadgeNFT.withdraw() sends to owner(), doesn't take an argument
            const tx = await badgeNFT.withdraw();
            await tx.wait();
            console.log("ETH withdrawn successfully from BadgeNFT.");
        } else {
            console.log("No ETH balance in BadgeNFT to withdraw.");
        }
    } catch (error) {
        console.error("Error withdrawing ETH from BadgeNFT:", error.message);
    }

    // 5. Withdraw USDC
    try {
        const usdcAddress = await paymentContract.usdcToken();
        const usdcContract = await hre.ethers.getContractAt("IERC20", usdcAddress);
        const usdcBalance = await usdcContract.balanceOf(paymentContractAddress);

        if (usdcBalance > 0n) {
            console.log(`Found ${hre.ethers.formatUnits(usdcBalance, 6)} USDC. Withdrawing...`);
            const tx = await paymentContract.withdrawUSDC(recipient);
            await tx.wait();
            console.log("USDC withdrawn successfully.");
        } else {
            console.log("No USDC balance to withdraw.");
        }
    } catch (error) {
        console.error("Error withdrawing USDC:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
