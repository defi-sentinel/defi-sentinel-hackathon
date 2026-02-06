const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFi Sentinel Integration Tests", function () {
    let paymentContract;
    let badgeNFT;
    let mockUSDC;
    let owner;
    let user1;
    let user2;
    let treasury;

    const MONTHLY_FEE = ethers.parseUnits("9.9", 6);
    const YEARLY_FEE = ethers.parseUnits("99.9", 6);
    const DEFI_NOVICE_ID = 2001;
    const PRO_MEMBER_ID = 3001;
    const SENTINEL_ELITE_ID = 3002;
    const BADGE_PRICE = ethers.parseEther("0.001");
    const INITIAL_SUPPLY = ethers.parseUnits("1000000", 6);

    beforeEach(async function () {
        [owner, user1, user2, treasury] = await ethers.getSigners();

        // Deploy everything
        const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
        badgeNFT = await BadgeNFT.deploy(owner.address);
        await badgeNFT.waitForDeployment();

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6, INITIAL_SUPPLY);
        await mockUSDC.waitForDeployment();

        const PaymentContract = await ethers.getContractFactory("PaymentContract");
        paymentContract = await PaymentContract.deploy(
            owner.address,
            await mockUSDC.getAddress(),
            await badgeNFT.getAddress(),
            MONTHLY_FEE,
            YEARLY_FEE
        );
        await paymentContract.waitForDeployment();

        // Setup connection
        await badgeNFT.setPaymentContract(await paymentContract.getAddress());

        // Fund users
        await mockUSDC.transfer(user1.address, ethers.parseUnits("10000", 6));
        await mockUSDC.transfer(user2.address, ethers.parseUnits("10000", 6));
    });

    describe("Full User Journey", function () {
        it("Should handle a user minting paid badge and then buying membership", async function () {
            // 1. User checks badges - has none
            expect(await badgeNFT.hasBadge(user1.address, DEFI_NOVICE_ID)).to.be.false;
            expect(await badgeNFT.hasBadge(user1.address, PRO_MEMBER_ID)).to.be.false;

            // 2. User mints a paid badge (Defi Novice)
            await badgeNFT.connect(user1).mintBadge(DEFI_NOVICE_ID, { value: BADGE_PRICE });
            expect(await badgeNFT.hasBadge(user1.address, DEFI_NOVICE_ID)).to.be.true;

            // 3. User buys 1 month membership
            await mockUSDC.connect(user1).approve(await paymentContract.getAddress(), MONTHLY_FEE);
            await paymentContract.connect(user1).payMembership(1);

            // 4. Verify user has both badges
            expect(await badgeNFT.hasBadge(user1.address, DEFI_NOVICE_ID)).to.be.true;
            expect(await badgeNFT.hasBadge(user1.address, PRO_MEMBER_ID)).to.be.true;

            // 5. Verify user is NOT Sentinel Elite
            expect(await badgeNFT.hasBadge(user1.address, SENTINEL_ELITE_ID)).to.be.false;

            // 6. User extends for 11 months (total 12) - Wait, logic checks CURRENT payment for 12+ or just logic?
            // Logic: if (yearCount >= 1) ... where yearCount = months / 12. 
            // It uses the params passed to payMembership.
            // So payMembership(11) -> 11/12 = 0 years. It won't mint Elite.
            // User needs to pay for 12 months IN A SINGLE TRANSACTION to get Elite based on current logic?
            // Let's check logic:
            // uint256 yearCount = months / 12;
            // if (yearCount >= 1 && !badgeNFT.hasBadge(user, SENTINEL_ELITE_ID)) { mint... }
            // YES. The current contract architecture rewards BULK payment, not cumulative time.

            await mockUSDC.connect(user1).approve(await paymentContract.getAddress(), YEARLY_FEE);
            await paymentContract.connect(user1).payMembership(12);

            // Now should have Elite
            expect(await badgeNFT.hasBadge(user1.address, SENTINEL_ELITE_ID)).to.be.true;
        });

        it("Should track fees correctly across multiple users and operations", async function () {
            // User 1 buys 1 month
            await mockUSDC.connect(user1).approve(await paymentContract.getAddress(), MONTHLY_FEE);
            await paymentContract.connect(user1).payMembership(1);

            // User 2 buys 12 months
            await mockUSDC.connect(user2).approve(await paymentContract.getAddress(), YEARLY_FEE);
            await paymentContract.connect(user2).payMembership(12);

            // User 1 mints paid badge (goes to BadgeNFT balance, not PaymentContract)
            await badgeNFT.connect(user1).mintBadge(DEFI_NOVICE_ID, { value: BADGE_PRICE });

            // Verify Payment Contract Balance
            expect(await mockUSDC.balanceOf(await paymentContract.getAddress())).to.equal(MONTHLY_FEE + YEARLY_FEE);
            expect(await paymentContract.totalFeesCollected()).to.equal(MONTHLY_FEE + YEARLY_FEE);

            // Verify BadgeNFT Balance (ETH)
            expect(await ethers.provider.getBalance(await badgeNFT.getAddress())).to.equal(BADGE_PRICE);

            // Verify withdrawal flows

            // Withdraw USDC
            const initialTreasuryUSDC = await mockUSDC.balanceOf(treasury.address);
            await paymentContract.withdrawUSDC(treasury.address);
            expect(await mockUSDC.balanceOf(treasury.address)).to.equal(initialTreasuryUSDC + MONTHLY_FEE + YEARLY_FEE);

            // Withdraw ETH
            const initialOwnerETH = await ethers.provider.getBalance(owner.address);
            const tx = await badgeNFT.withdraw();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            const finalOwnerETH = await ethers.provider.getBalance(owner.address);

            // owner balance increases by BADGE_PRICE but decreases by gas
            expect(finalOwnerETH).to.equal(initialOwnerETH + BADGE_PRICE - gasUsed);
        });
    });

    describe("Cross-Contract Security", function () {
        it("Should enforce only PaymentContract can mint membership badges", async function () {
            // User tries to mint membership badge directly
            await expect(
                badgeNFT.connect(user1).mintMembershipBadge(user1.address, PRO_MEMBER_ID)
            ).to.be.revertedWith("BadgeNFT: Only payment contract can call this");

            // Owner tries to mint membership badge directly (also restricted)
            await expect(
                badgeNFT.connect(owner).mintMembershipBadge(user1.address, PRO_MEMBER_ID)
            ).to.be.revertedWith("BadgeNFT: Only payment contract can call this");

            // Only via payment
            await mockUSDC.connect(user1).approve(await paymentContract.getAddress(), MONTHLY_FEE);
            await paymentContract.connect(user1).payMembership(1);
            expect(await badgeNFT.hasBadge(user1.address, PRO_MEMBER_ID)).to.be.true;
        });
    });
});
