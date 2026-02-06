// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BadgeNFT
 * @notice ERC-1155 Soulbound Token contract for DeFi Sentinel badges
 * @dev All badges are soulbound (non-transferable) and minted based on specific conditions
 *
 * Badge IDs:
 * - 1001: Early Adopter (free, capped at 1000)
 * - 2001: DeFi Novice (paid)
 * - 2002: DeFi Intermediate (paid)
 * - 2003: DeFi Master (paid)
 * - 2004: Risk Guardian (paid)
 * - 3001: Pro Member (free, auto-minted by PaymentContract)
 * - 3002: Sentinel Elite (free, auto-minted by PaymentContract)
 * - 4001: Scholar (paid)
 * - 4002: Explorer (paid)
 */
contract BadgeNFT is ERC1155, Ownable, ReentrancyGuard {
    // Badge ID constants
    uint256 public constant EARLY_ADOPTER_ID = 1001;
    uint256 public constant DEFI_NOVICE_ID = 2001;
    uint256 public constant DEFI_INTERMEDIATE_ID = 2002;
    uint256 public constant DEFI_MASTER_ID = 2003;
    uint256 public constant RISK_GUARDIAN_ID = 2004;
    uint256 public constant PRO_MEMBER_ID = 3001;
    uint256 public constant SENTINEL_ELITE_ID = 3002;
    uint256 public constant SCHOLAR_ID = 4001;
    uint256 public constant EXPLORER_ID = 4002;

    // Early Adopter cap
    uint256 public constant EARLY_ADOPTER_CAP = 1000;

    // State variables
    mapping(address => mapping(uint256 => bool)) public hasBadge;
    mapping(uint256 => uint256) public badgePrice; // Price in wei (ETH), 0 = free
    uint256 public earlyAdopterCount;
    address public paymentContract; // Only payment contract can mint membership badges

    // URI management
    string private _baseURI; // Base URI for all tokens (e.g., "https://api.defisentinel.com/badges/")
    mapping(uint256 => string) private _tokenURIs; // Individual token URIs (optional override)

    // Events
    event BadgeMinted(address indexed user, uint256 indexed badgeId);
    event BadgePriceSet(uint256 indexed badgeId, uint256 price);
    event PaymentContractSet(address indexed paymentContract);
    event BaseURISet(string baseURI);
    event TokenURISet(uint256 indexed badgeId, string tokenURI);

    // Modifiers
    modifier onlyPaymentContract() {
        require(
            msg.sender == paymentContract,
            "BadgeNFT: Only payment contract can call this"
        );
        _;
    }

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        // Initialize badge prices (in wei)
        // Default prices for paid badges (0.001 ETH = 1000000000000000 wei)
        badgePrice[DEFI_NOVICE_ID] = 0.001 ether;
        badgePrice[DEFI_INTERMEDIATE_ID] = 0.001 ether;
        badgePrice[DEFI_MASTER_ID] = 0.001 ether;
        badgePrice[RISK_GUARDIAN_ID] = 0.001 ether;
        badgePrice[SCHOLAR_ID] = 0.001 ether;
        badgePrice[EXPLORER_ID] = 0.001 ether;
        // Free badges (price = 0)
        badgePrice[EARLY_ADOPTER_ID] = 0;
        badgePrice[PRO_MEMBER_ID] = 0;
        badgePrice[SENTINEL_ELITE_ID] = 0;
    }

    /**
     * @notice Mint a badge (for paid badges and Early Adopter)
     * @param badgeId The badge ID to mint
     */
    function mintBadge(uint256 badgeId) external payable nonReentrant {
        require(!hasBadge[msg.sender][badgeId], "BadgeNFT: Already minted");

        if (badgeId == EARLY_ADOPTER_ID) {
            // Early Adopter: free, capped
            require(
                earlyAdopterCount < EARLY_ADOPTER_CAP,
                "BadgeNFT: Early adopter closed"
            );
            require(msg.value == 0, "BadgeNFT: Early adopter is free");
            earlyAdopterCount++;
        } else {
            // Paid badges
            uint256 price = badgePrice[badgeId];
            require(price > 0, "BadgeNFT: Badge not paid or invalid badge ID");
            require(msg.value == price, "BadgeNFT: Wrong ETH amount");
        }

        hasBadge[msg.sender][badgeId] = true;
        _mint(msg.sender, badgeId, 1, "");
        emit BadgeMinted(msg.sender, badgeId);
    }

    /**
     * @notice Mint membership badges (only callable by PaymentContract)
     * @param user The user address to mint for
     * @param badgeId The membership badge ID (3001 or 3002)
     */
    function mintMembershipBadge(
        address user,
        uint256 badgeId
    ) external onlyPaymentContract {
        require(
            badgeId == PRO_MEMBER_ID ||
                badgeId == SENTINEL_ELITE_ID ||
                badgeId == EARLY_ADOPTER_ID,
            "BadgeNFT: Invalid membership badge ID"
        );

        if (badgeId == EARLY_ADOPTER_ID) {
            require(
                earlyAdopterCount < EARLY_ADOPTER_CAP,
                "BadgeNFT: Early adopter closed"
            );
            earlyAdopterCount++;
        }

        if (!hasBadge[user][badgeId]) {
            hasBadge[user][badgeId] = true;
            _mint(user, badgeId, 1, "");
            emit BadgeMinted(user, badgeId);
        }
    }

    /**
     * @notice Set the price for a badge (owner only)
     * @param badgeId The badge ID
     * @param priceWei The price in wei
     */
    function setBadgePrice(
        uint256 badgeId,
        uint256 priceWei
    ) external onlyOwner {
        badgePrice[badgeId] = priceWei;
        emit BadgePriceSet(badgeId, priceWei);
    }

    /**
     * @notice Set the payment contract address (owner only)
     * @param _paymentContract The payment contract address
     */
    function setPaymentContract(address _paymentContract) external onlyOwner {
        require(_paymentContract != address(0), "BadgeNFT: Invalid address");
        paymentContract = _paymentContract;
        emit PaymentContractSet(_paymentContract);
    }

    /**
     * @notice Set the base URI for all tokens (owner only)
     * @dev Base URI should end with a slash. Token URI will be: baseURI + tokenId + ".json"
     *      Example: "https://api.defisentinel.com/badges/" -> "https://api.defisentinel.com/badges/1001.json"
     * @param baseURI_ The base URI string
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURI = baseURI_;
        emit BaseURISet(baseURI_);
    }

    /**
     * @notice Set a custom URI for a specific token (owner only)
     * @dev This overrides the base URI for the specific token ID
     * @param badgeId The badge ID
     * @param tokenURI_ The full URI for this token (should point to JSON metadata)
     */
    function setTokenURI(
        uint256 badgeId,
        string memory tokenURI_
    ) external onlyOwner {
        _tokenURIs[badgeId] = tokenURI_;
        emit TokenURISet(badgeId, tokenURI_);
    }

    /**
     * @notice Get the URI for a specific token
     * @dev Returns individual token URI if set, otherwise constructs from base URI
     * @param badgeId The badge ID
     * @return The URI string pointing to the token's metadata JSON
     */
    function uri(uint256 badgeId) public view override returns (string memory) {
        // If individual URI is set, use it
        if (bytes(_tokenURIs[badgeId]).length > 0) {
            return _tokenURIs[badgeId];
        }

        // Otherwise, construct from base URI
        string memory base = _baseURI;
        if (bytes(base).length == 0) {
            return "";
        }

        // Convert badgeId to string and append ".json"
        return string(abi.encodePacked(base, _toString(badgeId), ".json"));
    }

    /**
     * @notice Get the base URI
     * @return The base URI string
     */
    function baseURI() external view returns (string memory) {
        return _baseURI;
    }

    /**
     * @notice Get the custom URI for a token (if set)
     * @param badgeId The badge ID
     * @return The custom URI string, or empty if not set
     */
    function tokenURI(uint256 badgeId) external view returns (string memory) {
        return _tokenURIs[badgeId];
    }

    /**
     * @notice Internal function to convert uint256 to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @notice Withdraw ETH from contract (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "BadgeNFT: No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "BadgeNFT: Withdrawal failed");
    }

    /**
     * @notice Override to prevent transfers (soulbound)
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        // Allow minting (from == address(0))
        if (from == address(0)) {
            super._update(from, to, ids, values);
        } else {
            // Block all transfers (soulbound)
            revert("BadgeNFT: Tokens are soulbound and cannot be transferred");
        }
    }

    /**
     * @notice Override safeTransferFrom to prevent transfers
     */
    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert("BadgeNFT: Tokens are soulbound and cannot be transferred");
    }

    /**
     * @notice Override safeBatchTransferFrom to prevent transfers
     */
    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("BadgeNFT: Tokens are soulbound and cannot be transferred");
    }
}
