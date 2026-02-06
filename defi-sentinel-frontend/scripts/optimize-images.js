/**
 * Image Optimization Script
 * Converts JPG/PNG images to WebP format with compression
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  quality: 80, // WebP quality (1-100)
  badges: { quality: 85, maxSize: 512 }, // Badge images - higher quality
  covers: { quality: 75, maxSize: 1920 }, // Cover images - lower quality OK
  articles: { quality: 80, maxSize: 1920 }, // Article images
  logos: { quality: 90, maxSize: 256 }, // Logos - highest quality
};

async function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getOptimizationConfig(filePath) {
  if (filePath.includes('/badges/')) return config.badges;
  if (filePath.includes('/covers/')) return config.covers;
  if (filePath.includes('/articles/')) return config.articles;
  if (filePath.includes('/logos/')) return config.logos;
  return { quality: config.quality, maxSize: 1920 };
}

async function optimizeImage(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Skip if WebP already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipped (already exists): ${path.basename(outputPath)}`);
    return { skipped: true };
  }

  const startSize = fs.statSync(inputPath).size;
  const optimizationConfig = getOptimizationConfig(inputPath);

  try {
    await sharp(inputPath)
      .resize(optimizationConfig.maxSize, optimizationConfig.maxSize, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: optimizationConfig.quality })
      .toFile(outputPath);

    const endSize = fs.statSync(outputPath).size;
    const savings = ((1 - endSize / startSize) * 100).toFixed(1);

    console.log(
      `✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} ` +
      `(${(startSize / 1024).toFixed(0)}KB → ${(endSize / 1024).toFixed(0)}KB, -${savings}%)`
    );

    return {
      success: true,
      originalSize: startSize,
      newSize: endSize,
      savings: parseFloat(savings),
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return { error: true };
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  const dirsToScan = [
    path.join(__dirname, '../public/images'),
    path.join(__dirname, '../public/protocols'), // Add protocols folder
  ];

  let imageFiles = [];
  for (const dir of dirsToScan) {
    if (fs.existsSync(dir)) {
      imageFiles.push(...await getImageFiles(dir));
    }
  }

  console.log(`Found ${imageFiles.length} images to process\n`);

  const results = {
    optimized: 0,
    skipped: 0,
    errors: 0,
    totalOriginalSize: 0,
    totalNewSize: 0,
  };

  for (const file of imageFiles) {
    const result = await optimizeImage(file);

    if (result.skipped) {
      results.skipped++;
    } else if (result.error) {
      results.errors++;
    } else if (result.success) {
      results.optimized++;
      results.totalOriginalSize += result.originalSize;
      results.totalNewSize += result.newSize;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Optimized: ${results.optimized} images`);
  console.log(`⏭️  Skipped:   ${results.skipped} images (already exist)`);
  console.log(`❌ Errors:    ${results.errors} images`);

  if (results.optimized > 0) {
    const originalMB = (results.totalOriginalSize / 1024 / 1024).toFixed(2);
    const newMB = (results.totalNewSize / 1024 / 1024).toFixed(2);
    const totalSavings = ((1 - results.totalNewSize / results.totalOriginalSize) * 100).toFixed(1);

    console.log(`\n📦 Total size: ${originalMB}MB → ${newMB}MB (-${totalSavings}%)`);
    console.log(`💾 Saved: ${(originalMB - newMB).toFixed(2)}MB`);
  }

  console.log('\n✨ Done! Now update your code to use .webp extensions');
  console.log('💡 Tip: You can delete the old JPG/PNG files once verified\n');
}

main().catch(console.error);
