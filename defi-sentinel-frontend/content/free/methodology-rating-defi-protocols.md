---
id: "6"
title: "Methodology of Rating DeFi Protocols"
slug: "methodology-rating-defi-protocols"
summary: "Learn how we evaluate and rate DeFi protocols using our comprehensive 5-dimensional risk framework."
coverImage: "/images/covers/metholody.jpeg"
difficulty: "easy"
isPaid: false
readTime: 14
isFirstEdition: true
popularity: 87
publishedAt: "2025-01-10"
tags: ["defi", "rating", "methodology", "research"]
category: "Tutorial"
author:
  name: "DeFi Research Team"
  role: "Lead Analyst"
  bio: "Experienced team of blockchain researchers and analysts dedicated to making DeFi accessible to everyone."
---
# Methodology for DeFi Protocol Rating

In the rapidly evolving landscape of Decentralized Finance (DeFi), assessing the safety and quality of a protocol is a complex challenge. Users and automated agents alike need a standardized, quantitative framework to evaluate risks objectively. We have developed a comprehensive **DeFi Protocol Rating Framework** that evaluates protocols across **5 main fields**, generating a final score out of **100**.

This methodology is designed to be rigorous, transparent, and uniform, ensuring that everyone—from individual investors to AI agents—can arrive at the same conclusion when verifying a protocol.

The final protocol score is calculated using weighted factors across five dimensions:


*   **S1 - Smart Contract & Technical Risk** (30%): Code security, audits, and technical maturity
*   **S2 - Economic Design & Market Risk** (25%): Economic model soundness and liquidity health
*   **S3 - Governance & Centralization Risk** (20%): Decentralization and control mechanisms
*   **S4 - Sustainability & Competitive Position** (15%): Longevity and business viability
*   **S5 - Reputation & Social Trust** (10%): Team credibility and community trust

*   **Total Score** = `(S1 × 30%) + (S2 × 25%) + (S3 × 20%) + (S4 × 15%) + (S5 × 10%)`

Below is the detailed breakdown of our 5-field rating system, including the exact source of information and point calculations, illustrated with real-world examples from protocols like **Aave**, **Morpho**, **Ethena**, **Pendle**, and **Uniswap**.

---

## Rating Weight Distribution

![Weight Distribution](/images/articles/methodology-rating-defi-protocols/weight-distribution-pie.png)

---

## Quick Reference Table

| Field | Sub-Field | Max Points | Weight |
|-------|-----------|------------|--------|
| **1. Smart Contract & Technical Risk** | | **100** | **30%** |
| | 1.1 Audit Coverage | 60 | |
| | 1.2 Code Maturity & Openness | 20 | |
| | 1.3 Upgradeability & Admin Control | 10 | |
| | 1.4 Bug Bounty & Incident History | 10 | |
| **2. Economic Design & Market Risk** | | **100** | **25%** |
| | 2.1 Core Mechanism Soundness | 10 | |
| | 2.2 Capital Quality & Stickiness | 25 | |
| | 2.3 Liquidity Stress Behavior | 15 | |
| | 2.4 Liquidity & Exit Accessibility | 40 | |
| | 2.5 Market Dependency | 10 | |
| **3. Governance & Centralization Risk** | | **100** | **20%** |
| | 3.1 Governance Structure | 30 | |
| | 3.2 Governance Token Distribution | 10 | |
| | 3.3 Admin & Emergency Powers | 30 | |
| | 3.4 Treasury & Transparency | 30 | |
| **4. Sustainability & Competitive Position** | | **100** | **15%** |
| | 4.1 Protocol Age & Survival | 30 | |
| | 4.2 Innovation vs Imitation | 30 | |
| | 4.3 Revenue & Self-Sufficiency | 40 | |
| **5. Reputation & Social Trust Risk** | | **100** | **10%** |
| | 5.1 Team & Founder Reputation | 40 | |
| | 5.2 Investors & Backers | 30 | |
| | 5.3 Community & Communication | 30 | |

**Final Score Formula:** `(S1 × 30%) + (S2 × 25%) + (S3 × 20%) + (S4 × 15%) + (S5 × 10%)`

---

## 1. Smart Contract & Technical Risk (Weight: 30%)
**Max Score: 100**

This section evaluates the code quality, security practices, and technical maturity of the protocol.

### 1.1 Audit Coverage (60 Points)
We prioritize quality over quantity. A single audit from a Tier-1 firm carries more weight than multiple audits from lesser-known firms.
*   **Criteria**:
    *   **Tier 1 Audit (e.g., OpenZeppelin, Spearbit, Trail of Bits):** +60 Points (Max Cap).
    *   **Tier 2 Audit + Others combined:** +40 Points (Max Cap).
    *   **Other / Independent Auditor:** +20 Points.
    *   **Multiple Audits Bonus:** +5 Points per additional audit (Subject to max caps).
    *   You can check the Audit company list at this link: [Smart Contract Auditor Rankings 2026](/research/smart-contract-auditor-rankings-2026)
*   **Reasoning**: Prevents "audit spamming" where multiple low-quality audits could mathematically overtake a single rigorous Tier-1 audit.
*   **Source**: DefiLlama 'Audits' section, Vendor Public Githubs, or Protocol Docs.
*   **Example**: **Morpho** scores **60/60**. It has secured multiple Tier 1 audits (**OpenZeppelin**, **Trail of Bits**), hitting the Max Cap immediately.

![Audit Coverage Scoring](/images/articles/methodology-rating-defi-protocols/audit-coverage-scoring.png)

### 1.2 Code Maturity & Openness (20 Points)
Time is the best tester ("Lindy Effect"). We look for open-source code.
*   **Criteria**:
    *   **Open Source:** +5 Points (Verified on Etherscan/GitHub).
    *   **Contract Age:**
        *   1.5 years or more: +10 Points.
        *   1 – 1.5 years: +7.5 Points.
        *   0.5 – 1 year: +5 Points.
        *   < 0.5 year: +0 Points.
    *   **GitHub Activity:** +5 Points (Active maintenance/Frequent commits).
*   **Source**: Etherscan (Contract Verification), GitHub Repo (Commits/Activity), DefiLlama, Rootdata.
*   **Example**: **Aave** scores **20/20**. It is Open Source (+5), has been on mainnet > 1.5 years (+10), and has very active GitHub maintenance (+5).

### 1.3 Upgradeability & Admin Control (10 Points)
We assess "Rug Pull" risk here.
*   **Criteria**:
    *   **Immutable/Ossified Contracts:** +10 Points (Max).
    *   **Timelock (Min 48h) + Public/Reputable Signers:** +8 Points.
    *   **Timelock + Anonymous Multisig:** +6 Points (Capped Social Risk).
    *   **Multisig (5+ reputable signers):** +5 Points.
    *   **EOA Admin (Instant Upgrade Power):** 0 Points (High Risk).
    *   *Note: If extensive multisig and timelock both exist, default to the higher secure tier.*
*   **Source**: Etherscan (Read Contract/Owner), L2Beat (ZK/Optimistic Rollups), Protocol Docs.
*   **Example**: **Morpho Blue** scores **10/10** because the core lending contracts are **Immutable**.

### 1.4 Bug Bounty & Incident History (10 Points)
Active bug bounties incentivize whitehat hackers.
*   **Criteria**:
    *   **Active Bug Bounty (Immunefi > $500k):** +10 Points.
    *   **Active Bug Bounty ($100k – $500k):** +7.5 Points.
    *   **Active Bug Bounty (< $100k):** +5 Points.
    *   **No Bug Bounty:** 0 Points.
    *   **Past Exploit Penalty:**
        *   Major uncompensated exploit (>10% TVL lost): **-20 Points**.
        *   Minor resolved incident: **-5 Points**.
*   **Source**: Immunefi, HackenProof, DefiLlama 'Hacks', Rekt.news.
*   **Example**: **Pendle** scores **10/10** for maintaining an Active Bug Bounty on Immunefi with payouts > $1,000,000.

---

## 2. Economic Design & Market Risk (Weight: 25%)
**Max Score: 100**

This section assesses the soundness of the economic model and liquidity health.

### 2.1 Core Mechanism Soundness (10 Points)
Is the protocol built on a battle-tested model?
*   **Criteria**:
    *   **Standard Fork (e.g., Uniswap V2, Aave V2):** +10 Points (Battle-tested).
    *   **Novel but Audited Economic Model:** +7.5 Points.
    *   **Experimental/Complex Mechanism:** +5 Points.
*   **Source**: DefiLlama 'Forked From', Whitepaper, Web Search reviews.
*   **Example**: **Aave** scores **10/10** as a "Standard Fork" base (though it is the original) and Category Definer.

### 2.2 Capital Quality & Stickiness (25 Points)
Replaces raw TVL size with a measure of durability.
*   **Criteria**:
    *   **High Organic Growth & Stickiness:** +25 Points.
    *   **Mixed Incentives / Solid TVL Base:** +15 Points.
    *   **Highly Incentivized / Mercenary Capital:** +5 Points.
    *   **Low/Trace TVL:** 0 Points.
*   **Source**: DefiLlama (TVL vs Token Price Correlation, Yield Composition).
*   **Example**: **Morpho** scores **25/25** for "High Organic Growth" due to its P2P efficiency model that doesn't rely solely on token incentives.

### 2.3 Liquidity Stress Behavior (15 Points)
Measures resilience during volatility.
*   **Criteria**:
    *   **High Resilience (Low Slippage during stress):** +15 Points.
    *   **Moderate Resilience:** +10 Points.
    *   **Fragile (High Slippage/Depegs):** 0 Points.
*   **Source**: DEXScreener (Depth/Peg History), Coingecko.
*   **Example**: **Uniswap** scores **15/15** for proven High Resilience during market crashes.

### 2.4 Liquidity & Exit Accessibility (40 Points)
Combines Liquidity Depth and Withdrawal/Lockup Risk.
*   **Criteria**:
    *   **Instant Access / No Lockup:** +40 Points.
    *   **Lockup exists + Deep Liquid Secondary Market (Peg < 1% deviation):** +30-35 Points.
    *   **Reasonable Lockup (< 7 days) w/o Liquid Market:** +20 Points.
    *   **Lockup exists + Thin/Illiquid Market:** ≤20 Points.
    *   **Long Lockup (> 14 days) or Illiquid:** +10 Points.
    *   **Predatory Exit Tax (> 5%):** 0 Points.
*   **Source**: Protocol Docs, Staking Contract UI, Coingecko (-2% Depth), Honeypot.is.
*   **Example**: **Spark** scores **35/40**. While mostly instant, specific market conditions on D3M can affect absolute instant exit compared to a pure DEX like Uniswap (which gets 40).

![Liquidity & Exit Scoring](/images/articles/methodology-rating-defi-protocols/liquidity-exit-scoring.png)

### 2.5 Market Dependency (10 Points)
Exposure to volatile assets and market-dependent revenue increases risk.
*   **Criteria**:
    *   **Low Market Dependency (Revenue independent of asset price movement):** +10 Points.
    *   **Mixed Volatile Assets / Partial Market Dependency:** +5 Points.
    *   **Highly Volatile/Degen Assets / Fully Market-Dependent Revenue:** +0 Points.
*   **Source**: DefiLlama 'Composition', Protocol Asset List, Revenue Model Analysis.
*   **Example**: **Ethena** scores **10/10**. While its collateral consists of BTC and ETH, its yield derives from **perpetual funding rates**, not asset price appreciation. The delta-neutral strategy (spot long + perp short) neutralizes price exposure. Historically, negative funding rate periods are infrequent and short-lived—extended negative funding scenarios are rare in crypto markets due to the structural long bias of participants.

---

## 3. Governance & Centralization Risk (Weight: 20%)
**Max Score: 100**

Evaluates who controls the protocol.

### 3.1 Governance Structure (30 Points)
Decentralized governance is key to long-term trust.
*   **Criteria**:
    *   **Immutable / Governance Minimized (No DAO needed):** +30 Points.
    *   **Fully On-Chain DAO (e.g., Compound Governor):** +30 Points.
    *   **Snapshot + Veto (Off-chain signaling, On-chain execution):** +25 Points.
    *   **Multisig Council Decisions:** +15 Points.
    *   **Centralized Team Control:** 0 Points.
*   **Source**: Tally.xyz, Snapshot.org, Protocol Governance Docs.
*   **Example**: **Aave** scores **30/30** for its Fully On-Chain DAO.

![Governance Structure Scoring](/images/articles/methodology-rating-defi-protocols/governance-structure-scoring.png)

### 3.2 Governance Token Distribution (10 Points)
*   **Criteria**:
    *   **Highly Distributed + Quorum Rules:** +10 Points (High Capture Resistance).
    *   **VC/Whale Dominated Voting:** +5 Points.
    *   **Single Whale/Team Control:** 0 Points.
*   **Source**: Etherscan 'Holders', BubbleMaps.
*   **Example**: **Morpho** scores **10/10** for "Highly Distributed" governance token holdings.

### 3.3 Admin & Emergency Powers (30 Points)
*   **Criteria**:
    *   **No Pause/Blacklist Functions:** +30 Points.
    *   **Pause with Timelock (Defensive):** +25 Points.
    *   **Pause by Multisig (Immediate):** +15 Points.
    *   **Pause by Single EOA:** 0 Points.
*   **Source**: Etherscan (Write Contract: pause/blacklist), TokenSniffer.
*   **Example**: **Spark** scores **25/30** for having "Pause with Timelock" capabilities.

### 3.4 Treasury & Transparency (30 Points)
*   **Criteria**:
    *   **On-chain Treasury with periodic reports:** +30 Points.
    *   **On-chain Treasury (Silent/No reports):** +15 Points.
    *   **Opaque/No Treasury Disclosure:** 0 Points.
*   **Source**: DeepDAO, DefiLlama 'Treasury', Annual Reports.
*   **Example**: **Ethena** scores **30/30** for excellent transparency and proof of reserves dashboards.

---

## 4. Sustainability & Competitive Position (Weight: 15%)
**Max Score: 100**

Assesses the protocol's longevity and business model.

### 4.1 Protocol Age & Survival (30 Points)
Surviving a bear market demonstrates resilience.
*   **Criteria**:
    *   **Launched before 2024 (Survived 2022/2023 Bear Market):** +30 Points.
    *   **> 1.5 Years:** +25 Points.
    *   **> 1 Year:** +20 Points.
    *   **6 – 12 Months:** +15 Points.
    *   **< 6 Months:** +10 Points.
*   **Source**: DefiLlama TVL Chart (All-time start date), Rootdata.
*   **Example**: **Pendle** scores **30/30**, having launched in 2021.

### 4.2 Innovation vs Imitation (30 Points)
Innovators capture more value than generic forks.
*   **Criteria**:
    *   **Market Leader / Category Definer:** +30 Points.
    *   **Strong Challenger / Improved Fork:** +20 Points.
    *   **Generic Fork:** +10 Points.
*   **Source**: DefiLlama Categories/Rankings, Rootdata.
*   **Example**: **Morpho** scores **30/30** as a "Category Definer" for lending optimization.

### 4.3 Revenue & Self-Sufficiency (40 Points)
*   **Criteria**:
    *   **Profitable (Fees > Emissions):** +40 Points.
    *   **Improving Revenue/Emission Ratio (Trend):** +25 Points.
    *   **Revenue Generating (Subsidized):** +15 Points.
    *   **Declining Revenue/Emission Ratio:** -10 Points (Penalty).
    *   **Zero Profit / Pure Emission Model:** 0 Points.
    *   *If "Information Not Found": 0 points.*
*   **Source**: DefiLlama 'Fees & Revenue', TokenTerminal.
*   **Example**: **Aave** scores **40/40** as it is highly Profitable.

---

## 5. Reputation & Social Trust Risk (Weight: 10%)
**Max Score: 100**

### 5.1 Team & Founder Reputation (40 Points)
*   **Criteria**:
    *   **Base Score:** 20 Points.
    *   **Public Team (> 1.5 Years):** +20 Points.
    *   **Public Team (1 – 1.5 Years):** +15 Points.
    *   **Anon Team (> 2 Years):** +20 Points.
    *   **Infamous Founder (Past Scams/Rug):** Score sets to -40 Points.
*   **Source**: Rootdata, LinkedIn, Crunchbase, Web Search.
*   **Example**: **Morpho** scores **38-40/40** due to its highly reputable public team led by Paul Frambot.

### 5.2 Investors & Backers (30 Points)
*   **Criteria**:
    *   **Top Tier VCs (Paradigm, a16z) + Clean History:** +30 Points.
    *   **Long-term Community Owned (No VC needed):** +25 Points.
    *   **Tier 2 VCs / Known Angels:** +20 Points.
    *   **VC-Backed with History of Governance Abuse:** Cap at 15.
    *   **No Backers / Unknown:** +10 Points.
    *   **Predatory Tokenomics:** 0 Points.
*   **Source**: CryptoRank.io, Crunchbase, CypherHunter, Rootdata.
*   **Example**: **Ethena** scores **30/30** with Top Tier backing from Dragonfly and Binance Labs.

### 5.3 Community & Communication (30 Points)
*   **Criteria**:
    *   **High responsiveness & Regular Updates:** +30 Points.
    *   **Average activity:** +15 Points.
    *   **Ghost town / Deleted comments:** 0 Points.
*   **Source**: Twitter (X), Discord, Community Forums, Rootdata on specific protocol.
*   **Example**: **Spark** scores **25/30** leveraging the active MakerDAO ecosystem.

---

## Summary

By breaking down protocol risk into these 19 distinct sub-fields across 5 categories, we eliminate ambiguity. Whether you are a human analyst or an AI agent, following this **DeFi Protocol Rating Framework** ensures a consistent, data-driven assessment.

**Special Cases:**
*   **Not Applicable (N/A):** Redistribute points to remaining criteria in the same field.
*   **Information Not Found:** Default to **0 Points** (Conservative Approach).

---

## Example: Protocol Score Visualization

Below is an example of how a well-established protocol like **Aave** might score across all five dimensions:

**Aave Example Calculation:**
- Smart Contract (98/100) × 30% = 29.4
- Economic Design (100/100) × 25% = 25
- Governance (85/100) × 20% = 17
- Sustainability (100/100) × 15% = 15
- Reputation (100/100) × 10% = 10
- **Total Score: 96 / 100**