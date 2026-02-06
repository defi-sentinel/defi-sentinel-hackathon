---
id: "3"
title: "Why Avoid Circular Lending and Borrowing in DeFi"
slug: "why-avoid-circular-lending-borrowing"
summary: "Learn why circular lending strategies in DeFi are dangerous and how they can lead to cascading liquidations and massive losses."
coverImage: "/images/covers/looping.jpeg"
difficulty: "intermediate"
isPaid: false
readTime: 15
isFirstEdition: true
popularity: 88
publishedAt: "2024-02-15"
tags: ["risk", "defi", "lending", "leverage", "liquidation", "aave"]
category: "Deep Analysis"
author:
  name: "DeFi Research Team"
  role: "Lead Analyst"
  bio: "Experienced team of blockchain researchers and analysts dedicated to making DeFi accessible to everyone."
---

## What Is Circular Lending and Borrowing?

Circular lending and borrowing (also known as **looping** or **recursive lending**) is a DeFi strategy where users repeatedly deposit an asset as collateral, borrow against it, and re-deposit the borrowed funds into the same or another lending protocol.

Through multiple loops, users can significantly increase their apparent deposit size and borrowing volume, despite starting with a relatively small amount of capital. This technique is commonly used to:

- Amplify yield from deposit rewards or incentive programs
- Gain leveraged exposure to an asset
- Increase activity metrics for governance tokens or airdrops

At its core, circular lending is a **self-managed leverage strategy** implemented on-chain.

---

## A Simple Example of Circular Lending

![Circular Lending Example](/images/articles/why_avoid_looping/1_yhbfeHNd7E02spxfHpqk1Q.png)

Assume the following setup:

| Parameter | Value |
|-----------|-------|
| Initial capital | 10,000 USDC |
| Lending protocol LTV | 75% |
| Deposit sUSDE APY | 5% |
| Borrow USDC APY | 3% |

### Step 1

Swap 10,000 USDC to 10,000 sUSDE (assume 1:1 ratio), then deposit 10,000 sUSDE and borrow 7,500 USDC.

### Step 2

Swap 7,500 USDC to 7,500 sUSDE, re-deposit 7,500 sUSDE, and borrow 5,625 USDC.

### Step 3

Swap 5,625 USDC to 5,625 sUSDE, re-deposit 5,625 sUSDE, and borrow 4,218 USDC.

### After Three Loops

| Metric | Value |
|--------|-------|
| Total deposits | 23,125 sUSDE (earning 5% APR) |
| Total borrows | 17,343 USDC (paying 3% APR) |
| Net yield per year | (23,125 × 5%) - (17,343 × 3%) = $635.46 |
| Total capital at risk | 10,000 - 4,218 = $5,782 |
| **Final APR** | **10.99%** |

After three loops, we increase the sUSDE 5% APR yield to 10.99%. But if sUSDE price drops to 0.75 (perhaps due to a hack on-chain or CEX issue), the money we deposited will all be gone.

**While capital efficiency improves, risk grows much faster than yield.**

---

## Why Circular Lending Should Generally Be Avoided

While circular lending can look attractive on the surface, its risk–reward profile is often asymmetric: **limited upside with amplified downside**.

![Risk vs Reward](/images/articles/why_avoid_looping/Generated%20Image%20January%2019,%202026%20-%206_56PM.jpeg)

### 1. Limited Net Yield, Exponential Risk

In many cases, the net yield from circular lending is marginal:

- Deposit APY + incentives
- Minus borrowing interest
- Minus transaction costs and monitoring overhead

However, every additional loop increases leverage multiplicatively, meaning that a small adverse change can wipe out a disproportionately large position.

**Example:** Assume a circular DAI position spans three different protocols, and each protocol independently carries a 1% failure risk.

The combined risk is: **1 - 0.99³ ≈ 3%**

As more protocols are involved, risk compounds, while yield does not. Adding one more protocol does not double returns, but it does increase systemic exposure.

> **Risk scales faster than reward.**

### 2. Liquidation Risk

Liquidation risk is the most direct and destructive threat:

- Circular positions operate close to the protocol's maximum loan-to-value (LTV)
- A small price movement, oracle update, or volatility spike can trigger liquidation
- Once liquidation begins, the entire looped position is affected — not just a single borrow

Because all positions are tightly coupled, circular lending has **far less margin for error** than simple collateralized borrowing.

#### Black Swan Events Are Not Rare

Black swan events happen every year — sometimes multiple times per year:

| Date | Event | Impact |
|------|-------|--------|
| May 2022 | UST collapse | Cascading liquidations across DeFi |
| Mar 2023 | Silicon Valley Bank failure | USDC depegged to ~$0.93 |
| Feb 2025 | Bybit exploit | USDe temporarily lost its peg |
| Oct 2025 | Market crash | Triggered by macro and tariff-related news |

**Systemic risk is permanent.** Crypto liquidity is far more fragile than most users expect.

Even for high-market-cap assets like Bitcoin or Ethereum, 30% single-day drops occurred around 2020. Even in 2026, with improved liquidity, ±5% daily moves are still possible. With high leverage, liquidation is often a matter of *when*, not *if*.

### 3. Interest Rate Risk

Interest rates in DeFi are dynamic and utilization-based. Risks include:

- Borrow rates increasing rapidly due to liquidity shortages
- Deposit APYs dropping when incentives end or capital floods in
- Incentive token prices collapsing while liabilities remain fixed

A position that was profitable at block N can quietly become negative carry hours later, especially during market stress.

That said, interest rate risk is usually the smallest among all risks. In the worst case, it typically results in reduced DeFi income or moderate losses. It is rarely catastrophic by itself — but it can worsen other risks.

### 4. Smart Contract and Protocol Risk

Circular lending concentrates exposure into a fragile dependency chain:

- Smart contract vulnerabilities
- Oracle manipulation or delayed updates
- Governance changes to LTV, liquidation thresholds, or incentives

This is a **tightly coupled system** — failure at any single point can destabilize the entire loop.

For example, a smart contract issue can trigger panic withdrawals. Liquidity exits lead to asset sell-offs, which then feeds back into liquidation and liquidity risk. Many historical lending exploits disproportionately harmed users running recursive strategies.

---

## If You Still Choose to Use Circular Lending

Circular lending is not inherently wrong, but it should be treated as a **high-maintenance, high-risk strategy** — not passive yield.

### 1. Closely Monitor Oracle Sources

- Understand which oracle the protocol relies on (Chainlink, Pyth, TWAP, or custom)
- Be aware of update frequency and behavior during high volatility
- Oracles based on averaged prices (TWAP) are often safer than real-time spot prices

**Oracle anomalies are a common trigger for unexpected liquidations.**

### 2. Use Scripts or Bots for Monitoring

Manual monitoring is often insufficient. At minimum, users should be able to:

- Track real-time health factors
- Monitor oracle price changes
- Receive alerts when safety margins shrink

Advanced users rely on scripts to adjust leverage, repay debt, and exit positions automatically. With modern "vibe coding," running a 24/7 monitoring bot costs only a few dollars per month — a small price to protect large positions.

*(DeFi Sentinel is expected to provide Telegram-based notifications for real-time risk signals in the near future.)*

### 3. Continuously Track Interest Rate Changes

Key metrics to watch:

| Metric | Why It Matters |
|--------|----------------|
| Borrow APY vs Deposit APY | Determines net profitability |
| Utilization ratio | High utilization = volatile rates |
| Incentive emission schedules | Know when rewards expire |

Circular lending only works when rate conditions remain favorable — which is rarely guaranteed.

### 4. Avoid Low-Liquidity or Obscure Protocols

Low trading volume and thin liquidity increase systemic risk:

- Higher price manipulation risk
- Slower oracle updates
- Poor liquidation depth

**Prefer protocols with:**
- Deep liquidity
- Long operational history
- Transparent risk parameters

Borrowing high-quality assets such as USDT or USDC reduces tail risk. For large capital, diversifying across multiple liquidity pools further lowers exposure.

---

## Conclusion

Circular lending and borrowing in DeFi is best understood as **leveraged yield engineering**, not free money.

For most users:

- The upside is capped
- The downside is amplified
- The operational complexity is high

Unless you have strong risk controls, automated monitoring, and a clear understanding of the mechanics involved, circular lending strategies are likely to underperform simple, unleveraged positions over the long term.

**The best yield strategy is often the one you can sleep through.**
