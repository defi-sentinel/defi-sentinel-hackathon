import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Protocols Table
export const protocols = sqliteTable("protocols", {
  id: text("id").primaryKey(), // UUID
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  overview: text("overview"), // Markdown content
  logo: text("logo"),
  auditStatus: text("audit_status"),
  chains: text("chains", { mode: "json" }), // stored as JSON array of strings
  launchDate: integer("launch_date", { mode: "timestamp" }),
  tokenTgeDate: integer("token_tge_date", { mode: "timestamp" }),


  // Risk Metrics
  rating: text("rating"), // AAA, AA, etc.
  score: integer("score"), // 0-100
  ratedDate: integer("rated_date", { mode: "timestamp" }), // When protocol was rated

  // Rich Data (JSON)
  metrics: text("metrics", { mode: "json" }),
  valueProposition: text("value_proposition", { mode: "json" }),
  products: text("products", { mode: "json" }),
  strategies: text("strategies", { mode: "json" }),
  governance: text("governance", { mode: "json" }),
  resources: text("resources", { mode: "json" }),
  risks: text("risks", { mode: "json" }), // Combined risk data (overall + categories)
  statusBadges: text("status_badges", { mode: "json" }),

  // Dynamic Data
  tvl: real("tvl"),
  tvlHistory: text("tvl_history", { mode: "json" }),
  revenueHistory: text("revenue_history", { mode: "json" }),
  tvlChange7d: real("tvl_change_7d"),
  tvlChange30d: real("tvl_change_30d"), // Added for Trending Calculation
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  isTrending: integer("is_trending", { mode: "boolean" }).default(false),
  hasRiskAlert: integer("has_risk_alert", { mode: "boolean" }).default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),

  // External API Slugs (empty string = not available)
  coingeckoSlug: text("coingecko_slug"), // CoinGecko token ID, empty = no token
  defillamaSlug: text("defillama_slug", { mode: "json" }), // Array of DefiLlama slugs, e.g. ["uniswap-v1", "uniswap-v2", "uniswap-v3"]

  fundingHistory: text("funding_history", { mode: "json" }),
});

// 2. Strategies Table
export const strategies = sqliteTable("strategies", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  description: text("description"),
  type: text("type"), // Stablecoin, Delta-Neutral, etc.
  riskLevel: text("risk_level"), // Low, Medium, High
  protocols: text("protocols", { mode: "json" }),
  chains: text("chains", { mode: "json" }),

  strategyLink: text("strategy_link"),
  steps: text("steps", { mode: "json" }), // Array of steps

  apy: real("apy"),
  apy7d: real("apy_7d"),
  apy30d: real("apy_30d"),

  // New fields for frontend parity
  projectId: text("project_id"),
  complexity: text("complexity"),
  status: text("status"),
  tags: text("tags", { mode: "json" }),
  yieldBreakdown: text("yield_breakdown", { mode: "json" }),
  strategyClass: text("strategy_class"),
  apyHistory: text("apy_history", { mode: "json" }),
  tvlHistory: text("tvl_history", { mode: "json" }),
  riskChain: text("risk_chain", { mode: "json" }),

  // Advanced fields
  proTips: text("pro_tips", { mode: "json" }),
  safetyFinalScore: integer("safety_final_score"),

  // Risk Visualization Data
  riskProtocols: text("risk_protocols", { mode: "json" }),
  riskAssets: text("risk_assets", { mode: "json" }),
  riskStrategies: text("risk_strategies", { mode: "json" }),

  isPro: integer("is_pro", { mode: "boolean" }).default(false),

  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// 9. Ads Table
export const ads = sqliteTable("ads", {
  id: text("id").primaryKey(), // UUID
  title: text("title").notNull(),
  description: text("description"),
  link: text("link"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// 3. Articles Table
export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(), // UUID
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"), // Markdown/MDX
  coverImage: text("cover_image"), // URL or path
  tags: text("tags", { mode: "json" }), // Array of strings
  difficulty: text("difficulty"), // easy, intermediate, advanced
  isPaid: integer("is_paid", { mode: "boolean" }).default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  popularityScore: integer("popularity_score").default(0),
});

// 4. Alerts Table
export const alerts = sqliteTable("alerts", {
  id: text("id").primaryKey(), // UUID
  type: text("type").notNull(), // security, yield, new_rating
  title: text("title").notNull(),
  message: text("message"),
  severity: text("severity"), // low, medium, high
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// 5. Users/Membership Table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  walletAddress: text("wallet_address").notNull().unique(),
  nonce: text("nonce"), // Random string for SIWE authentication
  email: text("email"),
  memberSince: integer("member_since", { mode: "timestamp" }), // mm/dd/year format stored as timestamp
  daysRemaining: integer("days_remaining").default(0),
  quizCompleted: integer("quiz_completed").default(0),
  riskAssessmentDone: integer("risk_assessment_done", { mode: "boolean" }).default(false),
  tier: text("tier").default("free"), // free, monthly, yearly, custom
  expiryDate: integer("expiry_date", { mode: "timestamp" }),
  // Game progress stored as JSON
  gameProgress: text("game_progress", { mode: "json" }), // { easy: {...}, medium: {...}, hard: {...}, risk: {...} }
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// 6. User Badges Table (9 badges per user)
export const userBadges = sqliteTable("user_badges", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: integer("badge_id").notNull(), // 1-9
  earned: integer("earned", { mode: "boolean" }).default(false),
  nftMinted: integer("nft_minted", { mode: "boolean" }).default(false),
  earnedAt: integer("earned_at", { mode: "timestamp" }),
  mintedAt: integer("minted_at", { mode: "timestamp" }),
});

// 7. Billing History Table
export const billingHistory = sqliteTable("billing_history", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(), // "month", "year", or "custom" with months
  months: integer("months"), // For custom plans
  price: text("price").notNull(), // e.g., "10 USDC"
  date: integer("date", { mode: "timestamp" }).notNull(),
  wallet: text("wallet").notNull(),
  txHash: text("tx_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// 8. Homepage Configuration
export const homepageConfig = sqliteTable("homepage_config", {
  id: text("id").primaryKey(), // UUID
  // Featured Research
  featuredTitleLine1: text("featured_title_line1"),
  featuredTitleLine2: text("featured_title_line2"),
  featuredDescription: text("featured_description"),
  featuredLink: text("featured_link"),
  featuredReadTime: text("featured_read_time"),

  // Latest Insight 1
  insight1Title: text("insight1_title"),
  insight1Description: text("insight1_description"),
  insight1Link: text("insight1_link"),

  // Latest Insight 2
  insight2Title: text("insight2_title"),
  insight2Description: text("insight2_description"),
  insight2Link: text("insight2_link"),

  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

