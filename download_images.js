const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  'hero_cinematic.png': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1920&auto=format&fit=crop',
  'about_master.png': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
  'trans_before.png': 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop',
  'trans_after.png': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop',
  'gallery_1.png': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
  'gallery_2.png': 'https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=1000&auto=format&fit=crop',
  'gallery_3.png': 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1000&auto=format&fit=crop',
  'gallery_4.png': 'https://images.unsplash.com/photo-1593702295094-ada7554100c3?q=80&w=1000&auto=format&fit=crop',
  'gallery_5.png': 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=1000&auto=format&fit=crop',
  'gallery_6.png': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1000&auto=format&fit=crop',
  'team_1.png': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'team_2.png': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'team_3.png': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
};

const targetDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved: ${dest}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => { });
      reject(err);
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(targetDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await downloadFile(url, dest);
    } catch (e) {
      console.error(`Error downloading ${filename}:`, e.message);
    }
  }
  console.log('All image downloads completed successfully!');
}

run();
