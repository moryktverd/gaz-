/**
 * Icon generation script for PWA
 *
 * This script generates app icons in different sizes.
 * Creates SVG placeholders that can be replaced with actual PNG assets.
 *
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon template
function generateSVGIcon(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">
    LPG
  </text>
</svg>`;
}

// Generate icons for each size
sizes.forEach(size => {
  const svg = generateSVGIcon(size);
  const svgFilename = `icon-${size}x${size}.svg`;
  const pngFilename = `icon-${size}x${size}.png`;
  const svgPath = path.join(iconsDir, svgFilename);
  const pngPath = path.join(iconsDir, pngFilename);
  
  // Write SVG
  fs.writeFileSync(svgPath, svg);
  
  // Try to convert to PNG using available tools
  let converted = false;
  
  // Try using ImageMagick (convert command)
  try {
    execSync(`convert "${svgPath}" -resize ${size}x${size} "${pngPath}"`, { stdio: 'ignore' });
    converted = true;
    console.log(`✓ Generated ${pngFilename} (PNG)`);
  } catch (e) {
    // ImageMagick not available
  }
  
  // If conversion failed, keep SVG as fallback
  if (!converted) {
    console.log(`✓ Generated ${svgFilename} (SVG - PNG conversion unavailable)`);
  }
});

console.log('\n✅ Icon generation complete!');
if (fs.existsSync(path.join(iconsDir, 'icon-192x192.png'))) {
  console.log('✓ PNG icons created successfully');
} else {
  console.log('⚠️  Using SVG placeholders (ImageMagick not available)');
  console.log('💡 For production: Replace with actual PNG icons or install ImageMagick');
}
