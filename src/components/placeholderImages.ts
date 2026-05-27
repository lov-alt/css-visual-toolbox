/* ── Built-in placeholder images as SVG data URIs ── */

function svgUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}

/* ── Landscape — mountains + sun ─────── */

const landscape = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#facc15;stop-opacity:1"/>
      <stop offset="40%" style="stop-color:#fb923c;stop-opacity:0.9"/>
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="mount1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#818cf8"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
    <linearGradient id="mount2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#sky)"/>
  <circle cx="320" cy="100" r="35" fill="#fef08a" opacity="0.9"/>
  <polygon points="0,240 60,140 120,200 160,120 220,190 300,100 400,200 400,400 0,400" fill="url(#mount1)" opacity="0.85"/>
  <polygon points="0,300 100,210 180,260 280,200 340,240 400,280 400,400 0,400" fill="url(#mount2)" opacity="0.6"/>
</svg>
`);

/* ── Portrait — abstract circles ─────── */

const portrait = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ec4899"/>
      <stop offset="50%" style="stop-color:#a855f7"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <circle cx="200" cy="180" r="90" fill="#fff" opacity="0.15"/>
  <circle cx="140" cy="280" r="55" fill="#fff" opacity="0.1"/>
  <circle cx="280" cy="300" r="35" fill="#fff" opacity="0.12"/>
  <circle cx="100" cy="100" r="28" fill="#fff" opacity="0.08"/>
  <circle cx="310" cy="130" r="20" fill="#fff" opacity="0.1"/>
</svg>
`);

/* ── Texture — soft noise dots ───────── */

const texture = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="dot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#d4d4d8;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#d4d4d8;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="#fafafa"/>
  <circle cx="50" cy="60" r="40" fill="url(#dot)"/>
  <circle cx="150" cy="30" r="60" fill="url(#dot)"/>
  <circle cx="280" cy="80" r="35" fill="url(#dot)"/>
  <circle cx="350" cy="50" r="45" fill="url(#dot)"/>
  <circle cx="70" cy="180" r="30" fill="url(#dot)"/>
  <circle cx="200" cy="160" r="55" fill="url(#dot)"/>
  <circle cx="330" cy="200" r="40" fill="url(#dot)"/>
  <circle cx="100" cy="300" r="50" fill="url(#dot)"/>
  <circle cx="250" cy="310" r="35" fill="url(#dot)"/>
  <circle cx="360" cy="330" r="45" fill="url(#dot)"/>
  <circle cx="40" cy="380" r="25" fill="url(#dot)"/>
  <circle cx="180" cy="370" r="30" fill="url(#dot)"/>
  <circle cx="300" cy="360" r="20" fill="url(#dot)"/>
</svg>
`);

export const placeholders = {
  landscape,
  portrait,
  texture,
} as const;
