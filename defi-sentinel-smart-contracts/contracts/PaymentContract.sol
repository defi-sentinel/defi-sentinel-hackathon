// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "./BadgeNFT.sol";

/**
 * @title PaymentContract
 * @notice Handles membership payments in USDC and auto-mints membership badges
 * @dev Payment contract for DeFi Sentinel membership subscriptions
 */
contract PaymentContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    uint256 public monthlyFee; // USDC amount (6 decimals)
    uint256 public yearlyFee; // USDC amount (6 decimals)
    uint256 public totalFeesCollected;
    uint256 public totalMembers;

    IERC20 public usdcToken; // USDC token address
    BadgeNFT public badgeNFT; // Badge NFT contract address

    // Badge ID constants (from BadgeNFT)
    uint256 private constant EARLY_ADOPTER_ID = 1001;
    uint256 private constant PRO_MEMBER_ID = 3001;
    uint256 private constant SENTINEL_ELITE_ID = 3002;

    // Events
    event MembershipPaid(
        address indexed user,
        uint256 months,
        uint256 amount,
        uint256 yearCount,
        uint256 monthCount
    );
    event FeesWithdrawn(address indexed to, uint256 amount);
    event FeesUpdated(uint256 monthlyFee, uint256 yearlyFee);
    event ContractsSet(address indexed usdcToken, address indexed badgeNFT);

    constructor(
        address initialOwner,
        address _usdcToken,
        address _badgeNFT,
        uint256 _monthlyFee,
        uint256 _yearlyFee
    ) Ownable(initialOwner) {
        require(
            _usdcToken != address(0),
            "PaymentContract: Invalid USDC address"
        );
        require(
            _badgeNFT != address(0),
            "PaymentContract: Invalid BadgeNFT address"
        );
        require(_monthlyFee > 0, "PaymentContract: Invalid monthly fee");
        require(_yearlyFee > 0, "PaymentContract: Invalid yearly fee");

        usdcToken = IERC20(_usdcToken);
        badgeNFT = BadgeNFT(_badgeNFT);
        monthlyFee = _monthlyFee; // 9.9 USDC (9900000 with 6 decimals)
        yearlyFee = _yearlyFee; // 99.9 USDC (99900000 with 6 decimals)
    }

    /**
     * @notice Pay for membership subscription with permit (EIP-2612)
     * @dev This function handles approval via signature, so only ONE transaction is needed
     *      User signs a permit message off-chain (no gas), then this function executes permit + payment
     * @param months Number of months to pay for
     * @param deadline Deadline for the permit signature
     * @param v Signature v component
     * @param r Signature r component
     * @param s Signature s component
     */
    function payMembershipWithPermit(
        uint256 months,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(months > 0, "PaymentContract: Months must be greater than 0");
        require(deadline >= block.timestamp, "PaymentContract: Permit expired");

        // Calculate payment
        uint256 yearCount = months / 12;
        uint256 monthCount = months % 12;
        uint256 cost = (yearCount * yearlyFee) + (monthCount * monthlyFee);

        // Execute permit on USDC (this approves this contract to spend USDC)
        // USDC's permit function will verify the signature
        try
            IERC20Permit(address(usdcToken)).permit(
                msg.sender,
                address(this),
                cost,
                deadline,
                v,
                r,
                s
            )
        {} catch {
            // If USDC doesn't support permit, revert with helpful message
            revert(
                "PaymentContract: USDC permit not supported. Use payMembership() after approving."
            );
        }
        // Transfer USDC from user to contract
        usdcToken.safeTransferFrom(msg.sender, address(this), cost);

        // Process payment (same logic as payMembership)
        _processPayment(msg.sender, months, cost, yearCount, monthCount);
    }

    /**
     * @notice Pay for membership subscription
     * @dev User must approve this contract to spend USDC before calling this function
     * @param months Number of months to pay for
     */
    function payMembership(uint256 months) external nonReentrant {
        require(months > 0, "PaymentContract: Months must be greater than 0");

        // Calculate payment
        uint256 yearCount = months / 12;
        uint256 monthCount = months % 12;
        uint256 cost = (yearCount * yearlyFee) + (monthCount * monthlyFee);

        // Check allowance
        uint256 allowance = usdcToken.allowance(msg.sender, address(this));
        require(
            allowance >= cost,
            "PaymentContract: Insufficient USDC allowance. Please approve first."
        );

        // Transfer USDC from user to contract
        usdcToken.safeTransferFrom(msg.sender, address(this), cost);

        // Process payment
        _processPayment(msg.sender, months, cost, yearCount, monthCount);
    }

    /**
     * @notice Internal function to process payment and mint badges
     */
    function _processPayment(
        address user,
        uint256 months,
        uint256 cost,
        uint256 yearCount,
        uint256 monthCount
    ) internal {
        // Update totals
        totalFeesCollected += cost;

        // Check if this is first payment (Pro Member)
        bool isFirstPayment = !badgeNFT.hasBadge(user, PRO_MEMBER_ID);

        // Auto-mint membership badges
        if (isFirstPayment) {
            // First payment: mint Pro Member
            badgeNFT.mintMembershipBadge(user, PRO_MEMBER_ID);
            totalMembers++;

            // Auto-mint Early Adopter for first 1000 members
            // We use totalMembers as current count (simplified proxy for earlyAdopterCount)
            if (
                totalMembers <= 1000 &&
                !badgeNFT.hasBadge(user, EARLY_ADOPTER_ID)
            ) {
                // Try to mint early adopter, ignore if cap reached in NFT contract
                try
                    badgeNFT.mintMembershipBadge(user, EARLY_ADOPTER_ID)
                {} catch {}
            }
        }

        // If yearCount >= 1, mint Sentinel Elite
        if (yearCount >= 1 && !badgeNFT.hasBadge(user, SENTINEL_ELITE_ID)) {
            badgeNFT.mintMembershipBadge(user, SENTINEL_ELITE_ID);
        }

        emit MembershipPaid(user, months, cost, yearCount, monthCount);
    }

    /**
     * @notice Withdraw USDC from contract (owner only)
     * @param to Address to withdraw to
     */
    function withdrawUSDC(address to) external onlyOwner {
        require(to != address(0), "PaymentContract: Invalid address");
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "PaymentContract: No balance to withdraw");

        usdcToken.safeTransfer(to, balance);
        emit FeesWithdrawn(to, balance);
    }

    /**
     * @notice Set monthly fee (owner only)
     * @param fee New monthly fee in USDC (6 decimals)
     */
    function setMonthlyFee(uint256 fee) external onlyOwner {
        require(fee > 0, "PaymentContract: Invalid fee");
        monthlyFee = fee;
        emit FeesUpdated(monthlyFee, yearlyFee);
    }

    /**
     * @notice Set yearly fee (owner only)
     * @param fee New yearly fee in USDC (6 decimals)
     */
    function setYearlyFee(uint256 fee) external onlyOwner {
        require(fee > 0, "PaymentContract: Invalid fee");
        yearlyFee = fee;
        emit FeesUpdated(monthlyFee, yearlyFee);
    }

    /**
     * @notice Get total individual members
     * @return Total number of unique members
     */
    function getTotalMembers() external view returns (uint256) {
        return totalMembers;
    }

    /**
     * @notice Get total fees collected
     * @return Total USDC collected
     */
    function getTotalFeesCollected() external view returns (uint256) {
        return totalFeesCollected;
    }

    /**
     * @notice Calculate the cost for a given number of months
     * @param months Number of months
     * @return cost Total cost in USDC (6 decimals)
     */
    function calculateCost(uint256 months) external view returns (uint256) {
        uint256 yearCount = months / 12;
        uint256 monthCount = months % 12;
        return (yearCount * yearlyFee) + (monthCount * monthlyFee);
    }

    /**
     * @notice Check if user has sufficient allowance for a payment
     * @param user User address
     * @param months Number of months
     * @return hasAllowance True if user has sufficient allowance
     * @return requiredAmount Amount required in USDC
     * @return currentAllowance User's current allowance
     */
    function checkAllowance(
        address user,
        uint256 months
    )
        external
        view
        returns (
            bool hasAllowance,
            uint256 requiredAmount,
            uint256 currentAllowance
        )
    {
        uint256 yearCount = months / 12;
        uint256 monthCount = months % 12;
        requiredAmount = (yearCount * yearlyFee) + (monthCount * monthlyFee);
        currentAllowance = usdcToken.allowance(user, address(this));
        hasAllowance = currentAllowance >= requiredAmount;
    }
}
