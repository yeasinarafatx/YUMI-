const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const instagramSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ig-rad" cx="15%" cy="105%" r="115%">
      <stop offset="0%" stop-color="#FFDD55"/>
      <stop offset="10%" stop-color="#FFDD55"/>
      <stop offset="50%" stop-color="#FF543E"/>
      <stop offset="100%" stop-color="#C837AB" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ig-lin" x1="10%" y1="100%" x2="90%" y2="0%">
      <stop offset="0%" stop-color="#3771C8"/>
      <stop offset="35%" stop-color="#60F"/>
      <stop offset="65%" stop-color="#C837AB"/>
      <stop offset="90%" stop-color="#FF543E"/>
      <stop offset="100%" stop-color="#FFDD55"/>
    </linearGradient>
  </defs>
  <!-- Outer Rounded Squircle -->
  <rect x="24" y="24" width="464" height="464" rx="115" fill="url(#ig-lin)"/>
  <rect x="24" y="24" width="464" height="464" rx="115" fill="url(#ig-rad)"/>
  
  <!-- Camera Glyph -->
  <rect x="100" y="100" width="312" height="312" rx="78" fill="none" stroke="#FFFFFF" stroke-width="32"/>
  <circle cx="256" cy="256" r="76" fill="none" stroke="#FFFFFF" stroke-width="32"/>
  <circle cx="348" cy="164" r="22" fill="#FFFFFF"/>
</svg>
`;

const facebookSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="256" fill="#1877F2"/>
  <path d="M356 256h-64v240h-96V256h-48v-80h48v-52c0-48 29.3-76 74-76 21.5 0 43.8 3.8 43.8 3.8v48.2h-24.7c-24 0-31.5 14.8-31.5 30.2V176h55.2l-8.8 80z" fill="#FFFFFF"/>
</svg>
`;

async function run() {
  const targetDir = path.join(__dirname, '../public/images');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate Instagram PNG
  await sharp(Buffer.from(instagramSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(targetDir, 'instagram.png'));
  console.log('Created public/images/instagram.png');

  // Generate Facebook PNG
  await sharp(Buffer.from(facebookSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(targetDir, 'facebook.png'));
  console.log('Created public/images/facebook.png');
}

run().catch(console.error);
