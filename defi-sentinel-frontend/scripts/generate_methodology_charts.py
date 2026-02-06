import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

# Set style for dark theme friendly charts (without seaborn style)
plt.rcParams['figure.facecolor'] = '#1a1a2e'
plt.rcParams['axes.facecolor'] = '#16213e'
plt.rcParams['axes.edgecolor'] = '#e94560'
plt.rcParams['axes.labelcolor'] = 'white'
plt.rcParams['text.color'] = 'white'
plt.rcParams['xtick.color'] = 'white'
plt.rcParams['ytick.color'] = 'white'
plt.rcParams['grid.color'] = '#0f3460'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 11

output_dir = Path(r"F:\PycharmProjects\DeFi Sentinel-new\defi-sentinel-frontend\public\images\articles\methodology-rating-defi-protocols")
output_dir.mkdir(parents=True, exist_ok=True)

# Color palette
colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
colors_light = ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171']

# ============================================
# Chart 1: Pie Chart - Weight Distribution
# ============================================
def create_weight_pie_chart():
    fig, ax = plt.subplots(figsize=(10, 8), facecolor='#1a1a2e')
    ax.set_facecolor('#1a1a2e')

    weights = [30, 25, 20, 15, 10]
    labels = [
        'Smart Contract &\nTechnical Risk\n(30%)',
        'Economic Design &\nMarket Risk\n(25%)',
        'Governance &\nCentralization Risk\n(20%)',
        'Sustainability &\nCompetitive Position\n(15%)',
        'Reputation &\nSocial Trust\n(10%)'
    ]

    explode = (0.02, 0.02, 0.02, 0.02, 0.02)

    wedges, texts, autotexts = ax.pie(
        weights,
        labels=labels,
        autopct='%1.0f%%',
        colors=colors,
        explode=explode,
        startangle=90,
        pctdistance=0.6,
        labeldistance=1.15,
        textprops={'fontsize': 10, 'color': 'white'},
        wedgeprops={'edgecolor': '#1a1a2e', 'linewidth': 2}
    )

    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(12)

    ax.set_title('DeFi Protocol Rating\nWeight Distribution', fontsize=16, fontweight='bold', color='white', pad=20)

    plt.tight_layout()
    plt.savefig(output_dir / 'weight-distribution-pie.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: weight-distribution-pie.png")

# ============================================
# Chart 2: Audit Coverage Bar Chart
# ============================================
def create_audit_coverage_chart():
    fig, ax = plt.subplots(figsize=(12, 6), facecolor='#1a1a2e')
    ax.set_facecolor('#16213e')

    categories = ['Tier 1 Audit\n(OpenZeppelin, Trail of Bits)',
                  'Tier 2 Audit\n+ Others Combined',
                  'Other/Independent\nAuditor',
                  'Multiple Audits\nBonus (per audit)']
    scores = [60, 40, 20, 5]

    bars = ax.barh(categories, scores, color=['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
                   edgecolor='white', linewidth=0.5, height=0.6)

    # Add value labels
    for bar, score in zip(bars, scores):
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height()/2, f'+{score} pts',
                va='center', ha='left', fontsize=11, fontweight='bold', color='white')

    ax.set_xlabel('Points', fontsize=12, fontweight='bold')
    ax.set_title('Audit Coverage Scoring (Max 60 Points)', fontsize=14, fontweight='bold', color='white', pad=15)
    ax.set_xlim(0, 70)
    ax.axvline(x=60, color='#ef4444', linestyle='--', linewidth=2, label='Max Cap')
    ax.legend(loc='lower right', facecolor='#16213e', edgecolor='white', labelcolor='white')

    plt.tight_layout()
    plt.savefig(output_dir / 'audit-coverage-scoring.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: audit-coverage-scoring.png")

# ============================================
# Chart 3: Liquidity & Exit Accessibility
# ============================================
def create_liquidity_chart():
    fig, ax = plt.subplots(figsize=(12, 7), facecolor='#1a1a2e')
    ax.set_facecolor('#16213e')

    categories = [
        'Instant Access\nNo Lockup',
        'Lockup + Deep Liquid\nSecondary Market',
        'Reasonable Lockup\n(< 7 days)',
        'Lockup + Thin/Illiquid\nMarket',
        'Long Lockup\n(> 14 days)',
        'Predatory Exit Tax\n(> 5%)'
    ]
    scores = [40, 32.5, 20, 15, 10, 0]
    bar_colors = ['#10b981', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#7f1d1d']

    bars = ax.barh(categories, scores, color=bar_colors,
                   edgecolor='white', linewidth=0.5, height=0.6)

    for bar, score in zip(bars, scores):
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height()/2, f'{score} pts',
                va='center', ha='left', fontsize=10, fontweight='bold', color='white')

    ax.set_xlabel('Points', fontsize=12, fontweight='bold')
    ax.set_title('Liquidity & Exit Accessibility Scoring (Max 40 Points)', fontsize=14, fontweight='bold', color='white', pad=15)
    ax.set_xlim(0, 48)

    plt.tight_layout()
    plt.savefig(output_dir / 'liquidity-exit-scoring.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: liquidity-exit-scoring.png")

# ============================================
# Chart 4: Governance Structure Scoring
# ============================================
def create_governance_chart():
    fig, ax = plt.subplots(figsize=(12, 6), facecolor='#1a1a2e')
    ax.set_facecolor('#16213e')

    categories = [
        'Immutable / Governance\nMinimized',
        'Fully On-Chain DAO\n(Compound Governor)',
        'Snapshot + Veto\n(Off-chain + On-chain)',
        'Multisig Council\nDecisions',
        'Centralized Team\nControl'
    ]
    scores = [30, 30, 25, 15, 0]
    bar_colors = ['#10b981', '#10b981', '#3b82f6', '#f59e0b', '#ef4444']

    bars = ax.barh(categories, scores, color=bar_colors,
                   edgecolor='white', linewidth=0.5, height=0.6)

    for bar, score in zip(bars, scores):
        width = bar.get_width()
        ax.text(width + 0.5, bar.get_y() + bar.get_height()/2, f'{score} pts',
                va='center', ha='left', fontsize=10, fontweight='bold', color='white')

    ax.set_xlabel('Points', fontsize=12, fontweight='bold')
    ax.set_title('Governance Structure Scoring (Max 30 Points)', fontsize=14, fontweight='bold', color='white', pad=15)
    ax.set_xlim(0, 36)

    plt.tight_layout()
    plt.savefig(output_dir / 'governance-structure-scoring.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: governance-structure-scoring.png")

# ============================================
# Chart 5: Radar Chart - Aave Example
# ============================================
def create_aave_radar_chart():
    fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True), facecolor='#1a1a2e')
    ax.set_facecolor('#16213e')

    categories = ['Smart Contract\n& Technical', 'Economic Design\n& Market',
                  'Governance &\nCentralization', 'Sustainability &\nCompetitive',
                  'Reputation &\nSocial Trust']
    scores = [95, 88, 92, 90, 85]

    # Number of variables
    num_vars = len(categories)

    # Compute angle for each category
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()

    # Complete the loop
    scores_plot = scores + scores[:1]
    angles += angles[:1]

    # Plot
    ax.fill(angles, scores_plot, color='#10b981', alpha=0.25)
    ax.plot(angles, scores_plot, color='#10b981', linewidth=2, marker='o', markersize=8)

    # Add score labels
    for angle, score, cat in zip(angles[:-1], scores, categories):
        ax.annotate(f'{score}', xy=(angle, score), xytext=(angle, score + 8),
                    ha='center', va='center', fontsize=12, fontweight='bold', color='#10b981')

    # Set category labels
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10, color='white')

    # Set radial limits
    ax.set_ylim(0, 100)
    ax.set_yticks([20, 40, 60, 80, 100])
    ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=9, color='#888')

    # Grid styling
    ax.grid(color='#0f3460', linewidth=0.5)
    ax.spines['polar'].set_color('#0f3460')

    ax.set_title('Aave Protocol Score\nTotal: 90.9/100', fontsize=16, fontweight='bold',
                 color='white', pad=30, y=1.08)

    plt.tight_layout()
    plt.savefig(output_dir / 'aave-radar-example.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: aave-radar-example.png")

# ============================================
# Chart 6: Score Components Explanation
# ============================================
def create_score_components_chart():
    fig, ax = plt.subplots(figsize=(14, 6), facecolor='#1a1a2e')
    ax.set_facecolor('#16213e')

    components = ['S1\nSmart Contract\n& Technical', 'S2\nEconomic Design\n& Market',
                  'S3\nGovernance &\nCentralization', 'S4\nSustainability &\nCompetitive',
                  'S5\nReputation &\nSocial Trust']
    weights = [30, 25, 20, 15, 10]

    x = np.arange(len(components))
    bars = ax.bar(x, weights, color=colors, edgecolor='white', linewidth=1, width=0.7)

    # Add weight labels on bars
    for bar, weight in zip(bars, weights):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, height + 1, f'{weight}%',
                ha='center', va='bottom', fontsize=14, fontweight='bold', color='white')

    ax.set_xticks(x)
    ax.set_xticklabels(components, fontsize=10)
    ax.set_ylabel('Weight (%)', fontsize=12, fontweight='bold')
    ax.set_ylim(0, 38)
    ax.set_title('Five Scoring Dimensions (S1-S5) and Their Weights',
                 fontsize=14, fontweight='bold', color='white', pad=15)

    # Add formula text
    formula = "Total Score = (S1 × 30%) + (S2 × 25%) + (S3 × 20%) + (S4 × 15%) + (S5 × 10%)"
    ax.text(0.5, -0.18, formula, transform=ax.transAxes, fontsize=11,
            ha='center', va='top', color='#10b981', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='#0f3460', edgecolor='#10b981', alpha=0.8))

    plt.tight_layout()
    plt.savefig(output_dir / 'score-components.png', dpi=150, bbox_inches='tight',
                facecolor='#1a1a2e', edgecolor='none', transparent=False)
    plt.close()
    print("Created: score-components.png")

# Run all chart generation
if __name__ == "__main__":
    print("Generating methodology charts...")
    create_weight_pie_chart()
    create_audit_coverage_chart()
    create_liquidity_chart()
    create_governance_chart()
    create_aave_radar_chart()
    create_score_components_chart()
    print("\nAll charts generated successfully!")
