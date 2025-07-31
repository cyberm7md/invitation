const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Base URL for QR codes (replace with your Render URL after deployment)
const baseUrl = 'http://localhost:3000/check?id=';

// Create qrcodes directory
const outputDir = path.join(__dirname, 'qrcodes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate 300 QR codes
async function generateQRCodes() {
  for (let i = 1; i <= 300; i++) {
    const url = `${baseUrl}${i}`;
    const outputPath = path.join(outputDir, `qrcode_${i}.png`);
    try {
      await QRCode.toFile(outputPath, url, {
        width: 300,
        margin: 1,
      });
      console.log(`Generated QR code ${i}`);
    } catch (err) {
      console.error(`Error generating QR code ${i}:`, err);
    }
  }
  console.log('All QR codes generated in the qrcodes folder.');
}

generateQRCodes();
