/**
 * Generates all required app icon PNGs from the SVG logo design.
 * Run once with: node generate-icons.js
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

// ─── SVG definition ───────────────────────────────────────────────────────────
// Full 500×500 logo: squircle background + C arc + A shape + tassel.
// Uses solid colours (not gradient strokes) for maximum renderer compatibility.
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bgG" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f0fdfa"/>
      <stop offset="1" stop-color="#ccfbf1"/>
    </linearGradient>
  </defs>

  <!-- Squircle background -->
  <rect x="14" y="14" width="472" height="472" rx="106" ry="106"
        fill="url(#bgG)" stroke="#99f6e4" stroke-width="4"/>

  <!-- C shadow -->
  <path d="M 243,177 A 92,92 0 1,1 243,327"
        stroke="#0d9488" stroke-opacity="0.13" stroke-width="62"
        fill="none" stroke-linecap="round" transform="translate(5,6)"/>
  <!-- C arc (opens right, body sweeps left) -->
  <path d="M 243,177 A 92,92 0 1,1 243,327"
        stroke="#14b8a6" stroke-width="54"
        fill="none" stroke-linecap="round"/>

  <!-- A shadow -->
  <path d="M 240,373 L 313,122 L 386,373"
        stroke="#042f2e" stroke-opacity="0.13" stroke-width="47"
        fill="none" stroke-linecap="round" stroke-linejoin="round"
        transform="translate(5,6)"/>
  <!-- A legs -->
  <path d="M 240,373 L 313,122 L 386,373"
        stroke="#0f766e" stroke-width="39"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Graduation cap crossbar (brim extends past legs) -->
  <path d="M 248,272 L 378,272"
        stroke="#0f766e" stroke-width="31"
        fill="none" stroke-linecap="round"/>

  <!-- Tassel: outer ring -->
  <circle cx="313" cy="105" r="17" fill="#0f766e"/>
  <!-- Tassel: inner highlight -->
  <circle cx="313" cy="105" r="9" fill="#e6fffa"/>
</svg>`;

// Adaptive icon foreground: same logo but centred at 72% of canvas,
// outer area transparent so Android's mask system clips it cleanly.
const ADAPTIVE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bgG2" x1="162" y1="162" x2="862" y2="862" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f0fdfa"/>
      <stop offset="1" stop-color="#ccfbf1"/>
    </linearGradient>
  </defs>
  <!-- Logo centred, scaled to 700px (68% of 1024) with 162px offset each side -->
  <g transform="translate(162, 162) scale(1.4)">
    <rect x="14" y="14" width="472" height="472" rx="106" ry="106"
          fill="url(#bgG2)" stroke="#99f6e4" stroke-width="4"/>
    <path d="M 243,177 A 92,92 0 1,1 243,327"
          stroke="#0d9488" stroke-opacity="0.13" stroke-width="62"
          fill="none" stroke-linecap="round" transform="translate(5,6)"/>
    <path d="M 243,177 A 92,92 0 1,1 243,327"
          stroke="#14b8a6" stroke-width="54"
          fill="none" stroke-linecap="round"/>
    <path d="M 240,373 L 313,122 L 386,373"
          stroke="#042f2e" stroke-opacity="0.13" stroke-width="47"
          fill="none" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(5,6)"/>
    <path d="M 240,373 L 313,122 L 386,373"
          stroke="#0f766e" stroke-width="39"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 248,272 L 378,272"
          stroke="#0f766e" stroke-width="31"
          fill="none" stroke-linecap="round"/>
    <circle cx="313" cy="105" r="17" fill="#0f766e"/>
    <circle cx="313" cy="105" r="9" fill="#e6fffa"/>
  </g>
</svg>`;

// ─── Generator ────────────────────────────────────────────────────────────────
function generatePng(svgString, outputPath, renderWidth) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: renderWidth },
    font: { loadSystemFonts: false },
  });
  const rendered = resvg.render();
  const png = rendered.asPng();
  fs.writeFileSync(outputPath, png);
  console.log(`✓  ${outputPath}  (${renderWidth}×${renderWidth}, ${(png.length / 1024).toFixed(0)} KB)`);
}

const assets = path.join(__dirname, 'assets');

// Main app icon — 1024×1024
generatePng(LOGO_SVG,     path.join(assets, 'icon.png'),                      1024);
// Android adaptive foreground — 1024×1024
generatePng(ADAPTIVE_SVG, path.join(assets, 'android-icon-foreground.png'),   1024);
// Splash screen centre image — 300×300
generatePng(LOGO_SVG,     path.join(assets, 'splash-icon.png'),                300);
// Web favicon — 48×48
generatePng(LOGO_SVG,     path.join(assets, 'favicon.png'),                     48);

console.log('\nAll icons generated.');
