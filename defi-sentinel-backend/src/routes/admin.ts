
import express from 'express';
import { db } from '../db';
import { protocols, strategies, ads, alerts, homepageConfig } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { syncProtocolData } from '../services/dataSync';

const router = express.Router();

// --- Helper Functions ---

const parseJsonBody = (body: any) => {
    // If body comes in as string (e.g. from some clients), parse it.
    // Express json() middleware usually handles this, but good to be safe for complex nested JSON.
    return body;
};

// --- Homepage Config ---

// GET /admin/homepage
router.get('/homepage', async (req, res) => {
    try {
        const result = await db.select().from(homepageConfig).limit(1);
        res.json(result[0] || {});
    } catch (error) {
        console.error("Error fetching homepage config:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /admin/homepage
router.put('/homepage', async (req, res) => {
    try {
        const config = req.body;
        const result = await db.select().from(homepageConfig).limit(1);

        if (result.length === 0) {
            // Create
            await db.insert(homepageConfig).values({
                id: uuidv4(),
                ...config,
                updatedAt: new Date()
            });
        } else {
            // Update
            await db.update(homepageConfig)
                .set({ ...config, updatedAt: new Date() })
                .where(eq(homepageConfig.id, result[0].id));
        }
        res.json({ success: true, message: "Homepage config updated" });
    } catch (error) {
        console.error("Error updating homepage config:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- Protocols ---

// GET /admin/protocols
router.get('/protocols', async (req, res) => {
    try {
        const result = await db.select().from(protocols);
        res.json({ data: result });
    } catch (error) {
        console.error("Error fetching protocols:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /admin/protocols/:id
router.get('/protocols/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select().from(protocols).where(eq(protocols.id, id)).limit(1);
        if (result.length === 0) return res.status(404).json({ error: "Protocol not found" });

        const p = result[0];

        // Ensure JSON fields are parsed (Drizzle text -> JSON)
        const parseJson = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        };

        const formatted = {
            ...p,
            metrics: parseJson(p.metrics),
            valueProposition: parseJson(p.valueProposition),
            mechanics: parseJson(p.mechanics),
            risks: parseJson(p.risks),
            resources: parseJson(p.resources),
            strategies: parseJson(p.strategies),
            governance: parseJson(p.governance),
            products: parseJson(p.products),
            statusBadges: parseJson(p.statusBadges),
            tvlHistory: parseJson(p.tvlHistory),
            chains: parseJson(p.chains),
            fundingHistory: parseJson(p.fundingHistory)
        };

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching protocol:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /admin/protocols
router.post('/protocols', async (req, res) => {
    try {
        const data = req.body;
        const id = uuidv4();

        // Basic validation
        if (!data.slug || !data.name) {
            return res.status(400).json({ error: "Slug and Name are required" });
        }

        await db.insert(protocols).values({
            id,
            slug: data.slug,
            name: data.name,
            category: data.category || 'Uncategorized',
            description: data.description,
            overview: data.overview,
            logo: data.logo,
            auditStatus: data.auditStatus,
            chains: data.chains, // JSON
            launchDate: data.launchDate ? new Date(data.launchDate) : undefined,
            rating: data.rating,
            score: data.score,
            ratedDate: data.ratedDate ? new Date(data.ratedDate) : undefined,
            tvl: data.tvlValue || data.tvl || 0, // Mapping tvlValue to tvl (numeric) if provided
            isNew: data.isNew,
            isTrending: data.isTrending,
            hasRiskAlert: data.hasRiskAlert,
            isFeatured: data.isFeatured,

            // Rich JSON (Properly mapped)
            metrics: data.metrics,
            valueProposition: data.valueProposition,
            mechanics: data.mechanics,
            risks: data.risks,
            resources: data.resources,
            strategies: data.strategies,
            governance: data.governance,
            products: data.products,
            statusBadges: data.statusBadges,
            tvlHistory: data.tvlHistory,
            fundingHistory: data.fundingHistory,

            // Dynamic/Calculated fields (if provided manually)
            tvlChange7d: data.tvlChange7d,
            tvlChange30d: data.tvlChange30d,

            // External API slugs
            coingeckoSlug: data.coingeckoSlug,
            defillamaSlug: data.defillamaSlug,
        });

        // Auto-sync data from DefiLlama/CoinGecko for the new protocol
        syncProtocolData(data.slug).catch(err => {
            console.error(`[Admin] Failed to sync data for new protocol ${data.slug}:`, err);
        });

        res.json({ success: true, id, message: "Protocol created" });
    } catch (error: any) {
        console.error("Error creating protocol:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// PUT /admin/protocols/:id
router.put('/protocols/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Verify existence
        const existing = await db.select().from(protocols).where(eq(protocols.id, id)).limit(1);
        if (existing.length === 0) return res.status(404).json({ error: "Protocol not found" });

        // Fields allowed to be updated by Admin (plus others for flexibility)
        // We generally allow updating almost everything except ID.
        await db.update(protocols).set({
            slug: data.slug,
            name: data.name,
            category: data.category,
            description: data.description,
            overview: data.overview,
            logo: data.logo,
            auditStatus: data.auditStatus,
            chains: data.chains,
            launchDate: data.launchDate ? new Date(data.launchDate) : undefined,
            rating: data.rating,
            score: data.score,
            ratedDate: data.ratedDate ? new Date(data.ratedDate) : undefined,
            isNew: data.isNew,
            isTrending: data.isTrending,
            hasRiskAlert: data.hasRiskAlert,
            isFeatured: data.isFeatured,

            // Rich JSON (Properly mapped)
            metrics: data.metrics,
            valueProposition: data.valueProposition,
            mechanics: data.mechanics,
            risks: data.risks,
            resources: data.resources,
            strategies: data.strategies,
            governance: data.governance,
            products: data.products,
            statusBadges: data.statusBadges,
            tvlHistory: data.tvlHistory,
            fundingHistory: data.fundingHistory,

            // Dynamic/Calculated fields
            tvlChange7d: data.tvlChange7d,
            tvlChange30d: data.tvlChange30d,

            // External API slugs
            coingeckoSlug: data.coingeckoSlug,
            defillamaSlug: data.defillamaSlug,
        }).where(eq(protocols.id, id));

        res.json({ success: true, message: "Protocol updated" });
    } catch (error) {
        console.error("Error updating protocol:", error);
        res.status(500).json({ error: error.message || "Internal Server Error", details: error });
    }
});

// DELETE /admin/protocols/:id
router.delete('/protocols/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(protocols).where(eq(protocols.id, id));
        res.json({ success: true, message: "Protocol deleted" });
    } catch (error) {
        console.error("Error deleting protocol:", error);
        res.status(500).json({ error: error.message || "Internal Server Error", details: error });
    }
});

// --- Strategies (Global) ---

// GET /admin/strategies
router.get('/strategies', async (req, res) => {
    try {
        const result = await db.select().from(strategies);
        res.json({ data: result });
    } catch (error) {
        console.error("Error fetching strategies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /admin/strategies
router.post('/strategies', async (req, res) => {
    try {
        const data = req.body;
        const id = uuidv4();
        await db.insert(strategies).values({
            id,
            name: data.name,
            description: data.description,
            type: data.type,
            riskLevel: data.riskLevel,
            protocols: data.protocols,
            chains: data.chains,
            status: data.status,
            apy: data.apy,
            complexity: data.complexity,
            steps: data.steps,
            tags: data.tags,
            yieldBreakdown: data.yieldBreakdown,
            proTips: data.proTips,
            strategyLink: data.strategyLink,
            projectId: data.projectId,
            strategyClass: data.strategyClass,
            riskProtocols: data.riskProtocols,
            riskAssets: data.riskAssets,
            riskStrategies: data.riskStrategies,
            safetyFinalScore: data.safetyFinalScore,
        });
        res.json({ success: true, id, message: "Strategy created" });
    } catch (error) {
        console.error("Error creating strategy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /admin/strategies/:id
router.put('/strategies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await db.update(strategies).set({
            name: data.name,
            description: data.description,
            type: data.type,
            riskLevel: data.riskLevel,
            protocols: data.protocols,
            chains: data.chains,
            status: data.status,
            apy: data.apy,
            complexity: data.complexity,
            steps: data.steps,
            tags: data.tags,
            yieldBreakdown: data.yieldBreakdown,
            proTips: data.proTips,
            strategyLink: data.strategyLink,
            projectId: data.projectId,
            strategyClass: data.strategyClass,
            riskProtocols: data.riskProtocols,
            riskAssets: data.riskAssets,
            riskStrategies: data.riskStrategies,
            safetyFinalScore: data.safetyFinalScore,
        }).where(eq(strategies.id, id));

        res.json({ success: true, message: "Strategy updated" });
    } catch (error) {
        console.error("Error updating strategy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /admin/strategies/:id
router.delete('/strategies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(strategies).where(eq(strategies.id, id));
        res.json({ success: true, message: "Strategy deleted" });
    } catch (error) {
        console.error("Error deleting strategy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- Ads ---

// GET /admin/ads
router.get('/ads', async (req, res) => {
    try {
        const result = await db.select().from(ads).orderBy(desc(ads.createdAt));
        res.json({ data: result });
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /admin/ads
router.post('/ads', async (req, res) => {
    try {
        const data = req.body;
        const id = uuidv4();
        await db.insert(ads).values({
            id,
            title: data.title,
            description: data.description,
            link: data.link,
            isActive: data.isActive !== undefined ? data.isActive : true,
        });
        res.json({ success: true, id, message: "Ad created" });
    } catch (error) {
        console.error("Error creating ad:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /admin/ads/:id
router.put('/ads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await db.update(ads).set({
            title: data.title,
            description: data.description,
            link: data.link,
            isActive: data.isActive
        }).where(eq(ads.id, id));
        res.json({ success: true, message: "Ad updated" });
    } catch (error) {
        console.error("Error updating ad:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /admin/ads/:id
router.delete('/ads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(ads).where(eq(ads.id, id));
        res.json({ success: true, message: "Ad deleted" });
    } catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- Alerts ---

// GET /admin/alerts
router.get('/alerts', async (req, res) => {
    try {
        const result = await db.select().from(alerts).orderBy(desc(alerts.createdAt));
        res.json({ data: result });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /admin/alerts
router.post('/alerts', async (req, res) => {
    try {
        const data = req.body;
        const id = uuidv4();
        await db.insert(alerts).values({
            id,
            type: data.type,
            title: data.title,
            message: data.message,
            severity: data.severity,
            active: data.active !== undefined ? data.active : true,
        });
        res.json({ success: true, id, message: "Alert created" });
    } catch (error) {
        console.error("Error creating alert:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /admin/alerts/:id
router.put('/alerts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await db.update(alerts).set({
            type: data.type,
            title: data.title,
            message: data.message,
            severity: data.severity,
            active: data.active
        }).where(eq(alerts.id, id));
        res.json({ success: true, message: "Alert updated" });
    } catch (error) {
        console.error("Error updating alert:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /admin/alerts/:id
router.delete('/alerts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(alerts).where(eq(alerts.id, id));
        res.json({ success: true, message: "Alert deleted" });
    } catch (error) {
        console.error("Error deleting alert:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
