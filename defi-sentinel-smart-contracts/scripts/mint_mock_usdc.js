const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const addressFilePath = path.join(__dirname, "..", "address.txt");

    if (!fs.existsSync(addressFilePath)) {
        console.error("address.txt not found. Please run deploy.js first or create the file.");
        process.exit(1);
    }

    const content = fs.readFileSync(addressFilePath, "utf8");
    const lines = content.split("\n").filter(l => l.trim() !== "");

    // 1. Find USDC address
    let usdcAddress = "";
    lines.forEach(line => {
        if (line.startsWith("USDC")) {
            const match = line.match(/0x[a-fA-F0-9]{40}/);
            if (match) usdcAddress = match[0];
        }
    });

    if (!usdcAddress) {
        console.error("USDC address not found in address.txt");
        process.exit(1);
    }

    // 2. Identify target addresses
    let targets = [];
    const envTarget = process.env.TARGET_ADDRESS;

    if (envTarget) {
        targets = [envTarget];
        console.log("Using target address from environment variable.");
    } else {
        // Collect all addresses that aren't contract addresses
        const contractLabels = ["BadgeNFT", "PaymentContract", "USDC"];
        lines.forEach(line => {
            const isContract = contractLabels.some(label => line.startsWith(label));
            if (!isContract) {
                const match = line.match(/0x[a-fA-F0-9]{40}/);
                if (match) targets.push(match[0]);
            }
        });
    }

    if (targets.length === 0) {
        console.error("No target addresses found in address.txt or environment.");
        process.exit(1);
    }

    const amount = process.env.AMOUNT || "1000";
    const mintAmount = hre.ethers.parseUnits(amount, 6);

    console.log(`Using USDC at: ${usdcAddress}`);
    console.log(`Minting ${amount} mUSDC to ${targets.length} address(es)...`);

    const mockUSDC = await hre.ethers.getContractAt("MockERC20", usdcAddress);

    for (const addr of targets) {
        try {
            console.log(`Minting for: ${addr}`);
            const tx = await mockUSDC.mint(addr, mintAmount);
            await tx.wait();
            const balance = await mockUSDC.balanceOf(addr);
            console.log(`  Success! New balance: ${hre.ethers.formatUnits(balance, 6)} mUSDC`);
        } catch (e) {
            console.error(`  Failed for ${addr}:`, e.message);
        }
    }

    console.log("\nAll minting operations completed.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
