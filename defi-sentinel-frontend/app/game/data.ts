import { LucideIcon } from "lucide-react";

export type Question = {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string; // Option ID
  explanation: string;
};

export type QuizLevel = "easy" | "medium" | "hard";
export type QuizType = QuizLevel | "risk";

export type QuizConfig = {
  id: QuizLevel;
  type: "quiz";
  title: string;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
  questionCount: number;
  passThreshold: number;
  questions: Question[];
  estimatedTime: string; // e.g., "~90 seconds"
  rewards: string[]; // e.g., ["Beginner Badge", "Explorer Unlock"]
};

export type RiskQuestion = {
  id: number;
  question: string;
  options: { id: string; text: string; score: number }[];
};

export type RiskProfile = {
  min: number;
  max: number;
  label: string;
  color: string;
  description: string;
};

export type RiskConfig = {
  id: "risk";
  type: "assessment";
  title: string;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
  questions: RiskQuestion[];
  profiles: RiskProfile[];
  estimatedTime: string;
  rewards: string[];
};

export const EASY_QUIZ: QuizConfig = {
  id: "easy",
  type: "quiz",
  title: "DeFi Beginner",
  image: "/images/covers/defi_benginner.jpg",
  badge: "🟢 DeFi Beginner",
  badgeColor: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
  description: "Start your journey. Master the essential building blocks of the decentralized world.",
  questionCount: 15,
  passThreshold: 12,
  questions: [
    {
      id: 1,
      question: "Which asset class is designed to maintain a 1:1 parity with a national currency like the US Dollar?",
      options: [
        { id: "A", text: "Governance tokens" },
        { id: "B", text: "Wrapped assets" },
        { id: "C", text: "Stablecoins" },
        { id: "D", text: "Utility tokens" },
      ],
      correctAnswer: "C",
      explanation: "Stablecoins use collateral (like USDC) or algorithms (like DAI) to peg their value to a stable asset, typically the USD.",
    },
    {
      id: 2,
      question: "If you lose your 12-word seed phrase and your device breaks, who can reset your password for you?",
      options: [
        { id: "A", text: "The wallet provider" },
        { id: "B", text: "Customer support" },
        { id: "C", text: "The blockchain network" },
        { id: "D", text: "No one" },
      ],
      correctAnswer: "D",
      explanation: "In DeFi, you have \"self-custody.\" There is no central help desk; the seed phrase is the only way to access the private keys on the blockchain.",
    },
    {
      id: 3,
      question: "When swapping tokens on a DEX, what term describes the difference between the expected price and the actual execution price?",
      options: [
        { id: "A", text: "Slippage" },
        { id: "B", text: "Spread" },
        { id: "C", text: "Gas cost" },
        { id: "D", text: "Impermanent loss" },
      ],
      correctAnswer: "A",
      explanation: "Slippage occurs when the price changes between the moment you submit a trade and the moment it is confirmed, often due to low liquidity.",
    },
    {
      id: 4,
      question: "Why might a user choose to \"Stake\" their tokens in a PoS network?",
      options: [
        { id: "A", text: "To trade faster" },
        { id: "B", text: "To reduce gas fees" },
        { id: "C", text: "To earn rewards and help secure the network" },
        { id: "D", text: "To avoid impermanent loss" },
      ],
      correctAnswer: "C",
      explanation: "Staking involves locking tokens to participate in the consensus mechanism of a blockchain, earning a portion of transaction fees or new issuance in return.",
    },
    {
      id: 5,
      question: "Which actions require users to sign transactions with their wallet?",
      options: [
        { id: "A", text: "Reading blockchain data" },
        { id: "B", text: "Transferring tokens or interacting with contracts" },
        { id: "C", text: "Viewing balances" },
        { id: "D", text: "Browsing a frontend" },
      ],
      correctAnswer: "B",
      explanation: "Signing a transaction is the cryptographic \"handshake\" that proves you own the private keys and authorize a change on the ledger.",
    },
    {
      id: 6,
      question: "What does \"DeFi\" stand for?",
      options: [
        { id: "A", text: "Department of Finance" },
        { id: "B", text: "Decentralized Finance" },
        { id: "C", text: "Derivative Financing" },
        { id: "D", text: "Digital Federal Institution" },
      ],
      correctAnswer: "B",
      explanation: "DeFi refers to financial services built on blockchain technology, removing the need for traditional intermediaries like banks.",
    },
    {
      id: 7,
      question: "A support agent on Discord asks for your private key to \"help sync your wallet.\" What should you do?",
      options: [
        { id: "A", text: "Never share it, as it grants full control over your funds" },
        { id: "B", text: "Give it to them so they can fix the issue" },
        { id: "C", text: "Give them only the first 6 words" },
        { id: "D", text: "Share it only if the Discord has a \"Verified\" checkmark" },
      ],
      correctAnswer: "A",
      explanation: "Your private key (or seed phrase) is for your eyes only. Sharing it is the most common way to get scammed in DeFi.",
    },
    {
      id: 8,
      question: "Which of these is a popular browser-extension wallet used to interact with DeFi?",
      options: [
        { id: "A", text: "PayPal" },
        { id: "B", text: "Venmo" },
        { id: "C", text: "Apple Pay" },
        { id: "D", text: "MetaMask" },
      ],
      correctAnswer: "D",
      explanation: "MetaMask is one of the most widely used non-custodial wallets that allows users to interact with decentralized applications (dApps).",
    },
    {
      id: 9,
      question: "Your transaction is \"Pending\" for a long time during a period of high network activity. How can you speed it up?",
      options: [
        { id: "A", text: "Restart your computer" },
        { id: "B", text: "Contact the protocol's customer support" },
        { id: "C", text: "Increase the Gas Price (priority fee)" },
        { id: "D", text: "Send the same transaction again with a lower fee" },
      ],
      correctAnswer: "C",
      explanation: "Gas fees act as an auction mechanism; increasing your fee incentivizes validators to include your transaction in the next block.",
    },
    {
      id: 10,
      question: "A lending protocol's website is blocked in your country. If the protocol is truly decentralized, can you still interact with it?",
      options: [
        { id: "A", text: "No, the website is the protocol" },
        { id: "B", text: "Yes, by interacting directly with the smart contract on the blockchain" },
        { id: "C", text: "No, you must wait for the company to appeal" },
        { id: "D", text: "Yes, but only if you have a physical key" },
      ],
      correctAnswer: "B",
      explanation: "Smart contracts live on the blockchain. Frontends (websites) are just interfaces; the logic is accessible to anyone via the blockchain.",
    },
    {
      id: 11,
      question: "You are about to move a large amount of life savings to a new wallet. What is the safest \"first step\"?",
      options: [
        { id: "A", text: "Send it all at once to save on gas" },
        { id: "B", text: "Wait for the market to go up" },
        { id: "C", text: "Check the recipient's social media profile" },
        { id: "D", text: "Send a small \"test\" transaction first to verify the address" },
      ],
      correctAnswer: "D",
      explanation: "Because blockchain transactions are irreversible, sending a small amount first ensures you have the correct address and the wallet is working.",
    },
    {
      id: 12,
      question: "You have $1,000 worth of USDC in your wallet but $0 in ETH. What will happen if you try to send the USDC?",
      options: [
        { id: "A", text: "The network will take the fee from your USDC" },
        { id: "B", text: "The recipient pays the fee" },
        { id: "C", text: "The transaction will fail because you lack ETH for gas" },
        { id: "D", text: "The transaction is free for stablecoins" },
      ],
      correctAnswer: "C",
      explanation: "On the Ethereum network, gas fees must be paid in the native token (ETH), regardless of what asset you are transferring.",
    },
    {
      id: 13,
      question: "What happens when a token is \"Burned\"?",
      options: [
        { id: "A", text: "It is sold for a high price" },
        { id: "B", text: "It is sent to a \"dead\" address and removed from circulation" },
        { id: "C", text: "It is locked in a vault for 1 year" },
        { id: "D", text: "It is converted into Bitcoin" },
      ],
      correctAnswer: "B",
      explanation: "Token burning reduces the total supply, which can sometimes lead to an increase in value if demand remains constant.",
    },
    {
      id: 14,
      question: "A government order forces a company-run exchange to freeze accounts from a specific region. A DeFi user in that same region continues to trade tokens without any interruption. Why is this possible?",
      options: [
        { id: "A", text: "They are using a fake identity" },
        { id: "B", text: "DeFi users are exempt from all laws" },
        { id: "C", text: "Decentralized protocols are permissionless and have no central office to enforce the freeze" },
        { id: "D", text: "The exchange is just pretending to be frozen" },
      ],
      correctAnswer: "C",
      explanation: "Because DEXs are made of code on a public blockchain, they don't have a \"CEO\" or \"Help Desk\" that can manually block individual users or regions.",
    },
    {
      id: 15,
      question: "You have been using a new DeFi app for months. One morning, you find new \"Governance\" tokens in your wallet that you never bought. The app explains that these were distributed to reward early users. How did these tokens likely arrive?",
      options: [
        { id: "A", text: "An automated \"Airdrop\" to reward early protocol participants" },
        { id: "B", text: "A manual transfer from another user" },
        { id: "C", text: "A technical glitch in the blockchain" },
        { id: "D", text: "A refund for overpaid gas fees" },
      ],
      correctAnswer: "A",
      explanation: "Airdrops are a common way for new protocols to distribute ownership and \"voting power\" to the people who actually use the platform.",
    },
  ],
  estimatedTime: "~3 minutes",
  rewards: ["Beginner Badge", "Unlock Medium Level"],
};

export const MEDIUM_QUIZ: QuizConfig = {
  id: "medium",
  type: "quiz",
  title: "DeFi Explorer",
  image: "/images/covers/defi_exploer.jpg",
  badge: "🔵 DeFi Explorer",
  badgeColor: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  description: "Level up. Master the mechanics of AMMs, Lending, and Governance.",
  questionCount: 15,
  passThreshold: 12,
  questions: [
    {
      id: 16,
      question: "Which Ethereum-based tool allows you to view every transaction ever sent to a specific wallet address?",
      options: [
        { id: "A", text: "MetaMask" },
        { id: "B", text: "Etherscan" },
        { id: "C", text: "Infura" },
        { id: "D", text: "Hardhat" },
      ],
      correctAnswer: "B",
      explanation: "Etherscan is a block explorer. Because blockchains are public ledgers, these tools allow anyone to audit transaction history and wallet balances.",
    },
    {
      id: 17,
      question: "A stablecoin protocol maintains its peg by automatically minting or burning its secondary token whenever the price of the stablecoin deviates from $1. Which category does this belong to?",
      options: [
        { id: "A", text: "Fiat-backed" },
        { id: "B", text: "Crypto-backed" },
        { id: "C", text: "Commodity-backed" },
        { id: "D", text: "Algorithmic" },
      ],
      correctAnswer: "D",
      explanation: "Algorithmic stablecoins (like the former UST) use supply-and-demand code logic and incentive mechanisms to maintain a peg rather than actual cash in a bank.",
    },
    {
      id: 18,
      question: "Why do users need to approve token spending before interacting with protocols?",
      options: [
        { id: "A", text: "To give smart contracts permission to move tokens" },
        { id: "B", text: "To reduce gas usage" },
        { id: "C", text: "To lock tokens permanently" },
        { id: "D", text: "To verify identity" },
      ],
      correctAnswer: "A",
      explanation: "For security, your wallet prevents dApps from taking your tokens unless you explicitly \"approve\" the contract to spend a certain amount.",
    },
    {
      id: 19,
      question: "Which metric is most commonly used to measure the total capital locked inside a specific DeFi protocol?",
      options: [
        { id: "A", text: "Market cap" },
        { id: "B", text: "Trading volume" },
        { id: "C", text: "Total Value Locked (TVL)" },
        { id: "D", text: "Fully diluted valuation" },
      ],
      correctAnswer: "C",
      explanation: "TVL represents the total dollar value of all assets currently deposited in a protocol's smart contracts for lending or trading.",
    },
    {
      id: 20,
      question: "Which mechanism ensures that a decentralized stablecoin like DAI remains backed even if its collateral drops in value?",
      options: [
        { id: "A", text: "Algorithmic rebasing" },
        { id: "B", text: "Overcollateralization" },
        { id: "C", text: "Central bank reserves" },
        { id: "D", text: "Token burning" },
      ],
      correctAnswer: "B",
      explanation: "If the collateral (e.g., ETH) value drops below a certain ratio, the protocol automatically sells it to pay back the debt and keep the system solvent.",
    },
    {
      id: 21,
      question: "When providing liquidity to a pool, what do you usually receive as a \"receipt\" to prove your share of the pool?",
      options: [
        { id: "A", text: "Governance tokens" },
        { id: "B", text: "Wrapped tokens" },
        { id: "C", text: "Stablecoins" },
        { id: "D", text: "LP tokens" },
      ],
      correctAnswer: "D",
      explanation: "LP tokens represent your proportional share of a liquidity pool and are required to withdraw your original assets plus earned fees.",
    },
    {
      id: 22,
      question: "You borrowed $500 worth of USDC using $1,000 worth of ETH as collateral. Overnight, the price of ETH drops by 60%, making your collateral worth only $400. What happens next?",
      options: [
        { id: "A", text: "The protocol waits for you to deposit more ETH" },
        { id: "B", text: "The protocol automatically sells your ETH to repay the debt (Liquidation)" },
        { id: "C", text: "Your interest rate suddenly drops" },
        { id: "D", text: "Your loan is forgiven because of the market crash" },
      ],
      correctAnswer: "B",
      explanation: "A health factor below 1.0 means your collateral no longer sufficiently covers your debt, allowing the protocol to sell your assets to cover the loan.",
    },
    {
      id: 23,
      question: "How does impermanent loss occur during price divergence?",
      options: [
        { id: "A", text: "Fees stop accumulating" },
        { id: "B", text: "Gas fees increase" },
        { id: "C", text: "One asset price changes relative to the other" },
        { id: "D", text: "Tokens are locked" },
      ],
      correctAnswer: "C",
      explanation: "When the price ratio of the tokens in a pool changes, the AMM rebalances them, leaving you with less value than if you had simply held the tokens in your wallet.",
    },
    {
      id: 24,
      question: "A new DeFi protocol claims to have $1 Billion in its vaults, but a skeptical user wants to verify this without \"trusting\" the project's website dashboard. How can they find the truth?",
      options: [
        { id: "A", text: "Check the public blockchain explorer (like Etherscan) to audit the smart contract's balances" },
        { id: "B", text: "Call the project's CEO" },
        { id: "C", text: "Wait for an official government audit" },
        { id: "D", text: "Ask other users on social media" },
      ],
      correctAnswer: "A",
      explanation: "\"Don't trust, verify.\" Since all code and transactions are public, users don't need to trust a bank's word that they have the money.",
    },
    {
      id: 25,
      question: "A developer wants to build a new yield optimizer that automatically moves funds between Aave and Uniswap. Do they need to sign a partnership agreement with those protocols first?",
      options: [
        { id: "A", text: "Yes, they need legal permission" },
        { id: "B", text: "No, because DeFi protocols are \"permissionless\" and their code is open for anyone to build on" },
        { id: "C", text: "Only if they are moving more than $1 Million" },
        { id: "D", text: "Yes, both protocols must approve the developer's identity" },
      ],
      correctAnswer: "B",
      explanation: "Because there are no \"gatekeepers,\" developers can build on top of other protocols (composability), leading to rapid, global innovation.",
    },
    {
      id: 26,
      question: "How does concentrated liquidity improve capital efficiency?",
      options: [
        { id: "A", text: "By allowing LPs to focus liquidity within price ranges" },
        { id: "B", text: "By spreading liquidity across all prices" },
        { id: "C", text: "By increasing token inflation" },
        { id: "D", text: "By removing impermanent loss" },
      ],
      correctAnswer: "A",
      explanation: "Instead of spreading liquidity from $0$ to $\infty$, users can put their money where the volume is (e.g., $1,900$–$2,100$ for ETH), earning more fees with less capital.",
    },
    {
      id: 27,
      question: "Which metrics best reflect real protocol usage?",
      options: [
        { id: "A", text: "Token price" },
        { id: "B", text: "TVL only" },
        { id: "C", text: "Social media followers" },
        { id: "D", text: "Revenue and active users" },
      ],
      correctAnswer: "D",
      explanation: "TVL can be \"faked\" by a few large whales, but consistent fee revenue and active address growth indicate genuine utility.",
    },
    {
      id: 28,
      question: "How does oracle manipulation lead to protocol losses?",
      options: [
        { id: "A", text: "By increasing gas costs" },
        { id: "B", text: "By blocking transactions" },
        { id: "C", text: "By triggering incorrect liquidations or pricing" },
        { id: "D", text: "By draining treasuries directly" },
      ],
      correctAnswer: "C",
      explanation: "If a protocol relies on a single DEX for price data, an attacker can move that price and \"trick\" the protocol into thinking they have more collateral than they do.",
    },
    {
      id: 29,
      question: "How does recursive lending allow leverage?",
      options: [
        { id: "A", text: "By increasing gas efficiency" },
        { id: "B", text: "By repeatedly borrowing and redepositing collateral" },
        { id: "C", text: "By reducing collateral requirements" },
        { id: "D", text: "By minting new tokens" },
      ],
      correctAnswer: "B",
      explanation: "This \"looping\" increases your total exposure (and risk) to an asset beyond what you could afford with your initial deposit.",
    },
    {
      id: 30,
      question: "To launch a new token fairly, a project starts the sale at a very high price (e.g., $100) and gradually lowers it every minute until all tokens are sold. Why does this discourage bots from buying everything in the first second?",
      options: [
        { id: "A", text: "Bots aren't programmed to wait" },
        { id: "B", text: "The gas fees are higher at the start" },
        { id: "C", text: "The sale only allows human CAPTCHAs" },
        { id: "D", text: "There is no benefit to being \"first\" if the price is higher than the market's eventual value" },
      ],
      correctAnswer: "D",
      explanation: "There is no benefit to being \"first\" in a Dutch Auction; the price is the same for everyone in a specific batch, discouraging gas wars and front-running.",
    },
  ],
  estimatedTime: "~4 minutes",
  rewards: ["Explorer Badge", "Unlock Boss Level"],
};

export const HARD_QUIZ: QuizConfig = {
  id: "hard",
  type: "quiz",
  title: "DeFi Master",
  image: "/images/covers/defi-master.jpg",
  badge: "🟣 DeFi Master",
  badgeColor: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  description: "The ultimate challenge. Prove your expertise in complex mechanics and systemic risks.",
  questionCount: 15,
  passThreshold: 12,
  questions: [
    {
      id: 31,
      question: "How do aggregators optimize trade execution paths?",
      options: [
        { id: "A", text: "By splitting orders across multiple pools" },
        { id: "B", text: "By limiting route choices" },
        { id: "C", text: "By increasing slippage tolerance" },
        { id: "D", text: "By batching transactions only" },
      ],
      correctAnswer: "A",
      explanation: "Aggregators (like 1inch) use algorithms to find the most efficient route, sometimes hopping through 3-4 different pools to get the best price.",
    },
    {
      id: 32,
      question: "Which risks do LPs face during sudden market movements?",
      options: [
        { id: "A", text: "Oracle failure" },
        { id: "B", text: "Impermanent loss and liquidation of positions" },
        { id: "C", text: "Validator slashing" },
        { id: "D", text: "Governance attacks" },
      ],
      correctAnswer: "B",
      explanation: "When prices move fast, arbitrageurs trade against the pool to align it with market prices, often at the expense of the Liquidity Providers.",
    },
    {
      id: 33,
      question: "How do lending protocols generate yield without relying on emissions?",
      options: [
        { id: "A", text: "Trading fees" },
        { id: "B", text: "Token rebasing" },
        { id: "C", text: "Borrower interest payments" },
        { id: "D", text: "Liquidation penalties only" },
      ],
      correctAnswer: "C",
      explanation: "This is \"organic\" yield. Borrowers pay for the utility of the capital, and that interest is passed back to the depositors.",
    },
    {
      id: 34,
      question: "A group of malicious voters gains enough power to pass a governance proposal that would transfer all protocol funds to their private wallets. However, the funds cannot be moved for 48 hours, giving honest users time to withdraw their assets. What security mechanism is at work here?",
      options: [
        { id: "A", text: "Token Burning" },
        { id: "B", text: "High Quorum Requirements" },
        { id: "C", text: "A Governance Timelock" },
        { id: "D", text: "Frontend Moderation" },
      ],
      correctAnswer: "C",
      explanation: "Timelocks ensure that even if a bad proposal passes, there is a delay (e.g., 2 days) so users can withdraw their funds before the change goes live.",
    },
    {
      id: 35,
      question: "How do sandwich attacks exploit public mempools?",
      options: [
        { id: "A", text: "By placing trades before and after a victim transaction" },
        { id: "B", text: "By delaying transactions" },
        { id: "C", text: "By blocking validators" },
        { id: "D", text: "By altering oracle prices" },
      ],
      correctAnswer: "A",
      explanation: "The attacker uses the victim's trade to pump the price, sells at the top, and pockets the difference in a single block.",
    },
    {
      id: 36,
      question: "Which design choices reduce MEV exposure?",
      options: [
        { id: "A", text: "Higher gas fees" },
        { id: "B", text: "More liquidity pairs" },
        { id: "C", text: "Token inflation" },
        { id: "D", text: "Private order flow and batch auctions" },
      ],
      correctAnswer: "D",
      explanation: "Batch auctions execute trades at the same price simultaneously, removing the ability for bots to profit by reordering transactions within a block.",
    },
    {
      id: 37,
      question: "Which factors cause decentralized stablecoins to lose their peg?",
      options: [
        { id: "A", text: "UI downtime" },
        { id: "B", text: "Validator slashing" },
        { id: "C", text: "Insufficient collateral or market confidence loss" },
        { id: "D", text: "Low gas fees" },
      ],
      correctAnswer: "C",
      explanation: "If the collateral value crashes faster than it can be liquidated, the stablecoin is no longer 100% backed, leading to a loss of market confidence.",
    },
    {
      id: 38,
      question: "A protocol stops its high-yield token rewards, and 90% of the \"Liquidity Providers\" immediately withdraw their funds to chase higher yields on a newer, unproven platform. What is the common industry term for this type of short-term, yield-chasing capital?",
      options: [
        { id: "A", text: "Mercenary Capital" },
        { id: "B", text: "Sticky Liquidity" },
        { id: "C", text: "Protocol Owned Liquidity" },
        { id: "D", text: "Institutional Flow" },
      ],
      correctAnswer: "A",
      explanation: "\"Mercenary capital\" leaves when rewards stop. Mature protocols want \"sticky\" liquidity based on actual product quality.",
    },
    {
      id: 39,
      question: "You deposit $1,000 worth of ETH and $1,000 worth of USDC into a liquidity pool. Over the next month, ETH's price skyrockets by 400% while USDC stays at $1. When you withdraw, you find you have less total value than if you had simply held the original ETH and USDC in your wallet. Why?",
      options: [
        { id: "A", text: "The protocol was hacked" },
        { id: "B", text: "The USDC lost its peg" },
        { id: "C", text: "Gas fees consumed all profits" },
        { id: "D", text: "High volatility caused \"Impermanent Loss\" during rebalancing" },
      ],
      correctAnswer: "D",
      explanation: "IL is caused by the ratio change. If assets move in tandem, the ratio stays the same, and IL is minimized.",
    },
    {
      id: 40,
      question: "A user wants to withdraw their funds from a Layer 2 network back to the Ethereum Mainnet. They discover that their specific network requires a 7-day \"challenge period\" to allow for fraud disputes before the funds are released. What type of rollup are they likely using?",
      options: [
        { id: "A", text: "ZK-Rollup" },
        { id: "B", text: "Optimistic Rollup" },
        { id: "C", text: "Sidechain" },
        { id: "D", text: "Plasma" },
      ],
      correctAnswer: "B",
      explanation: "Optimistic Rollups assume transactions are valid but allow a 7-day window for anyone to \"dispute\" fraud, whereas ZK-Rollups use mathematical proofs for immediate finality.",
    },
    {
      id: 41,
      question: "Which LP will suffer more impermanent loss: Uniswap v2 or v3?",
      options: [
        { id: "A", text: "v2" },
        { id: "B", text: "v3" },
        { id: "C", text: "Both equally" },
        { id: "D", text: "Depends on gas fees" },
      ],
      correctAnswer: "B",
      explanation: "Because capital is concentrated, the \"inventory\" of tokens shifts much faster. You hit 100% of the losing asset much sooner than you would in a v2 pool.",
    },
    {
      id: 42,
      question: "How does Uniswap v3 tick spacing affect liquidity concentration?",
      options: [
        { id: "A", text: "Smaller ticks allow tighter ranges" },
        { id: "B", text: "Larger ticks increase impermanent loss" },
        { id: "C", text: "Ticks affect gas only" },
        { id: "D", text: "Ticks are irrelevant" },
      ],
      correctAnswer: "A",
      explanation: "Narrow ticks allow LPs to be incredibly precise. For stablecoins, they can put 99% of their money between $0.999 and $1.001, providing massive liquidity with very little capital.",
    },
    {
      id: 43,
      question: "How do bonding curves (like pumpfun) ensure prices rise as supply grows?",
      options: [
        { id: "A", text: "Fixed pricing" },
        { id: "B", text: "Mathematical functions increasing marginal cost" },
        { id: "C", text: "Governance votes" },
        { id: "D", text: "Token burning" },
      ],
      correctAnswer: "B",
      explanation: "A bonding curve is an automated market maker that follows a hard-coded mathematical formula, ensuring price discovery is purely based on minting/burning.",
    },
    {
      id: 44,
      question: "How do Uni v4 Hooks enable custom logic?",
      options: [
        { id: "A", text: "By modifying consensus" },
        { id: "B", text: "By injecting logic at swap/lp lifecycle points" },
        { id: "C", text: "By upgrading the EVM" },
        { id: "D", text: "By changing gas fees" },
      ],
      correctAnswer: "B",
      explanation: "Hooks are \"plugins\" that allow a pool to do things like \"check a whitelist before swapping\" or \"change the fee based on volatility\" without changing the core Uniswap code.",
    },
    {
      id: 45,
      question: "During a high-volatility event, a lending protocol relies on a single DEX pool as its price oracle. An attacker uses a flash loan to massively inflate the price of a low-liquidity asset in that specific pool. They then use that inflated asset as collateral to \"borrow\" all the USDC from the protocol's vault. What is this exploit called, and what was the protocol's critical mistake?",
      options: [
        { id: "A", text: "A Re-entrancy attack; they didn't use a mutex lock" },
        { id: "B", text: "An Oracle Manipulation attack; they relied on a single, low-liquidity source instead of a decentralized aggregate (like Chainlink)" },
        { id: "C", text: "A Sandwich attack; they didn't set high enough slippage" },
        { id: "D", text: "A Governance takeover; they didn't have enough token holders" },
      ],
      correctAnswer: "B",
      explanation: "Oracle manipulation is a common high-level exploit. Attackers temporarily \"pump\" a price in one place to trick a protocol into thinking they have much more collateral than they really do, allowing them to drain other valuable assets.",
    },
  ],
  estimatedTime: "~5 minutes",
  rewards: ["Master Badge", "NFT Eligibility"],
};


export const RISK_ASSESSMENT: RiskConfig = {
  id: "risk",
  type: "assessment",
  title: "Risk Profile",
  image: "/images/covers/defi-risk-assessment.jpg",
  badge: "🎯 Risk Assessment",
  badgeColor: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
  description: "Discover your investor personality. We'll analyze your preferences to suggest the best strategies.",
  questions: [
    {
      id: 1,
      question: "What is your primary goal when participating in DeFi?",
      options: [
        { id: "A", text: "Protecting my capital against inflation while earning a small premium.", score: 0 },
        { id: "B", text: "Building a balanced portfolio with a mix of blue-chip assets and stable yield.", score: 1 },
        { id: "C", text: "Significant wealth growth through active management and emerging protocols.", score: 2 },
        { id: "D", text: "Maximizing short-term gains through high-leverage and \"DeGen\" opportunities.", score: 3 },
      ],
    },
    {
      id: 2,
      question: "What percentage of your total liquid net worth is currently in DeFi?",
      options: [
        { id: "A", text: "Less than 20%", score: 0 },
        { id: "B", text: "20% – 50%", score: 1 },
        { id: "C", text: "50% – 80%", score: 2 },
        { id: "D", text: "Over 80%", score: 3 },
      ],
    },
    {
      id: 3,
      question: "How much of your active portfolio are you willing to \"lock up\" in exchange for significantly higher rewards (e.g., ve-tokenomics)?",
      options: [
        { id: "A", text: "None; I value the ability to exit instantly more than any yield.", score: 0 },
        { id: "B", text: "A small portion (e.g., 10%) for a few months.", score: 1 },
        { id: "C", text: "A significant portion (e.g., 50%) for 1–2 years if the project is a \"blue chip.\"", score: 2 },
        { id: "D", text: "Whatever it takes; I'm happy to lock 80%+ for 4 years to maximize my returns.", score: 3 },
      ],
    },
    {
      id: 4,
      question: "When a new, unproven \"meme\" token or high-risk asset starts trending, what is your mindset?",
      options: [
        { id: "A", text: "I stay away completely; it's pure gambling.", score: 0 },
        { id: "B", text: "I wait for more data and maybe buy a tiny amount as a \"lottery ticket.\"", score: 1 },
        { id: "C", text: "I put in a moderate amount after doing some quick on-chain research.", score: 2 },
        { id: "D", text: "I jump in immediately with a large position; volatility is where the profit is.", score: 3 },
      ],
    },
    {
      id: 5,
      question: "How often do you check your DeFi positions and the underlying protocol health?",
      options: [
        { id: "A", text: "Once a month or less; I set and forget blue-chip positions.", score: 0 },
        { id: "B", text: "Once a week; I monitor major market trends.", score: 1 },
        { id: "C", text: "Once a day; I actively manage my yield and collateral ratios.", score: 2 },
        { id: "D", text: "Mutiple times a day; I am constantly hunting for new opportunities and reacting to news.", score: 3 },
      ],
    },
    {
      id: 6,
      question: "A protocol you have 10% of your total defi positions in announces a \"minor bug detected in an unaudited hook.\" No funds have been lost yet. What is your reaction?",
      options: [
        { id: "A", text: "Withdraw everything immediately and wait for a fix/audit.", score: 0 },
        { id: "B", text: "Withdraw half my funds to lower exposure while monitoring the situation.", score: 1 },
        { id: "C", text: "Keep my funds in; \"minor\" bugs are part of the early stage.", score: 2 },
        { id: "D", text: "Deposit more; the inevitable temporary TVL drop might lead to higher rewards for those who stay.", score: 3 },
      ],
    },
    {
      id: 7,
      question: "You see a new \"Yield Farm\" on a new L2 offering 5,000% APR on a token you’ve never heard of. You have $1,000 to spare. What do you do?",
      options: [
        { id: "A", text: "Avoid it completely; it’s almost certainly a rug-pull or a ponzi.", score: 0 },
        { id: "B", text: "Research the team and code for 2 days before deciding to put in $50.", score: 1 },
        { id: "C", text: "Put in $200 of \"play money\" just to see what happens.", score: 2 },
        { id: "D", text: "Ape in the full $1,000 immediately to catch the early high-yield window.", score: 3 },
      ],
    },
    {
      id: 8,
      question: "The market crashes 30% in two hours. You have a leveraged position with a health factor of 1.1. Gas fees are $200. What is your move?",
      options: [
        { id: "A", text: "I don't use leverage; my risk is limited to the tokens I hold.", score: 0 },
        { id: "B", text: "Pay the $200 gas fee immediately to save the position from liquidation.", score: 1 },
        { id: "C", text: "Do nothing and hope the market bounces before I hit 1.0.", score: 2 },
        { id: "D", text: "Let the position get liquidated and immediately open a higher-leverage \"revenge trade\" to recover losses.", score: 3 },
      ],
    },
    {
      id: 9,
      question: "A protocol you use is integrated with several other projects (money legos). One of those secondary projects gets exploited. What do you do?",
      options: [
        { id: "A", text: "I avoid \"stacked\" protocols and only use simple, isolated ones.", score: 0 },
        { id: "B", text: "Exit my position immediately until the full extent of the \"contagion\" is known.", score: 1 },
        { id: "C", text: "Check the protocol's insurance fund or backstop to see if I'm covered.", score: 2 },
        { id: "D", text: "Keep everything as is; high risk usually means higher rewards for survivors.", score: 3 },
      ],
    },
    {
      id: 10,
      question: "A major bridge used to move funds between chains is hacked for $200M. You have tokens on the \"wrapped\" side of that bridge. What do you do?",
      options: [
        { id: "A", text: "I only use native assets on their original chains (no bridges).", score: 0 },
        { id: "B", text: "Sell the wrapped tokens for whatever they are worth now (even at a loss) to escape.", score: 1 },
        { id: "C", text: "Wait to see if the protocol treasury or a backstop recovers the peg.", score: 2 },
        { id: "D", text: "Buy the \"de-pegged\" tokens from people panicking, betting on a recovery.", score: 3 },
      ],
    },
    {
      id: 11,
      question: "How do you manage the tradeoff between \"Security\" and \"Convenience\" for your wallet?",
      options: [
        { id: "A", text: "Maximum Security: Multiple hardware wallets with physical backups in different locations.", score: 0 },
        { id: "B", text: "Balanced: Hardware wallet for my main funds and a browser wallet for daily trades.", score: 1 },
        { id: "C", text: "Convenience: Purely browser wallets (MetaMask/Rabby) for speed and ease of use.", score: 2 },
        { id: "D", text: "High Risk: I use the same simple password and keep my seed phrase in a cloud-synced text file.", score: 3 },
      ],
    },
    {
      id: 12,
      question: "When you see \"Audited by [Top Firm]\" on a website, what does it mean to you?",
      options: [
        { id: "A", text: "I look for the actual audit report and check which parts of the code were NOT covered.", score: 0 },
        { id: "B", text: "It's a positive sign, but I know it's not a 100% guarantee of safety.", score: 1 },
        { id: "C", text: "I don't look at audits; I look at the Total Value Locked (TVL).", score: 2 },
        { id: "D", text: "It means the protocol is 100% safe and I can deposit anything.", score: 3 },
      ],
    },
    {
      id: 13,
      question: "You have 3 different yield opportunities. Which one do you pick?",
      options: [
        { id: "A", text: "4% in a protocol that has been live for 4 years with $5B TVL.", score: 0 },
        { id: "B", text: "12% in a protocol live for 6 months with $100M TVL.", score: 1 },
        { id: "C", text: "35% in a \"New V3 fork\" live for 2 weeks with $10M TVL.", score: 2 },
        { id: "D", text: "120% in a \"Launchpad\" for a new gaming token.", score: 3 },
      ],
    },
    {
      id: 14,
      question: "How many different protocols do you utilize simultaneously for a single \"Strategy\"? (Composability risk)",
      options: [
        { id: "A", text: "Just one; I don't want \"Contagion\" risk if one fails.", score: 0 },
        { id: "B", text: "2 protocols (e.g., borrowing on Aave to stake on Curve).", score: 1 },
        { id: "C", text: "3–4 protocols (e.g., looping, leverage, and yield aggregators).", score: 2 },
        { id: "D", text: "I use complex \"stacks\" involving 5+ protocols for maximum optimization.", score: 3 },
      ],
    },
    {
      id: 15,
      question: "What is your reaction to a \"Social Media Influencer\" talking about a new DeFi \"Alpha\"?",
      options: [
        { id: "A", text: "I ignore all social media advice; it’s mostly paid promotion.", score: 0 },
        { id: "B", text: "I watch it, then do 4+ hours of my own research into the smart contracts.", score: 1 },
        { id: "C", text: "I trust the opinion of influencers who have been right in the past.", score: 2 },
        { id: "D", text: "I act immediately; by the time research is done, the \"pump\" is over.", score: 3 },
      ],
    },
  ],
  profiles: [
    { min: 0, max: 12, label: "Conservative", color: "text-emerald-500", description: "You prioritize capital preservation over high yields. Focus on established protocols and stablecoins." },
    { min: 13, max: 25, label: "Moderate", color: "text-blue-500", description: "You accept some risk for better returns. A balanced approach using blue-chip protocols and some yield strategies." },
    { min: 26, max: 37, label: "Aggressive", color: "text-purple-500", description: "You are comfortable with volatility and complex strategies. You actively manage positions to maximize growth." },
    { min: 38, max: 45, label: "High Risk", color: "text-red-500", description: "You seek maximum returns and are willing to experiment with new, unproven protocols. High risk, high reward." },
  ],
  estimatedTime: "~2 mins",
  rewards: ["Risk Profile Badge", "Strategy Recommendations"],
};

export const QUIZZES = [EASY_QUIZ, MEDIUM_QUIZ, HARD_QUIZ];
