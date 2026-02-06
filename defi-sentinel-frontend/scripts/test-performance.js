/**
 * Quick Performance Test Script
 * Run: node scripts/test-performance.js
 *
 * This checks image optimization results
 */

const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath, extensions) {
  let totalSize = 0;
  let fileCount = 0;

  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        traverse(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (extensions.includes(ext)) {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
          fileCount++;
        }
      }
    }
  }

  traverse(dirPath);
  return { totalSize, fileCount };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function main() {
  console.log('🔍 DeFi Sentinel Performance Test\n');
  console.log('='.repeat(70));

  const imagesDir = path.join(__dirname, '../public/images');

  // Check original images (JPG/PNG)
  const originalFormats = ['.jpg', '.jpeg', '.png'];
  const originalData = getDirectorySize(imagesDir, originalFormats);

  // Check optimized images (WebP)
  const webpData = getDirectorySize(imagesDir, ['.webp']);

  console.log('\n📊 IMAGE OPTIMIZATION RESULTS\n');
  console.log('Original Images (JPG/PNG):');
  console.log(`  Files: ${originalData.fileCount}`);
  console.log(`  Total Size: ${formatBytes(originalData.totalSize)}`);
  console.log(`  Average Size: ${formatBytes(originalData.totalSize / originalData.fileCount)}`);

  console.log('\nOptimized Images (WebP):');
  console.log(`  Files: ${webpData.fileCount}`);
  console.log(`  Total Size: ${formatBytes(webpData.totalSize)}`);
  console.log(`  Average Size: ${formatBytes(webpData.totalSize / webpData.fileCount)}`);

  if (originalData.totalSize > 0 && webpData.totalSize > 0) {
    const savings = originalData.totalSize - webpData.totalSize;
    const savingsPercent = ((savings / originalData.totalSize) * 100).toFixed(1);

    console.log('\n💰 SAVINGS:');
    console.log(`  Size Reduction: ${formatBytes(savings)}`);
    console.log(`  Percentage: ${savingsPercent}%`);

    if (parseFloat(savingsPercent) > 80) {
      console.log('  Status: ✅ EXCELLENT (>80% reduction)');
    } else if (parseFloat(savingsPercent) > 60) {
      console.log('  Status: ✅ GOOD (60-80% reduction)');
    } else {
      console.log('  Status: ⚠️  NEEDS IMPROVEMENT (<60% reduction)');
    }
  }

  // Check specific directories
  console.log('\n📁 BY DIRECTORY:\n');

  const directories = ['badges', 'covers', 'articles'];

  for (const dir of directories) {
    const dirPath = path.join(imagesDir, dir);
    if (!fs.existsSync(dirPath)) continue;

    const originalDir = getDirectorySize(dirPath, originalFormats);
    const webpDir = getDirectorySize(dirPath, ['.webp']);

    console.log(`${dir.toUpperCase()}:`);
    console.log(`  Original: ${formatBytes(originalDir.totalSize)} (${originalDir.fileCount} files)`);
    console.log(`  WebP: ${formatBytes(webpDir.totalSize)} (${webpDir.fileCount} files)`);

    if (originalDir.totalSize > 0 && webpDir.totalSize > 0) {
      const dirSavings = ((1 - webpDir.totalSize / originalDir.totalSize) * 100).toFixed(1);
      console.log(`  Savings: ${dirSavings}% ${dirSavings > 80 ? '✅' : '⚠️'}`);
    }
    console.log('');
  }

  // Recommendations
  console.log('='.repeat(70));
  console.log('\n💡 NEXT STEPS:\n');

  if (webpData.fileCount === 0) {
    console.log('❌ No WebP images found! Run: node scripts/optimize-images.js');
  } else if (webpData.fileCount < originalData.fileCount) {
    console.log('⚠️  Some images not converted. Run: node scripts/optimize-images.js');
  } else {
    console.log('✅ All images optimized!');
    console.log('\n📋 To complete optimization:');
    console.log('   1. Update image paths in code to use .webp extensions');
    console.log('   2. Test in browser (F12 → Network tab → Img filter)');
    console.log('   3. Run Lighthouse audit (F12 → Lighthouse tab)');
    console.log('   4. Consider deleting old JPG/PNG files once verified');
  }

  console.log('\n🚀 For detailed testing, see: PERFORMANCE_TEST.md\n');
}

main();
