const fs = require('fs');
const path = require('path');

const b64Image = fs.readFileSync(path.join(__dirname, 'user_img_b64.txt'), 'utf8').trim();

// 1. Read existing index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 2. Replace cover image styling to allocate 2/3 height for the user's portrait
const oldCoverCss = `  .portrait-container {
    width: 130px;
    height: 155px;
    border: 2px solid var(--gold-bright);
    border-radius: 50% 50% 4px 4px;
    padding: 3px;
    background: linear-gradient(180deg, #d4af37 0%, #8c5519 100%);
    box-shadow: 0 6px 15px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.5);
    margin-bottom: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .portrait-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50% 50% 2px 2px;
  }`;

const newCoverCss = `  /* User Thiruvalluvar Portrait Container - Exactly 2/3 of Cover Height */
  .portrait-container {
    width: 92%;
    height: 65%; /* Exactly 2/3 of cover page height! */
    border: 2px solid var(--gold-bright);
    border-radius: 8px;
    padding: 3px;
    background: #3b0d0d;
    box-shadow: 0 8px 25px rgba(0,0,0,0.85), inset 0 0 12px rgba(0,0,0,0.7);
    margin-bottom: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .portrait-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 16%; /* Crops floor tiles at bottom, centers Thiruvalluvar */
    border-radius: 6px;
  }`;

if (html.includes('.portrait-container {')) {
  html = html.replace(/\.portrait-container\s*\{[^}]+\}/, newCoverCss.split('\n\n')[0].replace('  /* User Thiruvalluvar Portrait Container - Exactly 2/3 of Cover Height */\n', ''));
  html = html.replace(/\.portrait-img\s*\{[^}]+\}/, `  .portrait-img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    object-position: center 16%;\n    border-radius: 6px;\n  }`);
}

// Ensure the face-cover layout distributes space cleanly
html = html.replace('justify-content: center;', 'justify-content: space-between;');

// Replace src image with user's uploaded base64 portrait
html = html.replace(/src="data:image\/[^"]+"/, `src="data:image/jpeg;base64,${b64Image}"`);
html = html.replace(/src="thiruvalluvar[^"]*"/, `src="data:image/jpeg;base64,${b64Image}"`);

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Successfully updated index.html with 2/3 height user Thiruvalluvar portrait!');
