/**
 * Protocol Logo Downloader
 * Downloads protocol logos locally for faster loading
 *
 * Usage:
 * 1. Start backend (to fetch protocol list)
 * 2. Run: node scripts/download-protocol-logos.js
 * 3. Logos will be downloaded to public/images/logos/
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '../public/images/logos');
const API_BASE = 'http://localhost:4000';

// Ensure logos directory exists
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Download file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

// Get file extension from URL or content-type
function getExtension(url) {
  const match = url.match(/\.(png|jpg|jpeg|svg|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase() : 'png';
}

// Sanitize filename
function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fetch protocols from backend
async function fetchProtocols() {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE}/api/protocols?limit=100`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  console.log('🚀 Protocol Logo Downloader\n');
  console.log('='.repeat(70));

  // Check if backend is running
  try {
    await fetchProtocols();
  } catch (err) {
    console.error('\n❌ ERROR: Backend is not running!');
    console.error('   Please start the backend first:');
    console.error('   cd defi-sentinel-backend && npm run dev\n');
    process.exit(1);
  }

  console.log('\n📥 Fetching protocol list from backend...');
  const protocols = await fetchProtocols();
  console.log(`   Found ${protocols.length} protocols\n`);

  const results = {
    downloaded: 0,
    skipped: 0,
    failed: 0,
  };

  for (const protocol of protocols) {
    const logoUrl = protocol.logo;

    // Skip if no logo URL or it's an emoji
    if (!logoUrl || !logoUrl.startsWith('http')) {
      results.skipped++;
      continue;
    }

    const filename = sanitizeFilename(protocol.slug || protocol.name);
    const ext = getExtension(logoUrl);
    const filepath = path.join(LOGOS_DIR, `${filename}.${ext}`);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ${protocol.name} (already exists)`);
      results.skipped++;
      continue;
    }

    try {
      await downloadFile(logoUrl, filepath);
      const stats = fs.statSync(filepath);
      console.log(`✅ ${protocol.name} → ${filename}.${ext} (${(stats.size / 1024).toFixed(1)}KB)`);
      results.downloaded++;

      // Small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.log(`❌ ${protocol.name} - ${err.message}`);
      results.failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 SUMMARY\n');
  console.log(`✅ Downloaded: ${results.downloaded}`);
  console.log(`⏭️  Skipped: ${results.skipped} (already exist)`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.downloaded > 0) {
    console.log('\n📋 NEXT STEPS:\n');
    console.log('1. Optimize logos to WebP:');
    console.log('   node scripts/optimize-images.js');
    console.log('\n2. Update code to use local logos (see below)');
    console.log('\n3. Test in browser to verify faster loading');
  }

  console.log('\n💡 CODE EXAMPLE:\n');
  console.log('// Update protocol logo logic:');
  console.log('const logoSrc = protocol.logo?.startsWith("http")');
  console.log('  ? `/images/logos/${protocol.slug}.webp` // Use local optimized');
  console.log('  : protocol.logo; // Fallback to emoji or external\n');
}

main().catch(console.error);
