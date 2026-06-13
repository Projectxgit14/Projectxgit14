const fs = require('fs');
const path = require('path');

// Get contributions data from GitHub
async function getGitHubContributions(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    return data.public_repos || 0;
  } catch (error) {
    console.log('Using default contribution count');
    return 50;
  }
}

// Generate dinosaur SVG with fire animation
function generateDinosaurAnimation(contributionCount) {
  const width = 1200;
  const height = 600;
  const daysInYear = 365;
  const boxSize = 12;
  const spacing = 4;
  
  // Calculate intensity based on contributions
  const intensity = Math.min(100, (contributionCount / daysInYear) * 100);

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes roar { 0% { transform: scaleX(1); } 50% { transform: scaleX(1.05); } 100% { transform: scaleX(1); } }
      @keyframes fireFlame { 
        0% { opacity: 0.3; transform: translateY(0px) scaleY(0.8); }
        50% { opacity: 1; transform: translateY(-20px) scaleY(1.2); }
        100% { opacity: 0.3; transform: translateY(0px) scaleY(0.8); }
      }
      @keyframes fireSpark {
        0% { opacity: 1; transform: translate(0, 0); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)); }
      }
      .dino-body { animation: roar 1.5s infinite ease-in-out; }
      .fire-flame { animation: fireFlame 1.2s infinite ease-in-out; }
      .fire-spark { animation: fireSpark 1s infinite ease-out; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#0d1117"/>

  <!-- Contribution Grid -->
  <g id="contribution-grid">`;

  // Generate contribution grid
  const cols = Math.floor((width - 100) / (boxSize + spacing));
  const rows = 7;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 50 + col * (boxSize + spacing);
      const y = 80 + row * (boxSize + spacing);
      
      // Random contribution intensity
      const rand = Math.random();
      const fillIntensity = rand > (1 - intensity / 100) ? Math.random() * 100 : 0;
      
      let fillColor = '#0d1117';
      if (fillIntensity > 75) fillColor = '#238636';
      else if (fillIntensity > 50) fillColor = '#2ea043';
      else if (fillIntensity > 25) fillColor = '#3fb950';
      else if (fillIntensity > 0) fillColor = '#26a641';
      
      svg += `    <rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" fill="${fillColor}" stroke="#161b22" stroke-width="1"/>`;
    }
  }

  svg += `
  </g>

  <!-- Dinosaur Body -->
  <g class="dino-body" transform="translate(${width - 300}, 250)">
    <!-- Back leg -->
    <ellipse cx="80" cy="80" rx="20" ry="35" fill="#2ea043"/>
    <!-- Belly -->
    <ellipse cx="60" cy="20" rx="40" ry="30" fill="#3fb950"/>
    <!-- Front leg -->
    <ellipse cx="20" cy="80" rx="18" ry="38" fill="#2ea043"/>
    <!-- Neck -->
    <path d="M 50 -5 Q 40 -30 35 -50" stroke="#2ea043" stroke-width="25" fill="none" stroke-linecap="round"/>
    <!-- Head -->
    <ellipse cx="30" cy="-70" rx="20" ry="25" fill="#238636"/>
    <!-- Jaw -->
    <path d="M 35 -60 L 60 -55 L 55 -50 L 30 -55 Z" fill="#1f6feb"/>
    <!-- Eye -->
    <circle cx="25" cy="-75" r="4" fill="#79c0ff"/>
    <!-- Spikes on back -->
    <g id="spikes">
      <polygon points="45,-10 50,-35 48,-10" fill="#238636"/>
      <polygon points="55,5 62,-20 58,5" fill="#238636"/>
      <polygon points="65,15 74,-10 68,15" fill="#238636"/>
      <polygon points="75,20 86,0 78,20" fill="#238636"/>
    </g>
    <!-- Tail -->
    <path d="M 85 15 Q 110 10 130 20" stroke="#238636" stroke-width="20" fill="none" stroke-linecap="round"/>

    <!-- FIRE ANIMATION -->
    <!-- Main fire flame -->
    <g class="fire-flame" transform="translate(60, -55)">
      <path d="M 0 0 Q -8 -15 0 -25 Q 8 -15 0 0 Z" fill="#ff7e14" opacity="0.9"/>
      <path d="M 0 0 Q -5 -12 0 -20 Q 5 -12 0 0 Z" fill="#ffa500" opacity="0.8"/>
      <path d="M 0 0 Q -3 -8 0 -15 Q 3 -8 0 0 Z" fill="#ffcd39" opacity="0.7"/>
    </g>

    <!-- Fire sparks -->
    <g class="fire-spark" style="--tx: -20px; --ty: -40px; animation-delay: 0s;">
      <circle cx="60" cy="-55" r="3" fill="#ff7e14"/>
    </g>
    <g class="fire-spark" style="--tx: 25px; --ty: -45px; animation-delay: 0.3s;">
      <circle cx="60" cy="-55" r="2.5" fill="#ffa500"/>
    </g>
    <g class="fire-spark" style="--tx: 15px; --ty: -50px; animation-delay: 0.6s;">
      <circle cx="60" cy="-55" r="2" fill="#ffcd39"/>
    </g>
    <g class="fire-spark" style="--tx: -15px; --ty: -35px; animation-delay: 0.9s;">
      <circle cx="60" cy="-55" r="2.5" fill="#ff7e14"/>
    </g>

    <!-- Fire glow effect -->
    <circle cx="60" cy="-55" r="25" fill="#ff7e14" opacity="0.15"/>
    <circle cx="60" cy="-55" r="18" fill="#ffa500" opacity="0.2"/>
  </g>

  <!-- Title -->
  <text x="${width / 2}" y="40" font-size="28" font-weight="bold" fill="#79c0ff" text-anchor="middle" font-family="Arial, sans-serif">
    🦖 Fire-Breathing Dinosaur Contributions 🔥
  </text>

  <!-- Stats -->
  <text x="${width / 2}" y="${height - 20}" font-size="14" fill="#8b949e" text-anchor="middle" font-family="monospace">
    Contributions: ${contributionCount} | Intensity: ${intensity.toFixed(1)}%
  </text>
</svg>`;

  return svg;
}

// Main function
async function main() {
  try {
    const username = process.env.GITHUB_ACTOR || 'Projectxgit14';
    console.log(`🦖 Generating dinosaur animation for ${username}...`);

    const contributions = await getGitHubContributions(username);
    console.log(`📊 Fetched contribution count: ${contributions}`);

    const svg = generateDinosaurAnimation(contributions);

    // Ensure dist directory exists
    const distDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Write SVG files
    const outputPath = path.join(distDir, 'dinosaur-fire.svg');
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Dinosaur animation created: ${outputPath}`);

    // Create dark theme variant
    const darkSvg = svg.replace('#0d1117', '#000000').replace('#79c0ff', '#58a6ff');
    const darkOutputPath = path.join(distDir, 'dinosaur-fire-dark.svg');
    fs.writeFileSync(darkOutputPath, darkSvg);
    console.log(`✅ Dark theme variant created: ${darkOutputPath}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating dinosaur animation:', error);
    process.exit(1);
  }
}

main();
