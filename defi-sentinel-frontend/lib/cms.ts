import fs from 'fs';
import path from 'path';
import { Article } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function parseFrontmatter(fileContent: string): { data: any; content: string } {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);

    if (!match) {
        return { data: {}, content: fileContent };
    }

    const frontmatterBlock = match[1];
    const content = fileContent.replace(match[0], '').trim();
    const data: any = {};

    frontmatterBlock.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();

            // Handle strings
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            // Handle arrays (simple bracket format like ["a", "b"])
            if (value.startsWith('[') && value.endsWith(']')) {
                const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                data[key] = items;
                return;
            }

            // Handle nested author object (simple 2-level)
            // This simple parser assumes 'author' key starts a block, but our frontmatter has author keys indented.
            // Let's refine the parser for nested keys if encountered, or just keep it simple.
            // Given the specific format we wrote, 'author' is on its own line and subsequent indented lines are properties.
            // This simple line-by-line might fail on nested objects.

            // Let's stick to a robust enough parser for the specific format we generated.
            // We will handle 'author' specifically if we see it as a parent key, or flatten it in the MD.
            // Actually, looking at the MD I wrote:
            // author:
            //   name: "..."
            // This is YAML. Writing a full YAML parser is hard.
            // Strategy: I will re-implement a slightly smarter parser that tracks indentation or parent keys.
        }
    });

    // Re-parsing approach:
    // We will use a more robust manual extraction for the specific fields we know exist.
    // Instead of generic YAML parsing, we look for specific constraints.

    const lines = frontmatterBlock.split('\n');
    let currentParent: string | null = null;

    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) continue;

        const indentLevel = line.search(/\S|$/);
        const trimmed = line.trim();

        if (trimmed.endsWith(':')) {
            // It's a parent key (like 'author:')
            currentParent = trimmed.slice(0, -1);
            data[currentParent] = {};
            continue;
        }

        const colonIndex = trimmed.indexOf(':');
        if (colonIndex !== -1) {
            const key = trimmed.slice(0, colonIndex).trim();
            let value = trimmed.slice(colonIndex + 1).trim();

            // Value cleaning
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value === 'true') value = true as any;
            if (value === 'false') value = false as any;
            if (!isNaN(Number(value))) value = Number(value) as any;
            if (value.toString().startsWith('[') && value.toString().endsWith(']')) {
                value = value.toString().slice(1, -1).split(',').map((s: string) => s.trim().replace(/^"|"$/g, '')) as any;
            }

            if (indentLevel > 0 && currentParent) {
                data[currentParent][key] = value;
            } else {
                data[key] = value;
                currentParent = null; // Reset if we hit a top-level key
            }
        }
    }

    return { data, content };
}

export function getAllArticles(): Article[] {
    const freeDir = path.join(CONTENT_DIR, 'free');
    const paidDir = path.join(CONTENT_DIR, 'paid');

    const articles: Article[] = [];

    // Helper to read dir
    const readDir = (dir: string, isPaid: boolean) => {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

            const fullPath = path.join(dir, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = parseFrontmatter(fileContents);

            articles.push({
                ...data,
                // SECURITY: Do not expose full content for paid articles in the listing/public fetch
                content: isPaid ? '' : content,
                isPaid, // Enforce isPaid based on folder
                slug: data.slug || file.replace(/\.mdx?$/, ''),
                id: data.id || file,
                tags: data.tags || [],
                difficulty: data.difficulty || 'easy',
                readTime: data.readTime || 5,
                publishedAt: data.publishedAt || new Date().toISOString(),
                author: data.author || { name: 'DeFi Sentinel' },
                category: data.category || 'Tutorial'
            } as Article);
        });
    };

    readDir(freeDir, false);
    readDir(paidDir, true);

    // Sort by date descending
    return articles.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
    const all = getAllArticles();
    return all.find(a => a.slug === slug) || null;
}

export function getPaidArticleContent(slug: string): string | null {
    // SECURITY: strictly check this file exists in the Paid folder
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    const paidPath = path.join(CONTENT_DIR, 'paid', `${safeSlug}.md`);

    if (fs.existsSync(paidPath)) {
        const fileContents = fs.readFileSync(paidPath, 'utf8');
        const { content } = parseFrontmatter(fileContents);
        return content;
    }
    return null;
}
