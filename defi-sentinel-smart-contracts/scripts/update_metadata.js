const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// $env:BASE_URI='https://defisentinel.org/metadata/badges/'; npx hardhat run scripts/update_metadata.js --network sepolia
async function main() {
    const addressFilePath = path.join(__dirname, "..", "address.txt");
    if (!fs.existsSync(addressFilePath)) {
        console.error("address.txt not found. Please run deploy.js first.");
        process.exit(1);
    }

    const content = fs.readFileSync(addressFilePath, "utf8");
    const badgeNFTLine = content.split("\n").find(l => l.startsWith("BadgeNFT"));

    if (!badgeNFTLine) {
        console.error("BadgeNFT address not found in address.txt");
        process.exit(1);
    }

    const badgeNFTAddress = badgeNFTLine.split("=")[1].trim();
    console.log(`BadgeNFT Address: ${badgeNFTAddress}`);

    // Get Base URI from env or input
    const baseURI = process.env.BASE_URI;
    if (!baseURI) {
        console.error("Please provide BASE_URI env var.");
        console.error("Example: BASE_URI='https://defisentinel.org/metadata/badges/' npx hardhat run scripts/update_metadata.js --network sepolia");
        process.exit(1);
    }

    console.log(`Setting Base URI to: ${baseURI}`);
    const BadgeNFT = await hre.ethers.getContractAt("BadgeNFT", badgeNFTAddress);

    const tx = await BadgeNFT.setBaseURI(baseURI);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("Base URI updated successfully.");

    // Verify
    const newURI = await BadgeNFT.uri(1001);
    console.log(`Verification - URI for 1001: ${newURI}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
